import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.roomMembers.createMany({
    data: [
      {
        userId: '14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d',
        roomId: 'd537e86a-1c43-4b7e-8bfc-89295c6226d5',
      },
      {
        userId: '8e8c6c7c-1180-4539-b7b4-f97d88f98552',
        roomId: 'd537e86a-1c43-4b7e-8bfc-89295c6226d5',
      },
      {
        userId: '6d06ab45-28cc-4d60-9d48-cec566342b2c',
        roomId: 'd537e86a-1c43-4b7e-8bfc-89295c6226d5',
      },
      {
        userId: '855fd687-9001-4512-b317-f2a71fa57cf5',
        roomId: 'd537e86a-1c43-4b7e-8bfc-89295c6226d5',
      },
      {
        userId: '14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d',
        roomId: 'a9561ffe-53f8-45cd-bc9a-dd7b01223a87',
      },
      {
        userId: '8e8c6c7c-1180-4539-b7b4-f97d88f98552',
        roomId: 'a9561ffe-53f8-45cd-bc9a-dd7b01223a87',
      },
      {
        userId: '14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d',
        roomId: '040f28aa-a9f6-475b-9e05-5b7de9600ce4',
      },
      {
        userId: '8e8c6c7c-1180-4539-b7b4-f97d88f98552',
        roomId: '040f28aa-a9f6-475b-9e05-5b7de9600ce4',
      },
      {
        userId: '14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d',
        roomId: 'dec456c9-49bb-44fc-88ea-98610b50e33c',
      },
      {
        userId: '8e8c6c7c-1180-4539-b7b4-f97d88f98552',
        roomId: 'dec456c9-49bb-44fc-88ea-98610b50e33c',
      },
      {
        userId: '14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d',
        roomId: '293b701e-df09-4aef-a39e-9d31b541fbe9',
      },
      {
        userId: '8e8c6c7c-1180-4539-b7b4-f97d88f98552',
        roomId: '293b701e-df09-4aef-a39e-9d31b541fbe9',
      },
      {
        userId: '14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d',
        roomId: 'c139cfa5-8f8a-477e-ab47-3338a7f458e2',
      },
      {
        userId: '8e8c6c7c-1180-4539-b7b4-f97d88f98552',
        roomId: 'c139cfa5-8f8a-477e-ab47-3338a7f458e2',
      },
      {
        userId: '14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d',
        roomId: 'b49e7ea6-d1d5-48ac-911d-8bd62af145bd',
      },
      {
        userId: '8e8c6c7c-1180-4539-b7b4-f97d88f98552',
        roomId: 'b49e7ea6-d1d5-48ac-911d-8bd62af145bd',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
