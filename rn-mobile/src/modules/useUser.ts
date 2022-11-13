import { useQuery } from '@tanstack/react-query';
import { wait } from 'src/utils/wait';

export const useUser = () => {
  const qr = useQuery(['room'], async () => {
    wait(2000);
    return {
      userId: '1',
    };
  });

  return { userId: '1', ...qr };
};
