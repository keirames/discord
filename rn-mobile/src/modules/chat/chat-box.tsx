import { Provider } from 'jotai';
import React from 'react';

import { messagesAtom, userIdAtom } from './atoms';
import { InputToolbar } from './input-toolbar';
import { MessageContainer } from './message-container';
import { Message } from './types';

interface Props {
  userId: string;
  messages: Message[];
}

export const ChatBox: React.FC<Props> = (props) => {
  const { userId, messages = [{ id: '1', text: 'hi' }] } = props;

  return (
    <Provider
      initialValues={[
        [messagesAtom, messages],
        [userIdAtom, userId],
      ]}>
      <MessageContainer />
      <InputToolbar />
    </Provider>
  );
};
