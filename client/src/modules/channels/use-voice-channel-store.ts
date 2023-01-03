import { devtools } from 'zustand/middleware';
import type { ConsumerOptions } from 'mediasoup-client/lib/types';
import create from 'zustand';

type Member = Omit<ConsumerOptions, 'streamId'> & { peerId: string };

type State = {
  pickedChannel: null | string;
  members: Member[];
  pickChannel: (id: string) => void;
  addMember: (params: Member) => void;
};

export const useVoiceChannelStore = create<State>()(
  devtools((set) => ({
    pickedChannel: null,
    members: [],
    pickChannel: (id) => set((state) => ({ ...state, pickedChannel: id })),
    addMember: (params) =>
      set((state) => ({
        ...state,
        members: [...state.members, { ...params }],
      })),
  })),
);
