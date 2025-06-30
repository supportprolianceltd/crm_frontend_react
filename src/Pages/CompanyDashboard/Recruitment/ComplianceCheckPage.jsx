import React from 'react';
import './ComplianceCheckPage.css';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import ApplicantTable from './ApplicantTable';
import { Link } from 'react-router-dom';

const ComplianceCheckPage = () => {
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
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>UI/UX Designer</option>
            <option>Project Manager</option>
            <option>Digital Marketer</option>
            <option>Sales Representative</option>
            <option>Business Analyst</option>
            <option>Data Entry Clerk</option>
            <option>Human Resource Officer</option>
            <option>Software Engineer</option>
            <option>Product Manager</option>
            <option>Receptionist</option>
            <option>Accountant</option>
            <option>Graphic Designer</option>
            <option>Administrative Assistant</option>
            <option>Operations Manager</option>
            <option>Security Personnel</option>
            <option>Teacher</option>
            </select>

        </div>
        </div>

        <div className='Uijauj-UUplao'>
            <ul>
                <li><span><UserGroupIcon /> 24 applicants</span></li>
                <li><span>Posted on: June 26, Thursday 2025</span></li>
                <li><span>Status: Active</span></li>
            </ul>

            <p>Total file size: <span>0MB</span></p>
            
        </div>
        <div className='OUkas-POka'>
          <h2><Link to='/jobs/'>Frontend Developer </Link></h2>
          <p><InformationCircleIcon /> Last complaince check is <b>June 26, Thursday 2025</b> by <b> Mr. Prince Godson</b></p>
        </div>
    </div>

    <ApplicantTable />
</div>
  );
};


export default ComplianceCheckPage;
