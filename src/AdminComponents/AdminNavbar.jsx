import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  Stack
} from '@mui/material';
import {
  AdminPanelSettings,
  DirectionsCarFilled,
  HomeOutlined,
  ExpandMore,
  AddCircleOutline,
  VisibilityOutlined,
  RequestQuoteOutlined,
  LogoutOutlined,
  ShieldOutlined
} from '@mui/icons-material';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState('Admin');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // MUI Menu State for Loan Dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const openLoanMenu = Boolean(anchorEl);

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) setAdminName(storedName);
  }, []);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(`${API_BASE_URL}/user/logout`);
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Helper for navigation styling
  const navButtonStyle = (path) => ({
    color: location.pathname === path ? '#60a5fa' : '#cbd5e1',
    textTransform: 'none',
    fontWeight: location.pathname === path ? 700 : 500,
    fontSize: '0.9rem',
    gap: 1,
    '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
  });

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
          
          {/* BRAND LOGO */}
          <Box 
            component={Link} 
            to="/home" 
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
          >
            <Avatar sx={{ bgcolor: '#2563eb', width: 40, height: 40 }}>
              <DirectionsCarFilled />
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                display: { xs: 'none', lg: 'block' }
              }}
            >
              vehicle loan hub <Box component="span" sx={{ color: '#4fb6ac', fontSize: '0.7rem', ml: 0.5 }}>ADMIN</Box>
            </Typography>
          </Box>

          {/* CENTER NAVIGATION */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button component={Link} to="/home" sx={navButtonStyle('/home')} startIcon={<HomeOutlined />}>
              Home
            </Button>

            {/* LOAN DROPDOWN */}
            <Button
              onClick={handleOpenMenu}
              endIcon={<ExpandMore sx={{ transform: openLoanMenu ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />}
              sx={navButtonStyle('')}
              startIcon={<ShieldOutlined />}
            >
              Loan Management
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openLoanMenu}
              onClose={handleCloseMenu}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  bgcolor: '#fff',
                  border: '1px solid #e2e8f0'
                }
              }}
            >
              
              <MenuItem onClick={handleCloseMenu} component={Link} to="/admin/add-loan" sx={{ py: 1.5, gap: 1.5, fontWeight: 600, color: '#475569' }}>
                <AddCircleOutline fontSize="small" /> Add Loan
              </MenuItem>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/admin/view-loan" sx={{ py: 1.5, gap: 1.5, fontWeight: 600, color: '#475569' }}>
                <VisibilityOutlined fontSize="small" /> View Loans
              </MenuItem>
            </Menu>

            <Button component={Link} to="/admin/requested-loans" sx={navButtonStyle('/admin/requested-loans')} startIcon={<RequestQuoteOutlined />}>
            Loans Requested
            </Button>
          </Box>
          

          {/* RIGHT SIDE ACTIONS */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              avatar={<Avatar sx={{ bgcolor: '#1e293b !important' }}><AdminPanelSettings sx={{ color: '#ffd700' }} /></Avatar>}
              label={`${adminName} / admin`}
              variant="outlined"
              sx={{
                color: '#ffd700',
                borderColor: 'rgba(255,215,0,0.3)',
                fontWeight: 700,
                display: { xs: 'none', sm: 'flex' },
                bgcolor: 'rgba(255,215,0,0.05)'
              }}
            />

            <Tooltip title="Log Out">
              <IconButton 
                onClick={() => setShowLogoutModal(true)} 
                sx={{ 
                  bgcolor: '#ef4444', 
                  color: '#fff', 
                  borderRadius: '10px',
                  '&:hover': { bgcolor: '#dc2626' }
                }}
              >
                <LogoutOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- LOGOUT DIALOG --- */}
      <Dialog
        open={showLogoutModal}
        onClose={() => !isLoggingOut && setShowLogoutModal(false)}
        PaperProps={{ sx: { borderRadius: '20px', p: 1, maxWidth: '400px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 900, color: '#1e293b' }}>
          Confirm Admin Logout
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography color="text.secondary">
            Are you sure you want to end your administrative session?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button onClick={() => setShowLogoutModal(false)} disabled={isLoggingOut} sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            sx={{ borderRadius: '10px', px: 4, fontWeight: 700, textTransform: 'none', bgcolor: '#ef4444' }}
          >
            {isLoggingOut ? <CircularProgress size={20} color="inherit" /> : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminNavbar;