import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AssetManagementHome from './AssetManagementHome';
import './AssetManagement.css';

const AssetManagement = () => {

  return (
    <div className='DB-Envt'>
     <div className='Main-DB-Envt'>
      <div className='DB-Envt-Container'>
        <Routes>
          <Route path="/" element={<AssetManagementHome />} />
        </Routes>
      </div>
      </div>
    </div>
  );
};

export default AssetManagement;