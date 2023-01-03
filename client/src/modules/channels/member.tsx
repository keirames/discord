import React, { useEffect, useRef } from 'react';
import { TransportOptions, RtpCapabilities } from 'mediasoup-client/lib/types';
import { useWebsocket2 } from '../ws/useWebsocket2';
import { useWsStore } from '../ws/use-ws-store';
import { useAuthStore } from '../auth/use-auth-store';

type Props = {
  id: string;
};

type JoinedAsSpeakerPayload = {
  roomId: string;
  peerId: string;
  routerRtpCapabilities: RtpCapabilities;
  sendTransportOptions: TransportOptions;
  recvTransportOptions: TransportOptions;
};

export const Member: React.FC<Props> = (props) => {
  const { id } = props;

  const ref = useRef(false);

  const userId = useAuthStore((state) => state.user?.id);

  const join = useWsStore((state) => state.join);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    join({ roomId: 'b9d5a7c1-ef32-4f71-8621-b254a4cbd561' });
  }, [join]);

  return <div>{id === userId ? 'me' : id}</div>;
};
