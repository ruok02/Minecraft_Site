import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box, Divider, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { CROPS } from '../data/crops';

import SpringIcon from '../assets/season/Spring.png';
import SummerIcon from '../assets/season/Summer.png';
import AutumnIcon from '../assets/season/Autumn.png';
import WinterIcon from '../assets/season/Winter.png';

interface TimerProps {
  uid: string;
  cropId: string | null;
  cropName: string;
  cropImageUrl?: string;
  cropSeason: '봄' | '여름' | '가을' | '겨울';
  currentServerSeason: '봄' | '여름' | '가을' | '겨울';
  initialHarvestPoints: number;
  initialRemainingWater: number;
  initialIsDry: boolean;
  initialIsStarted: boolean;
  lastUpdatedAt: string;
  waterInterval: number;
  autoPlantMode: boolean;
  onStatusChange: (updates: any) => void;
  onRemove: () => void;
}

const seasonStyles = {
  '봄': { bgcolor: '#e8f5e9', color: '#2e7d32', icon: SpringIcon },
  '여름': { bgcolor: '#fff3e0', color: '#ef6c00', icon: SummerIcon },
  '가을': { bgcolor: '#ffebee', color: '#c62828', icon: AutumnIcon },
  '겨울': { bgcolor: '#e1f5fe', color: '#0277bd', icon: WinterIcon },
};

const getCropImageUrl = (season: string, name: string) => {
  if (!name || name.includes('테스트')) return '';
  return new URL(`../assets/crops/${season}/${name}.png`, import.meta.url).href;
};

export const TimerCard: React.FC<TimerProps> = ({
  uid,
  cropId,
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
  autoPlantMode,
  onStatusChange,
  onRemove,
}) => {
  const waterIntervalSecs = waterInterval * 60;

  const isStartedRef = useRef(initialIsStarted);
  const isDryRef = useRef(initialIsDry);
  const waterLeftRef = useRef(initialRemainingWater);
  const pointsLeftRef = useRef(initialHarvestPoints);
  const hasNotifiedHarvestRef = useRef(false);

  const [isStarted, setIsStarted] = useState(initialIsStarted);
  const [isDry, setIsDry] = useState(initialIsDry);
  const [waterLeft, setWaterLeft] = useState(initialRemainingWater);
  const [pointsLeft, setPointsLeft] = useState(initialHarvestPoints);
  const [isSelectingCrop, setIsSelectingCrop] = useState(!cropId);

  const lastTickRef = useRef(Date.now());

  const getCurrentRate = (serverSeason: string, targetSeason: string) => {
    let rate = 1.0;
    if (serverSeason === targetSeason) rate += 0.5;
    if (serverSeason === '봄') rate += 0.2;
    if (serverSeason === '겨울') rate -= 0.5;
    return rate;
  };

  useEffect(() => {
    const now = Date.now();
    const lastUpdate = new Date(lastUpdatedAt).getTime();
    const elapsed = (now - lastUpdate) / 1000;

    if (isStartedRef.current && !isDryRef.current) {
      const currentRate = getCurrentRate(currentServerSeason, cropSeason);

      if (waterLeftRef.current > elapsed) {
        waterLeftRef.current -= elapsed;
        pointsLeftRef.current = Math.max(0, pointsLeftRef.current - (elapsed * currentRate));
      } else {
        const timeUntilDry = waterLeftRef.current;
        waterLeftRef.current = 0;
        isDryRef.current = true;
        pointsLeftRef.current = Math.max(0, pointsLeftRef.current - (timeUntilDry * currentRate));
      }
    }

    setWaterLeft(waterLeftRef.current);
    setPointsLeft(pointsLeftRef.current);
    setIsDry(isDryRef.current);
    syncStatus();
    lastTickRef.current = Date.now();
  }, []);

  useEffect(() => {
    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      if (!isStartedRef.current) return;

      if (waterLeftRef.current > 0) {
        const prevWater = waterLeftRef.current;
        waterLeftRef.current = Math.max(0, waterLeftRef.current - elapsed);
        setWaterLeft(waterLeftRef.current);

        if (prevWater > 0 && waterLeftRef.current <= 0) {
          isDryRef.current = true;
          setIsDry(true);
          syncStatus();
          if (Notification.permission === 'granted') {
            new Notification(`🌵 ${cropName} 밭이 말랐어요!`, { body: '물을 주지 않으면 작물이 자라지 않습니다.' });
          }
        }
      }

      if (cropId && !isDryRef.current && pointsLeftRef.current > 0) {
        const currentRate = getCurrentRate(currentServerSeason, cropSeason);
        pointsLeftRef.current = Math.max(0, pointsLeftRef.current - (elapsed * currentRate));
        setPointsLeft(pointsLeftRef.current);

        if (pointsLeftRef.current <= 0 && !hasNotifiedHarvestRef.current) {
          hasNotifiedHarvestRef.current = true;
          if (Notification.permission === 'granted') {
            new Notification(`🎉 ${cropName} 수확 가능!`, { body: '지금 바로 수확할 수 있습니다.' });
          }
        }
      }
    }, 1000);

    const saveInterval = setInterval(syncStatus, 5000);
    return () => { clearInterval(interval); clearInterval(saveInterval); };
  }, [currentServerSeason, cropId, cropSeason]);

  const syncStatus = () => {
    onStatusChange({
      harvestPoints: pointsLeftRef.current,
      remainingWaterSecs: waterLeftRef.current,
      isDry: isDryRef.current,
      isStarted: isStartedRef.current,
    });
  };

  const handleWaterClick = () => {
    if (Notification.permission === 'default') Notification.requestPermission();
    isStartedRef.current = true;
    isDryRef.current = false;
    waterLeftRef.current = waterIntervalSecs;
    setIsStarted(true);
    setIsDry(false);
    setWaterLeft(waterIntervalSecs);
    lastTickRef.current = Date.now();
    syncStatus();
  };

  const handleHarvestClick = () => {
    if (autoPlantMode) {
      // 자동 심기: 동일 작물로 리셋
      pointsLeftRef.current = Math.max(0, (CROPS.find(c => c.id === cropId)?.baseGrowthDays || 1) * 48 * 60);
      setPointsLeft(pointsLeftRef.current);
      hasNotifiedHarvestRef.current = false;
      syncStatus();
    } else {
      // 수동: 작물 선택 모드로 전환
      setIsSelectingCrop(true);
      onStatusChange({ cropId: null, name: '경작지 비어있음' });
    }
  };

  const handleSelectCrop = (newCropId: string) => {
    const crop = CROPS.find(c => c.id === newCropId);
    if (crop) {
      const baseMins = crop.baseGrowthDays * 48;
      pointsLeftRef.current = Math.floor(baseMins * 60);
      setPointsLeft(pointsLeftRef.current);
      setIsSelectingCrop(false);
      hasNotifiedHarvestRef.current = false;
      onStatusChange({
        cropId: crop.id,
        name: crop.name,
        season: crop.season,
        harvestPoints: pointsLeftRef.current,
        isStarted: true, // 심자마자 시작 (물 있으면 바로 성장)
      });
      setIsStarted(true);
      isStartedRef.current = true;
    }
  };

  const formatSeconds = (seconds: number) => {
    const totalSecs = Math.ceil(seconds);
    if (totalSecs <= 0) return '0분 0초';
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}분 ${s}초`;
  };

  const formatTime = (points: number) => {
    const currentRate = getCurrentRate(currentServerSeason, cropSeason);
    return formatSeconds(points / currentRate);
  };

  return (
    <Card sx={{
      minWidth: 200, boxShadow: 3, borderRadius: 2, borderLeft: '5px solid',
      borderColor: !cropId ? 'grey.300' : isDry ? 'error.main' : isStarted ? 'primary.main' : 'grey.400'
    }}>
      <CardContent>
        {isSelectingCrop ? (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>🌱 다음 작물 선택</Typography>
            <List sx={{ maxHeight: 250, overflow: 'auto', bgcolor: 'background.paper', border: '1px solid #eee', borderRadius: 1 }}>
              {CROPS.filter(c => c.id !== 'test_crop').map(crop => (
                <ListItem key={crop.id} disablePadding>
                  <ListItemButton 
                    onClick={() => handleSelectCrop(crop.id)}
                    sx={{ bgcolor: crop.season === currentServerSeason ? 'rgba(76, 175, 80, 0.1)' : 'transparent' }}
                  >
                    <ListItemIcon sx={{ minWidth: 35 }}>
                      <img src={getCropImageUrl(crop.season, crop.name)} style={{ width: 20, height: 20 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={crop.name} 
                      secondary={`${crop.baseGrowthDays}일`}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: crop.season === currentServerSeason ? 'bold' : 'normal' }}
                    />
                    {crop.season === currentServerSeason && (
                      <Typography variant="caption" color="success.main" fontWeight="bold">추천</Typography>
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {cropImageUrl && <img src={cropImageUrl} alt={cropName} style={{ width: 24, height: 24, objectFit: 'contain' }} />}
                <Typography variant="h6" fontWeight="bold">{cropName}</Typography>
              </Box>
              <Box sx={{ px: 1, py: 0.3, borderRadius: 1.5, bgcolor: seasonStyles[cropSeason].bgcolor, border: `1px solid ${seasonStyles[cropSeason].color}33`, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <img src={seasonStyles[cropSeason].icon} style={{ width: 14, height: 14 }} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: seasonStyles[cropSeason].color }}>{cropSeason}</Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="caption" color="text.secondary">예상 수확 시간</Typography>
            {pointsLeft <= 0 ? (
              <Button variant="contained" color="success" fullWidth sx={{ mt: 0.5, mb: 1, fontWeight: 'bold' }} onClick={handleHarvestClick}>
                🎉 수확 완료! {autoPlantMode && '(자동재심기)'}
              </Button>
            ) : (
              <Typography variant="body1" color={!isStarted ? 'text.disabled' : isDry ? 'warning.main' : 'text.primary'} fontWeight="500">
                {!isStarted ? '💧 물을 먼저 주세요' : isDry ? `⏸️ 정지 중 - ${formatTime(pointsLeft)} 남음` : formatTime(pointsLeft)}
              </Typography>
            )}
          </>
        )}

        <Box sx={{ mt: 2, p: 1, borderRadius: 1, bgcolor: isDry ? 'rgba(255,152,0,0.2)' : isStarted ? 'rgba(33,150,243,0.1)' : 'rgba(200,200,200,0.1)' }}>
          <Typography variant="caption" color="primary">다음 물 주기</Typography>
          <Typography variant="h6" color={isDry ? 'error' : 'primary'} sx={{ fontSize: '1.1rem' }}>
            {isStarted && !isDry ? formatSeconds(waterLeft) : isDry ? '🌵 말랐음!' : '대기 중'}
          </Typography>
          <Button size="small" variant="contained" fullWidth sx={{ mt: 1 }} onClick={handleWaterClick} disabled={isStarted && !isDry} color={isDry ? 'warning' : 'primary'}>
            {!isStarted ? '🌱 첫 물 주기 (시작)' : isDry ? '💧 물 주기' : '✅ 물 줌 (대기 중)'}
          </Button>
        </Box>
        <Button size="small" color="error" fullWidth sx={{ mt: 1 }} onClick={onRemove}>경작지 철거</Button>
      </CardContent>
    </Card>
  );
};