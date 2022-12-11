import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../auth/use-auth-store';
import { useChatStore } from '../chat/use-chat-store';
import { useGetRoom } from '../chat/use-get-room';
import { useRoomStore } from '../chat/use-room-store';
import { InputToolbar } from './input-toolbar';
import { MessageContainer } from './message-container';

type Props = {
  roomId: string;
};

const ChatBox: React.FC<Props> = (props) => {
  const { roomId } = props;

  const { room } = useGetRoom(roomId);
  const messages = useChatStore((state) => state.messages);
  const userId = useAuthStore((state) => state.user?.id);
  const lastRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (room && lastRef && lastRef.current) {
      lastRef.current.scrollIntoView({ block: 'end' });
    }
  }, [room]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="scrollbar h-full w-full overflow-y-scroll">
        {messages.map((message) => {
          const { id } = message;

          return <MessageContainer key={id} id={id} roomId={roomId} />;
        })}
        <div ref={lastRef} />
      </div>
      <InputToolbar />
    </div>
  );
};

export const ChatBoxContainer = () => {
  const roomId = useRoomStore((state) => state.roomId);

  if (!roomId) return <div>pick a room</div>;

  return <ChatBox roomId={roomId} />;
};
