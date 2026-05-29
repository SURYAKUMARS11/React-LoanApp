import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Material UI Icons
import { 
  CheckCircle, 
  DeleteSweep, 
  Close, 
  NotificationsActiveOutlined 
} from '@mui/icons-material';
import { Box, Typography, IconButton } from '@mui/material';

const Toast = ({ show, message, type = "success", onClose }) => {
  
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 100, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-6 right-6 z-[999] min-w-[320px] max-w-[400px]"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: `1px solid ${isSuccess ? '#d1fae5' : '#fee2e2'}`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Status Icon */}
            <Box
              sx={{
                flexShrink: 0,
                w: 44,
                h: 44,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                bgcolor: isSuccess ? '#ecfdf5' : '#fee2e2',
                color: isSuccess ? '#10b981' : '#ef4444',
                p: 1
              }}
            >
              {isSuccess ? <CheckCircle /> : <DeleteSweep />}
            </Box>

            {/* Text Content */}
            <Box sx={{ flex: 1, mr: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#1e293b', 
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                {isSuccess ? 'Success' : 'Notice'}
                <NotificationsActiveOutlined sx={{ fontSize: 14, opacity: 0.5 }} />
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ color: '#64748b', fontWeight: 500, display: 'block', mt: 0.5 }}
              >
                {message}
              </Typography>
            </Box>

            {/* Close IconButton */}
            <IconButton 
              size="small" 
              onClick={onClose}
              sx={{ 
                color: '#94a3b8',
                '&:hover': { color: '#1e293b', bgcolor: 'transparent' } 
              }}
            >
              <Close fontSize="small" />
            </IconButton>

            {/* Animated Progress Bar (Timer Visual) */}
            <Box
              component={motion.div}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: "linear" }}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                bgcolor: isSuccess ? '#10b981' : '#ef4444',
                opacity: 0.6
              }}
            />
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;