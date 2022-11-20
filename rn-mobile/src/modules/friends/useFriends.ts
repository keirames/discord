import { useQuery } from '@tanstack/react-query';
import { graphql } from 'src/gql';
import { wait } from 'src/utils/wait';

// const document = graphql(`
//   query allFriends {
//     friends {
//       id
//       name
//     }
//   }
// `);

const useFriends = () => {
  const qr = useQuery(['friends'], async () => {
    wait(1000);
    return { friends: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
  });

  return { friends: qr.data?.friends ?? [], ...qr };
};

export default useFriends;
