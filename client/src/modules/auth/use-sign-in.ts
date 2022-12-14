import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { graphql } from '../../gql';
import { useMe } from './use-me';
import { SignInMutation, SignInMutationVariables } from '../../gql/graphql';
import { graphQLClient } from '../../graphql-client';

const document = graphql(`
  mutation signIn($name: String!) {
    signIn(name: $name)
  }
`);

export const useSignIn = () => {
  const [isReady, setIsReady] = useState(false);

  useMe({ enabled: isReady });

  const mutation = useMutation<
    SignInMutation,
    any,
    SignInMutationVariables,
    any
  >({
    mutationFn: async (name) => graphQLClient.request(document, name),
    async onSuccess(data) {
      setIsReady(true);
    },
  });

  return mutation;
};
