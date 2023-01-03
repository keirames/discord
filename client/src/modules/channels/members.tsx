import React from 'react';
import { Member } from './member';
import { useVoiceChannelStore } from './use-voice-channel-store';
import { NotYou } from './not-you';
import { useAuthStore } from '../auth/use-auth-store';

export const Members = () => {
  const { pickedChannel, members } = useVoiceChannelStore((state) => state);

  const userId = useAuthStore((state) => state.user?.id);
  if (!userId) return null;

  return (
    <div>
      {pickedChannel && <Member id={userId} />}
      {members.map((m) => (
        <div key={m.peerId}>
          {/* <Member id={m} /> */}
          <NotYou id={m.peerId} />
        </div>
      ))}
    </div>
  );
};
