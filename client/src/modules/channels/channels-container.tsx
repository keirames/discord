import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillSound } from 'react-icons/ai';
import { useAuthStore } from '../auth/use-auth-store';
import { useGetGuild } from '../guilds/use-get-guild';
import { useGuildStore } from '../guilds/use-guild-store';
import { useRtcConnectorStore } from '../rtc-connector/use-rtc-connector-store';
import { useWsStore } from '../ws/use-ws-store';
import { useWebsocket } from '../ws/useWebsocket';
import { WsWrapper } from '../ws/ws-wrapper';
import { Members } from './members';
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

  const user = useAuthStore((state) => state.user);

  const { pickChannel, pickedChannel } = useVoiceChannelStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  const responseRef = useRef<HTMLAudioElement>(null);

  const { setTrack } = useRtcConnectorStore();

  useEffect(() => {
    const getTracks = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        if (audioRef.current) {
          console.log('bind src object voice');
          audioRef.current.srcObject = mediaStream;
          audioRef.current.play();
        }

        const tracks = mediaStream.getAudioTracks();
        setTrack(tracks[0]);
      } catch (err) {
        // TODO: machine dont have any mic
        console.log('cannot find mic');
      }
    };

    getTracks();
  }, [setTrack]);

  if (!data) return null;

  const {
    guild: { voiceChannels },
  } = data;
  return (
    <WsWrapper>
      <div className="h-full w-full">
        <div className="hover: cursor-pointer border border-transparent border-b-dark-700 p-2 hover:bg-dark-600">
          <span className="font-bold">{data.guild.name}</span>
        </div>
        <span className="p-2 text-sm uppercase">voice channels</span>
        <audio ref={audioRef} className="border border-red-300" muted />
        {voiceChannels.map((vc) => (
          <div key={vc.id} className="p-2">
            <div
              className={clsx({
                'flex cursor-pointer items-center rounded-md p-2 hover:bg-dark-600':
                  true,
                'bg-dark-600': pickedChannel === vc.id,
              })}
              onClick={async () => {}}
            >
              <AiFillSound />
              <span className="mx-2 capitalize">{vc.name}</span>
            </div>
            <div
              onClick={async () => {
                pickChannel(vc.id);
              }}
            >
              join
            </div>
            <div>join but mute</div>
            <Members />
          </div>
        ))}
      </div>
    </WsWrapper>
  );
};

export const ChannelsContainer = () => {
  const { guildId } = useGuildStore();

  if (!guildId) return <EmptyChannels />;

  return <Channels guildId={guildId} />;
};
