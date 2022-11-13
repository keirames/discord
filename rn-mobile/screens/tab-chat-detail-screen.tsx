import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Colors } from 'react-native-ui-lib';
import { ChatBox } from 'src/modules/chat-detail/chat-box';
import { useSendMessage } from 'src/modules/chat-detail/use-send-message';
import useRoom from 'src/modules/chat-detail/useRoom';
import { useUser } from 'src/modules/useUser';
import { TabChatStackParamList } from '../types';

type Props = NativeStackScreenProps<TabChatStackParamList, 'ChatDetail'>;

const TabChatDetailScreen: React.FC<Props> = (props) => {
  const { route } = props;

  const { room } = useRoom();
  const { userId } = useUser();
  const mutation = useSendMessage();

  const [inputVal, setInputVal] = useState('');

  if (!userId) return null;

  if (room) {
    return (
      <View style={styles.container}>
        <ChatBox userId={userId} messages={room.messages} />
        <TextInput value={inputVal} onChangeText={(v) => setInputVal(v)} />
        <Text onPress={() => mutation.mutate(inputVal)}>Send</Text>
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
  container: { flex: 1, backgroundColor: Colors.white },
});

export default TabChatDetailScreen;
