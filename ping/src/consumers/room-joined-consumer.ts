import { EachMessageHandler } from 'kafkajs';
import { getKafka } from '../events/kafka';
import { Topics } from '../types';

const GROUP_ID = 'room_joined_events_group';

export class RoomJoinedConsumer {
  topic = Topics.ROOM_JOINED;

  async eachMessage(handler: EachMessageHandler) {
    const consumer = getKafka().consumer({
      groupId: GROUP_ID,
    });

    await consumer.connect();
    await consumer.subscribe({ topic: this.topic });
    await consumer.run({
      eachMessage: handler,
    });
  }
}
