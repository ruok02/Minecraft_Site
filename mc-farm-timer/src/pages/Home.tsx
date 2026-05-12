import React from 'react';
import { Box, Typography, Grid, Paper, Button, Divider, List, ListItem, ListItemText } from '@mui/material';
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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const serverTime = getServerTime();
  const currentSeasonCrops = CROPS.filter(c => c.season === serverTime.season && c.id !== 'test_crop');

  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* 📢 최근 업데이트 */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          bgcolor: 'rgba(255, 255, 255, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.3)',
          textAlign: 'center' 
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#ffeb3b' }}>
          📢 최근 업데이트
        </Typography>
        <Box sx={{ my: 2, textAlign: 'left', display: 'inline-block' }}>
          {[
            '[2026.05.12] 수확 및 물 주기 타이머 소수점 동기화 개선',
            '[2026.05.12] 레이아웃 최적화 및 우측 상단 고정 시계 도입',
            '[2026.05.12] 심야알리미 통합 네비게이션 및 메인 페이지 구축'
          ].map((text, idx) => (
            <Typography key={idx} variant="body1" sx={{ mb: 1, display: 'flex', gap: 1 }}>
              <span style={{ color: '#e0e0e0' }}>• {text.substring(0, 13)}</span>
              <span style={{ color: '#bdbdbd' }}>{text.substring(13)}</span>
            </Typography>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 2, color: '#9e9e9e' }}>
          본 사이트는 '심야 잡화점' 유저가 제작한 비공식 웹사이트로, <br />
          유저 제보를 바탕으로 정보를 제공하며 일부 내용은 실제와 다를 수 있습니다.
        </Typography>
      </Paper>

      {/* 🚀 빠른 메뉴 */}
      <Box>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#ffffff' }}>🚀 빠른 메뉴</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              onClick={() => navigate('/farming')}
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                cursor: 'pointer', 
                transition: '0.3s', 
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 16px rgba(0,0,0,0.4)', bgcolor: 'rgba(255, 255, 255, 0.1)' } 
              }}
            >
              <Typography variant="h3" sx={{ mb: 1 }}>🌱</Typography>
              <Typography variant="h6" fontWeight="bold">농사 타이머</Typography>
              <Typography variant="caption" sx={{ color: '#bdbdbd' }}>작물 성장 및 물 주기 관리</Typography>
            </Paper>
          </Grid>
          {['🐾 테이밍', '⚖️ 무역', '📦 주문'].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Paper 
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  opacity: 0.6, 
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff'
                }}
              >
                <Typography variant="h3" sx={{ mb: 1 }}>{item.split(' ')[0]}</Typography>
                <Typography variant="h6" fontWeight="bold">{item.split(' ')[1]}</Typography>
                <Typography variant="caption" sx={{ color: '#bdbdbd' }}>준비 중</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 🍂 계절 정보 요약 */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <img src={seasonImages[serverTime.season]} style={{ width: 32, height: 32 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#ffffff' }}>{serverTime.season} 정보</Typography>
        </Box>
        <Paper 
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff'
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, px: 1 }}>현재 계절 획득 가능 작물</Typography>
          <Grid container spacing={1}>
            {currentSeasonCrops.map(crop => (
              <Grid item xs={12} sm={6} md={4} key={crop.id}>
                <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 2 }}>
                  <img src={getCropImageUrl(crop.season, crop.name)} style={{ width: 24, height: 24 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{crop.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#bdbdbd' }}>{crop.baseGrowthDays}일 소요</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {/* 🔗 공식 링크 */}
      <Box>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#ffffff' }}>🔗 공식 링크</Typography>
        <Grid container spacing={2}>
          {[
            { label: '공식 디스코드', url: '#' },
            { label: '위키', url: '#' },
            { label: '마인리스트', url: '#' }
          ].map(link => (
            <Grid item xs={12} sm={4} key={link.label}>
              <Button 
                variant="outlined" 
                fullWidth 
                href={link.url} 
                target="_blank"
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2, 
                  fontWeight: 'bold', 
                  color: '#ffffff', 
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.1)' }
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