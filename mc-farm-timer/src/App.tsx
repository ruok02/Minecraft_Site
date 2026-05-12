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
  uid: string;
  cropId: string | null; // null이면 비어있는 경작지
  name: string;
  growthMinutes: number;
  waterInterval: number;
  harvestPoints: number;
  remainingWaterSecs: number;
  lastUpdatedAt: string;
  isDry: boolean;
  isStarted: boolean;
  season: Season;
}

const SEASON_LIST: Season[] = ['봄', '여름', '가을', '겨울'];

const seasonImages: Record<Season, string> = {
  '봄': SpringIcon,
  '여름': SummerIcon,
  '가을': AutumnIcon,
  '겨울': WinterIcon,
};

const getCropImageUrl = (season: string, name: string) => {
  if (!name || name.includes('테스트')) return '';
  return new URL(`./assets/crops/${season}/${name}.png`, import.meta.url).href;
};

function App() {
  const initialServerTime = getServerTime();
  const [currentInGameTime, setCurrentInGameTime] = useState(initialServerTime);
  const [season, setSeason] = useState<Season>(initialServerTime.season);
  const [autoPlant, setAutoPlant] = useState(() => {
    return localStorage.getItem('mc_auto_plant') === 'true';
  });
  
  // 작물 탭 - 기본값은 현재 계절
  const [selectedTab, setSelectedTab] = useState<Season>(initialServerTime.season);

  const [timers, setTimers] = useState<TimerEntry[]>(() => {
    const saved = localStorage.getItem('mc_timers');
    if (!saved) return [];
    try {
      return JSON.parse(saved).map((t: any) => {
        const baseMins = t.growthMinutes || (CROPS.find(c => c.name === t.name)?.baseGrowthDays || 1) * 48;
        return {
          uid: t.uid || crypto.randomUUID(),
          cropId: t.cropId || (CROPS.find(c => c.name === t.name)?.id || null),
          name: t.name,
          growthMinutes: baseMins,
          waterInterval: t.waterInterval,
          harvestPoints: t.harvestPoints ?? (t.remainingHarvestSecs ?? baseMins * 60),
          remainingWaterSecs: t.remainingWaterSecs ?? (t.waterInterval * 60),
          lastUpdatedAt: t.lastUpdatedAt ?? new Date().toISOString(),
          isDry: t.isDry ?? false,
          isStarted: t.isStarted ?? false,
          season: t.season || '봄',
        };
      });
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

  useEffect(() => {
    localStorage.setItem('mc_auto_plant', String(autoPlant));
  }, [autoPlant]);

  const addTimer = (cropId: string) => {
    const crop = CROPS.find(c => c.id === cropId);
    if (crop) {
      const baseMins = crop.baseGrowthDays * 48;
      const waterInterval = crop.id === 'test_crop' ? 0.5 : (season === '여름' ? 24 : 48);
      setTimers(prev => [...prev, {
        uid: crypto.randomUUID(),
        cropId: crop.id,
        name: crop.name,
        growthMinutes: baseMins,
        waterInterval: waterInterval,
        harvestPoints: Math.floor(baseMins * 60), // 가중치 1.0 기준의 총 포인트
        remainingWaterSecs: Math.floor(waterInterval * 60),
        lastUpdatedAt: new Date().toISOString(),
        isDry: false,
        isStarted: false,
        season: crop.season,
      }]);
    }
  };

  const updateTimer = (uid: string, updates: Partial<TimerEntry>) => {
    setTimers(prev => {
      const newTimers = [...prev];
      const index = newTimers.findIndex(t => t.uid === uid);
      if (index === -1) return prev;
      newTimers[index] = { 
        ...newTimers[index], 
        ...updates,
        lastUpdatedAt: new Date().toISOString() 
      };
      return newTimers;
    });
  };

  const removeTimer = (uid: string) => {
    setTimers(prev => prev.filter(t => t.uid !== uid));
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>🌱 작물 심기</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'primary.main', color: 'white', px: 2, py: 1, borderRadius: 2, cursor: 'pointer' }}
             onClick={() => setAutoPlant(!autoPlant)}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>자동 심기 모드</Typography>
          <Box sx={{ 
            width: 40, height: 20, bgcolor: autoPlant ? 'success.light' : 'grey.400', 
            borderRadius: 10, position: 'relative', transition: '0.3s' 
          }}>
            <Box sx={{ 
              width: 16, height: 16, bgcolor: 'white', borderRadius: '50%', 
              position: 'absolute', top: 2, left: autoPlant ? 22 : 2, transition: '0.3s' 
            }} />
          </Box>
        </Box>
      </Box>

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
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    textTransform: 'none' // 한국어 폰트 유지 및 소문자 방지
                  }}
                  startIcon={<img src={getCropImageUrl(crop.season, crop.name)} alt={crop.name} style={{ width: 20, height: 20, objectFit: 'contain' }} />}
                >
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {crop.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '0.65rem', // 기존 body2(약 0.875rem)보다 약 5px 작게 조정
                        opacity: 0.9,
                        color: selectedTab === season ? 'secondary.contrastText' : 'secondary.main',
                        filter: 'brightness(1.2)' // 대비를 위한 약간의 조정
                      }}
                    >
                      {crop.baseGrowthDays}일
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* 내 밭 현황 */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>🧺 내 밭 현황</Typography>
      <Grid container spacing={2}>
        {timers.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.uid}>
            <TimerCard
              uid={t.uid}
              cropId={t.cropId}
              cropName={t.name}
              cropImageUrl={getCropImageUrl(t.season, t.name)}
              cropSeason={t.season}
              currentServerSeason={season}
              initialHarvestPoints={t.harvestPoints}
              initialRemainingWater={t.remainingWaterSecs}
              initialIsDry={t.isDry}
              initialIsStarted={t.isStarted}
              lastUpdatedAt={t.lastUpdatedAt}
              waterInterval={t.waterInterval}
              autoPlantMode={autoPlant}
              onStatusChange={(updates) => updateTimer(t.uid, updates)}
              onRemove={() => removeTimer(t.uid)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;