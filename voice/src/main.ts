import {
  Worker,
  Router,
  DtlsParameters,
  RtpParameters,
  MediaKind,
  RtpCapabilities,
} from 'mediasoup/node/lib/types';
import { EachMessageHandler, Kafka } from 'kafkajs';
import { MyRooms } from './types';
import { startMediasoup } from './utils/start-mediasoup';
import { createTransport, transportToOptions } from './utils/create-transport';
import { env } from './env/load-env';

const rooms: MyRooms = {};

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [env.BROKER],
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

  const kafkaProducer = kafka.producer();
  await kafkaProducer.connect();

  const consumer = kafka.consumer({ groupId: 'unique' });
  await consumer.connect();
  await consumer.subscribe({ topics: ['join_as_speaker'] });
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      const { value } = message;

      if (!value) return;
      console.log('got data from topic join_as_speaker');

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

        await kafkaProducer.send({
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
        console.log('produce data -> you_joined_as_speaker');
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
        value.toString()
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
    topic: 'connect_recv_transport',
    groupId: 'cg-connect_recv_transport',
    eachMessage: async ({ message }) => {
      const { value } = message;

      if (!value) return;
      console.log('got value from topic connect_recv_transport');

      type Data = {
        roomId: string;
        peerId: string;
        dtlsParameters: DtlsParameters;
      };
      const { roomId, peerId, dtlsParameters }: Data = JSON.parse(
        value.toString()
      );

      // ignore if room or peer not exist
      if (!rooms[roomId]?.state[peerId]) return;

      const { state } = rooms[roomId];
      const transport = state[peerId].recvTransport;
      if (!transport) return;

      try {
        await transport.connect({ dtlsParameters });
        console.log('recv transport connected using dtls');
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
        deviceRtpCapabilities: RtpCapabilities;
        kind: MediaKind;
        appData: any;
      };
      const {
        roomId,
        peerId: myPeerId,
        rtpParameters,
        deviceRtpCapabilities,
        kind,
        appData,
      }: Data = JSON.parse(value.toString());

      // ignore if room or peer not exist
      if (!rooms[roomId]?.state[myPeerId]) return;

      const { state, router } = rooms[roomId];
      const { sendTransport } = state[myPeerId];

      const transport = sendTransport;
      if (!transport) return;

      const myProducer = await transport.produce({
        kind,
        rtpParameters,
        appData: { ...appData, peerId: myPeerId },
      });
      rooms[roomId].state[myPeerId].producer = myProducer;

      // Create consumers for all person in same room
      // in order to consume your voice
      for (const theirPeerId of Object.keys(state)) {
        if (theirPeerId === myPeerId) continue;

        const peerTransport = state[theirPeerId]?.recvTransport;
        console.log(
          'their peer transport',
          JSON.stringify(peerTransport, null, 2)
        );
        if (!peerTransport) console.log('no recvTransport');
        if (!peerTransport) continue;

        const theirState = state[theirPeerId];

        try {
          const canConsumer = router.canConsume({
            producerId: myProducer.id,
            rtpCapabilities: deviceRtpCapabilities,
          });
          if (!canConsumer) {
            throw new Error(
              `recv-track: client cannot consume ${myProducer.appData.peerId}`
            );
          }

          const consumer = await peerTransport.consume({
            producerId: myProducer.id,
            rtpCapabilities: deviceRtpCapabilities,
            // TODO: mediasoup recommended true
            paused: false,
            appData: {
              peerId: myPeerId,
              mediaPeerId: myPeerId,
            },
          });

          theirState.consumers.push(consumer);

          const d = {
            // Use to let client know and create consumer
            theirPeerId,
            // Use to let client know and create consumer
            peerId: myPeerId,
            // Use to let client know and create consumer
            roomId: roomId,
            consumerParameters: {
              producerId: myProducer.id,
              id: consumer.id,
              kind: consumer.kind,
              rtpParameters: consumer.rtpParameters,
              type: consumer.type,
              producerPaused: consumer.producerPaused,
            },
          };
          await kafkaProducer.send({
            topic: 'new_peer_speaker',
            messages: [{ value: JSON.stringify(d) }],
          });
        } catch (err) {
          // TODO: log err
          console.log(err);
        }
      }

      await kafkaProducer.send({
        topic: 'send_track_done',
        messages: [
          {
            value: JSON.stringify({
              roomId,
              peerId: myPeerId,
              producerId: myProducer.id,
            }),
          },
        ],
      });
      console.log('produce -> send_track_done');
    },
  });

  await consume({
    topic: 'recv_track',
    groupId: 'recv_track group',
    eachMessage: async ({ message }) => {
      const { value } = message;

      if (!value) return;
      console.log('got value from topic recv_track');

      type Data = {
        roomId: string;
        peerId: string;
        rtpCapabilities: RtpCapabilities;
      };
      const { roomId, peerId, rtpCapabilities }: Data = JSON.parse(
        value.toString()
      );

      const producer = rooms[roomId].state[peerId].producer;
      if (!producer) {
        console.log('recv_track cannot find producer');
        return;
      }

      const canConsume = rooms[roomId].router.canConsume({
        producerId: producer.id,
        rtpCapabilities,
      });
      if (!canConsume) {
        console.log('cannot consume');
        return;
      }

      // TODO: remove undefined problem
      const consumer = await rooms[roomId].state[peerId].recvTransport?.consume(
        {
          producerId: producer.id,
          rtpCapabilities,
        }
      );
      if (!consumer) {
        console.log('cannot create consumer');
        return;
      }
      consumer.on('transportclose', () => {
        console.log('transport close from consumer');
      });
      consumer.on('producerclose', () => {
        console.log('producer of consumer closed');
      });

      await kafkaProducer.send({
        topic: 'recv_track_done',
        messages: [
          {
            value: JSON.stringify({
              roomId,
              peerId,
              id: consumer.id,
              producerId: producer.id,
              kind: consumer.kind,
              rtpParameters: consumer.rtpParameters,
            }),
          },
        ],
      });
      console.log('produce -> recv_track_done');
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
