import React, { useEffect, useState } from 'react';
import { graphQLClient } from '../../graphql-client';
import { getToken, setToken } from '../../local-storage';
import { Chat } from '../chat/chat';
import { Container } from '../voice-room/container';
import { useAuthStore } from './use-auth-store';
import { useSignIn } from './use-sign-in';

export const Auth = () => {
  const mutation = useSignIn();
  const { user } = useAuthStore();
  const [value, setValue] = useState('CEO');

  useEffect(() => {
    if (mutation.data) {
      console.log('set new token');
      setToken(mutation.data.signIn);
      graphQLClient.setHeader('Authorization', `Bearer ${getToken()}`);
    }
  }, [mutation.data]);

  if (user) return <Container />;

  return (
    <>
      <input value={value} onChange={(e) => setValue(e.currentTarget.value)} />
      <button
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 
      py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none 
      focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => mutation.mutate({ name: value })}
      >
        Sign In
      </button>
      <button onClick={() => mutation.mutate({ name: 'Jake' })}>
        sign in as Jake
      </button>
    </>
  );
};
