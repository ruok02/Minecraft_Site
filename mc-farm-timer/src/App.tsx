import { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, Button, Grid, Box, FormControl, InputLabel, Paper } from '@mui/material';
import { CROPS } from './data/crops';
import { getHarvestTime } from './utils/calcTime';
import { TimerCard } from './components/TimerCard';

function App() {
  const [timers, setTimers] = useState<{ name: string; time: Date }[]>(() => {
    const saved = localStorage.getItem('mc_timers');
    if (!saved) return [];
    return JSON.parse(saved).map((t: any) => ({ ...t, time: new Date(t.time) }));
  });

  const [season, setSeason] = useState<'봄' | '여름' | '가을' | '겨울'>('봄');

  useEffect(() => {
    localStorage.setItem('mc_timers', JSON.stringify(timers));
  }, [timers]);

  const addTimer = (cropId: string) => {
    const crop = CROPS.find(c => c.id === cropId);
    if (crop) {
      const harvestTime = getHarvestTime(new Date(), crop.baseGrowthDays, season);
      setTimers([...timers, { name: crop.name, time: harvestTime }]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent' }}>
        <Typography variant="h2" fontWeight="bold" color="primary" gutterBottom>
          🌙 심야 농사 타이머
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          심은 시간을 기록하고 수확 시간을 자동으로 계산하세요.
        </Typography>

        <FormControl sx={{ minWidth: 250, mb: 4 }}>
          <InputLabel>현재 서버 계절</InputLabel>
          <Select value={season} label="현재 서버 계절" onChange={(e) => setSeason(e.target.value as any)}>
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
              {crop.name} ({crop.baseGrowthDays}일)
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
              onRemove={() => setTimers(timers.filter((_, i) => i !== idx))} 
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;