import { View, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import useFriends from './useFriends';
import Avatar from '../../components/avatar';
import { Spacings } from 'react-native-ui-lib';

const FriendList = () => {
  const { friends } = useFriends();

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={friends}
        style={{
          flexGrow: 0,
        }}
        renderItem={() => (
          <View style={styles.item}>
            <Avatar name="Garry" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacings.s2,
  },
  item: {
    paddingRight: Spacings.s2,
  },
});

export default FriendList;
