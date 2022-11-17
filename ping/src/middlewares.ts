import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { AuthenticationError } from './authentication-error';
import { prismaClient } from './db/prisma-client';
import { DecodedTokenPayload } from './types';

export const authMiddleware = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void,
) => {
  const token = socket.handshake.query?.token;
  // TODO: change to roomId
  const roomID = socket.handshake.query?.roomID;

  if (typeof roomID != 'string') {
    next(new AuthenticationError());
    return;
  }

  if (typeof token != 'string') {
    next(new AuthenticationError());
    return;
  }

  try {
    // TODO: move to env
    const decoded = verify(token, 'secret');

    // TODO: use type guard
    const userID = (decoded as DecodedTokenPayload).userID;

    const isExisted = await prismaClient.roomMembers.findUnique({
      where: { userID_roomID: { userID, roomID } },
    });

    if (!isExisted) {
      next(new AuthenticationError());
      return;
    }
  } catch (err) {
    next(new AuthenticationError());
    return;
  }

  next();
};
