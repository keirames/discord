/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  query GetMe {\n    me {\n      id\n      name\n    }\n  }\n": types.GetMeDocument,
    "\n  mutation signIn($name: String!) {\n    signIn(name: $name)\n  }\n": types.SignInDocument,
    "\n  query GetRoom($id: ID!) {\n    room(id: $id) {\n      id\n      title\n      members {\n        id\n        name\n      }\n      messages {\n        id\n        text\n        userId\n        createdAt\n      }\n    }\n  }\n": types.GetRoomDocument,
    "\n  query allRooms {\n    rooms {\n      id\n      title\n    }\n  }\n": types.AllRoomsDocument,
    "\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      id\n      text\n      userId\n      createdAt\n    }\n  }\n": types.SendMessageDocument,
    "\n  query Guild($id: ID!) {\n    guild(id: $id) {\n      id\n      name\n      createdAt\n      voiceChannels {\n        id\n        name\n        createdAt\n      }\n    }\n  }\n": types.GuildDocument,
    "\n  query AllGuilds {\n    guilds {\n      id\n      name\n      createdAt\n    }\n  }\n": types.AllGuildsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMe {\n    me {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation signIn($name: String!) {\n    signIn(name: $name)\n  }\n"): (typeof documents)["\n  mutation signIn($name: String!) {\n    signIn(name: $name)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRoom($id: ID!) {\n    room(id: $id) {\n      id\n      title\n      members {\n        id\n        name\n      }\n      messages {\n        id\n        text\n        userId\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRoom($id: ID!) {\n    room(id: $id) {\n      id\n      title\n      members {\n        id\n        name\n      }\n      messages {\n        id\n        text\n        userId\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query allRooms {\n    rooms {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  query allRooms {\n    rooms {\n      id\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      id\n      text\n      userId\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation SendMessage($input: SendMessageInput!) {\n    sendMessage(input: $input) {\n      id\n      text\n      userId\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Guild($id: ID!) {\n    guild(id: $id) {\n      id\n      name\n      createdAt\n      voiceChannels {\n        id\n        name\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query Guild($id: ID!) {\n    guild(id: $id) {\n      id\n      name\n      createdAt\n      voiceChannels {\n        id\n        name\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllGuilds {\n    guilds {\n      id\n      name\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query AllGuilds {\n    guilds {\n      id\n      name\n      createdAt\n    }\n  }\n"];

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function graphql(source: string): unknown;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;