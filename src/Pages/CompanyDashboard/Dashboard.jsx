import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Dashboard.css';
import usePageTitle from '../../hooks/usecrmPageTitle';

// Components
import DashboardNavBar from './DashboardNavBar';
import DashFooter from './DashFooter';
import DashboardHome from './Home/DashboardHome';
import Recruitment from './Recruitment/Recruitment';
import Compliance from './Compliance/Compliance';
import Training from './Training/Training';
import AssetManagement from './AssetManagement/AssetManagement';
import Rostering from './Rostering/Rostering';
import HR from './HR/HR';
import Payroll from './Payroll/Payroll';

const Dashboard = () => {
  usePageTitle(); 

  return (
    <div className='Dashboard-Page'>
      <DashboardNavBar />
      <div className='Main_Dashboard_Page'>
        <Routes>
          <Route path="/*" element={<DashboardHome />} />
          <Route path="/recruitment/*" element={<Recruitment />} />
          <Route path="/compliance/*" element={<Compliance />} />
          <Route path="/training/*" element={<Training />} />
          <Route path="/assets/*" element={<AssetManagement />} />
          <Route path="/rostering/*" element={<Rostering />} />
          <Route path="/hr/*" element={<HR />} />
          <Route path="/payroll/*" element={<Payroll />} />
        </Routes>
      </div>
      <DashFooter />
    </div>
  );
};

export default Dashboard;
