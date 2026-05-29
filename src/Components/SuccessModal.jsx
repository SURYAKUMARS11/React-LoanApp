import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Material UI Imports
import { 
  Dialog, 
  DialogContent, 
  Typography, 
  Button, 
  Box, 
  LinearProgress,
  Stack
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

const SuccessModal = ({ isOpen, title, message, onClose, btnText = "Continue", showButton = true }) => {
  return (
    <Dialog
      open={isOpen}
      // Disable closing by clicking backdrop if we are in redirect mode (no button)
      onClose={showButton ? onClose : null}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          padding: '16px',
          maxWidth: '400px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated Success Icon Container */}
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.1 
                  }}
                >
                  <Box sx={{ 
                    bgcolor: '#ecfdf5', 
                    color: '#10b981', 
                    p: 2, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    mx: 'auto'
                  }}>
                    <CheckCircleOutline sx={{ fontSize: 48 }} />
                  </Box>
                </motion.div>
                
                {/* Decorative ripple effect */}
                <Box 
                  component={motion.div}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  sx={{ 
                    position: 'absolute', 
                    inset: -10, 
                    border: '2px solid #10b981', 
                    borderRadius: '50%', 
                    zIndex: -1 
                  }} 
                />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1.5 }}>
                {title}
              </Typography>
              
              <Typography sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
                {message}
              </Typography>

              {/* REDIRECTING INDICATOR (Linear Progress) */}
              {!showButton && (
                <Stack spacing={2} alignItems="center">
                  <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Redirecting you shortly...
                  </Typography>
                  <Box sx={{ width: '100%', px: 4 }}>
                    <LinearProgress 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3, 
                        bgcolor: '#eff6ff',
                        '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#3b82f6' }
                      }} 
                    />
                  </Box>
                </Stack>
              )}

              {/* ACTION BUTTON */}
              {showButton && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={onClose}
                    sx={{
                      bgcolor: '#2563eb',
                      py: 1.8,
                      borderRadius: '14px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 700,
                      boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                      '&:hover': { bgcolor: '#1d4ed8' }
                    }}
                  >
                    {btnText}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;