import React, { useMemo } from 'react';
import emojis from 'emojibase-data/en/data.json';
import { useEmojiPickerStore } from './use-emoji-picker-store';

// TODO: https://twemoji.maxcdn.com/v/latest/svg/1f1ea-1f1ed.svg
type Props = {
  code: string;
};

export const Emoji: React.FC<Props> = (props) => {
  const { code } = props;

  const setLabel = useEmojiPickerStore((state) => state.setLabel);

  const data = useMemo(() => emojis.find((e) => e.hexcode === code), [code]);

  if (!data) return null;

  return (
    <div
      className="cursor-pointer rounded-md p-2 hover:bg-gray-500"
      onMouseEnter={() => {
        setLabel(`:${data.label}:`);
      }}
    >
      <img
        src={`https://twemoji.maxcdn.com/v/latest/svg/${code.toLowerCase()}.svg`}
        alt="icon"
        width={30}
        height={30}
      />
    </div>
  );
};
