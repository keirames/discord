import { devtools } from 'zustand/middleware';
import create from 'zustand';

type State = {
  pickedChannel: null | string;
  pickChannel: (id: string) => void;
};

export const useVoiceChannelStore = create<State>()(
  devtools((set) => ({
    pickedChannel: null,
    pickChannel: (id) => set((state) => ({ ...state, pickedChannel: id })),
  })),
);
