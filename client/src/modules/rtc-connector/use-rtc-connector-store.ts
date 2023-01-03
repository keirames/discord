import type { Device, Transport } from 'mediasoup-client/lib/types';
import create from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  device?: Device;
  track?: MediaStreamTrack;
  recvTransport?: Transport;
  setDevice: (device: Device) => void;
  setTrack: (track: MediaStreamTrack) => void;
  setRecvTransport: (transport: Transport) => void;
};

export const useRtcConnectorStore = create<State>()(
  devtools((set, get) => {
    return {
      device: undefined,
      track: undefined,
      setDevice: (device) => set((state) => ({ ...state, device })),
      setTrack: (track) => set((state) => ({ ...state, track })),
      setRecvTransport: (transport) =>
        set((state) => ({ ...state, recvTransport: transport })),
    };
  }),
);
