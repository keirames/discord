import { createServer } from 'http';
import { Server } from 'socket.io';
import { runMessageSentConsumer } from './consumers/message-sent-consumer';
import { RoomJoinedConsumer } from './consumers/room-joined-consumer';
import { prismaClient } from './db/prisma-client';
import { authMiddleware } from './middlewares';

// const kafka = new Kafka({
//   clientId: 'socket-chat-events',
//   brokers: ['localhost:9092'],
// });
// const consumer = kafka.consumer({ groupId: 'chat-events-consumer-group' });

// await consumer.connect();
// await consumer.subscribe({ topic: 'chat' });

// await consumer.run({
//   eachMessage: async ({ topic, partition, message }) => {
//     if (!message.value) {
//       return;
//     }

//     const jsonRaw: { roomID: string; userID: string; msg: string } = JSON.parse(
//       message.value.toString()
//     );

//     socket.emit(jsonRaw.roomID, JSON.stringify(jsonRaw));
//   },
// });

interface JoinedRoomMsg {
  roomID: string;
  userID: string;
}

export const main = async () => {
  // new RoomJoinedConsumer().eachMessage(async ({ message }) => {
  //   const msgBuffer = message.value;
  //   if (!msgBuffer) return;

  //   const msgJson: JoinedRoomMsg = JSON.parse(msgBuffer.toString());
  //   const { roomID, userID } = msgJson;

  //   const isExisted = await prismaClient.roomMembers.findUnique({
  //     where: { userID_roomID: { roomID, userID } },
  //   });
  //   if (isExisted) return;

  //   await prismaClient.roomMembers.create({
  //     data: { roomID: msgJson.roomID, userID: msgJson.userID },
  //   });
  // });

  await runMessageSentConsumer();

  const httpServer = createServer();
  const io = new Server(httpServer);

  io.use(authMiddleware).on('connection', (socket) => {
    //
  });

  console.log('ws://localhost:3003');
  httpServer.listen(3003);
};
