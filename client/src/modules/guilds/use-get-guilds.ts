import { useQuery } from '@tanstack/react-query';
import { graphql } from '../../gql';
import { AllGuildsQuery } from '../../gql/graphql';
import { graphQLClient } from '../../graphql-client';

const document = graphql(`
  query AllGuilds {
    guilds {
      id
      name
      createdAt
    }
  }
`);

export const useGetGuilds = () => {
  const queryResult = useQuery({
    queryKey: ['guilds'],
    queryFn: async (): Promise<AllGuildsQuery> =>
      graphQLClient.request(document),
  });

  return { guilds: queryResult.data?.guilds || [], ...queryResult };
};
