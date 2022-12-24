import React from 'react';
import { Chat } from '../chat/chat';
import { Container } from '../voice-room/container';
import { useAuthStore } from './use-auth-store';
import { useSignIn } from './use-sign-in';

export const Auth = () => {
  const mutation = useSignIn();
  const { user } = useAuthStore();

  if (user) return <Container />;

  return (
    <>
      <input value={'CEO'} onChange={() => {}} />
      <button
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 
      py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none 
      focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => mutation.mutate({ name: 'CEO' })}
      >
        Sign In
      </button>
    </>
  );
};
