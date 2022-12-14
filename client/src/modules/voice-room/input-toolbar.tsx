import React, { useState } from 'react';
import { AiFillPlusCircle, AiFillGift } from 'react-icons/ai';
import { HiGif, HiGift } from 'react-icons/hi2';
import { CgCardHearts } from 'react-icons/cg';
import { useFloating } from '@floating-ui/react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { Emoji } from '../chat/emoji';
import { useRoomStore } from '../chat/use-room-store';
import { useSendMessage } from '../chat/use-send-message';
import { EmojiPicker } from '../../shared-components/emoji-picker/emoji-picker';

export const InputToolbar = () => {
  const [inputVal, setInputVal] = useState<string>('');
  const [rowHeight, setRowHeight] = useState(1);

  const { x, y, reference, floating, strategy, update } = useFloating({
    placement: 'top',
  });

  const mutation = useSendMessage();

  const roomId = useRoomStore((state) => state.roomId);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (e.metaKey || e.ctrlKey || e.altKey) {
        setInputVal((prev) => prev.concat('\n'));
        return;
      }

      setInputVal('');
      handleSendText();
    }
  };

  const handleClickIcon: React.MouseEventHandler<SVGElement> = (e) => {
    setInputVal('');
    handleSendText();
  };

  const handleSendText = () => {
    if (!roomId || inputVal.length === 0) return;

    mutation.mutate({ input: { roomId, text: inputVal } });
  };

  const handleSendIcon = () => {
    if (!roomId) return;

    mutation.mutate({ input: { roomId, text: 'ayaya' } });
  };

  return (
    <div className="w-full flex-1 px-4 pb-8">
      <div
        ref={reference}
        className="flex w-full flex-1 items-center justify-center rounded-lg bg-dark-550 py-1 px-4"
      >
        <AiFillPlusCircle
          className="mr-4 cursor-pointer text-gray-300 hover:text-gray-200"
          size={28}
        />
        <ReactTextareaAutosize
          value={inputVal}
          // TODO: change to group name
          placeholder="Message Group"
          minRows={1}
          maxRows={6}
          className="w-full resize-none border-transparent bg-dark-550 py-2 focus:outline-none"
          onChange={(e) => setInputVal(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          onHeightChange={(h) => {
            setRowHeight(h);
            update();
          }}
        />
        <AiFillGift
          size={30}
          className="mx-2 cursor-pointer text-gray-300 hover:text-gray-200"
        />
        <HiGif
          size={32}
          className="mx-2 mt-1 cursor-pointer text-gray-300 hover:text-gray-200"
        />
        <CgCardHearts
          size={30}
          className="mx-2 cursor-pointer text-gray-300 hover:text-gray-200"
        />
        <div
          ref={floating}
          style={{
            position: strategy,
            top: y ?? 0,
            // left: x ?? 0,
            right: 16,
            width: 'max-content',
          }}
        >
          <EmojiPicker />
        </div>
      </div>
    </div>
  );
};
