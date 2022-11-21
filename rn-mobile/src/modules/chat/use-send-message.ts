import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { graphql } from 'src/gql';
import {
  GetRoomQuery,
  SendMessageMutation,
  SendMessageMutationVariables,
} from 'src/gql/graphql';
import { graphQLClient } from 'src/graphql-client';
import { v4 } from 'uuid';

import { useAuthStore } from '../auth/use-auth-store';
import { pendingMessagesAtom } from './atoms';

const document = graphql(`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      text
      userId
    }
  }
`);

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  // No way it will undefined here
  const userId = useAuthStore((state) => state.user!.id);

  const [, setPendingMessages] = useAtom(pendingMessagesAtom);

  const mr = useMutation<
    SendMessageMutation,
    unknown,
    SendMessageMutationVariables,
    { tempId: string }
  >({
    mutationFn: async (input) => graphQLClient.request(document, input),
    onMutate(variables) {
      const {
        input: { roomId, text },
      } = variables;

      const tempId = v4();

      setPendingMessages((prev) => [...prev, tempId]);

      queryClient.setQueryData<GetRoomQuery>(['room', roomId], (oldData) => {
        if (!oldData) return;

        const { messages } = oldData.room;

        return {
          room: {
            ...oldData.room,
            messages: [{ id: tempId, text, userId }, ...messages],
          },
        };
      });

      return { tempId };
    },
    onSuccess(data, variables, context) {
      const { id, text, userId } = data.sendMessage;
      const tempId = context!.tempId;

      queryClient.setQueryData<GetRoomQuery>(
        ['room', variables.input.roomId],
        (oldData) => {
          if (!oldData) return;

          const { messages } = oldData.room;

          setPendingMessages((prev) => [...prev].filter((id) => id !== tempId));

          // Change tempId to real id
          const updatedMessages = [...messages].map((msg) => {
            if (msg.id === tempId) {
              return { ...msg, id };
            }

            return { ...msg };
          });

          return {
            room: {
              ...oldData.room,
              messages: [...updatedMessages],
            },
          };
        }
      );
    },
  });

  // const mr = useMutation<string, null, string, null>({
  //   mutationFn: async (msg) => msg,
  //   onSuccess(data, variables, context) {
  //     queryClient.setQueryData(['room'], (oldData: any) => {
  //       console.log(JSON.stringify(oldData, null, 2));
  //       return {
  //         room: {
  //           ...oldData.room,
  //           messages: [
  //             ...oldData.room.messages,
  //             { id: 'new shit', text: data, userId: '2' },
  //           ],
  //         },
  //       };
  //     });
  //   },
  // });

  return mr;
};
