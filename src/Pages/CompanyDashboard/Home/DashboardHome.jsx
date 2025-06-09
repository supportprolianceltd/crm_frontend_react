import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import About from './About';
import SideNavBar from './SideNavBar';

const Company = () => {
  return (
    <div className='DB-Envt'>
      <SideNavBar />
      <div className='Main-DB-Envt'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
};


export default Company;
