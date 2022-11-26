import { GraphQLClient } from 'graphql-request';
import { config } from './config';

export const graphQLClient = new GraphQLClient(config.graphql.url, {
  credentials: 'include',
});
