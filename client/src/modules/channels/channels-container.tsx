import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { AiFillSound } from 'react-icons/ai';
import { useGetGuild } from '../guilds/use-get-guild';
import { useGuildStore } from '../guilds/use-guild-store';
import { useWebsocket } from '../ws/useWebsocket';
import { useVoiceChannelStore } from './use-voice-channel-store';

const EmptyChannels = () => {
  return null;
};

type Props = {
  guildId: string;
};

const Channels: React.FC<Props> = (props) => {
  const { guildId } = props;

  const { data } = useGetGuild(guildId);

  const { pickChannel, pickedChannel } = useVoiceChannelStore();

  const [track, setTrack] = useState<MediaStreamTrack | null>(null);

  const { websocket } = useWebsocket(track);

  useEffect(() => {
    const getTracks = async () => {
      // voice track
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const tracks = mediaStream.getAudioTracks();
      setTrack(tracks[0]);
    };

    getTracks();
  }, []);

  if (!data) return null;

  const {
    guild: { voiceChannels },
  } = data;
  return (
    <div className="h-full w-full">
      <div className="hover: cursor-pointer border border-transparent border-b-dark-700 p-2 hover:bg-dark-600">
        <span className="font-bold">{data.guild.name}</span>
      </div>
      <span className="p-2 text-sm uppercase">voice channels</span>
      {voiceChannels.map((vc) => (
        <div key={vc.id} className="p-2">
          <div
            className={clsx({
              'flex cursor-pointer items-center rounded-md p-2 hover:bg-dark-600':
                true,
              'bg-dark-600': pickedChannel === vc.id,
            })}
            onClick={async () => {
              pickChannel(vc.id);

              if (websocket) {
                websocket.send(
                  JSON.stringify({
                    eventName: 'voice-channel/join',
                    payload: JSON.stringify({ roomId: 'abc' }),
                  }),
                );
              }
            }}
          >
            <AiFillSound />
            <span className="mx-2 capitalize">{vc.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ChannelsContainer = () => {
  const { guildId } = useGuildStore();

  if (!guildId) return <EmptyChannels />;

  return <Channels guildId={guildId} />;
};
