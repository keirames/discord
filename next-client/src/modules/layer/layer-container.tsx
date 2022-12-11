import React from 'react';

export const LayerContainer = () => {
  const style: React.CSSProperties = {
    right: 16,
  };

  return (
    <div className="pointer-events-none absolute h-full w-full bg-none"></div>
  );
};
