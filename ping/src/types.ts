export interface DecodedTokenPayload {
  id: string;
}

export enum Topics {
  ROOM_JOINED = 'room_joined',
  MESSAGE_SENT = 'message_sent',
}
