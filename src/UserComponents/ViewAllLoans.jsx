import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import UserNavbar from './UserNavbar';

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
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search,
  AccountBalanceOutlined,
  Clear
} from '@mui/icons-material';

const ViewAllLoans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All"); // New Category State
  const [loading, setLoading] = useState(true);

  // --- SORTING STATE ---
  const [orderBy, setOrderBy] = useState('interestRate');
  const [order, setOrder] = useState('asc');

  // --- PAGINATION STATES ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchAvailableLoans();
  }, []);

  // BUG FIX: Reset page to 0 when search or filter changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm, categoryFilter]);

  const fetchAvailableLoans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/loan/getAllLoans`);
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching available loans:", error);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  // Get Unique Loan Types for the Filter Dropdown
  const uniqueCategories = useMemo(() => {
    const types = loans.map(l => l.loanType);
    return ["All", ...new Set(types)];
  }, [loans]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // --- FUNCTIONAL FILTERING & SORTING LOGIC ---
  const filteredAndSortedLoans = useMemo(() => {
    return loans
      .filter(loan => {
        const matchesSearch = loan.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            loan.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "All" || loan.loanType === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const isAsc = order === 'asc';
        let comparison = 0;
        if (orderBy === 'interestRate' || orderBy === 'maximumAmount') {
          comparison = a[orderBy] - b[orderBy];
        } else {
          comparison = (a[orderBy] || "").toString().localeCompare((b[orderBy] || "").toString());
        }
        return isAsc ? comparison : -comparison;
      });
  }, [loans, searchTerm, categoryFilter, order, orderBy]);

  const paginatedLoans = filteredAndSortedLoans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleApply = (loanType) => {
    navigate('/user/apply-form', { state: { loanType } });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f7fe' }}>
      <UserNavbar />
      

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        
        {/* HEADER */}
        <Box sx={{ mb: 6 }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', mb: 1 }}>
            Available Vehicle Loans
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Find and apply for the best vehicle financing options available today.
            </Typography>
          </motion.div>
        </Box>

        {/* FUNCTIONAL FILTER BAR */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, mb: 4, borderRadius: '1.2rem', border: '1px solid #e2e8f0',
            display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center'
          }}
        >
          {/* Search Field */}
          <TextField
            placeholder="Search loans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
            sx={{ maxWidth: { md: 350 }, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Clear sx={{ cursor: 'pointer', fontSize: 18 }} onClick={() => setSearchTerm("")} />
                </InputAdornment>
              )
            }}
          />

          {/* Category Dropdown */}
          <FormControl size="small" sx={{ minWidth: 200, width: { xs: '100%', md: 'auto' } }}>
            <InputLabel>Loan Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Loan Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ borderRadius: '10px' }}
            >
              {uniqueCategories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Results Count Chip */}
          <Box sx={{ flexGrow: 1, textAlign: { md: 'right' } }}>
            <Chip 
              label={`${filteredAndSortedLoans.length} Loans Found`} 
              variant="outlined" 
              sx={{ fontWeight: 700, color: '#2563eb', borderColor: '#bfdbfe', bgcolor: '#eff6ff' }} 
            />
          </Box>
        </Paper>

        {/* DATA TABLE */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '1.2rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={headerStyle}>
                  <TableSortLabel active={orderBy === 'loanType'} direction={orderBy === 'loanType' ? order : 'asc'} onClick={() => handleRequestSort('loanType')}>
                    Loan Type
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={headerStyle}>Description</TableCell>
                <TableCell sx={headerStyle}>
                  <TableSortLabel active={orderBy === 'interestRate'} direction={orderBy === 'interestRate' ? order : 'asc'} onClick={() => handleRequestSort('interestRate')}>
                    Interest
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={headerStyle}>
                  <TableSortLabel active={orderBy === 'maximumAmount'} direction={orderBy === 'maximumAmount' ? order : 'asc'} onClick={() => handleRequestSort('maximumAmount')}>
                    Max Amount
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={headerStyle}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : (
                <AnimatePresence mode='wait'>
                  {paginatedLoans.length > 0 ? (
                    paginatedLoans.map((loan, index) => (
                      <TableRow key={loan._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={{ py: 2.5 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}><AccountBalanceOutlined fontSize="small" /></Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{loan.loanType}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', fontSize: '0.85rem', maxWidth: 250 }}>{loan.description}</TableCell>
                        <TableCell>
                          <Chip label={`${loan.interestRate}%`} size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 800 }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>${loan.maximumAmount?.toLocaleString()}</TableCell>
                        <TableCell align="center">
                          <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => handleApply(loan.loanType)}
                            sx={{ borderRadius: '8px', textTransform: 'none', px: 3, fontWeight: 700 }}
                          >
                            Apply
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography color="textSecondary">No loans found matching your filters.</Typography>
                        <Button variant="text" onClick={() => { setSearchTerm(""); setCategoryFilter("All"); }}>Clear all filters</Button>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={filteredAndSortedLoans.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </TableContainer>
      </Container>
    </Box>
  );
};

// Sub-components & Styles
const SkeletonRow = () => (
  <TableRow sx={{ '& td': { py: 2.5, borderBottom: '1px solid #f1f5f9' } }}>
    {/* Loan Type Skeleton */}
    <TableCell>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: '8px' }} />
        <Skeleton variant="text" width={100} height={20} />
      </Stack>
    </TableCell>

    {/* Description Skeleton */}
    <TableCell>
      <Box>
        <Skeleton variant="text" width="90%" height={15} />
        <Skeleton variant="text" width="60%" height={15} />
      </Box>
    </TableCell>

    {/* Interest Rate Skeleton (Chip shape) */}
    <TableCell>
      <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: '12px' }} />
    </TableCell>

    {/* Max Amount Skeleton */}
    <TableCell>
      <Skeleton variant="text" width={80} height={20} />
    </TableCell>

    {/* Action Button Skeleton */}
    <TableCell align="center">
      <Skeleton variant="rounded" width={90} height={36} sx={{ borderRadius: '8px', margin: '0 auto' }} />
    </TableCell>
  </TableRow>
);

const headerStyle = {
  fontWeight: 800,
  color: '#475569',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  py: 2
};

export default ViewAllLoans;