import * as mediasoupClient from 'mediasoup-client';
import React, { useEffect, useRef } from 'react';
import { getToken } from '../../local-storage';
import { useVoiceChannelStore } from '../channels/use-voice-channel-store';
import { useRtcConnectorStore } from '../rtc-connector/use-rtc-connector-store';
import {
  ListenableEventName,
  MemberJoinedPayload,
  SendTrackDonePayload,
  YouJoinedAsSpeakerPayload,
} from './types';
import { useWsStore } from './use-ws-store';

export const WsWrapper: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const ref = useRef(false);

  const { isReady, setReady, websocket, emit } = useWsStore();

  const { addMember } = useVoiceChannelStore();

  const { setDevice, track, setRecvTransport } = useRtcConnectorStore();

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    const token = getToken();
    const ws = new WebSocket(`ws://192.168.31.10:4000/ws?token=${token}`);

    ws.addEventListener('open', () => {
      setReady(ws);
    });
  }, [setReady]);

  useEffect(() => {
    let listener: (msgEvent: MessageEvent) => Promise<void> = async () => {};
    let sendTransportProduceEventCb: ({
      id,
    }: {
      id: string;
    }) => void = () => {};

    if (isReady) {
      listener = async (msgEvent: MessageEvent) => {
        const {
          eventName,
          payload,
        }: { eventName: ListenableEventName; payload: string } = JSON.parse(
          msgEvent.data,
        );

        if (eventName === 'voice-channel/new_peer_speaker') {
          // TODO: fix this any
          const x = JSON.parse(payload);
          console.log(x);
          console.log('add members data', {
            ...x,
            peerId: x.theirPeerId,
            ...x.consumerParameters,
          });
          addMember({ ...x, peerId: x.theirPeerId, ...x.consumerParameters });
        }

        // TODO: remove
        if (eventName === 'voice-channel/member-joined') {
          const { id }: MemberJoinedPayload = JSON.parse(payload);
        }

        if (eventName === 'voice-channel/send_track_done') {
          const { producerId }: SendTrackDonePayload = JSON.parse(payload);
          sendTransportProduceEventCb({ id: producerId });
        }

        if (eventName === 'voice-channel/you_joined_as_speaker') {
          console.log('got voice-channel/you_joined_as_speaker');
          const {
            roomId,
            peerId,
            routerRtpCapabilities,
            recvTransportOptions,
            sendTransportOptions,
          }: YouJoinedAsSpeakerPayload = JSON.parse(payload);

          const device = new mediasoupClient.Device();
          try {
            await device.load({ routerRtpCapabilities });
          } catch (err) {
            // TODO: remove console
            console.log('Fail to load device', err);
            return;
          }
          setDevice(device);

          const sendTransport = device.createSendTransport({
            ...sendTransportOptions,
          });
          console.log('send transport created', sendTransport);
          const recvTransport = device.createRecvTransport({
            ...recvTransportOptions,
          });
          console.log('recv transport created', recvTransport);
          setRecvTransport(recvTransport);

          sendTransport.on('connect', ({ dtlsParameters }, callback) => {
            console.log(
              'sendTransport connect event triggered -> emit voice-channel/connect_transport',
            );
            // Noti that connect signal is sent (in order to trigger produce event)
            // TODO: turn emit into type safe
            emit('voice-channel/connect_transport', {
              roomId: roomId,
              peerId: peerId,
              dtlsParameters,
            });
            callback();
          });
          sendTransport.on(
            'produce',
            ({ kind, rtpParameters, appData }, callback) => {
              console.log('produce triggered -> emit voice-channel/send_track');

              // TODO: type safe missing here
              emit('voice-channel/send_track', {
                roomId: roomId,
                peerId: peerId,
                kind,
                rtpParameters,
                deviceRtpCapabilities: device.rtpCapabilities,
                appData,
              });

              sendTransportProduceEventCb = callback;
            },
          );

          const params = {
            encodings: [],
            codecOptions: {
              videoGoogleStartBitrate: 1000,
            },
          };

          // TODO: testing pc purpose
          if (track) {
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
          }

          recvTransport.on('connect', ({ dtlsParameters }, callback) => {
            // TODO: type here
            emit('voice-channel/connect_recv_transport', {
              roomId: roomId,
              peerId: peerId,
              dtlsParameters,
            });
            // Tell the transport that parameters were transmitted.
            callback();
          });
        }
      };

      websocket?.addEventListener('message', listener);
    }

    return () => websocket?.removeEventListener('message', listener);
  }, [isReady, setDevice, websocket, emit, track, setRecvTransport, addMember]);

  if (!isReady) return null;

  return children;
};
