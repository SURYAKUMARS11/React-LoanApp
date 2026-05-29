import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig'; 
import SuccessModal from './SuccessModal';

// Material UI Imports
import { 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton, 
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { 
  EmailOutlined, 
  LockOutlined, 
  Visibility, 
  VisibilityOff, 
  DirectionsCarFilled,
  PersonOutline,
  PhoneAndroidOutlined,
  BadgeOutlined
} from '@mui/icons-material';

const Signup = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm({
    mode: "onBlur"
  });

  const onSubmit = async (data) => {
    // Manual validation logic preserved exactly for tests
    if (!data.userName) setError('userName', { message: 'User Name is required' });
    if (!data.email) setError('email', { message: 'Email is required' });
    if (!data.mobile) setError('mobile', { message: 'Mobile Number is required' });
    if (!data.password) setError('password', { message: 'Password is required' });
    if (!data.confirmPassword) setError('confirmPassword', { message: 'Confirm Password is required' });
    
    if (!data.userName || !data.email || !data.mobile || !data.password || !data.confirmPassword) return;
    
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    try {
      setApiError("");
      const payload = {
        userName: data.userName,
        email: data.email,
        mobile: data.mobile,
        password: data.password.trim(),
        role: data.role 
      };

      const response = await axios.post(`${API_BASE_URL}/user/signup`, payload);
      
      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000); 
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fe] flex items-center justify-center p-4 md:p-8 font-sans">
      
      <SuccessModal
        isOpen={showSuccess}
        title="Success!"
        message="User Registration is Successful! Redirecting to login..."
        showButton={false}
        onClose={() => navigate('/login')} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-[1000px] flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.07)]"
      >
        
        {/* LEFT SIDE: BRANDING */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e1b4b] p-10 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="flex items-center gap-2 mb-12"
            >
              <div className="bg-blue-500 p-2 rounded-lg">
                <DirectionsCarFilled fontSize="medium" />
              </div>
              <span className="text-xl font-bold tracking-tight italic">vehicle loan hub Hub Hub</span>
            </motion.div>

            <motion.h1 
               initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
               className="text-4xl font-extrabold mb-4 leading-tight">Start Your <br/><span className="text-blue-400">Journey.</span></motion.h1>
            <motion.p 
               initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}
               className="text-slate-400 text-lg font-light">Join thousands of users managing their assets securely.</motion.p>
          </div>

          <div className="relative z-10 pt-10 border-t border-white/10 mt-10 md:mt-0">
             <p className="text-sm text-slate-500 italic">"Security is not a product, but a process."</p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
            <p className="text-slate-500 mt-2">Fill in the details to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* USER NAME */}
            <div className="md:col-span-2">
              <TextField
                fullWidth
                label="Full Name"
                placeholder="John Doe"
                {...register("userName", { required: "User Name is required" })}
                error={!!errors.userName}
                helperText={errors.userName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </div>

            {/* EMAIL */}
            <div className="md:col-span-1">
              <TextField
                fullWidth
                label="Email Address"
                placeholder="mail@example.com"
                {...register("email", { 
                  required: "Email is required", 
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </div>

            {/* MOBILE */}
            <div className="md:col-span-1">
              <TextField
                fullWidth
                label="Mobile Number"
                placeholder="10-digit number"
                {...register("mobile", { 
                  required: "Mobile Number is required", 
                  pattern: { value: /^\d{10}$/, message: "Must be 10 digits" }
                })}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroidOutlined sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </div>

            {/* PASSWORD */}
            <div className="md:col-span-1">
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                {...register("password", { 
                  required: "Password is required", minLength: { value: 6, message: "Min 6 chars" } 
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="md:col-span-1">
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Confirm Password"
                placeholder="••••••••"
                {...register("confirmPassword", { 
                  required: "Confirm Password is required", validate: v => v === watch('password') || "Passwords do not match"
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
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
            </div>

            {/* ROLE */}
            <div className="md:col-span-2">
              <FormControl fullWidth sx={textFieldStyles} error={!!errors.role}>
                <InputLabel>Register as</InputLabel>
                <Select
                  label="Register as"
                  defaultValue="user"
                  {...register("role", { required: "Select a role" })}
                  startAdornment={
                    <InputAdornment position="start">
                      <BadgeOutlined sx={{ color: '#64748b', ml: 1, mr: -0.5 }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
              </FormControl>
            </div>

            <div className="md:col-span-2 pt-4">
              <AnimatePresence>
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-red-50 text-red-600 text-xs font-semibold p-4 rounded-xl flex items-center gap-2 border border-red-100 mb-4"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    {apiError}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Button
                component={motion.button}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                fullWidth
                disabled={isSubmitting}
                variant="contained"
                size="large"
                onClick={() => {
                   // Manual error triggers preserved for your tests
                   const fields = ["userName", "email", "mobile", "password", "confirmPassword"];
                   fields.forEach(field => {
                     const val = watch(field);
                     if (!val || !val.trim()) setError(field, { message: `${field} is required` });
                   });
                }}
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
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
              </Button>
              
              <Typography variant="body2" align="center" sx={{ mt: 4, color: '#64748b', fontWeight: 500 }}>
                Already have an account? {' '}
                <Link to="/login" className="text-blue-600 font-bold hover:text-blue-800 transition-colors underline-offset-4 hover:underline">
                  Sign In
                </Link>
              </Typography>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Styles for MUI Inputs
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

export default Signup;