import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  Button,
  Grid,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  Speed,
  VerifiedUserOutlined,
  AccountBalanceWalletOutlined,
  ArrowForward,
  TrendingUp,
  Security,
  FlashOn,
  Stars,
  FormatQuote,
  AssignmentOutlined,
  FactCheckOutlined,
  DirectionsCarFilledOutlined,
  CheckCircleRounded,
  HeadsetMic,
  Email
} from '@mui/icons-material';

import AdminNavbar from '../AdminComponents/AdminNavbar';
import UserNavbar from '../UserComponents/UserNavbar';

const HomePage = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#FFFFFF' }}>

      {/* NAVBAR */}
      <Box sx={{ zIndex: 1000, borderBottom: '1px solid #F1F5F9' }}>
        {role === 'admin' ? <AdminNavbar /> : <UserNavbar />}
      </Box>

      {/* 1. HERO SECTION */}
      <Box sx={{
        pt: { xs: 6, md: 10 },
        pb: { xs: 10, md: 12 },
        background: 'radial-gradient(circle at 90% 10%, #eff6ff 0%, transparent 40%)'
      }}>
        <Container maxWidth="lg" component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div variants={fadeInUp}>
                <Chip
                  label="New: 4.5% APR Fixed Rates"
                  icon={<TrendingUp fontSize="small" />}
                  sx={{ mb: 3, fontWeight: 700, bgcolor: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE' }}
                />
                <Typography variant="h1" sx={{
                  fontSize: { xs: '2.5rem', md: '3.8rem' },
                  fontWeight: 850, color: '#0F172A', lineHeight: 1.1, mb: 3
                }}>
                  The smarter way to <br />
                  <Box component="span" sx={{ color: '#2563EB' }}>finance your vehicle.</Box>
                </Typography>
                <Typography sx={{ color: '#475569', fontSize: '1.1rem', mb: 4, maxWidth: '540px' }}>
                  Join 10,000+ drivers who secured flexible, low-interest loans with zero hidden fees.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      console.log(role);
                      if (role === 'admin') {
                        navigate('/admin/view-loan'); // Or whatever your admin path is
                      } else {
                        navigate('/user/viewAllLoans');
                      }
                    }}
                    endIcon={<ArrowForward />}
                    sx={{ px: 4, py: 1.5, borderRadius: '12px', textTransform: 'none', fontWeight: 700, bgcolor: '#2563EB' }}
                  >
                    View Plans
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => scrollToSection('how-it-works')}
                    sx={{ px: 4, py: 1.5, borderRadius: '12px', textTransform: 'none', fontWeight: 700, color: '#0F172A', borderColor: '#E2E8F0' }}
                  >
                    How it works
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            {/* REDUCED IMAGE SECTION */}
            <Grid item xs={12} md={5}>
              <motion.div variants={fadeInUp}>
                <Box sx={{ position: 'relative', maxWidth: '420px', ml: 'auto', mr: { xs: 'auto', md: 0 } }}>
                  {/* Small Floating Card Top */}
                  <Paper sx={{
                    position: 'absolute', top: 20, left: -30, p: 1.5, borderRadius: '12px', zIndex: 10,
                    display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}>
                    <Avatar sx={{ bgcolor: '#DCFCE7', color: '#166534', width: 32, height: 32 }}><FlashOn sx={{ fontSize: 18 }} /></Avatar>
                    <Typography variant="caption" fontWeight={800}>Fast Approval</Typography>
                  </Paper>

                  {/* Main Image */}
                  <Paper elevation={0} sx={{
                    borderRadius: '24px', overflow: 'hidden', border: '6px solid #F8FAFC',
                    boxShadow: '0 30px 60px -12px rgba(0,0,0,0.15)'
                  }}>
                    <Box component="img" src="/loancoverimage.jpg" sx={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} />
                  </Paper>

                  {/* OVERLAY STATS CARD (Bottom of Image) */}
                  <Paper sx={{
                    position: 'absolute', bottom: -25, left: '50%', transform: 'translateX(-50%)',
                    width: '90%', p: 2, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)', zIndex: 11
                  }}>
                    <Stack direction="row" justifyContent="space-around" divider={<Divider orientation="vertical" flexItem />}>
                      <Box textAlign="center">
                        <Typography variant="subtitle2" fontWeight={800} color="#2563EB">4.9/5</Typography>
                        <Typography variant="caption" color="text.secondary">Rating</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="subtitle2" fontWeight={800} color="#2563EB">10k+</Typography>
                        <Typography variant="caption" color="text.secondary">Users</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="subtitle2" fontWeight={800} color="#2563EB">24h</Typography>
                        <Typography variant="caption" color="text.secondary">Funding</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. HOW IT WORKS */}
      <Box id="how-it-works" sx={{ py: 12, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="overline" sx={{ color: '#2563EB', fontWeight: 800, letterSpacing: 2 }}>The Process</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: '#0F172A' }}>Three simple steps to ownership.</Typography>
          </Box>
          <Grid container spacing={4}>
            <StepItem
              number="01"
              icon={<AssignmentOutlined sx={{ fontSize: 40 }} />}
              title="Apply Online"
              desc="Fill out our 2-minute application form with your basic details."
            />
            <StepItem
              number="02"
              icon={<FactCheckOutlined sx={{ fontSize: 40 }} />}
              title="Instant Verification"
              desc="Our system verifies your data and gives a decision within hours."
            />
            <StepItem
              number="03"
              icon={<DirectionsCarFilledOutlined sx={{ fontSize: 40 }} />}
              title="Get Funded"
              desc="Funds are transferred directly so you can drive away today."
            />
          </Grid>
        </Container>
      </Box>
      <Box sx={{ bgcolor: '#0F172A', py: 12, color: '#FFFFFF' }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ bgcolor: 'transparent', textAlign: 'center', color: 'inherit' }}>
            <FormatQuote sx={{ fontSize: 60, color: '#2563EB', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 500, fontStyle: 'italic', lineHeight: 1.5, mb: 4 }}>
              "Applying for a vehicle loan is now easier than ever. Our platform offers a seamless
              application process, competitive rates, and quick approval."
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <Avatar sx={{ bgcolor: '#2563EB' }}>V</Avatar>
              <Box textAlign="left">
                <Typography variant="subtitle2" fontWeight={800}>vehicle loan hub Team</Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Premier Financing Partner</Typography>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 8, borderTop: '1px solid #E2E8F0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={900} color="#0F172A" sx={{ mb: 2 }}>vehicle loan hub</Typography>
              <Typography variant="body2" color="text.secondary">
                Your reliable partner in premium vehicle financing. Making the journey to ownership faster and more secure.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="flex-end">
                <Box>
                  <Typography variant="caption" fontWeight={800} sx={{ color: '#94A3B8', textTransform: 'uppercase', mb: 1, display: 'block' }}>Email Us</Typography>
                  <Typography variant="body2" fontWeight={600}>support@vehicle loan hub.com</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight={800} sx={{ color: '#94A3B8', textTransform: 'uppercase', mb: 1, display: 'block' }}>Call Support</Typography>
                  <Typography variant="body2" fontWeight={600}>+1 123-456-7890</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="caption" sx={{ mt: 8, display: 'block', color: '#94A3B8', textAlign: 'center' }}>
            © {new Date().getFullYear()} vehicle loan hub. Designed for the road ahead.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

const StepItem = ({ number, title, desc }) => (
  <Grid item xs={12} md={4}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 2 }}>
      <Typography variant="h3" fontWeight={900} color="#E2E8F0">{number}</Typography>
      <Box>
        <Typography variant="subtitle1" fontWeight={800}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{desc}</Typography>
      </Box>
    </Stack>
  </Grid>
);

<footer>
  <h3>Contact Us</h3>
  <p>Email: support@vehicleloanhub.com</p>
</footer>

export default HomePage;