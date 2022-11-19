import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { AuthenticationError } from './authentication-error';
import { getEnv } from './load-env';

export const authMiddleware = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void
) => {
  const token = socket.handshake.query?.token;

  if (typeof token != 'string') {
    next(new AuthenticationError());
    return;
  }

  try {
    // TODO: move to env
    verify(token, getEnv('JWT_SECRET'));
  } catch (err) {
    next(new AuthenticationError());
    return;
  }

  next();
};
