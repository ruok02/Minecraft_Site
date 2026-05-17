import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CROPS } from '../data/crops';
import { getServerTime } from '../utils/calcTime';

const seasonImages: Record<string, string> = {
  '봄': new URL('../assets/season/Spring.png', import.meta.url).href,
  '여름': new URL('../assets/season/Summer.png', import.meta.url).href,
  '가을': new URL('../assets/season/Autumn.png', import.meta.url).href,
  '겨울': new URL('../assets/season/Winter.png', import.meta.url).href,
};

const getCropImageUrl = (season: string, name: string) => {
  if (!name || name.includes('테스트')) return '';
  return new URL(`../assets/crops/${season}/${name}.png`, import.meta.url).href;
};

// 카드 공통 스타일
const cardBase = {
  p: 3,
  borderRadius: 3,
  bgcolor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const serverTime = getServerTime();
  const currentSeasonCrops = CROPS.filter(c => c.season === serverTime.season && c.id !== 'test_crop');

  const quickMenus = [
    { emoji: '🌾', label: '농사 타이머', desc: '작물 성장 및 물 주기 관리', path: '/farming', active: true },
    { emoji: '🐾', label: '테이밍', desc: '준비 중', path: null },
    { emoji: '⚖️', label: '무역', desc: '준비 중', path: null },
    { emoji: '📦', label: '주문', desc: '준비 중', path: null },
  ];

  const links = [
    { label: '공식 디스코드', url: '#' },
    { label: '위키', url: '#' },
    { label: '마인리스트', url: '#' },
  ];

  const updates = [
    '[2026.05.12] 수확 및 물 주기 타이머 소수점 동기화 개선',
    '[2026.05.12] 레이아웃 최적화 및 우측 상단 고정 시계 도입',
    '[2026.05.12] 심야알리미 통합 네비게이션 및 메인 페이지 구축',
  ];

  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 5 }}>

      {/* 최근 업데이트 */}
      <Paper elevation={0} sx={{ ...cardBase, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#ffd54f', mb: 2 }}>
          📢 최근 업데이트
        </Typography>
        <Box sx={{ textAlign: 'left', display: 'inline-block', mb: 2 }}>
          {updates.map((text, idx) => (
            <Typography key={idx} variant="body2" sx={{ mb: 0.8, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              • {text}
            </Typography>
          ))}
        </Box>
        <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
          본 사이트는 '심야 잡화점' 유저가 제작한 비공식 웹사이트로,<br />
          유저 제보를 바탕으로 정보를 제공하며 일부 내용은 실제와 다를 수 있습니다.
        </Typography>
      </Paper>

      {/* 빠른 메뉴 */}
      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
          🚀 빠른 메뉴
        </Typography>
        <Grid container spacing={2}>
          {quickMenus.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.label}>
              <Paper
                onClick={() => item.path && navigate(item.path)}
                elevation={0}
                sx={{
                  ...cardBase,
                  textAlign: 'center',
                  cursor: item.active ? 'pointer' : 'default',
                  opacity: item.active ? 1 : 0.45,
                  transition: '0.25s',
                  ...(item.active && {
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      bgcolor: 'rgba(255,255,255,0.08)',
                      borderColor: 'rgba(126,184,247,0.4)',
                    }
                  })
                }}
              >
                <Typography sx={{ fontSize: '2rem', mb: 1 }}>{item.emoji}</Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>{item.label}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 계절 정보 */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <img src={seasonImages[serverTime.season]} style={{ width: 26, height: 26 }} alt={serverTime.season} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            {serverTime.season} 정보
          </Typography>
        </Box>
        <Paper elevation={0} sx={{ ...cardBase, p: 2.5 }}>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 2, color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            현재 계절 획득 가능 작물
          </Typography>
          <Grid container spacing={1}>
            {currentSeasonCrops.map(crop => (
              <Grid item xs={6} sm={4} md={3} key={crop.id}>
                <Box sx={{
                  p: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.03)',
                }}>
                  <img src={getCropImageUrl(crop.season, crop.name)} style={{ width: 22, height: 22 }} alt={crop.name} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.82rem' }}>{crop.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                      {crop.baseGrowthDays}일 소요
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {/* 공식 링크 */}
      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
          🔗 공식 링크
        </Typography>
        <Grid container spacing={1.5}>
          {links.map(link => (
            <Grid item xs={12} sm={4} key={link.label}>
              <Button
                variant="outlined"
                fullWidth
                href={link.url}
                target="_blank"
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  '&:hover': {
                    borderColor: 'rgba(126,184,247,0.6)',
                    color: '#7eb8f7',
                    bgcolor: 'rgba(126,184,247,0.06)',
                  }
                }}
              >
                {link.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;