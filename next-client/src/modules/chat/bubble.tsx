import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import { BsCheckCircle, BsCheckCircleFill, BsCircle } from 'react-icons/bs';
import { useAuthStore } from '../auth/use-auth-store';
import { MessageModel } from './types';
import { useGetRoom } from './use-get-room';
import { usePendingMessagesStore } from './use-pending-messages-store';

type Props = {
  // Id of user, not message's userId
  userId: string;
  currentMessage: MessageModel;
  prevMessage?: MessageModel;
  nextMessage?: MessageModel;
};

export const Bubble: React.FC<Props> = (props) => {
  const { userId, currentMessage, nextMessage, prevMessage } = props;

  const pendingMessages = usePendingMessagesStore(
    (state) => state.pendingMessages,
  );

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
      <div
        key={currentMessage.id}
        className={clsx({
          'flex min-w-0 flex-row items-end justify-end': true,
          'mb-1 mt-2': bubbleType === 'top',
          'my-1': bubbleType === 'middle',
          'mt-1 mb-2': bubbleType === 'bottom',
          'my-2': bubbleType === 'alone',
        })}
      >
        <div
          className={clsx({
            'max-w-[60%] rounded-3xl bg-blue-500 py-2 px-4 text-white': true,
            'rounded-br-md': bubbleType === 'top',
            'rounded-r-md': bubbleType === 'middle',
            'rounded-tr-md': bubbleType === 'bottom',
            'rounded-full': bubbleType === 'alone',
          })}
        >
          <div className="break-words">{currentMessage.text}</div>
        </div>
        <div className="ml-1 w-[20px] text-gray-400">
          {pendingMessages.includes(currentMessage.id) ? (
            <BsCircle />
          ) : (
            <BsCheckCircle />
          )}
          {/* <BsCheckCircleFill /> */}
        </div>
      </div>
    );
  };

  const renderBubble = () => {
    return (
      <div className="flex min-w-0 flex-row" key={currentMessage.id}>
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
            'my-1 max-w-[60%] rounded-3xl bg-gray-200 py-2 px-4 text-black':
              true,
            'mb-1 mt-2 rounded-bl-md': bubbleType === 'top',
            'my-1 rounded-l-md': bubbleType === 'middle',
            'mt-1 mb-2 rounded-tl-md': bubbleType === 'bottom',
            'my-2 rounded-full': bubbleType === 'alone',
          })}
        >
          <div className="break-words">{currentMessage.text}</div>
        </div>
      </div>
    );
  };

  return isMine ? renderOwnBubble() : renderBubble();
};
