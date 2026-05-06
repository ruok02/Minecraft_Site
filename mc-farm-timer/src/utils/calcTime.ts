import { addMinutes } from 'date-fns';

const REFERENCE_REAL_TIME = new Date('2026-04-30T01:36:00').getTime();

export const getServerTime = () => {
  const now = new Date().getTime();
  const diffInSeconds = (now - REFERENCE_REAL_TIME) / 1000;
  const totalServerMinutes = Math.floor(diffInSeconds / 2);
  const baseDays = 32;
  const totalDays = Math.floor(totalServerMinutes / 1440) + baseDays;
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  const seasons: ('봄' | '여름' | '가을' | '겨울')[] = ['봄', '여름', '가을', '겨울'];
  const seasonIndex = Math.floor((totalDays % 120) / 30);
  const currentSeason = seasons[seasonIndex];
  const dayInSeason = (totalDays % 30) + 1;
  const hour = Math.floor((totalServerMinutes % 1440) / 60);
  const minute = totalServerMinutes % 60;
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  return {
    season: currentSeason,
    day: dayInSeason,
    hour: String(hour).padStart(2, '0'),
    minute: String(minute).padStart(2, '0')
  };
};

<<<<<<< Updated upstream
/**
 * 확정 공식에 따른 실제 성장 시간(분) 계산
 * Step1: 제철 작물이면 baseMins × 0.5
 * Step2: 봄이면 현재 시간 × 0.8 (추가 20% 단축)
 * Step3: 겨울이면 baseMins × 0.5 만큼 추가
 */
=======
// ✅ 확정 공식
// Step1: 제철 작물이면 baseMins × 0.5
// Step2: 봄이면 현재시간 × 0.8 (추가 20% 단축)
// Step3: 겨울이면 baseMins × 0.5 만큼 추가
>>>>>>> Stashed changes
export const getGrowthMinutes = (
  baseDays: number,
  currentSeason: '봄' | '여름' | '가을' | '겨울',
  cropSeason: '봄' | '여름' | '가을' | '겨울'
): number => {
  const baseMins = baseDays * 48;
  const isInSeason = currentSeason === cropSeason;

  let growthMins = baseMins;

  // Step1: 제철 보너스 +50%
  if (isInSeason) {
    growthMins = growthMins * 0.5;
  }

  // Step2: 봄 추가 보너스 +20%
  if (currentSeason === '봄') {
    growthMins = growthMins * 0.8;
  }

<<<<<<< Updated upstream
  // Step3: 겨울 패널티 -50% (기본 시간의 절반을 더함)
=======
  // Step3: 겨울 패널티 (baseMins의 절반을 더함)
>>>>>>> Stashed changes
  if (currentSeason === '겨울') {
    growthMins = growthMins + baseMins * 0.5;
  }

  return growthMins;
};

export const getHarvestTime = (
  plantedAt: Date,
  baseDays: number,
  currentSeason: '봄' | '여름' | '가을' | '겨울',
  cropSeason: '봄' | '여름' | '가을' | '겨울'
): Date => {
  const mins = getGrowthMinutes(baseDays, currentSeason, cropSeason);
  return addMinutes(plantedAt, mins);
};

export const getNextWateringTime = (lastWatered: Date, currentSeason: string): Date => {
  const interval = currentSeason === '여름' ? 24 : 48;
  return addMinutes(lastWatered, interval);
};