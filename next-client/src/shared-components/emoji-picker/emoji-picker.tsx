import React from 'react';
import emojis from 'emojibase-data/en/data.json';
import groupDataSet from 'emojibase-data/meta/groups.json';
import { FaSmileWink, FaLeaf, FaIceCream } from 'react-icons/fa';
import { SearchBar } from './search-bar';
import { SkinTone } from './skin-tone';
import Image from 'next/image';
import { Group } from './group';
import { GroupType } from './types';

// TODO: remove constant width/height of picker

export const EmojiPicker = () => {
  console.log('group: ', groupDataSet.groups);

  const renderGroups = () => {
    const groups: React.ReactElement[] = [];

    // mapping emoji into group base on emojibase-data
    const groupMap: Record<GroupType, string[]> = {
      people: [],
      nature: [],
      food: [],
      activities: [],
      travel: [],
    };

    emojis.forEach((emoji) => {
      const { group, hexcode } = emoji;

      if (group === 0 || group === 1) {
        groupMap.people.push(hexcode);
      }

      if (group === 3) {
        groupMap.nature.push(hexcode);
      }

      if (group === 4) {
        groupMap.food.push(hexcode);
      }

      if (group === 5) {
        groupMap.travel.push(hexcode);
      }

      if (group === 6) {
        groupMap.activities.push(hexcode);
      }
    });

    for (const key in groupMap) {
      // ts lose type here
      const groupName: GroupType = key as any;

      groups.push(
        <Group key={groupName} name={groupName} codes={groupMap[groupName]} />,
      );
    }

    return groups;
  };

  return (
    <div className="flex h-[400px] w-[400px] flex-col rounded-lg bg-midnight-650">
      <div
        className="relative flex items-center border border-transparent 
      border-b-black py-4 pl-4 pr-2"
      >
        <SearchBar />
        <SkinTone />
      </div>
      <div className="flex flex-wrap overflow-y-scroll">{renderGroups()}</div>
    </div>
  );
};
