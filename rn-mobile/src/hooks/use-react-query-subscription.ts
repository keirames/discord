import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { GetRoomQuery } from 'src/gql/graphql';
import { useAuthStore } from 'src/modules/auth/use-auth-store';
import { getData } from 'src/storage/storage';

export const useReactQuerySubscription = () => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    const getToken = async () => {
      const token = await getData('token');
      setToken(token);
    };

    getToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    // TODO: from env
    const socket = io('ws://localhost:3003', { query: { token } });

    socket.on('connect', () => {
      console.log('connected');
    });

    if (userId) {
      socket.on(userId, (raw) => {
        interface Data {
          roomId: string;
          messageId: string;
          messageText: string;
        }

        const { roomId, messageId, messageText }: Data = JSON.parse(raw);

        queryClient.setQueryData<GetRoomQuery>(['room', roomId], (oldData) => {
          if (!oldData) return;

          const { messages } = oldData.room;

          return {
            room: {
              ...oldData.room,
              messages: [
                ...messages,
                { id: messageId, text: messageText, userId },
              ],
            },
          };
        });
      });
    }

    socket.on('connect_error', (e) => console.log(e));
  }, [queryClient, token, userId]);

  return null;
};
