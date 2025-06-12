import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RosteringHome from './RosteringHome';
import './Rostering.css';

const Rostering = () => {

  return (
   <div className='DB-Envt'>
     <div className='Main-DB-Envt'>
      <div className='DB-Envt-Container'>
        <Routes>
          <Route path="/" element={<RosteringHome />} />
        </Routes>
        </div>
      </div>
    </div>
  );
};

export default Rostering;