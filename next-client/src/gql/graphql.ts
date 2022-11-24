/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Message = {
  __typename?: 'Message';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  text: Scalars['String'];
  user?: Maybe<User>;
  userId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMember: User;
  createRoom: Room;
  deleteMessage: Message;
  kickMember: User;
  seen: Array<Scalars['String']>;
  sendMessage: Message;
  signIn: Scalars['String'];
};


export type MutationAddMemberArgs = {
  roomId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationCreateRoomArgs = {
  input: NewRoom;
};


export type MutationDeleteMessageArgs = {
  messageId: Scalars['String'];
};


export type MutationKickMemberArgs = {
  roomId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationSeenArgs = {
  messages: Array<Scalars['String']>;
  roomId: Scalars['ID'];
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSignInArgs = {
  name: Scalars['String'];
};

export type NewRoom = {
  members: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me: User;
  messages: Array<Message>;
  room: Room;
  rooms: Array<Room>;
};


export type QueryMessagesArgs = {
  roomId: Scalars['String'];
};


export type QueryRoomArgs = {
  id: Scalars['ID'];
};

export type Room = {
  __typename?: 'Room';
  id: Scalars['ID'];
  members: Array<User>;
  messages: Array<Message>;
  title?: Maybe<Scalars['String']>;
};

export type SendMessageInput = {
  roomId: Scalars['ID'];
  text: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
};
