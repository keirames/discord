import React from 'react';
import { EmoteKeys, emoteMap } from './emoji-data';

interface Props {
  name: EmoteKeys;
  onClick?: () => void;
}

export const Emoji: React.FC<Props> = (props) => {
  const { name, onClick = () => {} } = props;

  const src = emoteMap[name];

  if (!src) return <div>{`:${name}:`}</div>;

  return (
    <img alt="emoji" className="inline-block" src={src} onClick={onClick} />
  );
};
