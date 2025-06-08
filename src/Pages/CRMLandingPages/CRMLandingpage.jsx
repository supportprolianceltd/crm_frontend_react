import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './CRMLandingpage.css';
import NavBar from './NavBar';
import Home from './Home';
import RequestDemo from './RequestDemo';
import LoginPage from './Login';
import RegisterPage from './Register';
import CodeVerificationPage from './CodeVerification';
import ForgotPasswordPage from './ForgotPassword';
import NewPasswordPage from './NewPassword';


// Features

import Recruitment from './Features/Recruitment';


const CRMLandingpage = () => {
  const location = useLocation();

  // Paths where you want to add the 'Reg_Page' class
  const regPagePaths = ['/login', '/register', '/code-verification'];

  const isRegPage = regPagePaths.includes(location.pathname);

  return (
    <div className={`CRMLandingpagee ${isRegPage ? 'Reg_Page' : ''}`}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/request-for-demo" element={<RequestDemo />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
         <Route path="/code-verification" element={<CodeVerificationPage />} />
         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
         <Route path="/new-password" element={<NewPasswordPage />} />

         {/* Features */}

         <Route path="/recruitment" element={<Recruitment />} />


      </Routes>
    </div>
  );
};

export default CRMLandingpage;
