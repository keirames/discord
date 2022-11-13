import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Badge, Colors, Spacings, Typography } from 'react-native-ui-lib';
import Avatar from 'src/components/avatar';
import useRooms from 'src/modules/rooms/useRooms';
import { EvilIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { TabChatScreenNavigationProps } from '../../../types';

interface Props {
  id: string;
}

const RoomPipe: React.FC<Props> = (props) => {
  const { id } = props;

  const { rooms } = useRooms();

  const { navigate } = useNavigation<TabChatScreenNavigationProps>();

  const room = rooms.find((room) => room.id === id);

  if (!room) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigate('ChatDetail', { roomID: room.id })}
    >
      <Avatar />
      <View style={styles.content}>
        <Text style={styles.title}>{room.title}</Text>
        <Text style={styles.lastMsg} numberOfLines={1} ellipsizeMode="tail">
          Last message and it very long lorem wed w e f we f wwoijw ef w ef wef
          we fwef we f we fwe f t very long lorem wed w e f we f wwoijw ef w t
          very long lorem wed w e f we f wwoijw ef w t very long lorem wed w e f
          we f wwoijw ef w t very long lorem wed w e f we f wwoijw ef w
        </Text>
      </View>
      <View style={styles.indicator}>
        <Text style={styles.time}>8:40 PM</Text>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <EvilIcons name="check" size={18} color="black" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    marginHorizontal: Spacings.s2,
  },
  title: {
    ...Typography.text70R,
  },
  lastMsg: {
    ...Typography.text90R,
    color: Colors.grey30,
  },
  indicator: {
    width: '15%',
    flexDirection: 'column',
  },
  time: {
    ...Typography.text90R,
    color: Colors.grey30,
  },
});

const RoomList = () => {
  const { rooms } = useRooms();

  return (
    <View>
      {rooms.map((room) => (
        <View key={room.id} style={{ marginTop: Spacings.s4 }}>
          <RoomPipe id={room.id} />
        </View>
      ))}
    </View>
  );
};

export default RoomList;
