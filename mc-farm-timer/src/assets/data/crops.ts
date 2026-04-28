export interface Crop {
  id: string;
  name: string;
  baseDays: number; // 기본 성장 일수
  season: '봄' | '여름' | '가을' | '겨울';
}

export const CROPS: Crop[] = [
  { id: 'parsley', name: '파슬리', baseDays: 1, season: '봄' },
  { id: 'strawberry', name: '딸기', baseDays: 2, season: '봄' },
  { id: 'tomato', name: '토마토', baseDays: 1, season: '여름' },
  // ... 추가
];