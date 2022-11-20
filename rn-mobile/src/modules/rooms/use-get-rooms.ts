import { useQuery } from '@tanstack/react-query';
import { graphql } from 'src/gql';
import { graphQLClient } from 'src/graphql-client';

const document = graphql(`
  query allRooms {
    rooms {
      id
      title
    }
  }
`);

export const useGetRooms = () => {
  const qr = useQuery(['rooms'], async () => graphQLClient.request(document));

  return { rooms: qr.data?.rooms ?? [], ...qr };
};
