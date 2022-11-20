import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import { useReactQuerySubscription } from 'src/hooks/use-react-query-subscription';
import { ChatBox } from 'src/modules/chat/chat-box';
import { useGetRoom } from 'src/modules/chat/use-get-room';
import { useUser } from 'src/modules/useUser';

import { TabChatStackParamList } from '../types';

type Props = NativeStackScreenProps<TabChatStackParamList, 'ChatDetail'>;

const TabChatDetailScreen: React.FC<Props> = (props) => {
  const { route } = props;

  const roomId = route.params.roomID;

  useReactQuerySubscription();
  const { room, isLoading } = useGetRoom(roomId);
  const { userId } = useUser();

  if (!userId) return null;

  if (isLoading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  if (room) {
    return (
      <SafeAreaView style={styles.container}>
        <ChatBox userId={userId} roomId={roomId} messages={room.messages} />
      </SafeAreaView>
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
