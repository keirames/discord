import create from 'zustand';
import { combine, devtools } from 'zustand/middleware';
import { EmittableEventName } from './types';

const initialState = {
  ready: false,
};

const eventListeners: { eventName: string; handler: (payload: any) => void }[] =
  [];

type State = {
  websocket: WebSocket | null;
  isReady: boolean;
  setReady: (ws: WebSocket) => void;
  emit: (eventName: EmittableEventName, payload: unknown) => void;
  join: (payload: any) => void;
};

const emit = (params: {
  ws: WebSocket;
  eventName: EmittableEventName;
  payload: unknown;
}) => {
  const { ws, eventName, payload } = params;

  const data = JSON.stringify({
    eventName,
    payload: JSON.stringify(payload),
  });

  ws.send(data);
};

export const useWsStore = create<State>()(
  devtools((set, get) => ({
    websocket: null,
    isReady: false,
    setReady: (ws) => {
      set((state) => ({ ...state, isReady: true, websocket: ws }));
    },
    emit: (eventName: EmittableEventName, payload: unknown) => {
      const ws = get().websocket;
      if (!ws) return;

      emit({ ws, eventName, payload });
    },
    join: (payload) => {
      const websocket = get().websocket;
      if (!websocket) return;

      emit({ ws: websocket, eventName: 'voice-channel/join', payload });
    },
  })),
);

// const mutations = (setState: any, getState: any) => {
//   const token =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlODdjYjE5Yy02NGQyLTQ5ZTYtOGY1Ni0zYjgyOTgwNzAxNTUiLCJleHAiOjE2NzIwODExMjYsImlhdCI6MTY3MjA3MDMyNn0.gcLKDIlnZA_sNopECDzkWIrkyi-HJ9ZIhf_Z3w1gPhs';
//   const ws = new WebSocket(`ws://localhost:4000/ws?token=${token}`);

//   ws.addEventListener('open', () => {
//     setState({ ready: true });
//   });

//   return {
//     actions: {
//       register: <T>(
//         eventName: ListenableEventName,
//         handler: (payload: T) => void,
//       ) => {
//         eventListeners.push({ eventName, handler });
//       },
//       join: (payload: any) => {
//         emit({ ws, eventName: 'voice-channel/join', payload });
//       },
//     },
//   };
// };

// export const useWsStore = create(combine(initialState, mutations));
