import { atom } from 'jotai';
import { Message } from './models';

export const messagesAtom = atom<Message[]>([]);

export const inputValAtom = atom<string>('');

export const userIdAtom = atom<string>('');
