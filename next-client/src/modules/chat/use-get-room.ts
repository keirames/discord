import { useQuery } from '@tanstack/react-query';
import { graphql } from '../../gql';
import { GetRoomQuery } from '../../gql/graphql';
import { graphQLClient } from '../../graphql-client';

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
      }
    }
  }
`);

export const useGetRoom = (id: string) => {
  const qr = useQuery({
    queryKey: ['room', id, document],
    queryFn: async (): Promise<GetRoomQuery> =>
      graphQLClient.request(document, { id }),
  });

  return { room: qr.data?.room, ...qr };
};
