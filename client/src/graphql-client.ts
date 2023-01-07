import { GraphQLClient, request } from 'graphql-request';
import { config } from './config';
import { getToken } from './local-storage';

export const graphQLClient = new GraphQLClient(config.graphql.url, {
  credentials: 'include',
});
// TODO: Find way to get rid of
graphQLClient.setHeader('x-mobile', 'true');
