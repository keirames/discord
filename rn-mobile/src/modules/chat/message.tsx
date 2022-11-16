import { useAtom } from 'jotai';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { userIdAtom } from './atoms';
import { Bubble } from './bubble';
import { Message as IMessage, Position } from './types';

interface Props {
  previousMessage?: IMessage;
  currentMessage: IMessage;
}

export const Message: React.FC<Props> = (props) => {
  const { previousMessage, currentMessage } = props;

  const [userId] = useAtom(userIdAtom);

  const isMine = useMemo(
    () => userId === currentMessage.id,
    [currentMessage.id, userId]
  );

  const position = useMemo<Position>(
    () => (isMine ? 'right' : 'left'),
    [isMine]
  );

  return (
    <View style={styles[isMine ? 'right' : 'left'].container}>
      <Bubble currentMessage={currentMessage} position={position} />
    </View>
  );
};

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  }),
};