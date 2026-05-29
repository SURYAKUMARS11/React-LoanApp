import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../apiConfig';

// Material UI Imports
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  DirectionsCarFilled,
  HomeOutlined,
  DirectionsCarOutlined,
  PlaylistAddCheckOutlined,
  LogoutOutlined,
  AccountCircleOutlined,
  DarkModeOutlined,
  LightModeOutlined
} from '@mui/icons-material';

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Theme State
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Apply theme to body
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'user';

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(`${API_BASE_URL}/user/logout`);
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
      localStorage.clear();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const NavItem = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Button
        component={Link}
        to={to}
        startIcon={<Icon />}
        sx={{
          color: isActive ? '#60a5fa' : '#cbd5e1',
          textTransform: 'none',
          fontSize: '0.9rem',
          fontWeight: isActive ? 700 : 500,
          px: 2,
          borderRadius: '10px',
          transition: 'all 0.3s',
          '&:hover': {
            color: '#fff',
            backgroundColor: 'rgba(255,255,255,0.05)',
          },
        }}
      >
        {label}
      </Button>
    );
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          backgroundColor: '#0f172a', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          zIndex: 40
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 8 }, height: '72px' }}>
          
          <Box component={Link} to="/home" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}>
            <Avatar sx={{ bgcolor: '#2563eb', width: 40, height: 40 }}>
              <DirectionsCarFilled />
            </Avatar>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 900, textTransform: 'uppercase', display: { xs: 'none', sm: 'block' } }}>
              vehicle loan hub
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <NavItem to="/home" label="Home" icon={HomeOutlined} />
            <NavItem to="/user/viewAllLoans" label="Loans" icon={DirectionsCarOutlined} />
            <NavItem to="/user/applied-loan" label="My Applications" icon={PlaylistAddCheckOutlined} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            
            {/* --- THEME TOGGLE BUTTON --- */}
            {/* <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton 
                onClick={() => setIsDark(!isDark)}
                sx={{ 
                  color: isDark ? '#fbbf24' : '#94a3b8',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ y: -10, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 10, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex' }}
                  >
                    {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
                  </motion.div>
                </AnimatePresence>
              </IconButton>
            </Tooltip> */}

            <Chip
              avatar={<Avatar sx={{ bgcolor: '#1e293b !important' }}><AccountCircleOutlined sx={{ color: '#60a5fa' }} /></Avatar>}
              label={`${username}`}
              variant="outlined"
              sx={{
                color: '#e2e8f0',
                borderColor: 'rgba(255,255,255,0.1)',
                fontWeight: 600,
                display: { xs: 'none', lg: 'flex' }
              }}
            />

            <Button
              variant="contained"
              onClick={() => setShowConfirm(true)}
              startIcon={<LogoutOutlined />}
              sx={{
                bgcolor: '#ef4444',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '10px',
                px: 2,
                '&:hover': { bgcolor: '#dc2626' },
                display: { xs: 'none', sm: 'flex' }
              }}
            >
          
            </Button>
            
            {/* Mobile Logout Icon only */}
            <IconButton 
              onClick={() => setShowConfirm(true)} 
              sx={{ display: { xs: 'flex', sm: 'none' }, color: '#ef4444' }}
            >
              <LogoutOutlined />
            </IconButton>

          </Box>
        </Toolbar>
      </AppBar>
    
      {/* --- LOGOUT DIALOG --- */}
      <Dialog
        open={showConfirm}
        onClose={() => !isLoggingOut && setShowConfirm(false)}
        PaperProps={{ sx: { borderRadius: '20px', p: 1, maxWidth: '400px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800 }}>Confirm Logout</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography color="text.secondary">Are you sure you want to log out of vehicle loan hub?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button onClick={() => setShowConfirm(false)} sx={{ color: '#64748b', fontWeight: 700 }}>Cancel</Button>
          <Button
            onClick={confirmLogout}
            disabled={isLoggingOut}
            variant="contained"
            sx={{ bgcolor: '#ef4444', borderRadius: '10px', px: 4, '&:hover': { bgcolor: '#dc2626' } }}
          >
            {isLoggingOut ? <CircularProgress size={20} color="inherit" /> : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserNavbar;