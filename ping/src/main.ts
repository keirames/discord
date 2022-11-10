import { createServer } from 'http';
import { sign, verify } from 'jsonwebtoken';
import { Kafka } from 'kafkajs';
import { Server } from 'socket.io';
import { JoinedRoomConsumer } from './consumers/joined-room-consumer';
import { prismaClient } from './db/prisma-client';

// TODO: hide this
const secret = 'secret';

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

class AuthenticationError extends Error {
  constructor() {
    super('Authentication Error');
  }
}

interface JoinedRoomMsg {
  roomID: string;
  userID: string;
}

export const main = async () => {
  new JoinedRoomConsumer().eachMessage(async ({ message }) => {
    const msgBuffer = message.value;
    if (!msgBuffer) return;

    const msgJson: JoinedRoomMsg = JSON.parse(msgBuffer.toString());
    const { roomID, userID } = msgJson;

    const isExisted = await prismaClient.roomMembers.findUnique({
      where: { userID_roomID: { roomID, userID } },
    });
    if (isExisted) return;

    await prismaClient.roomMembers.create({
      data: { roomID: msgJson.roomID, userID: msgJson.userID },
    });
  });

  const httpServer = createServer();
  const io = new Server(httpServer);

  io.use((socket, next) => {
    const token = socket.handshake.query?.token;
    if (typeof token != 'string') {
      next(new AuthenticationError());
      return;
    }

    try {
      const decoded = verify(token, secret);
      console.log(decoded);
    } catch (err) {
      console.log(err);
      next(new AuthenticationError());
      return;
    }

    next();
  }).on('connection', (socket) => {
    //
  });

  httpServer.listen(3003);
};
