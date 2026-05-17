import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{
      mt: 'auto',
      py: 4,
      borderTop: '1px solid rgba(255,255,255,0.08)',
      textAlign: 'center',
      bgcolor: 'transparent',
    }}>
      <Container maxWidth="lg">
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
          심야알리미는 심야잡화점 유저를 위한 비공식 공략 사이트입니다.
        </Typography>
        <Typography variant="caption" display="block" sx={{ mb: 2, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8, fontSize: '0.72rem' }}>
          사이트에 사용된 이미지 및 콘텐츠의 저작권은 원작자 '심야잡화점' 및 해당 권리자에게 있으며, <br />
          문제 발생 시 요청에 따라 즉시 수정 또는 삭제됩니다.
        </Typography>
        <br></br>
        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>
          © 2026 심야알리미 (Simya Alerter)
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;