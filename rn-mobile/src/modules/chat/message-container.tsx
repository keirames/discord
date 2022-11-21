import { useAtom } from 'jotai';
import React from 'react';
import { ListRenderItemInfo, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { roomIdAtom } from 'src/modules/chat/atoms';
import { useGetRoom } from 'src/modules/chat/use-get-room';

import { Message } from './message';
import { Message as IMessage } from './types';

export const MessageContainer = () => {
  const [roomId] = useAtom(roomIdAtom);
  const { room } = useGetRoom(roomId);

  // * We will get room here for sure
  const messages = room!.messages;

  const renderRow = (info: ListRenderItemInfo<IMessage>) => {
    const { index, item } = info;

    const previousMessage: IMessage | undefined = messages[index - 1];

    return (
      <Message
        previousMessage={previousMessage}
        currentMessage={messages[index]}
      />
    );
  };

  return (
    <FlatList
      inverted
      showsVerticalScrollIndicator={false}
      data={messages}
      renderItem={renderRow}
      keyExtractor={(item) => item.id}
    />
  );
};
