import React from 'react';
import { useGetGuilds } from './use-get-guilds';
import { useGuildStore } from './use-guild-store';

export const Guilds = () => {
  const { guilds } = useGetGuilds();
  const pickGuild = useGuildStore((state) => state.pickGuild);

  return (
    <div>
      {guilds.map((guild) => (
        <div
          key={guild.id}
          className="mb-2 flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-2xl bg-blue-600"
          onClick={() => pickGuild(guild.id)}
        >
          <span>{guild.name.charAt(0)}</span>
        </div>
      ))}
    </div>
  );
};
