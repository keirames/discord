import React from 'react';
import { useAuthStore } from '../auth/use-auth-store';
import { Bubble } from './bubble';
import { useGetRoom } from './use-get-room';

type Props = {
  id: string;
  roomId: string;
};

export const MessageContainer: React.FC<Props> = (props) => {
  const { id, roomId } = props;

  const { room } = useGetRoom(roomId);
  // sure will get user here
  const userId = useAuthStore((state) => state.user!.id);

  const message = room?.messages.find((m) => m.id === id);
  const messageIdx = room?.messages.findIndex((m) => m.id === id);

  if (!message || !messageIdx) return null;

  const prevMessage = room?.messages[messageIdx - 1];
  const nextMessage = room?.messages[messageIdx + 1];
  return (
    <Bubble
      userId={userId}
      currentMessage={message}
      prevMessage={prevMessage}
      nextMessage={nextMessage}
    />
  );
};
