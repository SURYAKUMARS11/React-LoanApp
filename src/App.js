import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import your Pages
import Login from './Components/Login';
import Signup from './Components/Signup';
import HomePage from './Components/HomePage';
import LoanForm from './AdminComponents/LoanForm';
import ViewLoans from './AdminComponents/ViewLoans';
import LoanRequest from './AdminComponents/LoanRequest';
import AppliedLoans from './UserComponents/AppliedLoans';
import LoanApplicationForm from './UserComponents/LoanApplicationForm';
import ViewAllLoans from './UserComponents/ViewAllLoans';
import PrivateRoute from './Components/PrivateRoute';
import ErrorPage from './Components/ErrorPage';

// Import PrivateRoute
import axios from 'axios';
import ChatBot from './Components/ChatBot';
axios.defaults.withCredentials = true;


const LayoutContent = () => {
  const location = useLocation();
  const role = localStorage.getItem('role');

  // Define pages where you DON'T want a navbar
  const hideOnPages  = ['/login', '/signup', '/'];
  // const showNavbar = !noNavPages.includes(location.pathname);
  const shouldShowBot = !hideOnPages.includes(location.pathname);

  
  
  return (
    <>
       {shouldShowBot && role && (
        <ChatBot userRole={role} />
      )}

      <Routes>


        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<Signup/>}/>

          {/* Protected General Route (Both Admin and User can access Home) */}
          <Route
            path='/home'
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path='/admin/add-loan'
            element={
              <PrivateRoute requiredRole="admin">
                <LoanForm />
              </PrivateRoute>
            }
          />
          <Route
            path='/admin/view-loan'
            element={
              <PrivateRoute requiredRole="admin">
                <ViewLoans />
              </PrivateRoute>
            }
          />
          <Route
            path='/admin/requested-loans'
            element={
              <PrivateRoute requiredRole="admin">
                <LoanRequest />
              </PrivateRoute>
            }
          />

          {/* User Protected Routes */}
          <Route
            path='/user/applied-loan'
            element={
              <PrivateRoute requiredRole="user">
                <AppliedLoans />
              </PrivateRoute>
            }
          />
          <Route
            path='/user/apply-form'
            element={
              <PrivateRoute requiredRole="user">
                <LoanApplicationForm />
              </PrivateRoute>
            }
          />
          <Route
            path='/user/viewAllLoans'
            element={
              <PrivateRoute requiredRole="user">
                <ViewAllLoans />
              </PrivateRoute>
            }
          />

          {/* Catch-all: Redirect unknown routes to login */}
          <Route path="*" element={<ErrorPage/>} />
        </Routes>
    
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <LayoutContent />
      </div>
    </Router>
  );
}

export default App;