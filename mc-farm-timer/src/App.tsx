import { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, Button, Grid, Box, FormControl, InputLabel, Paper } from '@mui/material';
import { CROPS } from './data/crops';
import { getServerTime, getGrowthMinutes } from './utils/calcTime';
import { TimerCard } from './components/TimerCard';

// 계절 이미지 import
import SpringIcon from './assets/season/Spring.png';
import SummerIcon from './assets/season/Summer.png';
import AutumnIcon from './assets/season/Autumn.png';
import WinterIcon from './assets/season/Winter.png';

function App() {

  // 1. 초기 서버 시간 및 계절 계산 (딜레이 방지)
  const initialServerTime = getServerTime();
  const [currentInGameTime, setCurrentInGameTime] = useState(initialServerTime);
  const [season, setSeason] = useState(initialServerTime.season);

  // 2. 타이머 상태 (waterTime 포함하여 한 번만 선언!)
  const [timers, setTimers] = useState<{ name: string; growthMinutes: number; waterInterval: number; }[]>(() => {
  const saved = localStorage.getItem('mc_timers');
  if (!saved) return [];
  try {
    return JSON.parse(saved).map((t: any) => ({
      name: t.name,
      growthMinutes: t.growthMinutes,
      waterInterval: t.waterInterval,
    }));
  } catch { return []; }
});

  // 계절 이미지 매핑
  const seasonImages = {
    '봄': SpringIcon,
    '여름': SummerIcon,
    '가을': AutumnIcon,
    '겨울': WinterIcon,
  };

  // 2. addTimer 함수 수정 (최초 심을 때 물 주기 시간 계산)
  // addTimer 수정 - cropSeason 정보도 넘겨야 함
  const addTimer = (cropId: string) => {
    const crop = CROPS.find(c => c.id === cropId);
    if (crop) {
      const growthMins = getGrowthMinutes(crop.baseGrowthDays, season, crop.season);
      const waterInterval = season === '여름' ? 24 : 48;
      setTimers([...timers, {
        name: crop.name,
        growthMinutes: growthMins,
        waterInterval: waterInterval,
      }]);
    }
  };

  // 3. 실시간 업데이트 로직
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

  // 4. 핸들러 함수들 (중복 선언 제거됨)
  // (기존에 중복 선언되었던 addTimer 함수는 위 2번 영역에서 통합 관리하므로 삭제되었습니다.)

  // 5. 물 주기 버튼 클릭 핸들러 (시간 갱신)
  const handleWatering = (index: number) => {
    const newTimers = [...timers];
    // 현재 시간을 기준으로 다음 물 주기 시간 업데이트
    newTimers[index].waterTime = getNextWateringTime(new Date(), season);
    setTimers(newTimers);
  };

  const removeTimer = (index: number) => {
    setTimers(timers.filter((_, i) => i !== index));
  };

  // 6. UI 렌더링 (Return)
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
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          여름엔 24분, 그 외 계절엔 48분 주기로 물 주기를 알려드립니다.
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>🌱 작물 심기</Typography>
      <Grid container spacing={1} sx={{ mb: 6 }}>
        {CROPS.filter(c => c.season === season).map(crop => (
          <Grid item key={crop.id}>
            <Button variant="contained" color="secondary" onClick={() => addTimer(crop.id)}>
              {crop.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>🧺 내 밭 현황</Typography>
      <Grid container spacing={2}>
        {timers.map((t, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <TimerCard
              cropName={t.name}
              growthMinutes={t.growthMinutes}
              waterInterval={t.waterInterval}
              onRemove={() => removeTimer(idx)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;