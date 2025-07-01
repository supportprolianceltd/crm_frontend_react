// import React from 'react';
// import { Route, Routes, useLocation } from 'react-router-dom';
// import { SelectedFeaturesProvider } from '../../context/SelectedFeaturesContext';
// import './CRMLandingpage.css';
// import NavBar from './NavBar';
// import Home from './Home';
// import RequestDemo from './RequestDemo';
// import LoginPage from './Login';
// import RegisterPage from './Register';
// import CodeVerificationPage from './CodeVerification';
// import ForgotPasswordPage from './ForgotPassword';
// import NewPasswordPage from './NewPassword';
// import JobApplication from './JobApplication';
// import Recruitment from './Features/Recruitment';
// import ApplicantDashboard from '../ApplicantDashboard/Dashboard';

// const CRMLandingpage = () => {
//   const location = useLocation();

//   const regPagePaths = ['/login', '/register', '/code-verification'];
//   const isRegPage = regPagePaths.includes(location.pathname);

//   const isApplicantDashboard = location.pathname.startsWith('/application-dashboard');

//   return (
//     <SelectedFeaturesProvider>
//       <div
//         className={`CRMLandingpagee 
//           ${isRegPage ? 'Reg_Page' : ''} 
//           ${isApplicantDashboard ? 'application-dashboard-nav' : ''}`}
//       >
//         <NavBar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/request-for-demo" element={<RequestDemo />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/code-verification" element={<CodeVerificationPage />} />
//           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//           <Route path="/new-password" element={<NewPasswordPage />} />
//           <Route path="/jobs/:unique_link" element={<JobApplication />} />
//           <Route path="/recruitment" element={<Recruitment />} />
//           <Route path="/application-dashboard/*" element={<ApplicantDashboard />} />
//         </Routes>
//       </div>
//     </SelectedFeaturesProvider>
//   );
// };

// export default CRMLandingpage;


import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { SelectedFeaturesProvider } from '../../context/SelectedFeaturesContext';
import './CRMLandingpage.css';
import NavBar from './NavBar';
import Home from './Home';
import RequestDemo from './RequestDemo';
import LoginPage from './Login';
import RegisterPage from './Register';
import CodeVerificationPage from './CodeVerification';
import ForgotPasswordPage from './ForgotPassword';
import NewPasswordPage from './NewPassword';
import JobApplication from './JobApplication';
import Recruitment from './Features/Recruitment';
import ApplicantDashboard from '../ApplicantDashboard/Dashboard';

const CRMLandingpage = () => {
  const location = useLocation();

  const regPagePaths = ['/login', '/register', '/code-verification'];
  const isRegPage = regPagePaths.includes(location.pathname);

  const isApplicantDashboard = location.pathname.startsWith('/application-dashboard');

  return (
    <SelectedFeaturesProvider>
      <div
        className={`CRMLandingpagee 
          ${isRegPage ? 'Reg_Page' : ''} 
          ${isApplicantDashboard ? 'application-dashboard-nav' : ''}`}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request-for-demo" element={<RequestDemo />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/code-verification" element={<CodeVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
          <Route path="/jobs/:unique_link" element={<JobApplication />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route
            path="/application-dashboard/:job_application_code/:email/:unique_link"
            element={<ApplicantDashboard />}
          />
        </Routes>
      </div>
    </SelectedFeaturesProvider>
  );
};

export default CRMLandingpage;