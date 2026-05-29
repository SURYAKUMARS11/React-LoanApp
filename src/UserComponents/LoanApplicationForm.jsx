import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import UserNavbar from './UserNavbar';

// Material UI Imports
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogContent,
  Stack,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  AttachMoney,
  CalendarMonth,
  HomeWorkOutlined,
  CloudUploadOutlined,
  ArrowBackIosNew,
  CheckCircleOutline,
  DirectionsCarFilled,
  InfoOutlined
} from '@mui/icons-material';

const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const selectedLoanType = location.state?.loanType || "General Vehicle Loan";

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    mode: "onChange"
  });
  
  const selectedFile = watch("file");

  // Prevent invalid characters in number fields
  const blockInvalidChar = (e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();

  // Get today's date in YYYY-MM-DD format for the 'max' attribute
  const todayDateStr = new Date().toISOString().split("T")[0];

  const onSubmit = async (data) => {
    try {
      setApiError("");
      const formData = new FormData();
      formData.append("userId", localStorage.getItem('userId') || "");
      formData.append("userName", localStorage.getItem('username') || "");
      formData.append("loanType", selectedLoanType);
      formData.append("income", data.income);
      formData.append("model", data.model);
      formData.append("purchasePrice", data.purchasePrice);
      formData.append("address", data.address);
      formData.append("loanStatus", 0); 
      formData.append("submissionDate", new Date().toISOString());
      
      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]); 
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/loanApplication/addLoanApplication`, 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => navigate('/user/applied-loan'), 2000); 
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed to submit.");
    }
  };
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f7fe' }}>
      <UserNavbar /> 
      Loan Application Form
      <Dialog 
        open={showSuccess} 
        PaperProps={{ sx: { borderRadius: '24px', p: 3, textAlign: 'center', maxWidth: '400px' } }}
      >
        <DialogContent>
          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
             <CheckCircleOutline sx={{ fontSize: 80, color: '#10b981', mb: 2 }} />
          </motion.div>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>Application Sent!</Typography>
          <Typography color="text.secondary">
            Your application for <strong>{selectedLoanType}</strong> has been received.
          </Typography>
        </DialogContent>
      </Dialog>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Button 
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIosNew sx={{ fontSize: '14px !important' }} />}
          sx={{ color: '#64748b', mb: 3, fontWeight: 700, textTransform: 'none' }}
        >
          Return to Loans
        </Button>

        <Paper 
          elevation={0}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ 
            borderRadius: '2rem', 
            overflow: 'hidden', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0'
          }}
        >
          <Box sx={{ p: 4, bgcolor: '#1e293b', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#3b82f6', width: 56, height: 56 }}>
                <DirectionsCarFilled sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>Loan Application</Typography>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Plan: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{selectedLoanType}</span>
                </Typography>
              </Box>
            </Stack>
            <InfoOutlined sx={{ color: '#94a3b8', display: { xs: 'none', sm: 'block' } }} />
          </Box>
          Model is required

          Purchase Price is required

          Address is required
          Proof is required

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: { xs: 3, md: 6 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              
              {/* INCOME */}
              <TextField
                fullWidth
                label="Monthly Income"
                type="number"
                onKeyDown={blockInvalidChar}
                {...register("income", { 
                  required: "Income is required",
                  min: { value: 10000, message: "Minimum income must be 10,000" }
                })}
                error={!!errors.income}
                helperText={errors.income?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment> }}
                sx={fieldStyles}
              />

              {/* MODEL DATE - VALIDATION FOR FUTURE DATE & MIN 2015 */}
              <TextField
                fullWidth
                label="Vehicle Model Date"
                type="date"
                inputProps={{ max: todayDateStr }} // Native UI restriction
                InputLabelProps={{ shrink: true }}
                {...register("model", { 
                  required: "Model is required",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    if (selectedDate.getFullYear() < 2015) return "Model year must be 2015 or later";
                    if (selectedDate > today) return "Model date cannot be in the future";
                    return true;
                  }
                })}
                error={!!errors.model}
                helperText={errors.model?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonth /></InputAdornment> }}
                sx={fieldStyles}
              />

              {/* PURCHASE PRICE */}
              <TextField
                fullWidth
                label="Purchase Price"
                type="number"
                onKeyDown={blockInvalidChar}
                {...register("purchasePrice", { 
                  required: "Purchase Price is required",
                  min: { value: 500, message: "Minimum price must be 500" }
                })}
                error={!!errors.purchasePrice}
                helperText={errors.purchasePrice?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment> }}
                sx={fieldStyles}
              />

              {/* FILE UPLOAD */}
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadOutlined />}
                  sx={{
                    height: '56px',
                    borderRadius: '12px',
                    textTransform: 'none',
                    border: errors.file ? '1.5px solid #d32f2f' : '1.5px solid #e2e8f0',
                    color: selectedFile?.[0] ? '#1e293b' : '#64748b',
                    fontWeight: 600,
                    bgcolor: '#f8fafc',
                    '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' }
                  }}
                >
                  <Typography noWrap sx={{ fontSize: '0.875rem', px: 1 }}>
                    {selectedFile?.[0] ? selectedFile[0].name : "Upload Identity Proof"}
                  </Typography>
                  <input 
                    type="file" 
                    hidden 
                    accept=".jpg, .jpeg, .png" 
                    {...register("file", { 
                        required: "Proof file is required",
                        validate: {
                            lessThan2MB: (files) => files[0]?.size < 2000000 || "Max size 2MB",
                            acceptedFormats: (files) => ['image/jpeg', 'image/png', 'image/jpg'].includes(files[0]?.type) || "Only JPG/PNG allowed"
                        }
                    })} 
                  />
                </Button>
                {errors.file && <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.5, ml: 1.5 }}>{errors.file.message}</Typography>}
              </Box>

              {/* ADDRESS */}
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Current Residential Address"
                  placeholder="Street, City, Zip Code"
                  {...register("address", { 
                    required: "Address is required",
                    minLength: { value: 10, message: "Address is too short" },
                    validate: (value) => {
                        const hasLettersOrNumbers = /[a-zA-Z0-9]/.test(value);
                        if (!hasLettersOrNumbers) return "Please enter a valid residential address";
                        return true;
                    }
                  })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  InputProps={{ startAdornment: <InputAdornment position="start"><HomeWorkOutlined sx={{ mt: -4 }} /></InputAdornment> }}
                  sx={fieldStyles}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 6 }}>
              {apiError && <Typography align="center" sx={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 700, mb: 3 }}>{apiError}</Typography>}
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting || showSuccess}
                variant="contained"
                size="large"
                sx={{
                  py: 2,
                  borderRadius: '14px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  textTransform: 'none',
                  bgcolor: '#2563eb',
                  boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)',
                  '&:hover': { bgcolor: '#1d4ed8', transform: 'translateY(-2px)' },
                  transition: 'all 0.2s'
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit Application"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
  },
  '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 500 },
};

export default LoanApplicationForm;