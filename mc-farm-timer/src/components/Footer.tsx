import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ mt: 'auto', py: 6, borderTop: '1px solid #eee', textAlign: 'center' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
          심야알리미는 심야잡화점 유저를 위한 비공식 공략 사이트입니다.
        </Typography>
        <Typography variant="caption" color="text.disabled" display="block" sx={{ mb: 2 }}>
          사이트에 사용된 이미지 및 콘텐츠의 저작권은 원작자 '심야잡화점' 및 해당 권리자에게 있으며, <br />
          문제 발생 시 요청에 따라 즉시 수정 또는 삭제됩니다.
        </Typography>
        <Divider sx={{ mb: 2, opacity: 0.5 }} />
        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 'bold' }}>
          © 2026 심야알리미 (Simya Alerter)
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;