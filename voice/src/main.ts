import { Worker, Router } from 'mediasoup/node/lib/types';
import { Kafka } from 'kafkajs';
import { MyRooms } from './types';
import { startMediasoup } from './utils/start-mediasoup';

const rooms: MyRooms = {};

export const main = async () => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  });

  let workers: { worker: Worker; router: Router }[] = [];
  let workerIdx = 0;

  const getNextWorker = () => {
    const w = workers[workerIdx];
    workerIdx++;
    workerIdx %= workers.length;
    return w;
  };

  const createRoom = () => {
    const { worker, router } = getNextWorker();

    return { worker, router, state: {} };
  };

  try {
    workers = await startMediasoup();
  } catch (err) {
    console.log(err);
    throw err;
  }

  const consumer = kafka.consumer({ groupId: 'uniq' });
  await consumer.connect();
  await consumer.subscribe({ topics: ['join_as_speaker'] });
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      const { value } = message;

      if (!value) return;

      type Msg = {
        roomId: string;
        userId: string;
      };

      try {
        const msg: Msg = JSON.parse(value.toString());
      } catch (err) {
        return;
      }
    },
  });
};
