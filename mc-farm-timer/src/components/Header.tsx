import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Container, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { ColorModeContext } from '../main';
import { getServerTime } from '../utils/calcTime';

const seasonImages: Record<string, string> = {
  '봄': new URL('../assets/season/Spring.png', import.meta.url).href,
  '여름': new URL('../assets/season/Summer.png', import.meta.url).href,
  '가을': new URL('../assets/season/Autumn.png', import.meta.url).href,
  '겨울': new URL('../assets/season/Winter.png', import.meta.url).href,
};

const menuItems = [
  { label: '농사', path: '/farming', emoji: '🌾' },
  { label: '테이밍', path: '/taming', emoji: '🐾' },
  { label: '무역', path: '/trading', emoji: '⚖️' },
  { label: '주문', path: '/order', emoji: '📦' },
];

const Header: React.FC = () => {
  const location = useLocation();
  const { toggle, isDark } = useContext(ColorModeContext);
  const [time, setTime] = React.useState(getServerTime());

  React.useEffect(() => {
    const t = setInterval(() => setTime(getServerTime()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <AppBar position="fixed" elevation={0} sx={{
      bgcolor: 'background.default', // ✅ 배경색과 동일
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
          <Typography component={Link} to="/" sx={{
            fontWeight: 'bold', textDecoration: 'none',
            color: 'primary.main', fontSize: '1.1rem',
          }}>
            심야알리미
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Button key={item.path} component={Link} to={item.path} sx={{
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 'bold' : 'normal',
                  fontSize: '0.88rem',
                  px: 1.5, borderRadius: 2,
                  bgcolor: isActive ? 'rgba(126,184,247,0.1)' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                  gap: 0.5,
                }}>
                  <span>{item.emoji}</span>{item.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 다크모드 토글 */}
            <IconButton onClick={toggle} size="small" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
              {isDark ? '☀️' : '🌙'}
            </IconButton>

            {/* 서버 시간 */}
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              px: 1.5, py: 0.6, borderRadius: 2,
              bgcolor: 'action.hover',
              border: '1px solid', borderColor: 'divider',
            }}>
              <img src={seasonImages[time.season]} alt={time.season} style={{ width: 20, height: 20, objectFit: 'contain' }} />
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.primary' }}>
                {time.season} {time.day}일 {time.hour}:{time.minute}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;