import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../apiConfig';
import AdminNavbar from './AdminNavbar';
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  Search,
  EditOutlined,
  DeleteOutline,
  AttachMoney,
  DirectionsCarOutlined,
  ErrorOutline,
  TrendingUp
} from '@mui/icons-material';

const ViewLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pivot Table Sorting State
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('loanType');

  // Modal & Toast States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/loan/getAllLoans`);
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      // Small delay for smooth skeleton transition
      setTimeout(() => setLoading(false), 800);
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
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/loan/deleteLoan/${selectedLoanId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      await fetchLoans(); 
      setToast({ show: true, message: "Loan deleted successfully!", type: "error" });
    } catch (error) {
      setToast({ show: true, message: "Error deleting loan", type: "error" });
    } finally {
      setIsDeleting(false); 
    }
  };

  const handleEdit = (loan) => {
    navigate('/admin/add-loan', { state: { loan, isEdit: true } });
  };

  const openDeleteModal = (id) => {
    setSelectedLoanId(id);
    setShowDeleteModal(true);
  };

  // --- Filter & Sort logic ---
  const filteredLoans = loans.filter(loan => 
    loan.loanType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedLoans = filteredLoans.sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'interestRate' || orderBy === 'maximumAmount') {
      return isAsc ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    }
    return isAsc 
      ? a[orderBy].localeCompare(b[orderBy])
      : b[orderBy].localeCompare(a[orderBy]);
  });

  const paginatedLoans = sortedLoans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Skeleton Row Component
  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton variant="text" width="60%" height={30} /></TableCell>
      <TableCell><Skeleton variant="text" width="40%" height={30} /></TableCell>
      <TableCell><Skeleton variant="text" width="30%" height={30} /></TableCell>
      <TableCell><Skeleton variant="text" width="80%" height={30} /></TableCell>
      <TableCell align="center"><Skeleton variant="rounded" width={100} height={40} /></TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f7fe' }}>
      <AdminNavbar />
     
      <Toast
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* HEADER SECTION */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em', mb: 1 }}>
          Vechile Loans
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage and monitor available vehicle financing products
          </Typography>
        </Box>

        {/* SEARCH & CONTROLS */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: '1.5rem', 
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <TextField
            placeholder="Search by loan type..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            sx={{ width: { xs: '100%', sm: 300 }, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f8fafc' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94a3b8' }} /></InputAdornment>,
            }}
          />
          <Chip label={`${filteredLoans.length} Active Plans`} variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px', bgcolor: '#fff' }} />
        </Paper>

        {/* DATA TABLE */}
        <TableContainer 
          component={Paper} 
          elevation={0} 
          sx={{ 
            borderRadius: '1.5rem', 
            border: '1px solid #e2e8f0', 
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={headerStyle}>
                  <TableSortLabel
                    active={orderBy === 'loanType'}
                    direction={orderBy === 'loanType' ? order : 'asc'}
                    onClick={() => handleRequestSort('loanType')}
                  >
                    Loan Type
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={headerStyle}>
                  <TableSortLabel
                    active={orderBy === 'maximumAmount'}
                    direction={orderBy === 'maximumAmount' ? order : 'asc'}
                    onClick={() => handleRequestSort('maximumAmount')}
                  >
                    Max Amount
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={headerStyle}>
                  <TableSortLabel
                    active={orderBy === 'interestRate'}
                    direction={orderBy === 'interestRate' ? order : 'asc'}
                    onClick={() => handleRequestSort('interestRate')}
                  >
                    Interest
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={headerStyle}>Description</TableCell>
                <TableCell align="center" sx={headerStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
              ) : (
                <AnimatePresence mode="wait">
                  {paginatedLoans.length > 0 ? (
                    paginatedLoans.map((loan, idx) => (
                      <TableRow 
                        key={loan._id} 
                        hover
                        component={motion.tr}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
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
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: '#334155' }}>
                            <AttachMoney sx={{ fontSize: '1rem', color: '#64748b' }} />
                            <Typography sx={{ fontWeight: 700 }}>{loan.maximumAmount.toLocaleString()}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={<TrendingUp sx={{ fontSize: '0.9rem !important' }} />}
                            label={`${loan.interestRate}%`} 
                            size="small"
                            sx={{ bgcolor: '#f0f9ff', color: '#0369a1', fontWeight: 800, border: '1px solid #bae6fd' }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic', maxWidth: 250 }}>
                          {loan.description}
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Edit Plan">
                              <IconButton onClick={() => handleEdit(loan)} size="small" sx={{ color: '#2563eb', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}>
                                <EditOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Plan">
                              <IconButton onClick={() => openDeleteModal(loan._id)} size="small" sx={{ color: '#ef4444', bgcolor: '#fee2e2', '&:hover': { bgcolor: '#fecaca' } }}>
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                        <Typography sx={{ color: '#94a3b8', fontStyle: 'italic' }}>No loan plans found.</Typography>
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
            sx={{ borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}
          />
        </TableContainer>
      </Container>

      {/* REFINED DELETE DIALOG */}
      <Dialog 
        open={showDeleteModal} 
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        PaperProps={{ sx: { borderRadius: '24px', p: 1, maxWidth: '400px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 900 }}>
          <Avatar sx={{ bgcolor: '#fee2e2', color: '#ef4444', mx: 'auto', mb: 2, width: 56, height: 56 }}>
            <ErrorOutline fontSize="large" />
          </Avatar>
          Remove Plan?
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography color="text.secondary">
            Are you sure you want to delete this loan plan? This will remove it from the user marketplace.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button onClick={() => setShowDeleteModal(false)} sx={{ color: '#64748b', fontWeight: 700 }}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDelete}
            disabled={isDeleting}
            sx={{ borderRadius: '12px', px: 4, fontWeight: 700, textTransform: 'none', bgcolor: '#ef4444' }}
          >
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : "Delete Plan"}
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

export default ViewLoans;