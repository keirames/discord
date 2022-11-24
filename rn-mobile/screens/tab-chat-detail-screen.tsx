import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat, IMessage, Bubble } from 'react-native-gifted-chat';
import { Colors } from 'react-native-ui-lib';
import { useReactQuerySubscription } from 'src/hooks/use-react-query-subscription';
import { useAuthStore } from 'src/modules/auth/use-auth-store';
import { roomIdAtom } from 'src/modules/chat/atoms';
import { Receipts } from 'src/modules/chat/bubble';
import { ChatBox } from 'src/modules/chat/chat-box';
import { InputToolbar } from 'src/modules/chat/input-toolbar';
import { useGetRoom } from 'src/modules/chat/use-get-room';

import { TabChatStackParamList } from '../types';

type Props = NativeStackScreenProps<TabChatStackParamList, 'ChatDetail'>;

const TabChatDetailScreen: React.FC<Props> = (props) => {
  const { route } = props;

  const [, setRoomId] = useAtom(roomIdAtom);

  const roomId = route.params.roomID;

  setRoomId(roomId);

  useReactQuerySubscription();
  const { room, isLoading } = useGetRoom(roomId);
  const userId = useAuthStore((state) => state.user!.id);

  const mapMessagesIntoChatBox = (): IMessage[] => {
    const messages = room?.messages || [];

    return messages.map((m) => ({
      _id: m.id,
      text: m.text,
      createdAt: Date.now(),
      user: {
        _id: m.userId,
        avatar:
          'https://cdn.vox-cdn.com/thumbor/4E98u_RfYxa8pkRK79CyPClFABY=/0x0:1147x647/1200x800/filters:focal(483x233:665x415)/cdn.vox-cdn.com/uploads/chorus_image/image/70742090/Jotaro.0.jpeg',
      },
    }));
  };

  if (!userId) return null;

  if (isLoading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  const mappedMessages = mapMessagesIntoChatBox();
  if (room) {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={mappedMessages}
          user={{ _id: userId }}
          renderInputToolbar={(props) => {
            return <InputToolbar />;
          }}
          renderBubble={(props) => {
            const { currentMessage } = props;

            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  backgroundColor,
                }}>
                <Bubble {...props} />
                <Receipts messageId={currentMessage!._id.toString()} />
              </View>
            );
          }}
        />
      </View>
    );
  }

  return (
    <View>
      <Text>TabChatDetailScreen {route.params.roomID}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // TODO: should have default white whole app
    backgroundColor: Colors.white,
  },
});

export default TabChatDetailScreen;
