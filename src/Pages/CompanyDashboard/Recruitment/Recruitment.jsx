import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Recruitment.css';
import SideNavBar from './SideNavBar';
import RecruitmentHome from './RecruitmentHome';
import JobAdverts from './JobAdverts';


const Recruitment = () => {

  return (
     <div className='DB-Envt'>
      <SideNavBar />
     <div className='Main-DB-Envt'>
      <div className='DB-Envt-Container'>
        <Routes>
          <Route path="/" element={<RecruitmentHome />} />
          <Route path="/job-adverts" element={<JobAdverts />} />
        </Routes>
      </div>
      </div>
    </div>
  );
};

export default Recruitment;