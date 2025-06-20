import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './Recruitment.css';
import SideNavBar from './SideNavBar';
import RecruitmentHome from './RecruitmentHome';
import JobAdverts from './JobAdverts';
import Applications from './Applications';
import ViewApplications from './ViewApplications';
import Schedule from './Schedule';
import ScheduleList from './ScheduleList';


const Recruitment = () => {

  return (
     <div className='DB-Envt'>
      <SideNavBar />
     <div className='Main-DB-Envt'>
      <div className='DB-Envt-Container'>
        <Routes>
          <Route path="/" element={<RecruitmentHome />} />
          <Route path="/job-adverts" element={<JobAdverts />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/view-applications" element={<ViewApplications />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/schedule-list" element={<ScheduleList />} />
        </Routes>
      </div>
      </div>
    </div>
  );
};

export default Recruitment;