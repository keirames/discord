import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../auth/use-auth-store';
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
      {room?.messages.map((message) => {
        const { id, userId: msgUserId, text } = message;

        return (
          <div
            className={clsx({
              'flex flex-row': true,
              'justify-end': msgUserId === userId,
            })}
            key={id}
          >
            <div
              className={clsx({
                'my-1 rounded-full py-2 px-4': true,
                'bg-gray-100 text-black': msgUserId !== userId,
                'bg-blue-500 text-white': msgUserId === userId,
              })}
            >
              {text}
            </div>
          </div>
        );
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
