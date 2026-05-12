import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Farming from './pages/Farming';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ pt: 12, pb: 4, flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/farming" element={<Farming />} />
            <Route path="/taming" element={<Placeholder title="테이밍" />} />
            <Route path="/trading" element={<Placeholder title="무역" />} />
            <Route path="/order" element={<Placeholder title="주문" />} />
          </Routes>
        </Container>

        <Footer />
      </Box>
    </Router>
  );
}

const Placeholder = ({ title }: { title: string }) => (
  <Box sx={{ py: 10, textAlign: 'center' }}>
    <Typography variant="h3" fontWeight="bold" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h5" color="text.disabled">
      현재 기능을 준비 중입니다. 조만간 만나보실 수 있습니다!
    </Typography>
  </Box>
);

export default App;