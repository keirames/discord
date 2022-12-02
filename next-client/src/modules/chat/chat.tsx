import React from 'react';
import { ChatContainer } from './chat-box';
import { Panel } from './panel';

export const Chat = () => {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="h-full w-2/5 p-4">
        <Panel />
      </div>
      {/* //min-w-0 here to prevent chat container expand when there is long message */}
      <div className="h-full w-full min-w-0">
        <ChatContainer />
      </div>
      <div className="h-full w-2/5">Chat Detail</div>
    </div>
  );
};
