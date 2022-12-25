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

    // Cause we have broker between websocket server & voice server, there is no instantly response
    let produceCB: ({ id }: { id: string }) => void = () => {};

    // TODO: move token
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlODdjYjE5Yy02NGQyLTQ5ZTYtOGY1Ni0zYjgyOTgwNzAxNTUiLCJleHAiOjE2NzE5ODk4ODgsImlhdCI6MTY3MTk3OTA4OH0.PUA23aLtnkYUG86hoRKz6Win9xo7H-uA-DF97nOHVSc';
    const ws = new WebSocket(`ws://localhost:4000/ws?token=${token}`);

    // setTimeout(() => {
    //   ws.send('PONG');
    // }, 3000);

    ws.addEventListener('open', () => {
      console.log('connected');
    });

    ws.addEventListener('message', async (msgEvent) => {
      console.log(msgEvent);

      const parsedMsgEvent = JSON.parse(msgEvent.data);

      if (parsedMsgEvent.eventName === 'voice-channel/send_track_done') {
        const payload = JSON.parse(parsedMsgEvent.payload);
        console.log('voice-channel/send_track_done payload', payload);

        produceCB({ id: payload.producerId });

        return;
      }

      const payload: {
        roomId: string;
        peerId: string;
        routerRtpCapabilities: RtpCapabilities;
        sendTransportOptions: TransportOptions;
      } = JSON.parse(msgEvent.data);
      console.log('payload', payload);

      const device = new mediasoupClient.Device();
      console.log(payload.routerRtpCapabilities);
      await device.load({
        routerRtpCapabilities: {
          ...payload.routerRtpCapabilities,
        },
      });

      console.log('createSendTransport id', payload.sendTransportOptions.id);
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
      sendTransport.on(
        'produce',
        ({ kind, rtpParameters, appData }, callback) => {
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

          produceCB = callback;
        },
      );

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
