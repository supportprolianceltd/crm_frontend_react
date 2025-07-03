import React, { useState } from 'react';
import './ComplianceCheckPage.css';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import ApplicantTable from './ApplicantTable';
import EmploymentDecision from './EmploymentDecision';
import { Link } from 'react-router-dom';

const ComplianceCheckPage = () => {
  const [showEmploymentDecision, setShowEmploymentDecision] = useState(false);

  return (
    <div className='ComplianceCheckPage'>
      <div className='ComplianceCheckPage-TOop'>
        <div className='ComplianceCheckPage-TOop-Grid'>
          <div className='ComplianceCheckPage-TOop-1'>
            <h2>Compliance Check</h2>
          </div>
          <div className='ComplianceCheckPage-TOop-2'>
            <h4>Select Job Position:</h4>
            <select className="filter-select">
              {/* your options */}
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              {/* ... */}
            </select>
          </div>
        </div>

        <div className='Uijauj-UUplao'>
          <ul>
            <li><span><UserGroupIcon /> 24 applicants</span></li>
            <li><span>Posted on: June 26, Thursday 2025</span></li>
            <li><span>Status: Active</span></li>
          </ul>

          <button
            className='Deecc-NNBYna'
            onClick={() => setShowEmploymentDecision(true)}
          >
            <HandThumbUpIcon /> Employment Decision
          </button>
        </div>

        <div className='OUkas-POka'>
          <h2><Link to='/jobs/' title='View Job'>Frontend Developer </Link></h2>
          <p><InformationCircleIcon /> Last compliance check is <b>June 26, Thursday 2025</b> by <b> Mr. Prince Godson</b></p>
        </div>
      </div>

      <ApplicantTable />

      {/* Conditionally render EmploymentDecision */}
      {showEmploymentDecision && (
        <EmploymentDecision onClose={() => setShowEmploymentDecision(false)} />
      )}
    </div>
  );
};

export default ComplianceCheckPage;
