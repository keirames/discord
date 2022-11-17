import { Consumer } from 'kafkajs';
import { prismaClient } from '../db/prisma-client';
import { getKafka } from '../events/kafka';
import { Topics } from '../types';

const groupId = 'message_sent_events_group';
const topic = Topics.MESSAGE_SENT;

interface TopicData {
  userId: string;
  roomId: string;
  message: {
    id: string;
    text: string;
  };
}

const getMessageSentConsumer = async (): Promise<Consumer> => {
  const consumer = getKafka().consumer({
    groupId,
  });

  await consumer.connect();
  await consumer.subscribe({ topic });

  return consumer;
};

export const runMessageSentConsumer = async () => {
  const messageSentConsumer = await getMessageSentConsumer();
  messageSentConsumer.run({
    eachMessage: async ({ message }) => {
      const msgBuffer = message.value;
      if (!msgBuffer) return;

      // TODO: is there any thing to check it ? guard ??
      const topicData: TopicData = JSON.parse(msgBuffer.toString());
      console.log(topicData);
      const { roomId } = topicData;

      const roomMembers = await prismaClient.roomMembers.findMany({
        where: { roomID: roomId },
      });
      if (roomMembers.length === 0) return;

      const memberIds = roomMembers.map((roomMember) => roomMember.userID);

      memberIds.map((id) => {
        // TODO: socket send to user
        console.log(id);
      });
    },
  });
};
