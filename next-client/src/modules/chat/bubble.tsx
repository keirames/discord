import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import { useAuthStore } from '../auth/use-auth-store';
import { MessageModel } from './types';
import { useGetRoom } from './use-get-room';

type Props = {
  // Id of user, not message's userId
  userId: string;
  currentMessage: MessageModel;
  prevMessage?: MessageModel;
  nextMessage?: MessageModel;
};

export const Bubble: React.FC<Props> = (props) => {
  const { userId, currentMessage, nextMessage, prevMessage } = props;

  const isMine = useMemo(
    () => currentMessage.userId === userId,
    [currentMessage.userId, userId],
  );

  const isSameUser = useCallback(
    (m?: MessageModel) => {
      if (!m) return false;

      return m.userId === currentMessage.userId;
    },
    [currentMessage.userId],
  );

  const isShortTime = useCallback(
    (m?: MessageModel) => {
      if (!m) return false;

      const gapInMilliseconds = Math.abs(
        new Date(currentMessage.createdAt).getTime() -
          new Date(m.createdAt).getTime(),
      );

      return gapInMilliseconds / 1000 / 60 < 10;
    },
    [currentMessage.createdAt],
  );

  const bubbleType = useMemo<'top' | 'middle' | 'bottom' | 'alone'>(() => {
    if (
      (!isSameUser(prevMessage) || !isShortTime(prevMessage)) &&
      (!isSameUser(nextMessage) || !isShortTime(nextMessage))
    )
      return 'alone';

    if (
      (!isSameUser(prevMessage) || !isShortTime(prevMessage)) &&
      isSameUser(nextMessage) &&
      isShortTime(nextMessage)
    )
      return 'top';

    if (
      (!isSameUser(nextMessage) || !isShortTime(nextMessage)) &&
      isSameUser(prevMessage) &&
      isShortTime(prevMessage)
    )
      return 'bottom';

    return 'middle';
  }, [isSameUser, isShortTime, nextMessage, prevMessage]);

  const renderOwnBubble = () => {
    return (
      <div key={currentMessage.id} className="flex flex-row justify-end">
        <div
          className={clsx({
            'rounded-3xl bg-blue-500 py-2 px-4 text-white': true,
            'mb-[0.1rem] mt-2 rounded-br-md': bubbleType === 'top',
            'my-[0.1rem] rounded-r-md': bubbleType === 'middle',
            'mt-[0.1rem] mb-2 rounded-tr-md': bubbleType === 'bottom',
            'my-2 rounded-full': bubbleType === 'alone',
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
        <div
          className={clsx({
            'mr-2 flex justify-center': true,
            'items-start': bubbleType === 'bottom',
            'items-center': bubbleType === 'alone',
          })}
        >
          <div className="h-[35px] w-[35px]">
            {(bubbleType === 'bottom' || bubbleType === 'alone') && (
              <img
                src="https://i.scdn.co/image/ab67616d0000b273ee07b239264db04dcf5148cd"
                className="rounded-full"
              />
            )}
          </div>
        </div>
        <div
          className={clsx({
            'my-1 rounded-3xl bg-gray-200 py-2 px-4 text-black': true,
            'mb-[0.1rem] mt-2 rounded-bl-md': bubbleType === 'top',
            'my-[0.1rem] rounded-l-md': bubbleType === 'middle',
            'mt-[0.1rem] mb-2 rounded-tl-md': bubbleType === 'bottom',
            'my-2 rounded-full': bubbleType === 'alone',
          })}
        >
          {currentMessage.text}
        </div>
      </div>
    );
  };

  return isMine ? renderOwnBubble() : renderBubble();
};
