import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SideNavBar from './SideNavBar';
import Home from './Home';
import About from './About';

const Company = () => {
  const [shrinkNav, setShrinkNav] = useState(false);

  return (
    <div className={`DB-Envt ${shrinkNav ? 'ShrinkNav' : ''}`}>
      <SideNavBar setShrinkNav={setShrinkNav} />
      <div className='Main-DB-Envt'>
        <div className='DB-Envt-Container'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Company;