import React, { useState } from 'react';
import emojis from 'emojibase-data/en/data.json';
import { HiChevronDown } from 'react-icons/hi';
import {
  FaLeaf,
  FaSmileWink,
  FaIceCream,
  FaGamepad,
  FaCarSide,
} from 'react-icons/fa';
import { Emoji } from './emoji';
import { GroupType } from './types';
import clsx from 'clsx';

type Props = {
  name: GroupType;
  codes: string[];
};

export const Group: React.FC<Props> = (props) => {
  const { name, codes } = props;

  const [isHidden, setIsHidden] = useState(false);

  const renderIcon = () => {
    if (name === 'people') return <FaSmileWink size={14} />;

    if (name === 'nature') return <FaLeaf size={14} />;

    if (name === 'food') return <FaIceCream size={14} />;

    if (name === 'activities') return <FaGamepad size={14} />;

    if (name === 'travel') return <FaCarSide size={14} />;
  };

  return (
    <div className="w-full">
      <button
        className="flex cursor-pointer flex-wrap items-center text-sm 
      font-semibold uppercase text-gray-300 hover:text-white"
        onClick={() => setIsHidden((prev) => !prev)}
      >
        <div className="mr-4">{renderIcon()}</div>
        <div className="mr-4">{name}</div>
        <HiChevronDown size={16} className={clsx({ '-rotate-90': isHidden })} />
      </button>
      <div className={clsx({ 'flex flex-wrap': true, hidden: isHidden })}>
        {codes.map((c) => (
          <Emoji key={c} code={c} />
        ))}
      </div>
    </div>
  );
};
