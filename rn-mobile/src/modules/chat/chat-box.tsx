import { Provider, useAtom } from 'jotai';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
} from 'react-native';

import { messagesAtom, roomIdAtom, userIdAtom } from './atoms';
import { InputToolbar } from './input-toolbar';
import { MessageContainer } from './message-container';
import { Message } from './types';

interface Props {
  userId: string;
  roomId: string;
  messages: Message[];
}

export const ChatBox = () => {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.chatContainer} behavior="padding">
        <Text>chat container</Text>
      </KeyboardAvoidingView>
      <View style={styles.inputContainer}>
        <Text>tool box</Text>
        <TextInput />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: '100%', borderWidth: 1, borderColor: 'pink' },
  chatContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'red',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputContainer: {
    position: 'relative',
    bottom: 0,
  },
});

// export const ChatBox: React.FC<Props> = (props) => {
//   const { userId, roomId } = props;

//   return (
//     <Provider
//       initialValues={[
//         [userIdAtom, userId],
//         [roomIdAtom, roomId],
//       ]}>
//       <MessageContainer />
//       <InputToolbar />
//     </Provider>
//   );
// };
