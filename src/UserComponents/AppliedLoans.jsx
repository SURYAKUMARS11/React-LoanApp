import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../apiConfig';
import UserNavbar from './UserNavbar';
import Toast from '../Components/Toast';

// Material UI Imports
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Skeleton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Search,
  CalendarToday,
  DeleteOutline,
  ErrorOutline,
  DirectionsCarOutlined
} from '@mui/icons-material';

const AppliedLoans = () => {
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pivot Table Sorting State
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('submissionDate');

  // Deletion States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Pagination States (MUI uses 0-based indexing for page)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'test' && userId) {
      fetchUserLoans();
    } else {
      setLoading(false);
    }
  }, [userId, fetchUserLoans]);

  const fetchUserLoans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/loanApplication/getLoanApplicationsByUserId/${userId}`);
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching applied loans:", error);
    } finally {
      setTimeout(() => setLoading(false), 800); // Smooth skeleton transition
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const confirmDelete = async () => {
    setIsDeleting(true); 
    try {
      await axios.delete(`${API_BASE_URL}/loanApplication/deleteLoanApplication/${loanToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(loans.filter(loan => loan._id !== loanToDelete));
      setShowDeleteModal(false);
      setLoanToDelete(null);
      setToast({ show: true, message: "Application removed successfully.", type: "error" });
    } catch (error) {
      setToast({ show: true, message: "Failed to delete application.", type: "error" });
    } finally {
      setIsDeleting(false); 
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 0: return { label: "Pending", color: "#f59e0b", bg: "#fef3c7" };
      case 1: return { label: "Approved", color: "#10b981", bg: "#d1fae5" };
      case 2: return { label: "Rejected", color: "#ef4444", bg: "#fee2e2" };
      default: return { label: "Unknown", color: "#64748b", bg: "#f1f5f9" };
    }
  };

  // --- Filter & Sort Logic ---
  const filteredLoans = loans.filter(loan => 
    loan.loanType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedLoans = filteredLoans.sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'submissionDate') {
      return isAsc 
        ? new Date(a.submissionDate) - new Date(b.submissionDate)
        : new Date(b.submissionDate) - new Date(a.submissionDate);
    }
    return isAsc 
      ? a.loanType.localeCompare(b.loanType)
      : b.loanType.localeCompare(a.loanType);
  });

  const paginatedLoans = sortedLoans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Skeleton Row Component
  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton variant="text" width="50%" height={30} /></TableCell>
      <TableCell><Skeleton variant="text" width="40%" height={30} /></TableCell>
      <TableCell><Skeleton variant="rounded" width={80} height={30} /></TableCell>
      <TableCell align="center"><Skeleton variant="rounded" width={100} height={40} /></TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f7fe' }}>
      <UserNavbar /> 
      Applied Loans
      <Toast
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* HEADER SECTION */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em', mb: 1 }}>
              Applied Loans
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Track the status of your vehicle financing applications
            </Typography>
          </motion.div>
        </Box>

        {/* CONTROLS AREA */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Search by loan type..."
            variant="outlined"
            size="small"
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            sx={{ width: { xs: '100%', sm: 300 }, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f8fafc' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94a3b8' }} /></InputAdornment>,
            }}
          />
          <Chip label={`${filteredLoans.length} Applications`} variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px' }} />
        </Paper>

        {/* PIVOT TABLE CONTAINER */}
        <TableContainer 
          component={Paper} 
          elevation={0} 
          sx={{ borderRadius: '1.5rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
        >
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={headerStyle}>
                  <TableSortLabel
                    active={orderBy === 'loanType'}
                    direction={orderBy === 'loanType' ? order : 'asc'}
                    onClick={() => handleRequestSort('loanType')}
                  >
                    Loan Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={headerStyle}>
                  <TableSortLabel
                    active={orderBy === 'submissionDate'}
                    direction={orderBy === 'submissionDate' ? order : 'asc'}
                    onClick={() => handleRequestSort('submissionDate')}
                  >
                    Submission Date
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={headerStyle}>Status</TableCell>
                <TableCell align="center" sx={headerStyle}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
              ) : (
                <AnimatePresence mode='wait'>
                  {paginatedLoans.length > 0 ? (
                    paginatedLoans.map((loan, idx) => {
                      const status = getStatusConfig(loan.loanStatus);
                      const isApproved = loan.loanStatus === 1;

                      return (
                        <TableRow 
                          key={loan._id} 
                          hover 
                          component={motion.tr}
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', borderRadius: '10px' }}>
                                <DirectionsCarOutlined />
                              </Avatar>
                              <Typography sx={{ fontWeight: 800, color: '#1e293b' }}>{loan.loanType}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#64748b' }}>
                              <CalendarToday sx={{ fontSize: '0.9rem' }} />
                              <Typography variant="body2">{new Date(loan.submissionDate).toLocaleDateString()}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={status.label} 
                              size="small" 
                              sx={{ 
                                fontWeight: 800, 
                                fontSize: '0.7rem', 
                                textTransform: 'uppercase', 
                                bgcolor: status.bg, 
                                color: status.color,
                                border: `1px solid ${status.color}33`
                              }} 
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title={isApproved ? "Approved applications cannot be deleted" : "Delete application"}>
                              <span>
                                <Button
                                  variant="text"
                                  color="error"
                                  startIcon={<DeleteOutline />}
                                  // Logic: Disable button if status is Approved (1)
                                  disabled={isApproved}
                                  onClick={() => { setLoanToDelete(loan._id); setShowDeleteModal(true); }}
                                  sx={{ 
                                    fontWeight: 700, 
                                    textTransform: 'none', 
                                    borderRadius: '8px', 
                                    '&:hover': { bgcolor: '#fee2e2' },
                                    "&.Mui-disabled": { color: "#cbd5e1" }
                                  }}
                                >
                                  Delete
                                </Button>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                        <Typography sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                          No loan applications found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>

          {/* DYNAMIC PAGINATION */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filteredLoans.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            sx={{ bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}
          />
        </TableContainer>
      </Container>

      {/* REFINED DELETE DIALOG */}
      <Dialog 
        open={showDeleteModal} 
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        PaperProps={{ sx: { borderRadius: '20px', p: 1, maxWidth: '400px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 900 }}>
          <Avatar sx={{ bgcolor: '#fee2e2', color: '#ef4444', mx: 'auto', mb: 2, width: 56, height: 56 }}>
            <ErrorOutline fontSize="large" />
          </Avatar>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography color="text.secondary">
            Are you sure you want to remove this loan application? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button onClick={() => setShowDeleteModal(false)} disabled={isDeleting} sx={{ color: '#64748b', fontWeight: 700 }}>
            Keep it
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDelete}
            disabled={isDeleting}
            sx={{ borderRadius: '10px', px: 4, fontWeight: 700, textTransform: 'none' }}
          >
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : "Yes, Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const headerStyle = {
  fontWeight: 800,
  color: '#475569',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  py: 2
};

export default AppliedLoans;