import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 } from 'uuid';
import { graphql } from '../../gql';
import {
  GetRoomQuery,
  SendMessageMutation,
  SendMessageMutationVariables,
} from '../../gql/graphql';
import { graphQLClient } from '../../graphql-client';
import { useAuthStore } from '../auth/use-auth-store';
import { useChatStore } from './use-chat-store';

const document = graphql(`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      text
      userId
      createdAt
    }
  }
`);

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  // No way it will undefined here
  const userId = useAuthStore((state) => state.user!.id);
  const { markPending, removePending, addNewMessage, changeMessageId } =
    useChatStore();

  const useMutationResult = useMutation<
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
      const newMessage = {
        id: tempId,
        text,
        userId,
        createdAt: new Date().toISOString(),
      };

      addNewMessage(newMessage);
      markPending(tempId);

      queryClient.setQueryData<GetRoomQuery>(['room', roomId], (oldData) => {
        if (!oldData) return;

        const { messages } = oldData.room;

        return {
          room: {
            ...oldData.room,
            messages: [newMessage, ...messages],
          },
        };
      });

      return { tempId };
    },
    onSuccess(data, variables, context) {
      const {
        sendMessage: { id, text, userId, createdAt },
      } = data;
      const { tempId } = context!;

      queryClient.setQueryData<GetRoomQuery>(
        ['room', variables.input.roomId],
        (oldData) => {
          if (!oldData) return;

          const { messages } = oldData.room;

          changeMessageId(id, tempId);
          removePending(tempId);

          // Change tempId to real id & created at
          const updatedMessages = [...messages].map((msg) => {
            if (msg.id === tempId) {
              return { ...msg, id, createdAt };
            }

            return { ...msg };
          });

          return {
            ...oldData,
            room: {
              ...oldData.room,
              messages: [...updatedMessages],
            },
          };
        },
      );
    },
  });

  return useMutationResult;
};
