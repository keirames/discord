import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { useRoomStore } from './use-room-store';
import { useSendMessage } from './use-send-message';

export const InputToolbar = () => {
  const [inputVal, setInputVal] = useState<string>('');
  const mutation = useSendMessage();
  const roomId = useRoomStore((state) => state.roomId);

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Enter') return;

    setInputVal('');
    handleSend();
  };

  const handleClickIcon: React.MouseEventHandler<SVGElement> = (e) => {
    setInputVal('');
    handleSend();
  };

  const handleSend = () => {
    if (!roomId) return;

    mutation.mutate({ input: { roomId, text: inputVal } });
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <input
        className="h-10 w-full rounded-full bg-gray-100 p-4"
        value={inputVal}
        placeholder="Aa"
        onChange={(e) => setInputVal(e.currentTarget.value)}
        onKeyUp={handleKeyUp}
      />
      <div className="ml-4 h-full w-[30px] p-1">
        {inputVal.length !== 0 && (
          <IoSend
            className="h-full w-full cursor-pointer text-blue-600"
            onClick={handleClickIcon}
          />
        )}
      </div>
    </div>
  );
};
