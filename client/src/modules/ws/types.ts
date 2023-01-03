import type {
  RtpCapabilities,
  TransportOptions,
} from 'mediasoup-client/lib/types';

export type EmittableEventName =
  | 'voice-channel/join'
  | 'voice-channel/connect_transport'
  | 'voice-channel/send_track'
  | 'voice-channel/connect_recv_transport';

export type ListenableEventName =
  | 'voice-channel/you_joined_as_speaker'
  | 'voice-channel/send_track_done'
  | 'voice-channel/member-joined'
  | 'voice-channel/new_peer_speaker';

export type MemberJoinedPayload = {
  id: string;
};

export type YouJoinedAsSpeakerPayload = {
  roomId: string;
  peerId: string;
  routerRtpCapabilities: RtpCapabilities;
  sendTransportOptions: TransportOptions;
  recvTransportOptions: TransportOptions;
};

export type SendTrackDonePayload = {
  roomId: string;
  peerId: string;
  producerId: string;
};
