import { addMinutes } from 'date-fns';

const REFERENCE_REAL_TIME = new Date('2026-04-30T01:36:00').getTime(); 

export const getServerTime = () => {
  const now = new Date().getTime();
  const diffInSeconds = (now - REFERENCE_REAL_TIME) / 1000;
  
  const totalServerMinutes = Math.floor(diffInSeconds / 2);
  
  // 🌟 핵심 수정: 여름 3일 기준이므로 전체 루프의 32번째 날(인덱스 32)로 잡습니다.
  const baseDays = 32; 
  const totalDays = Math.floor(totalServerMinutes / 1440) + baseDays;

  // 120일 루프 (봄 0~29, 여름 30~59, 가을 60~89, 겨울 90~119)
  const seasons: ('봄' | '여름' | '가을' | '겨울')[] = ['봄', '여름', '가을', '겨울'];
  const seasonIndex = Math.floor((totalDays % 120) / 30);
  const currentSeason = seasons[seasonIndex];

  // 일자 계산 (1~30일)
  const dayInSeason = (totalDays % 30) + 1;

  const hour = Math.floor((totalServerMinutes % 1440) / 60);
  const minute = totalServerMinutes % 60;

  return { 
    season: currentSeason, 
    day: dayInSeason, 
    hour: String(hour).padStart(2, '0'), 
    minute: String(minute).padStart(2, '0') 
  };
};

/**
 * 최종 수확 가능 시간을 계산합니다.
 */
export const getHarvestTime = (plantedAt: Date, baseDays: number, currentSeason: string): Date => {
  let multiplier = 1.0;
  if (currentSeason === '봄') multiplier = 1.2;
  else if (currentSeason === '겨울') multiplier = 0.5;

  const totalMinutes = (baseDays * 48) / multiplier;
  return addMinutes(plantedAt, totalMinutes);
};

/**
 * 다음 물 주기 시간을 계산합니다.
 */
export const getNextWateringTime = (lastWatered: Date, currentSeason: string): Date => {
  const interval = currentSeason === '여름' ? 24 : 48;
  return addMinutes(lastWatered, interval);
};