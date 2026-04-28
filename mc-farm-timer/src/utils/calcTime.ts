import { addMinutes } from 'date-fns';

/**
 * 다음 물 주기 시간을 계산합니다.
 * @param lastWatered 심은 시간 또는 마지막으로 물 준 시간
 * @param currentSeason 현재 서버의 계절
 */
export const getNextWateringTime = (lastWatered: Date, currentSeason: string): Date => {
  const interval = currentSeason === '여름' ? 24 : 48; // 여름은 24분 주기
  return addMinutes(lastWatered, interval);
};

/**
 * 최종 수확 가능 시간을 계산합니다.
 * @param plantedAt 심은 시간
 * @param baseDays 작물의 기본 성장 일수
 * @param currentSeason 현재 서버의 계절 (보너스 적용용)
 */
export const getHarvestTime = (plantedAt: Date, baseDays: number, currentSeason: string): Date => {
  let multiplier = 1.0;
  
  // 계절별 성장 속도 보너스 예시 (서버 설정에 맞게 수정 가능)
  if (currentSeason === '봄') multiplier = 1.2; // 20% 빠름
  else if (currentSeason === '겨울') multiplier = 0.5; // 50% 느림

  // 마인크래프트 하루(48분) 기준 계산
  const totalMinutes = (baseDays * 48) / multiplier;
  return addMinutes(plantedAt, totalMinutes);
};