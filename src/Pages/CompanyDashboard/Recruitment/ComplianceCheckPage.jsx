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
          <h2>Frontend Developer </h2>
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




























































































// import React, { useState, useEffect } from 'react';
// import './ComplianceCheckPage.css';
// import { UserGroupIcon, InformationCircleIcon, HandThumbUpIcon, PlusIcon } from '@heroicons/react/24/outline';
// import ApplicantTable from './ApplicantTable';
// import EmploymentDecision from './EmploymentDecision';
// import { fetchPublishedRequisitionsWithShortlisted, createComplianceItem } from './ApiService';
// import Modal from 'react-modal';

// const ComplianceCheckPage = () => {
//   const [showEmploymentDecision, setShowEmploymentDecision] = useState(false);
//   const [selectedJobId, setSelectedJobId] = useState(null);
//   const [jobRequisitions, setJobRequisitions] = useState([]);
//   const [complianceChecklist, setComplianceChecklist] = useState([]);
//   const [shortlistedApplications, setShortlistedApplications] = useState([]);
//   const [totalApplications, setTotalApplications] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newComplianceItem, setNewComplianceItem] = useState({ name: '', description: '', required: true });
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch published job requisitions with shortlisted applications
//     const fetchJobs = async () => {
//       try {
//         const response = await fetchPublishedRequisitionsWithShortlisted();
//         // Ensure response is an array
//         const requisitions = Array.isArray(response) ? response : [];
//         setJobRequisitions(requisitions);
//         if (requisitions.length > 0) {
//           setSelectedJobId(requisitions[0].job_requisition.id);
//         }
//       } catch (error) {
//         console.error('Error fetching published job requisitions:', error);
//         setError(error.message || 'Failed to load job requisitions.');
//       }
//     };
//     fetchJobs();
//   }, []);

//   useEffect(() => {
//     // Update compliance checklist and applications when selectedJobId changes
//     const updateJobData = () => {
//       if (selectedJobId) {
//         const selectedJob = jobRequisitions.find(
//           (job) => job.job_requisition.id === selectedJobId
//         );
//         if (selectedJob) {
//           // Set compliance checklist
//           const checklist = Array.isArray(selectedJob.job_requisition.compliance_checklist)
//             ? selectedJob.job_requisition.compliance_checklist.filter(
//                 (item) => item && typeof item === 'object' && item.name
//               )
//             : [];
//           setComplianceChecklist(checklist);

//           // Set shortlisted applications
//           setShortlistedApplications(
//             Array.isArray(selectedJob.shortlisted_applications)
//               ? selectedJob.shortlisted_applications
//               : []
//           );

//           // Set total applications
//           setTotalApplications(selectedJob.total_applications || 0);
//         } else {
//           setComplianceChecklist([]);
//           setShortlistedApplications([]);
//           setTotalApplications(0);
//         }
//       }
//     };
//     updateJobData();
//   }, [selectedJobId, jobRequisitions]);

//   const handleAddComplianceItem = async () => {
//     try {
//       if (!newComplianceItem.name.trim()) {
//         setError('Compliance item name is required.');
//         return;
//       }
//       if (
//         complianceChecklist.some(
//           (item) => item.name.toLowerCase() === newComplianceItem.name.trim().toLowerCase()
//         )
//       ) {
//         setError('Compliance item name must be unique.');
//         return;
//       }
//       const item = await createComplianceItem(selectedJobId, newComplianceItem);
//       setComplianceChecklist([...complianceChecklist, item]);
//       setIsModalOpen(false);
//       setNewComplianceItem({ name: '', description: '', required: true });
//       setError(null);
//     } catch (error) {
//       console.error('Error adding compliance item:', error);
//       setError(error.message || 'Failed to add compliance item.');
//     }
//   };

//   // Find the selected job for display
//   const selectedJob = jobRequisitions.find(
//     (job) => job.job_requisition.id === selectedJobId
//   );

//   return (
//     <div className="ComplianceCheckPage">
//       {error && (
//         <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
//           {error}
//         </div>
//       )}
//       <div className="ComplianceCheckPage-TOop">
//         <div className="ComplianceCheckPage-TOop-Grid">
//           <div className="ComplianceCheckPage-TOop-1">
//             <h2>Compliance Check</h2>
//           </div>
//           <div className="ComplianceCheckPage-TOop-2">
//             <h4>Select Job Position:</h4>
//             <select
//               className="filter-select"
//               value={selectedJobId || ''}
//               onChange={(e) => setSelectedJobId(e.target.value)}
//             >
//               <option value="" disabled>
//                 Select a Job
//               </option>
//               {jobRequisitions.map((job) => (
//                 <option key={job.job_requisition.id} value={job.job_requisition.id}>
//                   {job.job_requisition.title}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="Uijauj-UUplao">
//           <ul>
//             <li>
//               <span>
//                 <UserGroupIcon /> {shortlistedApplications.length} shortlisted /{' '}
//                 {totalApplications} total applicants
//               </span>
//             </li>
//             <li>
//               <span>
//                 Posted on:{' '}
//                 {selectedJob?.job_requisition.created_at
//                   ? new Date(selectedJob.job_requisition.created_at).toLocaleDateString('en-US', {
//                       month: 'long',
//                       day: 'numeric',
//                       year: 'numeric',
//                     })
//                   : 'N/A'}
//               </span>
//             </li>
//             <li>
//               <span>
//                 Status: {selectedJob?.job_requisition.status || 'N/A'}
//               </span>
//             </li>
//           </ul>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="Deecc-NNBYna"
//             disabled={!selectedJobId}
//           >
//             <PlusIcon /> Add Compliance Item
//           </button>
//           <button
//             className="Deecc-NNBYna"
//             onClick={() => setShowEmploymentDecision(true)}
//             disabled={!selectedJobId}
//           >
//             <HandThumbUpIcon /> Employment Decision
//           </button>
//         </div>

//         <div className="OUkas-POka">
//           <h2>{selectedJob?.job_requisition.title || 'Select a Job'}</h2>
//           <p>
//             <InformationCircleIcon /> Last compliance check is{' '}
//             <b>
//               {selectedJob?.job_requisition.last_compliance_check
//                 ? new Date(selectedJob.job_requisition.last_compliance_check).toLocaleDateString(
//                     'en-US',
//                     { month: 'long', day: 'numeric', year: 'numeric' }
//                   )
//                 : 'N/A'}
//             </b>{' '}
//             by <b>{selectedJob?.job_requisition.checked_by || 'N/A'}</b>
//           </p>
//           <div className="ComplianceChecklist">
//             <h3>Compliance Checklist</h3>
//             <ul>
//               {complianceChecklist.length > 0 ? (
//                 complianceChecklist.map((item) => (
//                   <li key={item.id}>
//                     <strong>{item.name}</strong>: {item.description || 'No description'} (
//                     {item.required ? 'Required' : 'Optional'})
//                   </li>
//                 ))
//               ) : (
//                 <li>No compliance items available.</li>
//               )}
//             </ul>
//           </div>
//         </div>
//       </div>

//       <ApplicantTable
//         jobId={selectedJobId}
//         complianceChecklist={complianceChecklist}
//         applications={shortlistedApplications}
//       />

//       {showEmploymentDecision && (
//         <EmploymentDecision onClose={() => setShowEmploymentDecision(false)} />
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={() => setIsModalOpen(false)}
//         style={{
//           content: {
//             top: '50%',
//             left: '50%',
//             right: 'auto',
//             bottom: 'auto',
//             marginRight: '-50%',
//             transform: 'translate(-50%, -50%)',
//             width: '400px',
//             padding: '20px',
//           },
//         }}
//       >
//         <h2>Add Compliance Item</h2>
//         {error && (
//           <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
//             {error}
//           </div>
//         )}
//         <div>
//           <label>Name</label>
//           <input
//             type="text"
//             value={newComplianceItem.name}
//             onChange={(e) =>
//               setNewComplianceItem({ ...newComplianceItem, name: e.target.value })
//             }
//           />
//         </div>
//         <div>
//           <label>Description</label>
//           <textarea
//             value={newComplianceItem.description}
//             onChange={(e) =>
//               setNewComplianceItem({ ...newComplianceItem, description: e.target.value })
//             }
//           />
//         </div>
//         <div>
//           <label>
//             <input
//               type="checkbox"
//               checked={newComplianceItem.required}
//               onChange={(e) =>
//                 setNewComplianceItem({ ...newComplianceItem, required: e.target.checked })
//               }
//             />
//             Required
//           </label>
//         </div>
//         <button onClick={handleAddComplianceItem}>Save</button>
//         <button onClick={() => setIsModalOpen(false)}>Cancel</button>
//       </Modal>
//     </div>
//   );
// };

// export default ComplianceCheckPage;