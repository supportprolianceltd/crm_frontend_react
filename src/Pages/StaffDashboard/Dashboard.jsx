import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Dashboard.css';
import usePageTitle from '../../hooks/usecrmPageTitle';

// Components
import DashboardHome from './DashboardHome';
import DashboardNavBar from './DashboardNavBar';
import DashFooter from './DashFooter';

const Dashboard = () => {
  usePageTitle(); 

  return (
    <div className='Dashboard-Page Staff-Dashboard'>
       <DashboardNavBar />
      <div className='Main_Dashboard_Page'>
        <Routes>
          <Route path="/*" element={<DashboardHome />} />
        </Routes>
      </div>
       <DashFooter />
    </div>
  );
};

export default Dashboard;
