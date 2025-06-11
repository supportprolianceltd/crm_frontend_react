import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PayrollHome from './PayrollHome';
import './Payroll.css';

const Payroll = () => {

  return (
    <div className='DB-Envt'>
     <div className='Main-DB-Envt'>
       <div className='DB-Envt-Container'>
        <Routes>
          <Route path="/" element={<PayrollHome />} />
        </Routes>
      </div>
      </div>
    </div>
  );
};

export default Payroll;