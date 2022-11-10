import { Kafka } from 'kafkajs';

export const getKafka = (): Kafka => {
  const kafka = new Kafka({
    clientId: 'socket-chat-events',
    brokers: ['localhost:9092'],
  });

  return kafka;
};
