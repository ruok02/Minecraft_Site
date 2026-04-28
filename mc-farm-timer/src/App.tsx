import { useState } from 'react';
import { CROPS } from './data/crops';
import { getHarvestTime } from './utils/calcTime';
import { TimerCard } from './components/TimerCard';

function App() {
  const [timers, setTimers] = useState<{ name: string; time: Date }[]>([]);
  const [season, setSeason] = useState<'봄' | '여름' | '가을' | '겨울'>('봄');

  const addTimer = (cropId: string) => {
    const crop = CROPS.find(c => c.id === cropId);
    if (crop) {
      const harvestTime = getHarvestTime(new Date(), crop.baseGrowthDays, season);
      setTimers([...timers, { name: crop.name, time: harvestTime }]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Minecraft Farm Timer</h1>
      
      <div>
        <label>현재 계절 선택: </label>
        <select onChange={(e) => setSeason(e.target.value as any)}>
          <option value="봄">봄</option>
          <option value="여름">여름 (물 주기 24분)</option>
          <option value="가을">가을</option>
          <option value="겨울">겨울</option>
        </select>
      </div>

      <hr />

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {CROPS.map(crop => (
          <button key={crop.id} onClick={() => addTimer(crop.id)}>
            {crop.name} 심기
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        {timers.map((t, idx) => (
          <TimerCard key={idx} cropName={t.name} targetTime={t.time} />
        ))}
      </div>
    </div>
  );
}

export default App;