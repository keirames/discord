import { useQuery } from '@tanstack/react-query';
import { graphql } from '../../gql';
import { graphQLClient } from '../../graphql-client';

const document = graphql(`
  query allRooms {
    rooms {
      id
      title
    }
  }
`);

export const useGetRooms = () => {
  const qr = useQuery({
    queryKey: ['rooms'],
    queryFn: () => graphQLClient.request(document),
  });

  return { rooms: qr.data?.rooms ?? [], ...qr };
};
