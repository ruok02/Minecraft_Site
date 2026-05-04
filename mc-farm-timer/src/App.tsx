import { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, Button, Grid, Box, FormControl, InputLabel, Paper } from '@mui/material';
import { CROPS } from './data/crops';
import { getServerTime, getHarvestTime } from './utils/calcTime';
import { TimerCard } from './components/TimerCard';

// 계절 이미지 import
import SpringIcon from './assets/season/Spring.png';
import SummerIcon from './assets/season/Summer.png';
import AutumnIcon from './assets/season/Autumn.png'; 
import WinterIcon from './assets/season/Winter.png';

function App() {

  // 1. 서버 시간 데이터를 한 번 가져옵니다.
  const initialServerTime = getServerTime();

  // 2. 초기값 자체를 서버 시간에서 가져온 데이터로 설정합니다.
  const [currentInGameTime, setCurrentInGameTime] = useState(initialServerTime);
  const [season, setSeason] = useState(initialServerTime.season); // 여기서 '봄'을 지웁니다.

  const [timers, setTimers] = useState<{ name: string; time: Date }[]>(() => {
    const saved = localStorage.getItem('mc_timers');
    if (!saved) return [];
    try {
      return JSON.parse(saved).map((t: any) => ({ ...t, time: new Date(t.time) }));
    } catch { return []; }
  });

  // 계절 이미지 매핑
  const seasonImages = {
    '봄': SpringIcon,
    '여름': SummerIcon,
    '가을': AutumnIcon,
    '겨울': WinterIcon,
  };

  // 2. 효과 선언 (Effects)
  // 실시간 서버 시간 업데이트 (1초 주기로 체크)
  // 3. 실시간 업데이트 로직 (동일)
  useEffect(() => {
    const timer = setInterval(() => {
      const serverTime = getServerTime();
      setCurrentInGameTime(serverTime);
      
      // 계절이 넘어가는 시점에만 실행됨
      if (serverTime.season !== season) {
        setSeason(serverTime.season);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [season]);

  // 타이머 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem('mc_timers', JSON.stringify(timers));
  }, [timers]);

  // 3. 로직 함수 (Handlers)
  const addTimer = (cropId: string) => {
    const crop = CROPS.find(c => c.id === cropId);
    if (crop) {
      const harvestTime = getHarvestTime(new Date(), crop.baseGrowthDays, season);
      setTimers([...timers, { name: crop.name, time: harvestTime }]);
    }
  };

  const removeTimer = (index: number) => {
    setTimers(timers.filter((_, i) => i !== index));
  };

  // 4. UI 렌더링 (Return)
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 🌟 실시간 서버 시간 위젯 (중앙 상단) */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 2, 
        mb: 4,
        p: 2,
        borderRadius: 2,
        bgcolor: 'rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.1)'
      }}>
        <img 
          src={seasonImages[season]} 
          alt={season} 
          style={{ width: 40, height: 40, objectFit: 'contain' }} 
        />
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
          {season} {currentInGameTime.day}일 {currentInGameTime.hour}:{currentInGameTime.minute}
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent' }}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          심야 농사 타이머
        </Typography>

        <FormControl sx={{ minWidth: 250, mb: 4 }}>
          <InputLabel>현재 서버 계절</InputLabel>
          <Select 
            value={season} 
            label="현재 서버 계절" 
            onChange={(e) => setSeason(e.target.value as any)}
          >
            <MenuItem value="봄">🌸 봄 (+20% 성장)</MenuItem>
            <MenuItem value="여름">🚤 여름 (물 24분)</MenuItem>
            <MenuItem value="가을">🍂 가을</MenuItem>
            <MenuItem value="겨울">☃️ 겨울 (-50% 성장)</MenuItem>
          </Select>
        </FormControl>
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
              targetTime={t.time} 
              onRemove={() => removeTimer(idx)} 
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;