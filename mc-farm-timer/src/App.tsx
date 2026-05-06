import { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Box, Paper } from '@mui/material';
import { CROPS } from './data/crops';
import { getServerTime, getGrowthMinutes } from './utils/calcTime';
import { TimerCard } from './components/TimerCard';

import SpringIcon from './assets/season/Spring.png';
import SummerIcon from './assets/season/Summer.png';
import AutumnIcon from './assets/season/Autumn.png';
import WinterIcon from './assets/season/Winter.png';

type Season = '봄' | '여름' | '가을' | '겨울';

interface TimerEntry {
  name: string;
  growthMinutes: number;
  waterInterval: number;
  plantedAt: string;
  lastWateredAt: string | null;
}

function App() {
  const initialServerTime = getServerTime();
  const [currentInGameTime, setCurrentInGameTime] = useState(initialServerTime);
  const [season, setSeason] = useState<Season>(initialServerTime.season);

  const [timers, setTimers] = useState<TimerEntry[]>(() => {
    const saved = localStorage.getItem('mc_timers');
    if (!saved) return [];
    try {
      return JSON.parse(saved).map((t: any) => ({
        name: t.name,
        growthMinutes: t.growthMinutes,
        waterInterval: t.waterInterval,
        plantedAt: t.plantedAt,
        lastWateredAt: t.lastWateredAt ?? null,
      }));
    } catch { return []; }
  });

  const seasonImages: Record<Season, string> = {
    '봄': SpringIcon,
    '여름': SummerIcon,
    '가을': AutumnIcon,
    '겨울': WinterIcon,
  };

  // 실시간 서버 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      const serverTime = getServerTime();
      setCurrentInGameTime(serverTime);
      if (serverTime.season !== season) {
        setSeason(serverTime.season);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [season]);

  // localStorage 저장
  useEffect(() => {
    localStorage.setItem('mc_timers', JSON.stringify(timers));
  }, [timers]);

  const addTimer = (cropId: string) => {
    const crop = CROPS.find(c => c.id === cropId);
    if (crop) {
      const growthMins = getGrowthMinutes(crop.baseGrowthDays, season, crop.season);
      const waterInterval = season === '여름' ? 24 : 48;
      setTimers(prev => [...prev, {
        name: crop.name,
        growthMinutes: growthMins,
        waterInterval: waterInterval,
        plantedAt: new Date().toISOString(),
        lastWateredAt: null,
      }]);
    }
  };

  // ✅ 물 주기 핸들러 - lastWateredAt 현재 시각으로 업데이트
  const handleWatering = (index: number) => {
    setTimers(prev => {
      const newTimers = [...prev];
      newTimers[index] = {
        ...newTimers[index],
        lastWateredAt: new Date().toISOString(),
      };
      return newTimers;
    });
  };

  const removeTimer = (index: number) => {
    setTimers(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 실시간 서버 시간 위젯 */}
      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 2, mb: 4, p: 2, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.05)'
      }}>
        <img
          src={seasonImages[season]}
          alt={season}
          style={{ width: 40, height: 40, objectFit: 'contain' }}
        />
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
          {currentInGameTime.season} {currentInGameTime.day}일 {currentInGameTime.hour}:{currentInGameTime.minute}
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent' }}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          심야 농사 타이머
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: '#ffffff' }}>
          여름엔 24분, 그 외 계절엔 48분 주기로 물 주기를 알려드립니다.
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#ffff', textAlign: 'center' }}>🌱 작물 심기</Typography>
      <Grid
        container
        spacing={1}
        sx={{
          mb: 6,
          display: 'flex',          // Flexbox 활성화
          justifyContent: 'center', // 가로 중앙 정렬
          alignItems: 'center',     // 세로 중앙 정렬 (필요 시)
          width: '100%',            // 컨테이너 너비를 꽉 채움
          ml: 0                     // Grid 특유의 왼쪽 마이너스 마진 제거 (정밀한 중앙 정렬용)
        }}
      >
        {CROPS.filter(c => c.season === season).map(crop => (
          <Grid item key={crop.id}>
            <Button variant="contained" color="secondary" onClick={() => addTimer(crop.id)}>
              {crop.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#ffff' }}>🧺 내 밭 현황</Typography>
      <Grid container spacing={2}>
        {timers.map((t, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <TimerCard
              cropName={t.name}
              growthMinutes={t.growthMinutes}
              waterInterval={t.waterInterval}
              plantedAt={t.plantedAt}
              lastWateredAt={t.lastWateredAt}
              onWater={() => handleWatering(idx)}
              onRemove={() => removeTimer(idx)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;