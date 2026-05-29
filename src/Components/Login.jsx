import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

// Material UI Imports
import { 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton, 
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import { 
  EmailOutlined, 
  LockOutlined, 
  Visibility, 
  VisibilityOff, 
  DirectionsCarFilled 
} from '@mui/icons-material';

// 1. Import the Modal
import SuccessModal from './SuccessModal'; 

const Login = () => {
  const [apiError, setApiError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    mode: "onBlur"
  });

  useEffect(() => {
    localStorage.removeItem('role');  
    console.log("Login page loaded: LocalStorage cleared.");
  }, []);

  const onSubmit = async (data) => {
    // Logic preserved exactly as original
    if (!data.email || data.email.trim() === '') {
      setError('email', { message: 'Email is required' });
    }
    if (!data.password || data.password.trim() === '') {
      setError('password', { message: 'Password is required' });
    }
    
    if (!data.email || data.email.trim() === '' || !data.password || data.password.trim() === '') {
      return;
    }

    try {
      setApiError("");
      const response = await axios.post(`${API_BASE_URL}/user/login`, data, {
        withCredentials: true
      });

      if (response.status === 200) {
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('userId', response.data.id);

        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/home');
        }, 2000); 
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fe] flex items-center justify-center p-4 md:p-10 font-sans">
      
      <SuccessModal 
        isOpen={showSuccessModal} 
        title="Login Successful!" 
        message="Redirecting you to the home..."
        showButton={false}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-[1000px] flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.07)] min-h-[600px]"
      >

        {/* LEFT SIDE: BRANDING/VISUAL */}
        <div className="md:w-[45%] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e1b4b] p-12 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="flex items-center gap-2 mb-12"
            >
              <div className="bg-blue-500 p-2 rounded-lg">
                <DirectionsCarFilled fontSize="medium" />
              </div>
              <span className="text-xl font-bold tracking-tight italic">vehicle loan hub</span>
            </motion.div>

            <motion.h1
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Fueling Your <br/> <span className="text-blue-400">Ambitions.</span>
            </motion.h1>
            
            <motion.p
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-slate-400 text-lg font-light leading-relaxed max-w-xs">
              Secure financing and manage your vehicle assets with world-class precision.
            </motion.p>
          </div>

          <div className="relative z-10 pt-10 border-t border-white/10">
             <p className="text-sm text-slate-500 italic">"The first step to financial freedom starts here."</p>
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN FORM */}
        <div className="md:w-[55%] p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access your vault</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* EMAIL FIELD */}
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              placeholder="name@company.com"
              {...register("email", { 
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: errors.email ? '#ef4444' : '#64748b' }} />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyles}
            />

            {/* PASSWORD FIELD */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              placeholder="••••••••"
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: errors.password ? '#ef4444' : '#64748b' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={textFieldStyles}
            />

            {/* API ERROR DISPLAY */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-red-50 text-red-600 text-xs font-semibold p-4 rounded-xl flex items-center gap-2 border border-red-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOGIN BUTTON */}
            <div className="pt-2">
              <Button
                component={motion.button}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                fullWidth
                disabled={isSubmitting}
                variant="contained"
                size="large"
                sx={{
                  py: 1.8,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 700,
                  backgroundColor: '#2563eb',
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                    boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)',
                  },
                  '&:disabled': {
                    backgroundColor: '#cbd5e1'
                  }
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>

            <Typography variant="body2" align="center" sx={{ mt: 4, color: '#64748b', fontWeight: 500 }}>
              New to the platform? {' '}
              <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-800 transition-colors underline-offset-4 hover:underline">
                Create an Account
              </Link>
            </Typography>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Custom Styles for MUI TextFields to match the UI
const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
  },
  '& .MuiInputLabel-root': { color: '#64748b' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
};

export default Login;