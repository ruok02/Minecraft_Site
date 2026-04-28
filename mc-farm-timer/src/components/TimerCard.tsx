import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, Divider } from '@mui/material';
import { differenceInSeconds, format } from 'date-fns';

interface TimerProps {
  cropName: string;
  targetTime: Date;
  onRemove: () => void;
}

export const TimerCard: React.FC<TimerProps> = ({ cropName, targetTime, onRemove }) => {
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
    <Card sx={{ minWidth: 200, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">{cropName}</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="text.secondary">
          수확 예정: {format(targetTime, 'HH:mm:ss')}
        </Typography>
        <Typography variant="h5" sx={{ my: 1.5, color: timeLeft > 0 ? 'primary.main' : 'success.main' }}>
          {timeLeft > 0 ? formatTime(timeLeft) : '🎉 수확 가능!'}
        </Typography>
        <Button size="small" color="error" variant="text" onClick={onRemove}>삭제</Button>
      </CardContent>
    </Card>
  );
};