import { useQuery } from '@tanstack/react-query';
import { graphql } from '../../gql';
import { GetRoomQuery } from '../../gql/graphql';
import { graphQLClient } from '../../graphql-client';
import { useChatStore } from './use-chat-store';

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
  const setMessages = useChatStore((state) => state.setMessages);

  const queryResult = useQuery({
    queryKey: ['room', id],
    queryFn: async (): Promise<GetRoomQuery> =>
      graphQLClient.request(document, { id }),
    onSuccess: (data) => {
      const messages = data.room.messages;
      setMessages(
        messages
          .map((message) => {
            const { id, text, userId, createdAt } = message;

            return { id, text, userId, createdAt };
          })
          .reverse(),
      );
    },
  });

  return { room: queryResult.data?.room, ...queryResult };
};
