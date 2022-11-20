import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { graphql } from 'src/gql';
import { SignInMutation, SignInMutationVariables } from 'src/gql/graphql';
import { graphQLClient, setTokenHeader } from 'src/graphql-client';
import { useAuthStore } from 'src/modules/auth/use-auth-store';
import { useMe } from 'src/modules/auth/use-me';
import { storeData } from 'src/storage/storage';

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
      const token = data.signIn;
      await storeData('token', token);

      setTokenHeader(token);

      setIsReady(true);
    },
  });

  return mutation;
};
