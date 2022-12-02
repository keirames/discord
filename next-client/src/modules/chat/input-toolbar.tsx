import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { IoSend } from 'react-icons/io5';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { useRoomStore } from './use-room-store';
import { useSendMessage } from './use-send-message';

export const InputToolbar = () => {
  const [inputVal, setInputVal] = useState<string>('');
  const [rowHeight, setRowHeight] = useState(1);
  const [focus, setFocus] = useState(false);

  useHotkeys(
    'ctrl+enter, meta+enter',
    () => {
      setInputVal((prev) => prev.concat('\n'));
    },
    {
      enabled: focus && inputVal.length !== 0,
      enableOnFormTags: ['TEXTAREA'],
    },
  );
  useHotkeys(
    'enter',
    () => {
      setInputVal('');
      // handleSend();
      console.log('enter');
    },
    {
      enabled: inputVal.length !== 0,
      enableOnFormTags: ['TEXTAREA'],
    },
  );

  const mutation = useSendMessage();

  const roomId = useRoomStore((state) => state.roomId);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleClickIcon: React.MouseEventHandler<SVGElement> = (e) => {
    setInputVal('');
    handleSend();
  };

  const handleSend = () => {
    if (!roomId || inputVal.length === 0) return;

    // mutation.mutate({ input: { roomId, text: inputVal } });
  };

  return (
    <div className="flex w-full flex-1 items-center justify-center p-4">
      <ReactTextareaAutosize
        value={inputVal}
        minRows={1}
        maxRows={6}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="w-full resize-none rounded-3xl bg-gray-100 px-4 py-2"
        onChange={(e) => setInputVal(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onHeightChange={(h) => {
          setRowHeight(h);
        }}
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
