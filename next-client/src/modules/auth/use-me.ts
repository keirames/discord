import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { graphql } from '../../gql';
import { GetMeQuery } from '../../gql/graphql';
import { graphQLClient } from '../../graphql-client';
import { useAuthStore } from './use-auth-store';

const document = graphql(`
  query GetMe {
    me {
      id
      name
    }
  }
`);

export const useMe = (options: Pick<UseQueryOptions, 'enabled'>) => {
  const { enabled } = options;

  const qr = useQuery({
    queryKey: ['me'],
    queryFn: async (): Promise<GetMeQuery> => graphQLClient.request(document),
    enabled,
    onSuccess(data) {
      const { me } = data;

      useAuthStore.setState((state) => ({ ...state, user: { id: me.id } }));
    },
  });

  return qr;
};
