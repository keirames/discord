import create from 'zustand';

interface State {
  pendingMessages: string[];
  markPending: (id: string) => void;
  removePending: (id: string) => void;
}

export const usePendingMessagesStore = create<State>()((set) => ({
  pendingMessages: [],
  markPending: (id) =>
    set((state) => {
      if (state.pendingMessages.find((i) => i === id)) return state;

      return { ...state, pendingMessages: [...state.pendingMessages, id] };
    }),
  removePending: (id) =>
    set((state) => ({
      ...state,
      pendingMessages: state.pendingMessages.filter((i) => i !== id),
    })),
}));
