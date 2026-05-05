import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box, Divider } from '@mui/material';

interface TimerProps {
  cropName: string;
  growthMinutes: number;   // 실제 성장 시간(분) - calcTime에서 계산된 값
  waterInterval: number;   // 물 주기 간격(분) - 24 or 48
  onRemove: () => void;
}

export const TimerCard: React.FC<TimerProps> = ({
  cropName,
  growthMinutes,
  waterInterval,
  onRemove
}) => {
  // 물을 줬는지 여부 (처음엔 false → 타이머 정지 상태)
  const [isWatered, setIsWatered] = useState(false);
  // 수확까지 남은 실제 초
  const [harvestLeft, setHarvestLeft] = useState(growthMinutes * 60);
  // 물 주기까지 남은 초
  const [waterLeft, setWaterLeft] = useState(waterInterval * 60);
  // 물이 말랐는지 여부
  const [isDry, setIsDry] = useState(false);

  const harvestRef = useRef(harvestLeft);
  const waterRef = useRef(waterLeft);
  harvestRef.current = harvestLeft;
  waterRef.current = waterLeft;

  useEffect(() => {
    // 물 안 줬으면 타이머 전체 정지
    if (!isWatered) return;

    const interval = setInterval(() => {
      // 물이 마른 상태면 수확 타이머 정지
      if (!isDry) {
        setHarvestLeft(prev => Math.max(0, prev - 1));
      }
      // 물 주기 타이머는 항상 흐름
      setWaterLeft(prev => {
        if (prev <= 1) {
          setIsDry(true); // 물 마름 처리
          // 브라우저 알림
          if (Notification.permission === 'granted') {
            new Notification(`🌵 ${cropName} 밭이 말랐어요!`, {
              body: '물을 주지 않으면 작물이 자라지 않습니다.'
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isWatered, isDry, cropName]);

  // 물 주기 버튼 핸들러
  const handleWater = () => {
    setIsWatered(true);
    setIsDry(false);
    setWaterLeft(waterInterval * 60);
    // 알림 권한 요청
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0분 0초';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}분 ${s}초`;
  };

  return (
    <Card sx={{
      minWidth: 200, boxShadow: 3, borderRadius: 2,
      borderLeft: '5px solid',
      borderColor: isDry ? 'error.main' : isWatered ? 'primary.main' : 'grey.400'
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">{cropName}</Typography>
        <Divider sx={{ my: 1 }} />

        {/* 수확 타이머 */}
        <Typography variant="caption" color="text.secondary">예상 수확 시간</Typography>
        <Typography variant="body1"
          color={!isWatered ? 'text.disabled' : harvestLeft > 0 ? 'text.primary' : 'success.main'}
          fontWeight="500">
          {!isWatered
            ? '💧 물을 먼저 주세요'
            : isDry
            ? `⏸️ 정지 중 - ${formatTime(harvestLeft)} 남음`
            : harvestLeft > 0
            ? formatTime(harvestLeft)
            : '🎉 수확 가능!'}
        </Typography>

        {/* 물 주기 타이머 */}
        <Box sx={{
          mt: 2, p: 1, borderRadius: 1,
          bgcolor: isDry ? 'rgba(255,152,0,0.2)' : 'rgba(33,150,243,0.1)'
        }}>
          <Typography variant="caption" color="primary">다음 물 주기</Typography>
          <Typography variant="h6"
            color={isDry ? 'error' : 'primary'}
            sx={{ fontSize: '1.1rem' }}>
            {isDry ? '🌵 말랐음!' : isWatered ? formatTime(waterLeft) : '대기 중'}
          </Typography>
          <Button
            size="small" variant="contained" fullWidth sx={{ mt: 1 }}
            onClick={handleWater}
            color={isDry ? 'warning' : 'primary'}>
            {isWatered ? '물 주기 완료 ✅' : '🌱 첫 물 주기 (시작)'}
          </Button>
        </Box>

        <Button size="small" color="error" fullWidth sx={{ mt: 1 }} onClick={onRemove}>
          삭제
        </Button>
      </CardContent>
    </Card>
  );
};