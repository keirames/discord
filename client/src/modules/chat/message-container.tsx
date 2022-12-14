import React from 'react';
import { useAuthStore } from '../auth/use-auth-store';
import { Bubble } from './bubble';
import { useChatStore } from './use-chat-store';

type Props = {
  id: string;
  roomId: string;
};

export const MessageContainer: React.FC<Props> = (props) => {
  const { id, roomId } = props;

  const messages = useChatStore((state) => state.messages);
  // sure will get user here
  const userId = useAuthStore((state) => state.user!.id);

  const message = messages.find((m) => m.id === id);
  const messageIdx = messages.findIndex((m) => m.id === id);

  if (!message || !(messageIdx !== -1)) return null;

  const prevMessage = messages[messageIdx - 1];
  const nextMessage = messages[messageIdx + 1];
  return (
    <Bubble
      userId={userId}
      currentMessage={message}
      prevMessage={prevMessage}
      nextMessage={nextMessage}
    />
  );
};
