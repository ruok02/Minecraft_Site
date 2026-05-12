import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { getServerTime } from '../utils/calcTime';

const seasonImages: Record<string, string> = {
  '봄': new URL('../assets/season/Spring.png', import.meta.url).href,
  '여름': new URL('../assets/season/Summer.png', import.meta.url).href,
  '가을': new URL('../assets/season/Autumn.png', import.meta.url).href,
  '겨울': new URL('../assets/season/Winter.png', import.meta.url).href,
};

const Header: React.FC = () => {
  const location = useLocation();
  const [time, setTime] = React.useState(getServerTime());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(getServerTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { label: '농사', path: '/farming' },
    { label: '테이밍', path: '/taming' },
    { label: '무역', path: '/trading' },
    { label: '주문', path: '/order' },
  ];

  return (
    <AppBar position="fixed" color="inherit" elevation={1} sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 로고 */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: 'bold',
              textDecoration: 'none',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            심야알리미
          </Typography>

          {/* 메뉴 */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color={location.pathname === item.path ? 'primary' : 'inherit'}
                sx={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  fontSize: '1rem'
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* 서버 시간 위젯 */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: '6px 16px',
            borderRadius: '12px',
            bgcolor: 'rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            <img src={seasonImages[time.season]} alt={time.season} style={{ width: 24, height: 24, objectFit: 'contain' }} />
            <Typography sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              {time.season} {time.day}일 {time.hour}:{time.minute}
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;