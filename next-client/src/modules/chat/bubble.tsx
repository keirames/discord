import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import { Message } from '../../gql/graphql';
import { useAuthStore } from '../auth/use-auth-store';
import { useGetRoom } from './use-get-room';

type Props = {
  userId: string;
  currentMessage: Omit<Message, '__typename'>;
  prevMessage?: Omit<Message, '__typename'>;
  nextMessage?: Omit<Message, '__typename'>;
};

export const Bubble: React.FC<Props> = (props) => {
  const { userId, currentMessage, nextMessage, prevMessage } = props;

  const isMine = useMemo(
    () => currentMessage.userId === userId,
    [currentMessage.userId, userId],
  );

  const isSameUser = useCallback(
    (m: Omit<Message, '__typename'>) => {
      return m.userId === userId;
    },
    [userId],
  );

  const isShortTime = useCallback(
    (m: Omit<Message, '__typename'>) => {
      return (
        new Date(currentMessage.createdAt).getTime() -
          new Date(m.createdAt).getTime() / 1000 / 60 <
        10
      );
    },
    [currentMessage.createdAt],
  );

  const bubbleType = useMemo<'top' | 'middle' | 'bottom' | 'alone'>(() => {
    if (nextMessage && isSameUser(nextMessage)) {
      console.log(currentMessage.text);
    }

    if (
      nextMessage &&
      isSameUser(nextMessage) &&
      isShortTime(nextMessage) &&
      (!prevMessage || !isSameUser(prevMessage) || !isShortTime(prevMessage))
    ) {
      return 'top';
    }

    if (
      prevMessage &&
      isSameUser(prevMessage) &&
      nextMessage &&
      isSameUser(nextMessage) &&
      isShortTime(prevMessage) &&
      isShortTime(nextMessage)
    ) {
      return 'middle';
    }

    if (
      prevMessage &&
      isSameUser(prevMessage) &&
      isShortTime(prevMessage) &&
      (!nextMessage || !isSameUser(nextMessage) || !isShortTime(nextMessage))
    ) {
      return 'bottom';
    }

    return 'alone';
  }, [isSameUser, isShortTime, nextMessage, prevMessage]);

  const renderOwnBubble = () => {
    console.log(bubbleType);
    return (
      <div key={currentMessage.id} className="flex flex-row justify-end">
        <div
          className={clsx({
            'my-1 bg-blue-500 py-2 px-4 text-white': true,
            'rounded-full': bubbleType == 'top',
          })}
        >
          {currentMessage.text}
        </div>
        <div className="w-[10px]" />
      </div>
    );
  };

  const renderBubble = () => {
    return (
      <div className="flex flex-row" key={currentMessage.id}>
        <div className="mr-2 flex items-center justify-center">
          <img
            src="https://i.scdn.co/image/ab67616d0000b273ee07b239264db04dcf5148cd"
            className="rounded-full"
            width={35}
            height={35}
          />
        </div>
        <div className="my-1 rounded-full bg-gray-200 py-2 px-4 text-black">
          {currentMessage.text}
        </div>
      </div>
    );
  };

  return isMine ? renderOwnBubble() : renderBubble();
};
