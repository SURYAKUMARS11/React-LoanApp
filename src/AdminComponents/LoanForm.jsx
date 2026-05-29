import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../apiConfig'; 
import AdminNavbar from './AdminNavbar';

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
  Avatar,
  IconButton
} from '@mui/material';
import {
  AccountBalanceOutlined,
  NotesOutlined,
  PercentOutlined,
  MonetizationOnOutlined,
  CheckCircleOutline,
  ArrowBack,
  PostAddOutlined,
  EditNoteOutlined
} from '@mui/icons-material';

const LoanForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isEdit = location.state?.isEdit || false;
  const editData = location.state?.loan || null;

  const [formData, setFormData] = useState({
    loanType: '',
    description: '',
    interestRate: '',
    maximumAmount: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        loanType: editData.loanType,
        description: editData.description,
        interestRate: editData.interestRate,
        maximumAmount: editData.maximumAmount
      });
    }
  }, [isEdit, editData]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        navigate('/admin/view-loan');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showModal, navigate]);

  /**
   * Updated: Now allows '.' (period) for decimal inputs
   */
  const handleNumericKeyDown = (e, allowDecimal = false) => {
    // Block e, +, - 
    const blockedKeys = ['e', 'E', '+', '-'];
    // If decimal is NOT allowed (for Max Amount), also block the period
    if (!allowDecimal && e.key === '.') {
      e.preventDefault();
    }
    if (blockedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "interestRate") {
      // Allow numbers and ONE decimal point
      finalValue = value.replace(/[^0-9.]/g, '');
      const parts = finalValue.split('.');
      if (parts.length > 2) {
        finalValue = parts[0] + '.' + parts.slice(1).join('');
      }
    } else if (name === "maximumAmount") {
      // Keep as whole number only
      finalValue = value.replace(/[^0-9]/g, '');
    }

    setFormData((prevState) => ({ ...prevState, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const newErrors = {};
    if (!formData.loanType.trim()) newErrors.loanType = 'Loan Type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Updated: Use parseFloat for interest rate validation
    if (!formData.interestRate || parseFloat(formData.interestRate) <= 0) {
        newErrors.interestRate = 'Valid Interest Rate is required';
    }
    if (!formData.maximumAmount || parseInt(formData.maximumAmount) <= 0) {
        newErrors.maximumAmount = 'Valid Maximum Amount is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        
        const payload = {
          ...formData,
          interestRate: parseFloat(formData.interestRate), // Save as decimal
          maximumAmount: parseInt(formData.maximumAmount) // Save as integer
        };

        if (isEdit) {
          await axios.put(`${API_BASE_URL}/loan/updateLoan/${editData._id}`, payload, config);
        } else {
          await axios.post(`${API_BASE_URL}/loan/addLoan`, payload, config);
        }

        setShowModal(true);
      } catch (error) {
        setApiError(error.response?.data?.message || "Operation failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f7fe' }}>
      <AdminNavbar />
    
      
      <Dialog 
        open={showModal} 
        PaperProps={{ sx: { borderRadius: '24px', p: 3, textAlign: 'center', maxWidth: '380px' } }}
      >
        <DialogContent>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 12 }}>
             <CheckCircleOutline sx={{ fontSize: 80, color: '#10b981', mb: 2 }} />
          </motion.div>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>
            Success!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Loan plan has been <strong>{isEdit ? "updated" : "created"}</strong>.
          </Typography>
          
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ color: '#64748b' }}>
            <CircularProgress size={16} color="inherit" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Redirecting to list...
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>

      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#fff', mr: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <ArrowBack fontSize="small" />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em' }}>
           <button type="submit" >Add Loan</button>
          </Typography>
        </Box>

        <Paper 
          elevation={0}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ borderRadius: '2rem', p: { xs: 3, md: 5 }, border: '1px solid #e2e8f0', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', width: 64, height: 64, mx: 'auto', mb: 2 }}>
              {isEdit ? <EditNoteOutlined fontSize="large" /> : <PostAddOutlined fontSize="large" />}
            </Avatar>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Management Console
            </Typography>
          </Box>

          {apiError && (
            <Box sx={{ bgcolor: '#fee2e2', color: '#ef4444', p: 2, borderRadius: '12px', mb: 4, textAlign: 'center', border: '1px solid #fecaca' }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{apiError}</Typography>
            </Box>
          )}

          <Stack component="form" onSubmit={handleSubmit} spacing={3}>
            <TextField
              fullWidth
              label="Loan Type"
              name="loanType"
              value={formData.loanType}
              onChange={handleChange}
              error={!!errors.loanType}
              helperText={errors.loanType}
              placeholder="e.g. Luxury Car Loan"
              InputProps={{ startAdornment: <InputAdornment position="start"><AccountBalanceOutlined sx={{ color: '#94a3b8' }} /></InputAdornment> }}
              sx={fieldStyles}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Detail the loan benefits..."
              InputProps={{ startAdornment: <InputAdornment position="start"><NotesOutlined sx={{ color: '#94a3b8', mt: -2 }} /></InputAdornment> }}
              sx={fieldStyles}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Interest Rate"
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                // allowDecimal = true passed here
                onKeyDown={(e) => handleNumericKeyDown(e, true)} 
                error={!!errors.interestRate}
                helperText={errors.interestRate}
                // step="any" allows the browser to accept decimals without warning
                inputProps={{ min: 0, step: "any", inputMode: 'decimal' }}
                InputProps={{ endAdornment: <InputAdornment position="end"><PercentOutlined sx={{ fontSize: 18 }} /></InputAdornment> }}
                sx={fieldStyles}
              />

              <TextField
                label="Max Amount"
                type="number"
                name="maximumAmount"
                value={formData.maximumAmount}
                onChange={handleChange}
                // allowDecimal = false passed here
                onKeyDown={(e) => handleNumericKeyDown(e, false)} 
                error={!!errors.maximumAmount}
                helperText={errors.maximumAmount}
                inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
                InputProps={{ startAdornment: <InputAdornment position="start"><MonetizationOnOutlined sx={{ fontSize: 18 }} /></InputAdornment> }}
                sx={fieldStyles}
              />
            </Box>

            <Box sx={{ pt: 2 }}>
              <Button
                fullWidth
                type="submit"
                disabled={isLoading || showModal}
                variant="contained"
                size="large"
                sx={{
                  py: 1.8, borderRadius: '14px', fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: '#2563eb',
                  boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.3)', '&:hover': { bgcolor: '#1d4ed8' }
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : isEdit ? "Save Changes" : "Publish Loan"}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
  },
  '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 500 },
};

export default LoanForm;