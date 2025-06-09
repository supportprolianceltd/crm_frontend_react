import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RecruitmentHome from './RecruitmentHome';
import './Recruitment.css';

const Recruitment = () => {

  return (
    <div className='AdminPage'>
      <div className='Main_Company_Page'>
        <Routes>
          <Route path="/" element={<RecruitmentHome />} />
        </Routes>
      </div>
    </div>
  );
};

export default Recruitment;