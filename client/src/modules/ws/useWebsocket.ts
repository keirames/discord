import { useEffect, useRef, useState } from 'react';
import * as mediasoupClient from 'mediasoup-client';
import type {
  RtpCapabilities,
  TransportOptions,
} from 'mediasoup-client/lib/types';

let websocket: WebSocket | null = null;

export const useWebsocket = (track: MediaStreamTrack | null) => {
  const ref = useRef(false);

  useEffect(() => {
    if (!track) return;

    if (ref.current) return;
    ref.current = true;

    // TODO: move token
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlODdjYjE5Yy02NGQyLTQ5ZTYtOGY1Ni0zYjgyOTgwNzAxNTUiLCJleHAiOjE2NzE5MDU3NzYsImlhdCI6MTY3MTg5NDk3Nn0.75vCU6FNeKAxzOF3Oo_SfEaJ15ioPX9lKYA5f1q7hSY';
    const ws = new WebSocket(`ws://localhost:4000/ws?token=${token}`);

    ws.addEventListener('open', () => {
      console.log('connected');
    });

    ws.addEventListener('message', async (msgEvent) => {
      const payload: {
        roomId: string;
        peerId: string;
        routerRtpCapabilities: RtpCapabilities;
        sendTransportOptions: TransportOptions;
      } = JSON.parse(msgEvent.data);
      console.log(payload);

      const device = new mediasoupClient.Device();
      await device.load({
        routerRtpCapabilities: payload.routerRtpCapabilities,
      });

      const sendTransport = device.createSendTransport({
        ...payload.sendTransportOptions,
      });

      // event will triggered on first call .produce()
      sendTransport.on('connect', ({ dtlsParameters }, callback) => {
        // Noti that connect signal is sent (in order to trigger produce event)
        websocket?.send(
          JSON.stringify({
            eventName: 'voice-channel/connect_transport',
            payload: JSON.stringify({
              roomId: payload.roomId,
              peerId: payload.peerId,
              dtlsParameters,
            }),
          }),
        );
        callback();
      });
      sendTransport.on('produce', ({ kind, rtpParameters, appData }) => {
        console.log('produce triggered -> emit send_track');

        websocket?.send(
          JSON.stringify({
            eventName: 'voice-channel/send_track',
            payload: JSON.stringify({
              roomId: payload.roomId,
              peerId: payload.peerId,
              kind,
              rtpParameters,
              appData,
            }),
          }),
        );
      });

      const params = {
        encodings: [],
        codecOptions: {
          videoGoogleStartBitrate: 1000,
        },
      };
      const producer = await sendTransport.produce({
        ...params,
        track,
      });
      producer.on('trackended', () => {
        console.log('track ended');

        // close video track
      });
      producer.on('transportclose', () => {
        console.log('transport ended');

        // close video track
      });
    });

    websocket = ws;
  }, [track]);

  return { websocket };
};
