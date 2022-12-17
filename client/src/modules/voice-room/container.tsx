import React from 'react';
import { BsBroadcastPin } from 'react-icons/bs';
import { VoiceRoom } from './voice-room';
import { MdEmojiPeople } from 'react-icons/md';
import { RiVipCrownFill } from 'react-icons/ri';
import { BsPlusSquare } from 'react-icons/bs';
import { Rooms } from './rooms';
import { ChatBoxContainer } from './chat-box';
import { Guilds } from '../guilds/guilds';
import { ChannelsContainer } from '../channels/channels-container';

export const Container = () => {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-shrink-0 flex-grow-0 basis-24 flex-col items-center justify-start overflow-y-scroll bg-dark-700">
        <Guilds />
      </div>
      <div className="min-w-0 flex-shrink-0 flex-grow-0 basis-72 bg-dark-650">
        {/* <Rooms /> */}
        <ChannelsContainer />
      </div>
      <div className="flex h-full w-full min-w-0 flex-1 flex-col">
        <div className="">header</div>
        <div className="flex min-h-0 flex-1">
          <div className="h-full w-full min-w-0 flex-1 bg-dark-600">
            {/* <ChatBoxContainer /> */}
          </div>
          {/* <div className="w-1/3 bg-zinc-500">detail box</div> */}
        </div>
      </div>
    </div>
  );
};
