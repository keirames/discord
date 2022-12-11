import React, { useState } from 'react';

type ToneLevel = '0' | '1' | '2' | '3' | '4' | '5';

const toneIconMap: { [key in ToneLevel]: string } = {
  0: '👊',
  1: '👊🏻',
  2: '👊🏼',
  3: '👊🏽',
  4: '👊🏾',
  5: '👊🏿',
};

export const SkinTone = () => {
  const [toneLevel, setToneLevel] = useState<ToneLevel>('0');
  const [selecting, setSelecting] = useState(false);

  const renderSelection = () => {
    const selection: ToneLevel[] = [];

    for (const key in toneIconMap) {
      // Lose type on for..in hence need to force type
      const level: ToneLevel = key as any;

      if (level === toneLevel) {
        continue;
      }

      selection.push(level);
    }
    selection.unshift(toneLevel);

    return selection.map((level) => (
      <div
        key={level}
        className="px-2 hover:bg-midnight-650"
        onClick={() => {
          setSelecting(false);
          setToneLevel(level);
        }}
      >
        {toneIconMap[level]}
      </div>
    ));
  };

  return (
    <div className="relative ml-2 cursor-pointer text-3xl">
      <div
        className="border border-transparent px-2"
        onClick={() => setSelecting(true)}
      >
        {toneIconMap[toneLevel]}
      </div>
      {selecting && (
        <div className="absolute top-0 rounded-md border border-black bg-dark-700">
          {renderSelection()}
        </div>
      )}
    </div>
  );
};
