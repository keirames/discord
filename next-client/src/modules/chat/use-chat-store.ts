import create from 'zustand';
import { devtools } from 'zustand/middleware';

export type Message = {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
};

type ChatStore = {
  messages: Message[];
  pendingMessageIds: string[];
  setMessages: (messages: Message[]) => void;
  addNewMessage: (message: Message) => void;
  changeMessageId: (newId: string, oldId: string) => void;
  markPending: (id: string) => void;
  removePending: (id: string) => void;
};

export const useChatStore = create<ChatStore>()(
  devtools((set) => ({
    messages: [],
    pendingMessageIds: [],
    setMessages: (messages) =>
      set((state) => ({
        ...state,
        messages: [...messages, ...state.messages],
      })),
    changeMessageId: (newId, oldId) =>
      set((state) => {
        return {
          ...state,
          messages: [
            ...state.messages.map((msg) => {
              if (msg.id === oldId) {
                return { ...msg, id: newId };
              }

              return msg;
            }),
          ],
        };
      }),
    addNewMessage: (message) =>
      set((state) => ({ ...state, messages: [...state.messages, message] })),
    markPending: (id) =>
      set((state) => {
        if (state.pendingMessageIds.find((i) => i === id)) return state;

        return {
          ...state,
          pendingMessageIds: [...state.pendingMessageIds, id],
        };
      }),
    removePending: (id) =>
      set((state) => ({
        ...state,
        pendingMessageIds: state.pendingMessageIds.filter((i) => i !== id),
      })),
  })),
);
