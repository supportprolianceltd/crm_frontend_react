import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TrainingHome from './TrainingHome';
import './Training.css';

const Training = () => {

  return (
    <div className='DB-Envt'>
     <div className='Main-DB-Envt'>
      <div className='DB-Envt-Container'>
        <Routes>
          <Route path="/" element={<TrainingHome />} />
        </Routes>
        </div>
      </div>
    </div>
  );
};

export default Training;