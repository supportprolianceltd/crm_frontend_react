import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Dashboard.css';
import usePageTitle from '../../hooks/usecrmPageTitle';
import Home from './Home';
import Recruitment from './Recruitment/Recruitment';
import DashboardNavBar from './DashboardNavBar';

const Dashboard = () => {
  usePageTitle(); 

  return (
    <div className='Dashboard-Page'>
        <DashboardNavBar />
      <div className='Main_Dashboard_Page'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recruitment" element={<Recruitment />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;