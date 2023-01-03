import { useEffect, useRef, useState } from 'react';
import * as mediasoupClient from 'mediasoup-client';
import type {
  RtpCapabilities,
  TransportOptions,
  Transport,
} from 'mediasoup-client/lib/types';
import { getToken } from '../../local-storage';

let websocket: WebSocket | null = null;

let globalRecvTransport: Transport | null = null;

export const useWebsocket = (
  track: MediaStreamTrack | null,
  responseRef: React.RefObject<HTMLAudioElement>,
) => {
  const ref = useRef(false);

  useEffect(() => {
    if (!track) return;

    if (ref.current) return;
    ref.current = true;

    // Cause we have broker between websocket server & voice server, there is no instantly response
    let produceCB: ({ id }: { id: string }) => void = () => {};

    const token = getToken();
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

      if (parsedMsgEvent.eventName === 'voice-channel/recv_track_done') {
        const payload = JSON.parse(parsedMsgEvent.payload);
        console.log('voice-channel/recv_track_done payload', payload);

        // TODO: create consumer here
        if (!globalRecvTransport) {
          console.log('no recvTransport');
          return;
        }
        const consumer = await globalRecvTransport.consume({
          id: payload.id,
          producerId: payload.producerId,
          kind: payload.kind,
          rtpParameters: payload.rtpParameters,
        });
        const { track } = consumer;
        if (responseRef.current) {
          console.log('attach response ref');
          // responseRef.current.srcObject = new MediaStream([track]);
        }

        return;
      }

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
        recvTransportOptions: TransportOptions;
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

      const recvTransport = device.createRecvTransport({
        ...payload.recvTransportOptions,
      });
      globalRecvTransport = recvTransport;
      recvTransport.on('connect', ({ dtlsParameters }, callback) => {
        websocket?.send(
          JSON.stringify({
            eventName: 'voice-channel/connect_recv_transport',
            payload: JSON.stringify({
              roomId: payload.roomId,
              peerId: payload.peerId,
              dtlsParameters,
            }),
          }),
        );
        // Tell the transport that parameters were transmitted.
        callback();
      });

      websocket?.send(
        JSON.stringify({
          eventName: 'voice-channel/recv_track',
          payload: JSON.stringify({
            roomId: payload.roomId,
            peerId: payload.peerId,
            rtpCapabilities: device.rtpCapabilities,
          }),
        }),
      );
    });

    websocket = ws;
  }, [responseRef, track]);

  return { websocket };
};
