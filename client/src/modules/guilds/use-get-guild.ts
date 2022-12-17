import { useQuery } from '@tanstack/react-query';
import { graphql } from '../../gql';
import { GuildQuery } from '../../gql/graphql';
import { graphQLClient } from '../../graphql-client';

const document = graphql(`
  query Guild($id: ID!) {
    guild(id: $id) {
      id
      name
      createdAt
      voiceChannels {
        id
        name
        createdAt
      }
    }
  }
`);

export const useGetGuild = (id: string) => {
  const queryResult = useQuery({
    queryKey: ['guild', id],
    queryFn: async (): Promise<GuildQuery> => {
      return graphQLClient.request(document, { id });
    },
  });

  return queryResult;
};
