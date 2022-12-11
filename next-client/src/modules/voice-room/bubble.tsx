import React from 'react';
import { Message } from '../chat/use-chat-store';

type Props = {
  // Id of user, not message's userId
  userId: string;
  currentMessage: Message;
  prevMessage?: Message;
  nextMessage?: Message;
};

export const Bubble: React.FC<Props> = (props) => {
  const { userId, currentMessage, prevMessage, nextMessage } = props;

  return (
    <div className="relative my-4 w-full py-1 pl-20 hover:bg-midnight-600">
      <div className="absolute left-5 top-2 h-[35px] w-[35px]">
        <img
          src="https://i.scdn.co/image/ab67616d0000b273ee07b239264db04dcf5148cd"
          className="rounded-full"
        />
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start overflow-hidden">
        <div className="flex items-center">
          <div className="mr-2 font-semibold  ">name</div>
          <div className="text-xs font-light">Yesterday at 1:55 PM</div>
        </div>
        <div className="w-full break-words">{currentMessage.text}</div>
      </div>
    </div>
  );
};
