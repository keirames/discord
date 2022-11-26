import React from 'react';
import { useRoomStore } from './use-room-store';

export const ChatBox = () => {
  const roomId = useRoomStore((state) => state.roomId);

  if (!roomId) return <div>pick a room</div>;

  return <div>ChatBox</div>;
};
