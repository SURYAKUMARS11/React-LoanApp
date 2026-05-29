import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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
  Chip,
  Skeleton,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Search,
  VisibilityOutlined,
  CheckCircleOutline,
  HighlightOff,
  CalendarToday,
  Close,
  ImageOutlined,
  HomeWorkOutlined
} from '@mui/icons-material';

const ROOT_URL = API_BASE_URL.replace('/api', '');

const LoanRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState({ id: null, type: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Pivot Table Sorting State
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('submissionDate');

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async (showTableLoading = true) => {
    if (showTableLoading) setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/loanApplication/getAllLoanApplications`);
      setRequests(response.data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      if (showTableLoading) setTimeout(() => setLoading(false), 800);
    }
  };

  const handleStatusUpdate = async (id, newStatus, actionType) => {
    setIsUpdating({ id, type: actionType });
    try {
      await axios.put(`${API_BASE_URL}/loanApplication/updateLoanApplication/${id}`,
        { loanStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchRequests(false);

      setToast({
        show: true,
        message: `Loan request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`,
        type: actionType === 'approve' ? 'success' : 'error'
      });
    } catch (error) {
      setToast({ show: true, message: "Failed to update status", type: "error" });
    } finally {
      setIsUpdating({ id: null, type: null });
    }
  };

  const getStatusConfig = (status) => {
    if (status === 0) return { label: "Pending", color: "#f59e0b", bg: "#fef3c7" };
    if (status === 1) return { label: "Approved", color: "#10b981", bg: "#d1fae5" };
    if (status === 2) return { label: "Rejected", color: "#ef4444", bg: "#fee2e2" };
    return { label: "Unknown", color: "#64748b", bg: "#f1f5f9" };
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // --- Filter & Sort logic ---
  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const statusText = req.loanStatus === 0 ? "Pending" : req.loanStatus === 1 ? "Approved" : "Rejected";
    const matchesStatus = statusFilter === "All" || statusText === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedRequests = filteredRequests.sort((a, b) => {
    const isAsc = order === 'asc';
    if (['submissionDate', 'model'].includes(orderBy)) {
      return isAsc ? new Date(a[orderBy]) - new Date(b[orderBy]) : new Date(b[orderBy]) - new Date(a[orderBy]);
    }
    if (['purchasePrice', 'income'].includes(orderBy)) {
      return isAsc ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    }
    return isAsc ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
  });

  const paginatedItems = sortedRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const SkeletonRow = () => (
    <TableRow>
      {[...Array(8)].map((_, i) => (
        <TableCell key={i}><Skeleton variant="text" height={30} /></TableCell>
      ))}
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

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* HEADER */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em', mb: 1 }}>
            Loan Approvals
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Review and manage incoming vehicle loan applications
          </Typography>
        </Box>

        {/* CONTROLS */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            placeholder="Search by username..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: 300 }, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f8fafc' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94a3b8' }} /></InputAdornment>,
            }}
          />

          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: '12px', bgcolor: '#f8fafc' }}
              >
                <MenuItem value="All">All Requests</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* DATA TABLE */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '1.5rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <Table sx={{ minWidth: 1100 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={headerStyle}>Username</TableCell>
                <TableCell sx={headerStyle}>Loan Type</TableCell>
                <TableCell sx={headerStyle}>Model</TableCell>
                <TableCell sx={headerStyle}>
                  <TableSortLabel active={orderBy === 'submissionDate'} direction={orderBy === 'submissionDate' ? order : 'asc'} onClick={() => handleRequestSort('submissionDate')}>
                    Submitted
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={headerStyle}>
                  <TableSortLabel active={orderBy === 'purchasePrice'} direction={orderBy === 'purchasePrice' ? order : 'asc'} onClick={() => handleRequestSort('purchasePrice')}>
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={headerStyle}>Income</TableCell>
                <TableCell sx={headerStyle}>Status</TableCell>
                <TableCell align="center" sx={headerStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
              ) : paginatedItems.length > 0 ? (
                paginatedItems.map((req, idx) => {
                  const status = getStatusConfig(req.loanStatus);
                  return (
                    <TableRow key={req._id} hover component={motion.tr} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>{req.userName}</TableCell>
                      <TableCell sx={{ color: '#475569' }}>{req.loanType}</TableCell>
                      <TableCell sx={{ color: '#64748b' }}>{new Date(req.model).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#64748b' }}>
                          <CalendarToday sx={{ fontSize: '0.875rem' }} />
                          <Typography variant="body2">{new Date(req.submissionDate).toLocaleDateString()}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>${req.purchasePrice.toLocaleString()}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>${req.income.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={status.label} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', bgcolor: status.bg, color: status.color, border: `1px solid ${status.color}33` }} />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton onClick={() => setSelectedRequest(req)} size="small" sx={{ bgcolor: '#eff6ff', color: '#2563eb' }}>
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {(req.loanStatus === 0 || req.loanStatus === 2) && (
                            <Tooltip title="Approve">
                              <IconButton
                                disabled={isUpdating.id === req._id}
                                onClick={() => handleStatusUpdate(req._id, 1, 'approve')}
                                size="small"
                                sx={{ bgcolor: '#ecfdf5', color: '#10b981' }}
                              >
                                {isUpdating.id === req._id && isUpdating.type === 'approve' ? <CircularProgress size={18} color="inherit" /> : <CheckCircleOutline fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          )}

                          {(req.loanStatus === 0 || req.loanStatus === 1) && (
                            <Tooltip title="Reject">
                              <IconButton
                                disabled={isUpdating.id === req._id}
                                onClick={() => handleStatusUpdate(req._id, 2, 'reject')}
                                size="small"
                                sx={{ bgcolor: '#fee2e2', color: '#ef4444' }}
                              >
                                {isUpdating.id === req._id && isUpdating.type === 'reject' ? <CircularProgress size={18} color="inherit" /> : <HighlightOff fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10, color: '#94a3b8', fontStyle: 'italic' }}>No requests found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          Logout

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRequests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            sx={{ bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}
          />
        </TableContainer>
      </Container>

      {/* SHOW MORE DIALOG */}
      <Dialog open={!!selectedRequest} onClose={() => setSelectedRequest(null)} PaperProps={{ sx: { borderRadius: '24px', maxWidth: '500px', width: '100%' } }}>
        <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb' }}><AssignmentOutlined /></Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Application Details</Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>ID: {selectedRequest?._id.slice(-8)}</Typography>
            </Box>
          </Stack>
          <IconButton onClick={() => setSelectedRequest(null)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedRequest && (
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, color: '#64748b' }}>
                  <HomeWorkOutlined fontSize="small" />
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Residential Address</Typography>
                </Stack>
                <Typography sx={{ color: '#1e293b', fontWeight: 500, bgcolor: '#f8fafc', p: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  {selectedRequest.address}
                </Typography>
              </Box>
              

              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, color: '#64748b' }}>
                  <ImageOutlined fontSize="small" />
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Identity Proof</Typography>
                </Stack>
                <Box sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', bgcolor: '#000', lineHeight: 0 }}>
                  <img
                    src={`${ROOT_URL}/uploads/${selectedRequest.file}`}
                    alt="Proof document"
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Identity+Proof+Not+Found"; }}
                  />
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const headerStyle = {
  fontWeight: 800,
  color: '#475569',
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  py: 2
};

const AssignmentOutlined = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 12h6"></path><path d="M9 16h6"></path></svg>
);

export default LoanRequest;