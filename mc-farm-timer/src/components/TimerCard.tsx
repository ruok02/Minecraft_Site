import React, { useState, useEffect } from 'react';
import { differenceInSeconds, format } from 'date-fns';

interface TimerProps {
  cropName: string;
  targetTime: Date;
}

export const TimerCard: React.FC<TimerProps> = ({ cropName, targetTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = differenceInSeconds(targetTime, new Date());
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}분 ${s}초`;
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '8px' }}>
      <h3>{cropName}</h3>
      <p>수확 예정: {format(targetTime, 'HH:mm:ss')}</p>
      <p style={{ color: 'red', fontWeight: 'bold' }}>
        남은 시간: {timeLeft > 0 ? formatTime(timeLeft) : '수확 가능!'}
      </p>
    </div>
  );
};