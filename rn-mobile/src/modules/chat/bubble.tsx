import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  BorderRadiuses,
  Colors,
  Spacings,
  Text,
} from 'react-native-ui-lib';

import { pendingMessagesAtom } from './atoms';
import { Message as IMessage, Position } from './types';

interface Props {
  currentMessage: IMessage;
  position: Position;
}

export const Receipts: React.FC<{ messageId: string }> = (props) => {
  const { messageId } = props;

  const [pendingMessages] = useAtom(pendingMessagesAtom);

  const isPending = useMemo(
    () => pendingMessages.includes(messageId),
    [messageId, pendingMessages]
  );

  if (isPending) {
    return <FontAwesome name="circle-o" style={styles.tick} />;
  }

  return <FontAwesome name="check-circle-o" style={styles.tick} />;
};

export const Bubble: React.FC<Props> = (props) => {
  const { currentMessage, position } = props;

  const [pendingMessages] = useAtom(pendingMessagesAtom);

  const isPending = useMemo(
    () => pendingMessages.includes(currentMessage.id),
    [currentMessage.id, pendingMessages]
  );

  const renderReceipts = () => {
    if (position === 'right') {
      if (isPending) {
        return <FontAwesome name="circle-o" style={styles.tick} />;
      }

      return <FontAwesome name="check-circle-o" style={styles.tick} />;
    }

    return null;
  };

  return (
    <View
      style={[
        styles.container,
        position === 'left' ? styles.containerLeft : styles.containerRight,
      ]}>
      {position === 'left' && (
        <Avatar
          label={'IJ'}
          size={30}
          backgroundColor={Colors.red80}
          containerStyle={styles.avatar}
        />
      )}
      <View
        style={[styles.bubbleContainer, specificStyles[position].container]}>
        <Text>{currentMessage.text}</Text>
      </View>
      {renderReceipts()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '70%',
    marginVertical: Spacings.s2,
  },
  containerLeft: {},
  containerRight: {
    justifyContent: 'flex-end',
  },
  bubbleContainer: {
    padding: Spacings.s2,
    borderRadius: BorderRadiuses.br50,
  },
  tick: {
    fontSize: 12,
    marginHorizontal: Spacings.s1,
  },
  avatar: {
    marginHorizontal: Spacings.s1,
  },
});

const specificStyles: { [K in Position]: any } = {
  left: StyleSheet.create({
    container: {
      backgroundColor: Colors.grey60,
      // TODO: remove
      // borderTopRightRadius: BorderRadiuses.br50,
      // borderBottomRightRadius: BorderRadiuses.br50,
    },
  }),
  right: StyleSheet.create({
    container: {
      backgroundColor: Colors.blue60,
      // borderTopLeftRadius: BorderRadiuses.br50,
      // borderBottomLeftRadius: BorderRadiuses.br50,
    },
  }),
};
