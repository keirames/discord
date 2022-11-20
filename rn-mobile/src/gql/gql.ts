/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query GetMe {\n    me {\n      id\n      name\n    }\n  }\n": types.GetMeDocument,
    "\n  mutation signIn($name: String!) {\n    signIn(name: $name)\n  }\n": types.SignInDocument,
    "\n  query GetRoom($id: ID!) {\n    room(id: $id) {\n      id\n      title\n      members {\n        id\n        name\n      }\n      messages {\n        id\n        text\n        userId\n      }\n    }\n  }\n": types.GetRoomDocument,
    "\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      id\n      text\n      userId\n    }\n  }\n": types.SendMessageDocument,
    "\n  query allRooms {\n    rooms {\n      id\n      title\n    }\n  }\n": types.AllRoomsDocument,
};

export function graphql(source: "\n  query GetMe {\n    me {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      id\n      name\n    }\n  }\n"];
export function graphql(source: "\n  mutation signIn($name: String!) {\n    signIn(name: $name)\n  }\n"): (typeof documents)["\n  mutation signIn($name: String!) {\n    signIn(name: $name)\n  }\n"];
export function graphql(source: "\n  query GetRoom($id: ID!) {\n    room(id: $id) {\n      id\n      title\n      members {\n        id\n        name\n      }\n      messages {\n        id\n        text\n        userId\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRoom($id: ID!) {\n    room(id: $id) {\n      id\n      title\n      members {\n        id\n        name\n      }\n      messages {\n        id\n        text\n        userId\n      }\n    }\n  }\n"];
export function graphql(source: "\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      id\n      text\n      userId\n    }\n  }\n"): (typeof documents)["\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      id\n      text\n      userId\n    }\n  }\n"];
export function graphql(source: "\n  query allRooms {\n    rooms {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  query allRooms {\n    rooms {\n      id\n      title\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;