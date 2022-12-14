import create from 'zustand';

interface State {
  user: { id: string } | null;
}

export const useAuthStore = create<State>()((set) => ({
  user: null,
  setUser: (userId: string) =>
    set((state) => ({ ...state, user: { ...state.user, id: userId } })),
}));
