import { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Box, Paper, Tab, Tabs } from '@mui/material';
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

const SEASON_LIST: Season[] = ['봄', '여름', '가을', '겨울'];

const seasonImages: Record<Season, string> = {
  '봄': SpringIcon,
  '여름': SummerIcon,
  '가을': AutumnIcon,
  '겨울': WinterIcon,
};

function App() {
  const initialServerTime = getServerTime();
  const [currentInGameTime, setCurrentInGameTime] = useState(initialServerTime);
  const [season, setSeason] = useState<Season>(initialServerTime.season);
  
  // 작물 탭 - 기본값은 현재 계절
  const [selectedTab, setSelectedTab] = useState<Season>(initialServerTime.season);

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
      {/* 서버 시간 위젯 */}
      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 2, mb: 4, p: 2, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.05)'
      }}>
        <img src={seasonImages[season]} alt={season} style={{ width: 40, height: 40, objectFit: 'contain' }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
          {currentInGameTime.season} {currentInGameTime.day}일 {currentInGameTime.hour}:{currentInGameTime.minute}
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent' }}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          심야 농사 타이머
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          여름엔 24분, 그 외 계절엔 48분 주기로 물 주기를 알려드립니다.
        </Typography>
      </Paper>

      {/* 작물 심기 - 계절 탭 */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>🌱 작물 심기</Typography>
      <Paper elevation={1} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        {/* 계절 탭 */}
        <Tabs
          value={selectedTab}
          onChange={(_, val) => setSelectedTab(val)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {SEASON_LIST.map(s => (
            <Tab
              key={s}
              value={s}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src={seasonImages[s]} alt={s} style={{ width: 20, height: 20, objectFit: 'contain' }} />
                  <span>{s}</span>
                  {/* 현재 계절 표시 */}
                  {s === season && (
                    <Typography variant="caption" sx={{
                      bgcolor: 'primary.main', color: 'white',
                      px: 0.8, py: 0.1, borderRadius: 1, fontSize: '0.6rem'
                    }}>
                      현재
                    </Typography>
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>

        {/* 선택된 계절 작물 버튼 */}
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1}>
            {CROPS.filter(c => c.season === selectedTab).map(crop => (
              <Grid item key={crop.id}>
                <Button
                  variant={selectedTab === season ? 'contained' : 'outlined'}
                  color="secondary"
                  onClick={() => addTimer(crop.id)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {crop.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* 내 밭 현황 */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>🧺 내 밭 현황</Typography>
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