'use client'; // for Next.js 13+ App Router with client components

import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  duration?: number; // in seconds
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration = 1800, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(duration);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onComplete]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
      {formatTime(secondsLeft)}
    </span>
  );
};

export default CountdownTimer;
