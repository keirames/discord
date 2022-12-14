import create from 'zustand';
import { devtools } from 'zustand/middleware';

type PopLayoutControlStore = {};

export const usePopLayoutControlStore = create<PopLayoutControlStore>()(
  devtools(() => ({})),
);
