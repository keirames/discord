import { useEffect, useRef, useState } from 'react';

// type EventListener = (
//   eventName: string,
//   handler: (payload: any) => void,
// ) => void;
type EmittableEventName = 'voice-channel/join';

type ListenableEventName = 'voice-channel/you_joined_as_speaker';

const eventListeners: { eventName: string; handler: (payload: any) => void }[] =
  [];

export const useWebsocket2 = () => {
  // TODO: move ws state into global
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  // const [eventListeners, setEventListeners] = useState<
  //   { eventName: string; handler: (payload: any) => void }[]
  // >([]);

  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    // TODO: move token
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlODdjYjE5Yy02NGQyLTQ5ZTYtOGY1Ni0zYjgyOTgwNzAxNTUiLCJleHAiOjE2NzIwODExMjYsImlhdCI6MTY3MjA3MDMyNn0.gcLKDIlnZA_sNopECDzkWIrkyi-HJ9ZIhf_Z3w1gPhs';
    const ws = new WebSocket(`ws://localhost:4000/ws?token=${token}`);

    ws.addEventListener('open', () => {
      setWebsocket(ws);
    });

    ws.addEventListener('message', (msgEvent) => {
      const parsedMsgEvent: { eventName: string; payload: string } = JSON.parse(
        msgEvent.data,
      );

      for (const listener of eventListeners) {
        const { eventName, handler } = listener;

        if (eventName === parsedMsgEvent.eventName) {
          handler(JSON.parse(parsedMsgEvent.payload));
        }
      }
    });
  }, []);

  const on = <T>(
    eventName: ListenableEventName,
    handler: (payload: T) => void,
  ) => {
    eventListeners.push({ eventName, handler });
  };

  const emit = (eventName: EmittableEventName, payload: any) => {
    if (!websocket) return;

    const data = JSON.stringify({
      eventName,
      payload: JSON.stringify(payload),
    });

    websocket.send(data);
  };

  return { websocket, on, emit };
};

// on('eventName', (payload) => {});
