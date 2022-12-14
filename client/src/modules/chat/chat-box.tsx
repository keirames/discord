import React, { useEffect, useMemo, useRef } from 'react';
import { useAuthStore } from '../auth/use-auth-store';
import { InputToolbar } from './input-toolbar';
import { MessageContainer } from './message-container';
import { useChatStore } from './use-chat-store';
import { useGetRoom } from './use-get-room';
import { useRoomStore } from './use-room-store';

type Props = {
  roomId: string;
};

export const ChatBox: React.FC<Props> = (props) => {
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
    <div className="h-full w-full overflow-y-scroll">
      {messages.map((message) => {
        const { id } = message;

        return <MessageContainer key={id} id={id} roomId={roomId} />;
      })}
      <div ref={lastRef} />
    </div>
  );
};

export const ChatContainer = () => {
  const roomId = useRoomStore((state) => state.roomId);

  if (!roomId) return <div>pick a room</div>;

  return (
    <div className="flex h-full w-full min-w-0 flex-col border border-red-200">
      <div className="h-[5%]">
        <span>Header</span>
      </div>
      <ChatBox roomId={roomId} />
      <InputToolbar />
    </div>
  );
};
