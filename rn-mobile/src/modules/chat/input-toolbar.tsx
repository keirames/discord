import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {
  BorderRadiuses,
  Colors,
  Spacings,
  Typography,
} from 'react-native-ui-lib';
import { useSendMessage } from 'src/modules/chat/use-send-message';

import { inputValAtom, roomIdAtom } from './atoms';

export const InputToolbar = () => {
  const [val, setVal] = useAtom(inputValAtom);
  const [roomId] = useAtom(roomIdAtom);
  const mutation = useSendMessage();

  return (
    <View style={styles.container}>
      <TextInput
        value={val}
        onChangeText={(v) => setVal(v)}
        placeholder="Send text"
        style={styles.input}
      />
      <Ionicons
        name="ios-send"
        style={styles.icon}
        onPress={() => {
          setVal('');
          mutation.mutate({ input: { roomId, text: val } });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacings.s4,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.grey70,
    padding: Spacings.s2,
    borderRadius: BorderRadiuses.br50,
  },
  icon: {
    fontSize: 20,
    color: Colors.blue40,
    marginHorizontal: Spacings.s2,
  },
});
