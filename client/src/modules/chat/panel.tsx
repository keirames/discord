import clsx from 'clsx';
import React from 'react';
import { useGetRooms } from './use-get-rooms';
import { useRoomStore } from './use-room-store';

export const Panel = () => {
  const { rooms } = useGetRooms();
  const { pickRoom, roomId } = useRoomStore();

  return (
    <div>
      <div>
        <span>Messages</span>
      </div>
      <div>
        {rooms.map((room, idx) => (
          <React.Fragment key={room.id}>
            <div
              key={room.id}
              className={clsx(
                'flex cursor-pointer flex-row items-center rounded-lg py-2 px-2 hover:bg-gray-100',
                { 'bg-gray-100': roomId === room.id },
              )}
              onClick={() => {
                pickRoom(room.id);
              }}
            >
              <div className="mr-2 h-[40px] w-[40px]">
                <div className="flex h-full w-full items-center justify-center rounded-[50%] border bg-cyan-500">
                  NA
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex">
                  <span className="flex-1 font-bold">{room.title}</span>
                  <span className="text-sm text-gray-400">10:00</span>
                </div>
                <div className="flex flex-1 items-center">
                  <span className="w-2/3 truncate text-sm font-light text-gray-400">
                    fake last message and it is very long long long long
                  </span>
                  {/* <span className="w-1/3 text-right">1</span> */}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
