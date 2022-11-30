import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { graphql } from '../../gql';
import { GetRoomQuery } from '../../gql/graphql';
import { graphQLClient } from '../../graphql-client';
import { MessageModel } from './types';

const document = graphql(`
  query GetRoom($id: ID!) {
    room(id: $id) {
      id
      title
      members {
        id
        name
      }
      messages {
        id
        text
        userId
        createdAt
      }
    }
  }
`);

export const useGetRoom = (id: string) => {
  const queryResult = useQuery({
    queryKey: ['room', id],
    queryFn: async (): Promise<GetRoomQuery> =>
      graphQLClient.request(document, { id }),
  });

  const messages: MessageModel[] = _.reverse(
    (queryResult.data?.room.messages || []).map((m) => ({
      id: m.id,
      text: m.text,
      userId: m.userId,
      createdAt: m.createdAt,
    })),
  );

  return { room: queryResult.data?.room, messages, ...queryResult };
};
