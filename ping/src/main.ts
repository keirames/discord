import { createServer } from 'http';
import { Server } from 'socket.io';
import { runMessageSentConsumer } from './consumers/message-sent-consumer';
import { RoomJoinedConsumer } from './consumers/room-joined-consumer';
import { authMiddleware } from './middlewares';
import { getIO, initIOServer } from './socket-io';

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

  const httpServer = createServer();
  initIOServer(httpServer);

  getIO()
    .use(authMiddleware)
    .on('connection', (socket) => {
      //
    });

  await runMessageSentConsumer();

  console.log('ws://localhost:3003');
  httpServer.listen(3003);
};
