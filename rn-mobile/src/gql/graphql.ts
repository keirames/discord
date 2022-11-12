/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  id: Scalars['ID'];
  text: Scalars['String'];
  user?: Maybe<User>;
  userId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMember: Scalars['String'];
  createRoom: Room;
  deleteMessage: Scalars['String'];
  kickMember: Scalars['String'];
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
  friends: Array<User>;
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

export type AllFriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllFriendsQuery = { __typename?: 'Query', friends: Array<{ __typename?: 'User', id: string, name: string }> };

export type AllRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllRoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: string, title?: string | null }> };


export const AllFriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allFriends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AllFriendsQuery, AllFriendsQueryVariables>;
export const AllRoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<AllRoomsQuery, AllRoomsQueryVariables>;