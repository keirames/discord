import React from 'react';
import { SearchBar } from './search-bar';
import { SkinTone } from './skin-tone';

// TODO: remove constant width/height of picker

export const EmojiPicker = () => {
  return (
    <div className="flex h-[400px] w-[400px] flex-col rounded-lg bg-midnight-650">
      <div
        className="relative flex items-center border border-transparent 
      border-b-black py-4 pl-4 pr-2"
      >
        <SearchBar />
        <SkinTone />
      </div>
      <div>body</div>
    </div>
  );
};
