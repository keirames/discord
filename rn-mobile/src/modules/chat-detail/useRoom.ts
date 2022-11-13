import { useQuery } from '@tanstack/react-query';
import { graphql } from 'src/gql';
import { wait } from 'src/utils/wait';

const document = graphql(`
  query {
    room {
      id
      title
    }
  }
`);

const useRoom = () => {
  const qr = useQuery(['room'], async () => {
    wait(2000);
    return {
      room: {
        id: '1',
        title: 'UCL',
        members: [
          {
            id: '1',
            name: 'Garry',
          },
          {
            id: '2',
            name: 'Ronaldo',
          },
          {
            id: '3',
            name: 'Harry',
          },
        ],
        messages: [
          {
            id: '2',
            text: 'hi',
            userId: '1',
          },
          {
            id: '3',
            text: 'hi',
            userId: '1',
          },
          {
            id: '4',
            text: 'hi',
            userId: '1',
          },
          {
            id: '5',
            text: 'hi',
            userId: '1',
          },
          {
            id: '6',
            text: 'hi',
            userId: '1',
          },
          {
            id: '7',
            text: 'hi',
            userId: '1',
          },
          {
            id: '8',
            text: 'hi',
            userId: '1',
          },
          {
            id: '9',
            text: 'hi',
            userId: '1',
          },
          {
            id: '10',
            text: 'hi',
            userId: '1',
          },
          {
            id: '11',
            text: 'hi',
            userId: '1',
          },
          {
            id: '12',
            text: 'hi',
            userId: '1',
          },
          {
            id: '13',
            text: 'hi',
            userId: '1',
          },
          {
            id: '14',
            text: 'hi',
            userId: '1',
          },
          {
            id: '15',
            text: 'hi',
            userId: '1',
          },
          {
            id: '16',
            text: 'hi',
            userId: '1',
          },
          {
            id: '17',
            text: 'hi',
            userId: '1',
          },
          {
            id: '18',
            text: 'hi',
            userId: '1',
          },
          {
            id: '19',
            text: 'hi',
            userId: '1',
          },
          {
            id: '20',
            text: 'hi',
            userId: '1',
          },
          {
            id: '21',
            text: 'hi',
            userId: '1',
          },
          {
            id: '22',
            text: 'hi',
            userId: '1',
          },
          {
            id: '23',
            text: 'hi',
            userId: '1',
          },
          {
            id: '1',
            text: 'hallo',
            userId: '2',
          },
        ],
      },
    };
  });

  return { room: qr.data?.room, ...qr };
};

export default useRoom;
