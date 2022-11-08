import { createServer } from 'http';
import { Server } from 'socket.io';

export const main = () => {
  const httpServer = createServer();
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log(socket);
  });

  httpServer.listen(3003);
};
