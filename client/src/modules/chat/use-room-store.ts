import create from 'zustand';

interface State {
  roomId: null | string;
  pickRoom: (roomId: string) => void;
}

export const useRoomStore = create<State>()((set) => ({
  roomId: null,
  pickRoom: (roomId) => set((state) => ({ ...state, roomId })),
}));
