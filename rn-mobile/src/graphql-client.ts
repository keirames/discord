import { GraphQLClient } from 'graphql-request';

const URL = 'http://localhost:4000/query';

export const graphQLClient = new GraphQLClient(URL);

export const setTokenHeader = (token: string) => {
  graphQLClient.setHeader('authorization', `Bearer ${token}`);
};
