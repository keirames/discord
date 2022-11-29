import React, { useEffect, useMemo, useRef } from 'react';
import { useAuthStore } from '../auth/use-auth-store';
import { MessageContainer } from './message-container';
import { useGetRoom } from './use-get-room';
import { useRoomStore } from './use-room-store';

type Props = {
  roomId: string;
};

export const ChatBox: React.FC<Props> = (props) => {
  const { roomId } = props;

  const { room } = useGetRoom(roomId);
  const userId = useAuthStore((state) => state.user?.id);
  const lastRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (room && lastRef && lastRef.current) {
      lastRef.current.scrollIntoView({ block: 'end' });
    }
  }, [room]);

  return (
    <div className="h-full w-full">
      {room?.messages.reverse().map((message) => {
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
      <div>
        <span>Header</span>
      </div>
      <div className="h-[90vh] overflow-y-scroll border border-blue-100">
        <ChatBox roomId={roomId} />
      </div>
      <div>input</div>
    </div>
  );
};
