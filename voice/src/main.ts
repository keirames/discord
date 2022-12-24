import {
  Worker,
  Router,
  DtlsParameters,
  RtpParameters,
  MediaKind,
} from 'mediasoup/node/lib/types';
import { EachMessageHandler, Kafka } from 'kafkajs';
import { MyRooms } from './types';
import { startMediasoup } from './utils/start-mediasoup';
import { createTransport, transportToOptions } from './utils/create-transport';

const rooms: MyRooms = {};

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

export const main = async () => {
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

  const consumer = kafka.consumer({ groupId: 'unique' });
  await consumer.connect();
  await consumer.subscribe({ topics: ['join_as_speaker'] });
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      const { value } = message;
      console.log('got data from topic join_as_speaker');

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

        await producer.send({
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
        console.log(err);
        return;
      }
    },
  });

  await consume({
    topic: 'connect_transport',
    groupId: 'cg-connect_transport',
    eachMessage: async ({ message }) => {
      const { value } = message;

      if (!value) return;
      console.log('got value from topic connect_transport');

      type Data = {
        roomId: string;
        peerId: string;
        dtlsParameters: DtlsParameters;
      };
      const { roomId, peerId, dtlsParameters }: Data = JSON.parse(
        value.toString(),
      );

      // ignore if room or peer not exist
      if (!rooms[roomId]?.state[peerId]) return;

      const { state } = rooms[roomId];
      const transport = state[peerId].sendTransport;
      if (!transport) return;

      try {
        await transport.connect({ dtlsParameters });
      } catch (err) {
        console.log('transport connect issue: ', err);
        return;
      }
    },
  });

  await consume({
    topic: 'send_track',
    groupId: 'cg-send_track',
    eachMessage: async ({ message }) => {
      const { value } = message;

      if (!value) return;
      console.log('got value from topic send_track');

      type Data = {
        roomId: string;
        peerId: string;
        rtpParameters: RtpParameters;
        kind: MediaKind;
        appData: any;
      };
      const { roomId, peerId, rtpParameters, kind, appData }: Data = JSON.parse(
        value.toString(),
      );

      // ignore if room or peer not exist
      if (!rooms[roomId]?.state[peerId]) return;

      const { state } = rooms[roomId];
      const { sendTransport, producer, consumers } = state[peerId];

      const transport = sendTransport;
      if (!transport) return;

      const newProducer = await transport.produce({
        kind,
        rtpParameters,
        appData,
      });
      rooms[roomId].state[peerId].producer = newProducer;

      console.log('assign new producer into', 'room:', roomId, 'peer:', peerId);
    },
  });
};

const consume = async (options: {
  topic: string;
  groupId: string;
  eachMessage: EachMessageHandler;
}) => {
  const { topic, groupId, eachMessage } = options;

  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topics: [topic] });
  await consumer.run({ eachMessage });
};
