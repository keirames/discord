import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  const mr = useMutation<string, null, string, null>({
    mutationFn: async (msg) => msg,
    onSuccess(data, variables, context) {},
  });

  return mr;
};
