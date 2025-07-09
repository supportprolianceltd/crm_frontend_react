import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Dashboard.css';
import usePageTitle from '../../hooks/usecrmPageTitle';

// Components
import DashboardHome from './DashboardHome';

const Dashboard = () => {
  usePageTitle(); 

  return (
    <div className='Dashboard-Page'>
      <div className='Main_Dashboard_Page'>
        <Routes>
          <Route path="/*" element={<DashboardHome />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
