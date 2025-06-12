import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ComplianceHome from './ComplianceHome';
import './Compliance.css';

const Compliance = () => {

  return (
    <div className='DB-Envt'>
     <div className='Main-DB-Envt'>
      <div className='DB-Envt-Container'>
        <Routes>
          <Route path="/" element={<ComplianceHome />} />
        </Routes>
      </div>
      </div>
    </div>
  );
};

export default Compliance;