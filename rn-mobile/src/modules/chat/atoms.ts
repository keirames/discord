import { atom } from 'jotai';

import { Message } from './types';

export const messagesAtom = atom<Message[]>([]);

export const inputValAtom = atom<string>('');

export const userIdAtom = atom<string>('');

export const roomIdAtom = atom<string>('');

export const pendingMessagesAtom = atom<string[]>([]);
