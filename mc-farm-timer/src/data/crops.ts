export interface Crop {
  id: string;
  name: string;
  baseGrowthDays: number; // 위키에 적힌 기본 성장 일수
  season: '봄' | '여름' | '가을' | '겨울';
  imagePath: string;
}

export const CROPS: Crop[] = [
  // 🌸 봄 제철 작물
  { id: 'parsley', name: '파슬리', baseGrowthDays: 1, season: '봄' },
  { id: 'cabbage', name: '양배추', baseGrowthDays: 1, season: '봄' },
  { id: 'strawberry', name: '딸기', baseGrowthDays: 2, season: '봄' },
  { id: 'onion', name: '양파', baseGrowthDays: 2, season: '봄' },
  { id: 'broccoli', name: '브로콜리', baseGrowthDays: 3, season: '봄' },
  { id: 'asparagus', name: '아스파라거스', baseGrowthDays: 4, season: '봄' },
  { id: 'artichoke', name: '아티초크', baseGrowthDays: 5, season: '봄' },

  // 🚤 여름 제철 작물
  { id: 'tomato', name: '토마토', baseGrowthDays: 1, season: '여름' },
  { id: 'corn', name: '옥수수', baseGrowthDays: 1, season: '여름' },
  { id: 'chili', name: '고추', baseGrowthDays: 2, season: '여름' },
  { id: 'blueberry', name: '블루베리', baseGrowthDays: 2, season: '여름' },
  { id: 'melon', name: '멜론', baseGrowthDays: 2, season: '여름' },
  { id: 'eggplant', name: '가지', baseGrowthDays: 3, season: '여름' },
  { id: 'pineapple', name: '파인애플', baseGrowthDays: 3, season: '여름' },
  { id: 'banana', name: '바나나', baseGrowthDays: 3, season: '여름' },
  { id: 'paprika', name: '파프리카', baseGrowthDays: 4, season: '여름' },
  { id: 'mango', name: '망고', baseGrowthDays: 4, season: '여름' },
  { id: 'peach', name: '복숭아', baseGrowthDays: 5, season: '여름' },

  // 🍂 가을 제철 작물
  { id: 'bean', name: '콩', baseGrowthDays: 1, season: '가을' },
  { id: 'radish', name: '무', baseGrowthDays: 2, season: '가을' },
  { id: 'rice', name: '쌀', baseGrowthDays: 2, season: '가을' },
  { id: 'napa_cabbage', name: '배추', baseGrowthDays: 3, season: '가을' },
  { id: 'grape', name: '포도', baseGrowthDays: 3, season: '가을' },
  { id: 'sweet_potato', name: '고구마', baseGrowthDays: 4, season: '가을' },
  { id: 'ginseng', name: '산삼', baseGrowthDays: 5, season: '가을' },

  // ☃️ 겨울 제철 작물
  { id: 'green_onion', name: '파', baseGrowthDays: 2, season: '겨울' },
  { id: 'turnip', name: '순무', baseGrowthDays: 3, season: '겨울' },
  { id: 'lemon', name: '레몬', baseGrowthDays: 3, season: '겨울' },
  { id: 'garlic', name: '마늘', baseGrowthDays: 4, season: '겨울' },
  { id: 'orange', name: '오렌지', baseGrowthDays: 5, season: '겨울' },
];