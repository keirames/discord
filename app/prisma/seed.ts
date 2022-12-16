import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 } from "uuid";

const prisma = new PrismaClient();
async function main() {
  await prisma.user.createMany({
    data: [...Array(20).keys()].map(() => ({ name: faker.name.fullName() })),
  });

  const userId = v4();
  await prisma.user.create({ data: { id: userId, name: "CEO" } });

  await prisma.guild.createMany({
    data: [...Array(20).keys()].map(() => ({
      name: faker.science.chemicalElement().name,
    })),
  });

  const guildId = v4();
  await prisma.guild.create({ data: { id: guildId, name: "CEO test guild" } });

  await prisma.guild.createMany({
    data: [...Array(20).keys()].map(() => ({
      name: faker.science.chemicalElement().name,
    })),
  });

  const voiceChannelsIds = [...Array(5).keys()].map(() => v4());
  await prisma.voiceChannel.createMany({
    data: voiceChannelsIds.map((id) => ({
      id,
      name: faker.music.genre(),
      guildId,
    })),
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
