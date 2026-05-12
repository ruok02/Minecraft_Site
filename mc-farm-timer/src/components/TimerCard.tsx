import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box, Divider } from '@mui/material';

import SpringIcon from '../assets/season/Spring.png';
import SummerIcon from '../assets/season/Summer.png';
import AutumnIcon from '../assets/season/Autumn.png';
import WinterIcon from '../assets/season/Winter.png';

interface TimerProps {
  cropName: string;
  cropImageUrl?: string;
  cropSeason: '봄' | '여름' | '가을' | '겨울';
  currentServerSeason: '봄' | '여름' | '가을' | '겨울';
  initialHarvestPoints: number; // 가중치 1.0 기준의 남은 포인트
  initialRemainingWater: number;
  initialIsDry: boolean;
  initialIsStarted: boolean;
  lastUpdatedAt: string;
  waterInterval: number;
  onStatusChange: (updates: {
    harvestPoints: number;
    remainingWaterSecs: number;
    isDry: boolean;
    isStarted: boolean;
  }) => void;
  onRemove: () => void;
}

const seasonStyles = {
  '봄': { bgcolor: '#e8f5e9', color: '#2e7d32', icon: SpringIcon },
  '여름': { bgcolor: '#fff3e0', color: '#ef6c00', icon: SummerIcon },
  '가을': { bgcolor: '#ffebee', color: '#c62828', icon: AutumnIcon },
  '겨울': { bgcolor: '#e1f5fe', color: '#0277bd', icon: WinterIcon },
};

export const TimerCard: React.FC<TimerProps> = ({
  cropName,
  cropImageUrl,
  cropSeason,
  currentServerSeason,
  initialHarvestPoints,
  initialRemainingWater,
  initialIsDry,
  initialIsStarted,
  lastUpdatedAt,
  waterInterval,
  onStatusChange,
  onRemove,
}) => {
  const waterIntervalSecs = waterInterval * 60;

  const isStartedRef = useRef(initialIsStarted);
  const isDryRef = useRef(initialIsDry);
  const waterLeftRef = useRef(initialRemainingWater);
  const pointsLeftRef = useRef(initialHarvestPoints);

  const [isStarted, setIsStarted] = useState(initialIsStarted);
  const [isDry, setIsDry] = useState(initialIsDry);
  const [waterLeft, setWaterLeft] = useState(initialRemainingWater);
  const [pointsLeft, setPointsLeft] = useState(initialHarvestPoints);

  // 실시간 가중치 계산 공식 (매우 중요)
  const getCurrentRate = (serverSeason: string) => {
    let rate = 1.0; // 기본
    if (serverSeason === cropSeason) rate += 0.5; // 제철 보너스 (+50%)
    if (serverSeason === '봄') rate += 0.2; // 봄 환경 보너스 (+20%)
    if (serverSeason === '겨울') rate -= 0.5; // 겨울 환경 페널티 (-50%)
    return rate;
  };

  // 초기화 (새로고침 시 시간 따라잡기)
  useEffect(() => {
    const now = Date.now();
    const lastUpdate = new Date(lastUpdatedAt).getTime();
    const elapsed = Math.floor((now - lastUpdate) / 1000);

    if (isStartedRef.current && !isDryRef.current) {
      const currentRate = getCurrentRate(currentServerSeason);

      if (waterLeftRef.current > elapsed) {
        waterLeftRef.current -= elapsed;
        pointsLeftRef.current = Math.max(0, pointsLeftRef.current - (elapsed * currentRate));
      } else {
        const timeUntilDry = waterLeftRef.current;
        waterLeftRef.current = 0;
        isDryRef.current = true;
        // 물 마르기 전까지만 포인트 차감
        pointsLeftRef.current = Math.max(0, pointsLeftRef.current - (timeUntilDry * currentRate));
      }
    }

    setWaterLeft(waterLeftRef.current);
    setPointsLeft(pointsLeftRef.current);
    setIsDry(isDryRef.current);
    syncStatus();
  }, []);

  // 타이머 루프
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isStartedRef.current) return;

      // 1. 물 타이머
      if (waterLeftRef.current > 0) {
        waterLeftRef.current -= 1;
        setWaterLeft(waterLeftRef.current);

        if (waterLeftRef.current <= 0) {
          isDryRef.current = true;
          setIsDry(true);
          syncStatus();
          if (Notification.permission === 'granted') {
            new Notification(`🌵 ${cropName} 밭이 말랐어요!`, {
              body: '물을 주지 않으면 작물이 자라지 않습니다.'
            });
          }
        }
      }

      // 2. 수확 타이머 (포인트 차감 방식)
      if (!isDryRef.current && pointsLeftRef.current > 0) {
        const currentRate = getCurrentRate(currentServerSeason);
        pointsLeftRef.current = Math.max(0, pointsLeftRef.current - currentRate);
        setPointsLeft(pointsLeftRef.current);
      }
    }, 1000);

    const saveInterval = setInterval(syncStatus, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(saveInterval);
    };
  }, [currentServerSeason]); // 계절 바뀔 때 루프 갱신하여 rate 즉시 반영

  const syncStatus = () => {
    onStatusChange({
      harvestPoints: pointsLeftRef.current,
      remainingWaterSecs: waterLeftRef.current,
      isDry: isDryRef.current,
      isStarted: isStartedRef.current,
    });
  };

  const handleWaterClick = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    isStartedRef.current = true;
    isDryRef.current = false;
    waterLeftRef.current = waterIntervalSecs;
    setIsStarted(true);
    setIsDry(false);
    setWaterLeft(waterIntervalSecs);
    syncStatus();
  };

  const formatTime = (points: number) => {
    // 화면에 보여줄 시간 = 남은 포인트 / 현재 가중치
    const currentRate = getCurrentRate(currentServerSeason);
    const estimatedSeconds = Math.ceil(points / currentRate);
    
    if (estimatedSeconds <= 0) return '0분 0초';
    const m = Math.floor(estimatedSeconds / 60);
    const s = estimatedSeconds % 60;
    return `${m}분 ${s}초`;
  };

  const isButtonDisabled = isStarted && !isDry;

  return (
    <Card sx={{
      minWidth: 200, boxShadow: 3, borderRadius: 2,
      borderLeft: '5px solid',
      borderColor: isDry ? 'error.main' : isStarted ? 'primary.main' : 'grey.400'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {cropImageUrl && <img src={cropImageUrl} alt={cropName} style={{ width: 24, height: 24, objectFit: 'contain' }} />}
            <Typography variant="h6" fontWeight="bold">{cropName}</Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5, 
            px: 1, py: 0.3, 
            borderRadius: 1.5, 
            bgcolor: seasonStyles[cropSeason].bgcolor,
            border: `1px solid ${seasonStyles[cropSeason].color}33`
          }}>
            <img src={seasonStyles[cropSeason].icon} style={{ width: 14, height: 14, objectFit: 'contain' }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: seasonStyles[cropSeason].color }}>
              {cropSeason}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 1 }} />

        <Typography variant="caption" color="text.secondary">예상 수확 시간</Typography>
        <Typography variant="body1"
          color={
            !isStarted ? 'text.disabled'
            : pointsLeft <= 0 ? 'success.main'
            : isDry ? 'warning.main'
            : 'text.primary'
          }
          fontWeight="500">
          {!isStarted
            ? '💧 물을 먼저 주세요'
            : isDry
            ? `⏸️ 정지 중 - ${formatTime(pointsLeft)} 남음`
            : pointsLeft > 0
            ? formatTime(pointsLeft)
            : '🎉 수확 가능!'}
        </Typography>

        <Box sx={{
          mt: 2, p: 1, borderRadius: 1,
          bgcolor: isDry
            ? 'rgba(255,152,0,0.2)'
            : isStarted
            ? 'rgba(33,150,243,0.1)'
            : 'rgba(200,200,200,0.1)'
        }}>
          <Typography variant="caption" color="primary">다음 물 주기</Typography>
          <Typography variant="h6"
            color={isDry ? 'error' : 'primary'}
            sx={{ fontSize: '1.1rem' }}>
            {isStarted && !isDry ? `${Math.floor(waterLeft / 60)}분 ${waterLeft % 60}초` : isDry ? '🌵 말랐음!' : '대기 중'}
          </Typography>

          <Button
            size="small"
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
            onClick={handleWaterClick}
            disabled={isButtonDisabled}
            color={isDry ? 'warning' : 'primary'}>
            {!isStarted
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