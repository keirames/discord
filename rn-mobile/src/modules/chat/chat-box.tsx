import { Provider, useAtom } from 'jotai';
import React, { useEffect } from 'react';

import { messagesAtom, roomIdAtom, userIdAtom } from './atoms';
import { InputToolbar } from './input-toolbar';
import { MessageContainer } from './message-container';
import { Message } from './types';

interface Props {
  userId: string;
  roomId: string;
  messages: Message[];
}

export const ChatBox: React.FC<Props> = (props) => {
  const { userId, roomId } = props;

  return (
    <Provider
      initialValues={[
        [userIdAtom, userId],
        [roomIdAtom, roomId],
      ]}>
      <MessageContainer />
      <InputToolbar />
    </Provider>
  );
};
