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

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, name: string } };

export type SignInMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: string };

export type GetRoomQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRoomQuery = { __typename?: 'Query', room: { __typename?: 'Room', id: string, title?: string | null, members: Array<{ __typename?: 'User', id: string, name: string }>, messages: Array<{ __typename?: 'Message', id: string, text: string, userId: string }> } };

export type AllRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllRoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: string, title?: string | null }> };


export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const GetRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<GetRoomQuery, GetRoomQueryVariables>;
export const AllRoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<AllRoomsQuery, AllRoomsQueryVariables>;