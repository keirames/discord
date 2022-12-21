import { Worker, Router } from 'mediasoup/node/lib/types';
import { Kafka } from 'kafkajs';
import { MyRooms } from './types';
import { startMediasoup } from './utils/start-mediasoup';
import { createTransport, transportToOptions } from './utils/create-transport';

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

  const producer = kafka.producer();
  await producer.connect();

  const consumer = kafka.consumer({ groupId: 'uniq' });
  await consumer.connect();
  await consumer.subscribe({ topics: ['join_as_speaker'] });
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      const { value } = message;
      console.log(value);

      if (!value) return;

      type Msg = {
        roomId: string;
        peerId: string;
      };

      try {
        const { roomId, peerId }: Msg = JSON.parse(value.toString());

        if (!(roomId in rooms)) {
          rooms[roomId] = createRoom();
        }

        const { state, router } = rooms[roomId];
        const [recvTransport, sendTransport] = await Promise.all([
          createTransport('recv', router, peerId),
          createTransport('send', router, peerId),
        ]);

        rooms[roomId].state[peerId] = {
          recvTransport,
          sendTransport,
          producer: null,
          consumers: [],
        };

        producer.send({
          topic: 'you_joined_as_speaker',
          messages: [
            {
              value: JSON.stringify({
                roomId,
                peerId,
                routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
                recvTransportOptions: transportToOptions(recvTransport),
                sendTransportOptions: transportToOptions(sendTransport),
              }),
            },
          ],
        });
      } catch (err) {
        return;
      }
    },
  });
};
