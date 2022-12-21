import type {
  Consumer,
  Producer,
  Transport,
  Router,
  Worker,
} from 'mediasoup/node/lib/types';

export type MyPeer = {
  sendTransport: Transport | null;
  recvTransport: Transport | null;
  producer: Producer | null;
  consumers: Consumer[];
};

export type MyRoomState = Record<string, MyPeer>;

export type MyRooms = Record<
  string,
  { worker: Worker; router: Router; state: MyRoomState }
>;

export type VoiceSendDirection = 'recv' | 'send';
