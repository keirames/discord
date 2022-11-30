import React from 'react';
import { ChatContainer } from './chat-box';
import { Panel } from './panel';

export const Chat = () => {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="h-full w-2/5 p-4">
        <Panel />
      </div>
      <div className="h-full w-full">
        <ChatContainer />
      </div>
      <div className="h-full w-2/5">Chat Detail</div>
    </div>
  );
};
