import React, { useEffect, useRef } from 'react';
import { useRtcConnectorStore } from '../rtc-connector/use-rtc-connector-store';
import { useVoiceChannelStore } from './use-voice-channel-store';

type Props = {
  id: string;
};

export const NotYou: React.FC<Props> = (props) => {
  const { id } = props;

  const ref = useRef(false);

  const voiceRef = useRef<HTMLAudioElement>(null);

  const consumeOptions = useVoiceChannelStore((state) => state.members).find(
    (m) => m.peerId === id,
  );

  const { recvTransport } = useRtcConnectorStore();

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    console.log('recv trans', recvTransport);
    console.log('cons', consumeOptions);
    if (!recvTransport || !consumeOptions) return;

    const connectRecvTransport = async () => {
      const consumer = await recvTransport.consume({ ...consumeOptions });
      console.log('their peer consumer created', consumer);
      const { track } = consumer;

      if (voiceRef.current) {
        console.log(new MediaStream([track]));
        voiceRef.current.srcObject = new MediaStream([track]);
        voiceRef.current.play();
      }
    };

    connectRecvTransport();
  }, [consumeOptions, recvTransport]);

  return (
    <div>
      {id}
      <audio ref={voiceRef} />
    </div>
  );
};
