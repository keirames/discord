import { EachMessageHandler } from 'kafkajs';
import { getKafka } from '../events/kafka';

export class JoinedRoomConsumer {
  topic = 'joined-room';

  async eachMessage(handler: EachMessageHandler) {
    const consumer = getKafka().consumer({
      groupId: 'joined-room-events-group',
    });

    await consumer.connect();
    await consumer.subscribe({ topic: 'joined-room' });
    await consumer.run({
      eachMessage: handler,
    });
  }
}
