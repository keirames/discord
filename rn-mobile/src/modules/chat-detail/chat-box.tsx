import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BorderRadiuses, Colors, Spacings } from 'react-native-ui-lib';

interface Props {
  userId: string;
  messages: { id: string; text: string }[];
}

export const ChatBox: React.FC<Props> = (props) => {
  const { userId, messages } = props;

  return (
    <ScrollView style={styles.scrollView}>
      {messages.map((msg) => {
        const { id, text } = msg;

        const renderSelfMsg = () => {
          return (
            <View style={styles.rowRight}>
              <View style={styles.bubbleContainerRight}>
                <Text>{text}</Text>
              </View>
            </View>
          );
        };

        const renderMemberMsg = () => {
          return (
            <View style={styles.rowLeft}>
              <View style={styles.bubbleContainerLeft}>
                <Text>{text}</Text>
              </View>
            </View>
          );
        };

        if (userId === id) {
          return renderSelfMsg();
        }

        return renderMemberMsg();
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {},
  rowRight: {
    marginTop: Spacings.s1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rowLeft: {
    marginTop: Spacings.s1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  bubbleContainerLeft: {
    backgroundColor: Colors.grey70,
    padding: Spacings.s3,
    borderTopRightRadius: BorderRadiuses.br40,
    borderBottomRightRadius: BorderRadiuses.br40,
  },
  bubbleContainerRight: {
    backgroundColor: Colors.blue70,
    padding: Spacings.s3,
    borderTopLeftRadius: BorderRadiuses.br40,
    borderBottomLeftRadius: BorderRadiuses.br40,
  },
});
