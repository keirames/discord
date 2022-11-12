import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Colors, Typography } from 'react-native-ui-lib';

interface Props {
  name?: string;
}

const Avatar: React.FC<Props> = (props) => {
  const { name } = props;

  return (
    <View style={styles.container}>
      <View style={styles.round}>
        <Text style={styles.text}>NZ</Text>
      </View>
      {name && <Text style={styles.name}>{name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  round: {
    backgroundColor: Colors.blue40,
    width: 50,
    height: 50,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  name: { ...Typography.text90R },
});

export default Avatar;
