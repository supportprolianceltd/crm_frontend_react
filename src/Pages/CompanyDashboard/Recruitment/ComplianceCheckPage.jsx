// import React, { useState } from 'react';
// import './ComplianceCheckPage.css';
// import { UserGroupIcon } from '@heroicons/react/24/solid';
// import { InformationCircleIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
// import ApplicantTable from './ApplicantTable';
// import EmploymentDecision from './EmploymentDecision';
// import { Link } from 'react-router-dom';

// const ComplianceCheckPage = () => {
//   const [showEmploymentDecision, setShowEmploymentDecision] = useState(false);

//   return (
//     <div className='ComplianceCheckPage'>
//       <div className='ComplianceCheckPage-TOop'>
//         <div className='ComplianceCheckPage-TOop-Grid'>
//           <div className='ComplianceCheckPage-TOop-1'>
//             <h2>Compliance Check</h2>
//           </div>
//           <div className='ComplianceCheckPage-TOop-2'>
//             <h4>Select Job Position:</h4>
//             <select className="filter-select">
//               {/* your options */}
//               <option>Frontend Developer</option>
//               <option>Backend Developer</option>
//               {/* ... */}
//             </select>
//           </div>
//         </div>

//         <div className='Uijauj-UUplao'>
//           <ul>
//             <li><span><UserGroupIcon /> 24 applicants</span></li>
//             <li><span>Posted on: June 26, Thursday 2025</span></li>
//             <li><span>Status: Active</span></li>
//           </ul>

//           <button
//             className='Deecc-NNBYna'
//             onClick={() => setShowEmploymentDecision(true)}
//           >
//             <HandThumbUpIcon /> Employment Decision
//           </button>
//         </div>

//         <div className='OUkas-POka'>
//           <h2>Frontend Developer </h2>
//           <p><InformationCircleIcon /> Last compliance check is <b>June 26, Thursday 2025</b> by <b> Mr. Prince Godson</b></p>
//         </div>
//       </div>

//       <ApplicantTable />

//       {/* Conditionally render EmploymentDecision */}
//       {showEmploymentDecision && (
//         <EmploymentDecision onClose={() => setShowEmploymentDecision(false)} />
//       )}
//     </div>
//   );
// };

// export default ComplianceCheckPage;

























import React, { useState, useEffect } from 'react';
import './ComplianceCheckPage.css';
import {
  UserGroupIcon,
  InformationCircleIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import ApplicantTable from './ApplicantTable';
import EmploymentDecision from './EmploymentDecision';
import { fetchPublishedRequisitionsWithShortlisted } from './ApiService';

const ComplianceCheckPage = () => {
  const [jobRequisitions, setJobRequisitions] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [shortlistedApplications, setShortlistedApplications] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [complianceChecklist, setComplianceChecklist] = useState([]);
  const [lastComplianceCheck, setLastComplianceCheck] = useState(null);
  const [checkedBy, setCheckedBy] = useState('');
  const [showEmploymentDecision, setShowEmploymentDecision] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await fetchPublishedRequisitionsWithShortlisted();
      setJobRequisitions(data);

      if (data.length > 0) {
        const firstJob = data[0];
        setSelectedJobId(firstJob.job_requisition.id);
        setShortlistedApplications(firstJob.shortlisted_applications || []);
        setTotalApplications(firstJob.total_applications || 0);
        setShortlistedCount(firstJob.shortlisted_count || 0);
        setComplianceChecklist(firstJob.job_requisition.compliance_checklist || []);
        setLastComplianceCheck(firstJob.job_requisition.last_compliance_check || null);
        setCheckedBy(firstJob.job_requisition.checked_by || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load job requisitions. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    const selectedJob = jobRequisitions.find(
      (job) => job.job_requisition.id === jobId
    );
    if (selectedJob) {
      setShortlistedApplications(selectedJob.shortlisted_applications || []);
      setTotalApplications(selectedJob.total_applications || 0);
      setShortlistedCount(selectedJob.shortlisted_count || 0);
      setComplianceChecklist(selectedJob.job_requisition.compliance_checklist || []);
      setLastComplianceCheck(selectedJob.job_requisition.last_compliance_check || null);
      setCheckedBy(selectedJob.job_requisition.checked_by || '');
    } else {
      setShortlistedApplications([]);
      setTotalApplications(0);
      setShortlistedCount(0);
      setComplianceChecklist([]);
      setLastComplianceCheck(null);
      setCheckedBy('');
    }
  };

  const selectedJob = jobRequisitions.find(
    (job) => job.job_requisition.id === selectedJobId
  );

  return (
    <div className="ComplianceCheckPage">
      {error && <div className="error">Error: {error}</div>}

      <div className="ComplianceCheckPage-TOop Gen-Boxshadow">
        <div className="ComplianceCheckPage-TOop-Grid jjjh-filak">
          <div className="ComplianceCheckPage-TOop-1">
            <h2>Compliance Check</h2>
          </div>
          <div className="ComplianceCheckPage-TOop-2">
            <h4>Select Job Position:</h4>
            <select
              className="filter-select"
              value={selectedJobId}
              onChange={handleJobChange}
              disabled={jobRequisitions.length === 0}
            >
              {jobRequisitions.length === 0 ? (
                <option value="">No jobs available</option>
              ) : (
                jobRequisitions.map((job) => (
                  <option key={job.job_requisition.id} value={job.job_requisition.id}>
                    {job.job_requisition.title} - {job.job_requisition.job_application_code}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="Uijauj-UUplao">
          <ul>
            <li>
              <span>
                <UserGroupIcon /> {shortlistedCount} shortlisted / {totalApplications} total applicants
              </span>
            </li>
            <li>
              <span>
                Posted on:{' '}
                {selectedJob?.job_requisition.requested_date
                  ? new Date(selectedJob.job_requisition.requested_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      weekday: 'long',
                    })
                  : 'N/A'}
              </span>
            </li>
            <li>
              <span>Status: {selectedJob?.job_requisition.status || 'N/A'}</span>
            </li>
          </ul>

          <button
            className="Deecc-NNBYna"
            onClick={() => setShowEmploymentDecision(true)}
            disabled={!selectedJobId}
          >
            <HandThumbUpIcon /> Employment Decision
          </button>
        </div>

        <div className="OUkas-POka">
          <h2>{selectedJob?.job_requisition.title || 'Select a job'}</h2>
          <p>
            <InformationCircleIcon /> Last compliance check is{' '}
            <b>
              {lastComplianceCheck
                ? new Date(lastComplianceCheck).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    weekday: 'long',
                  })
                : 'N/A'}
            </b>{' '}
            by <b>{checkedBy || 'N/A'}</b>
          </p>
        </div>
      </div>

      <ApplicantTable
        jobId={selectedJobId}
        complianceChecklist={complianceChecklist}
        applications={shortlistedApplications}
      />

      {showEmploymentDecision && (
        <EmploymentDecision onClose={() => setShowEmploymentDecision(false)} />
      )}
    </div>
  );
};

export default ComplianceCheckPage;
