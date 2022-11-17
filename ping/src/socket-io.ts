import { IncomingMessage, Server, ServerResponse } from 'http';
import { Server as IOServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

let io: IOServer<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
> | null = null;

export const initIOServer = (
  httpServer: Server<typeof IncomingMessage, typeof ServerResponse>,
) => {
  io = new IOServer(httpServer);
};

export const getIO = () => {
  if (io === null) {
    throw new Error('IO not initialize properly!');
  }

  return io;
};
