import create from 'zustand';
import { devtools } from 'zustand/middleware';

type EmojiPickerStoreState = {
  label: string;
  setLabel: (newLabel: string) => void;
};

export const useEmojiPickerStore = create<EmojiPickerStoreState>()(
  devtools((set) => ({
    label: '',
    setLabel: (newLabel) => set((state) => ({ ...state, label: newLabel })),
  })),
);
