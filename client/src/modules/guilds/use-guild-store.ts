import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  guildId: null | string;
  pickGuild: (guildId: string) => void;
}

export const useGuildStore = create<State>()(
  devtools((set) => ({
    guildId: null,
    pickGuild: (guildId) => set((state) => ({ ...state, guildId })),
  })),
);
