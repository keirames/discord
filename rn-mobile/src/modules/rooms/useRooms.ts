import { useQuery } from '@tanstack/react-query';
import { graphql } from 'src/gql';
import { wait } from 'src/utils/wait';

const document = graphql(`
  query allRooms {
    rooms {
      id
      title
    }
  }
`);

const useRooms = () => {
  const qr = useQuery(['rooms'], async () => {
    wait(2000);
    return {
      rooms: [
        { id: '1', title: 'UCL' },
        { id: '2', title: 'Welcome' },
        { id: '3', title: 'Harry Potter' },
        { id: '4', title: 'Harry Potter' },
        { id: '5', title: 'Harry Potter' },
        { id: '6', title: 'Harry Potter' },
        { id: '7', title: 'Harry Potter' },
        { id: '8', title: 'Harry Potter' },
        { id: '9', title: 'Harry Potter' },
        { id: '10', title: 'Harry Potter' },
        { id: '11', title: 'Harry Potter' },
        { id: '12', title: 'Harry Potter' },
        { id: '13', title: 'Harry Potter' },
        { id: '14', title: 'Harry Potter' },
        { id: '15', title: 'Harry Potter' },
      ],
    };
  });

  return { rooms: qr.data?.rooms ?? [], ...qr };
};

export default useRooms;
