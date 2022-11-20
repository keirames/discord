import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Spacings } from 'react-native-ui-lib';
import { useSignIn } from 'src/modules/auth/use-sign-in';

const AuthScreen = () => {
  const mutation = useSignIn();

  const [inputVal, setInputVal] = useState<string>('Garry');

  return (
    <SafeAreaView style={styles.container}>
      <Text>AUTH SCREEN</Text>
      <TextInput
        style={styles.input}
        value={inputVal}
        placeholder="Enter name"
        onChangeText={(v) => setInputVal(v)}
      />
      <Button
        title="Go"
        onPress={() => {
          mutation.mutate({ name: inputVal });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { padding: Spacings.s2 },
});

export default AuthScreen;
