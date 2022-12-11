import clsx from 'clsx';
import React from 'react';
import { useGetRooms } from '../chat/use-get-rooms';
import { useRoomStore } from '../chat/use-room-store';

export const Rooms = () => {
  const { rooms } = useGetRooms();
  const { pickRoom, roomId } = useRoomStore();

  return (
    <div>
      {rooms.map((room, idx) => (
        <React.Fragment key={room.id}>
          <div
            key={room.id}
            className={clsx(
              'my-1 flex cursor-pointer flex-row items-center rounded-lg p-2 hover:bg-zinc-600',
              { 'bg-zinc-600': roomId === room.id },
            )}
            onClick={() => {
              pickRoom(room.id);
            }}
          >
            <div className="mr-2 h-[35px] w-[35px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-cyan-500">
                NA
              </div>
            </div>
            <div className="flex-1 truncate">{room.title}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
