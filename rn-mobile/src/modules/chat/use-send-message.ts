import { useMutation, useQueryClient } from '@tanstack/react-query';
import { graphql } from 'src/gql';
import {
  GetRoomQuery,
  SendMessageMutation,
  SendMessageMutationVariables,
} from 'src/gql/graphql';
import { graphQLClient } from 'src/graphql-client';

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

  const mr = useMutation<
    SendMessageMutation,
    unknown,
    SendMessageMutationVariables,
    unknown
  >({
    mutationFn: async (input) => graphQLClient.request(document, input),
    onSuccess(data, variables, context) {
      const { id, text, userId } = data.sendMessage;

      queryClient.setQueryData<GetRoomQuery>(
        ['room', variables.input.roomId],
        (oldData) => {
          if (!oldData) return;

          const { messages } = oldData.room;

          return {
            room: {
              ...oldData.room,
              messages: [...messages, { id, text, userId }],
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
