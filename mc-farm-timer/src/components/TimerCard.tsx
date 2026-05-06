import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box, Divider } from '@mui/material';

interface TimerProps {
  cropName: string;
  growthMinutes: number;
  waterInterval: number;
  plantedAt: string;
  lastWateredAt: string | null;
  onWater: () => void;
  onRemove: () => void;
}

export const TimerCard: React.FC<TimerProps> = ({
  cropName,
  growthMinutes,
  waterInterval,
  plantedAt,
  lastWateredAt,
  onWater,
  onRemove,
}) => {
  const waterIntervalSecs = waterInterval * 60;
  const totalHarvestSecs = growthMinutes * 60;

  const isValidDate = (d: string | null) =>
    !!d && d !== 'null' && !isNaN(new Date(d).getTime());

  // ✅ 물 줬는지 여부 - ref로 관리해서 클로저 문제 없애기
  const isWateredRef = useRef(isValidDate(lastWateredAt));
<<<<<<< Updated upstream
  const isDryRef = useRef(false);
  const waterLeftRef = useRef(
    isValidDate(lastWateredAt)
      ? Math.max(0, waterIntervalSecs - Math.floor((Date.now() - new Date(lastWateredAt!).getTime()) / 1000))
      : waterIntervalSecs
  );
  const harvestLeftRef = useRef(
    isValidDate(lastWateredAt)
      ? Math.max(0, totalHarvestSecs - Math.floor((Date.now() - new Date(plantedAt).getTime()) / 1000))
      : totalHarvestSecs
=======

  const isDryRef = useRef(false);

  // waterLeft 초기값: 물 준 적 있으면 경과시간 계산, 없으면 그냥 전체 interval
  const waterLeftRef = useRef(
    isValidDate(lastWateredAt)
      ? Math.max(0, waterIntervalSecs - Math.floor(
        (Date.now() - new Date(lastWateredAt!).getTime()) / 1000
      ))
      : waterIntervalSecs
  );

  // harvestLeft 초기값: 물 준 적 있으면 plantedAt 기준 계산, 없으면 전체 시간 고정
  const harvestLeftRef = useRef(
    isValidDate(lastWateredAt)
      ? Math.max(0, totalHarvestSecs - Math.floor(
        (Date.now() - new Date(plantedAt).getTime()) / 1000
      ))
      : totalHarvestSecs  // ✅ 물 안 줬으면 전체 시간 그대로
>>>>>>> Stashed changes
  );

  const [isWatered, setIsWatered] = useState(isWateredRef.current);
  const [isDry, setIsDry] = useState(
    isWateredRef.current && waterLeftRef.current <= 0
  );
  const [waterLeft, setWaterLeft] = useState(waterLeftRef.current);
  const [harvestLeft, setHarvestLeft] = useState(harvestLeftRef.current);

  useEffect(() => {
    // 초기 isDry 동기화
    if (isWateredRef.current && waterLeftRef.current <= 0) {
      isDryRef.current = true;
      setIsDry(true);
    }

    const interval = setInterval(() => {
      if (!isWateredRef.current) return; // 물 안 줬으면 아무것도 안 함

      // 물 주기 타이머
      waterLeftRef.current = Math.max(0, waterLeftRef.current - 1);
      setWaterLeft(waterLeftRef.current);

      if (waterLeftRef.current <= 0 && !isDryRef.current) {
        isDryRef.current = true;
        setIsDry(true);
        if (Notification.permission === 'granted') {
          new Notification(`🌵 ${cropName} 밭이 말랐어요!`, {
            body: '물을 주지 않으면 작물이 자라지 않습니다.'
          });
        }
      }

      // 수확 타이머: 안 마른 상태일 때만
      if (!isDryRef.current) {
        harvestLeftRef.current = Math.max(0, harvestLeftRef.current - 1);
        setHarvestLeft(harvestLeftRef.current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleWaterClick = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
<<<<<<< Updated upstream
    // ✅ ref 직접 업데이트 → 클로저 문제 없음
=======

    const now = Date.now();
    const plantedTime = new Date(plantedAt).getTime();

    // ✅ 물 줄 때 기준으로 수확 남은 시간 재계산
    const elapsedSincePlanted = Math.floor((now - plantedTime) / 1000);
    harvestLeftRef.current = Math.max(0, totalHarvestSecs - elapsedSincePlanted);

>>>>>>> Stashed changes
    isWateredRef.current = true;
    isDryRef.current = false;
    waterLeftRef.current = waterIntervalSecs;

    setIsWatered(true);
    setIsDry(false);
    setWaterLeft(waterIntervalSecs);
<<<<<<< Updated upstream
    onWater(); // App.tsx에 lastWateredAt 저장
  };
=======
    setHarvestLeft(harvestLeftRef.current); // ✅ 즉시 화면에 반영
    onWater();
  };

  
>>>>>>> Stashed changes

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0분 0초';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}분 ${s}초`;
  };

  const isButtonDisabled = isWatered && !isDry;

  return (
    <Card sx={{
      minWidth: 200, boxShadow: 3, borderRadius: 2,
      borderLeft: '5px solid',
      borderColor: isDry ? 'error.main' : isWatered ? 'primary.main' : 'grey.400'
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">{cropName}</Typography>
        <Divider sx={{ my: 1 }} />

        <Typography variant="caption" color="text.secondary">예상 수확 시간</Typography>
        <Typography variant="body1"
          color={
            !isWatered ? 'text.disabled'
            : harvestLeft <= 0 ? 'success.main'
            : isDry ? 'warning.main'
            : 'text.primary'
          }
          fontWeight="500">
          {!isWatered
            ? '💧 물을 먼저 주세요'
            : isDry
            ? `⏸️ 정지 중 - ${formatTime(harvestLeft)} 남음`
            : harvestLeft > 0
            ? formatTime(harvestLeft)
            : '🎉 수확 가능!'}
        </Typography>

        <Box sx={{
          mt: 2, p: 1, borderRadius: 1,
          bgcolor: isDry
            ? 'rgba(255,152,0,0.2)'
            : isWatered
            ? 'rgba(33,150,243,0.1)'
            : 'rgba(200,200,200,0.1)'
        }}>
          <Typography variant="caption" color="primary">다음 물 주기</Typography>
          <Typography variant="h6"
            color={isDry ? 'error' : 'primary'}
            sx={{ fontSize: '1.1rem' }}>
            {isDry ? '🌵 말랐음!' : isWatered ? formatTime(waterLeft) : '대기 중'}
          </Typography>

          <Button
            size="small"
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
            onClick={handleWaterClick}
            disabled={isButtonDisabled}
            color={isDry ? 'warning' : 'primary'}>
            {!isWatered
              ? '🌱 첫 물 주기 (시작)'
              : isDry
              ? '💧 물 주기'
              : '✅ 물 줌 (대기 중)'}
          </Button>
        </Box>

        <Button size="small" color="error" fullWidth sx={{ mt: 1 }} onClick={onRemove}>
          삭제
        </Button>
      </CardContent>
    </Card>
  );
};