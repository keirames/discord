import React from 'react';
import { ChatBox } from './chat-box';
import { Panel } from './panel';

export const Chat = () => {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="h-full w-1/5 p-4">
        <Panel />
      </div>
      <div className="h-full w-full">
        <ChatBox />
      </div>
    </div>
  );
};
