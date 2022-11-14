import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  const mr = useMutation<string, null, string, null>({
    mutationFn: async (msg) => msg,
    onSuccess(data, variables, context) {
      queryClient.setQueryData(['room'], (oldData: any) => {
        console.log(JSON.stringify(oldData, null, 2));
        return {
          room: {
            ...oldData.room,
            messages: [
              ...oldData.room.messages,
              { id: 'new shit', text: data, userId: '2' },
            ],
          },
        };
      });
    },
  });

  return mr;
};
