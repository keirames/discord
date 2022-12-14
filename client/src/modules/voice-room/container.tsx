import React from 'react';
import { BsBroadcastPin } from 'react-icons/bs';
import { VoiceRoom } from './voice-room';
import { MdEmojiPeople } from 'react-icons/md';
import { RiVipCrownFill } from 'react-icons/ri';
import { BsPlusSquare } from 'react-icons/bs';
import { Rooms } from './rooms';
import { ChatBoxContainer } from './chat-box';

export const Container = () => {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-shrink-0 flex-grow-0 basis-24 flex-col items-center justify-start overflow-y-scroll bg-dark-700">
        <img
          src="https://i.scdn.co/image/ab67616d0000b273ee07b239264db04dcf5148cd"
          className="h-[50px] w-[50px] cursor-pointer rounded-2xl"
        />
        <div className="my-2 w-full px-6">
          <div className="rounded-lg border border-gray-300" />
        </div>
        {[...Array(30).keys()].map((k) => (
          <img
            key={k}
            src="https://www.kindpng.com/picc/m/205-2055865_dog-face-transparent-dog-meme-face-png-png.png"
            className="my-1 h-[50px] w-[50px] cursor-pointer rounded-full hover:rounded-2xl"
          />
        ))}
      </div>
      <div className="min-w-0 flex-shrink-0 flex-grow-0 basis-72 bg-dark-650 p-4">
        <div className="flex items-center justify-between">
          <div className="uppercase">direct messages</div>
          <BsPlusSquare className="cursor-pointer" />
        </div>
        <Rooms />
      </div>
      <div className="flex h-full w-full min-w-0 flex-1 flex-col">
        <div className="">header</div>
        <div className="flex min-h-0 flex-1">
          <div className="h-full w-full min-w-0 flex-1 bg-dark-600">
            <ChatBoxContainer />
          </div>
          {/* <div className="w-1/3 bg-zinc-500">detail box</div> */}
        </div>
      </div>
    </div>
  );
};
