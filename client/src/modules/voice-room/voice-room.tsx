import React from 'react';

export const VoiceRoom = () => {
  return (
    <div className="m-4 flex h-[200px] w-[300px] flex-col rounded-3xl bg-blue-50">
      <div className="my-4 text-lg font-semibold">
        South Asia Music Club: Waiting For You
      </div>
      <div className="mb-2 text-sm font-light">
        Start broadcasting 25 minutes ago
      </div>
      <div className="flex-1 rounded-b-3xl border border-red-50 bg-white">
        <div className="my-2 text-sm font-semibold">Room by Mono</div>
        <div className="flex justify-between">
          <div>+300 Others listening</div>
          <button>{`let's go`}</button>
        </div>
      </div>
    </div>
  );
};
