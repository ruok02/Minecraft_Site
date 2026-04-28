import { addMinutes } from 'date-fns';

// 물 주기 시간 계산 (기본 48분, 여름 24분)
export const getNextWateringTime = (plantedAt: Date, currentSeason: string) => {
  const interval = currentSeason === '여름' ? 24 : 48;
  return addMinutes(plantedAt, interval);
};

// 수확 시간 계산 (봄 +20%, 겨울 -50% 등 적용)
export const getHarvestTime = (plantedAt: Date, cropDays: number, currentSeason: string) => {
  let bonus = 1.0;
  if (currentSeason === '봄') bonus = 1.2;
  else if (currentSeason === '겨울') bonus = 0.5;
  
  // 현실 시간 환산: (성장일수 * 48분) / 보너스배율
  const totalMinutes = (cropDays * 48) / bonus;
  return addMinutes(plantedAt, totalMinutes);
};