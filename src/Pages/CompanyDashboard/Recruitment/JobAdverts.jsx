// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, CheckCircleIcon, TrashIcon,
//   ClipboardDocumentListIcon,
//   FolderOpenIcon,
//   ArrowTrendingUpIcon,
//   InformationCircleIcon,
//   GlobeAltIcon,
//   BriefcaseIcon,
//   MegaphoneIcon,
//   LockClosedIcon,
//   ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// import { motion, AnimatePresence } from 'framer-motion';
// import JobDetails from './JobDetails';
// import EditRequisition from './EditRequisition';
// import CountUp from 'react-countup';

// const generateMockJobs = () => {
//   const titles = ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'QA Engineer', 'DevOps Engineer'];
//   const companies = ['TechCorp', 'Innovate Inc.', 'NexGen Solutions', 'Quantum Dynamics', 'FutureWorks'];
//   const jobTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
//   const locations = ['New York, NY', 'San Francisco, CA', 'London, UK', 'Berlin, Germany', 'Remote'];
//   const statuses = ['Open', 'Closed'];

//   const jobs = [];
//   for (let i = 1; i <= 50; i++) {
//     jobs.push({
//       id: `JOB-${String(i).padStart(3, '0')}`,
//       title: titles[i % titles.length],
//       company: companies[i % companies.length],
//       jobType: jobTypes[i % jobTypes.length],
//       location: locations[i % locations.length],
//       deadline: `2025-07-${String((i % 30) + 1).padStart(2, '0')}`,
//       status: statuses[i % statuses.length]
//     });
//   }
//   return jobs;
// };

// const Modal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => (
//   <AnimatePresence>
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-50 z-40"
//       onClick={onCancel}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 0.5 }}
//       exit={{ opacity: 0 }}
//     />
//     <motion.div
//       className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
//       initial={{ opacity: 0, scale: 0.75 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.75 }}
//       role="dialog"
//       aria-modal="true"
//     >
//       <h3 className="mb-4 text-lg font-semibold">{title}</h3>
//       <p className="mb-6">{message}</p>
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={onCancel}
//           className="rounded bg-gray-300 px-4 py-2 font-semibold hover:bg-gray-400"
//         >
//           {cancelText}
//         </button>
//         <button
//           onClick={onConfirm}
//           className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
//           autoFocus
//         >
//           {confirmText}
//         </button>
//       </div>
//     </motion.div>
//   </AnimatePresence>
// );

// const AlertModal = ({ title, message, onClose }) => (
//   <AnimatePresence>
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-50 z-40"
//       onClick={onClose}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 0.5 }}
//       exit={{ opacity: 0 }}
//     />
//     <motion.div
//       className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
//       initial={{ opacity: 0, scale: 0.75 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.75 }}
//       role="alertdialog"
//       aria-modal="true"
//     >
//       <h3 className="mb-4 text-lg font-semibold">{title}</h3>
//       <p className="mb-6">{message}</p>
//       <div className="flex justify-end">
//         <button
//           onClick={onClose}
//           className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
//           autoFocus
//         >
//           OK
//         </button>
//       </div>
//     </motion.div>
//   </AnimatePresence>
// );

// const JobAdvert = () => {
//   const [jobData, setJobData] = useState(generateMockJobs());
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [isVisible, setIsVisible] = useState(false);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [showNoSelectionAlert, setShowNoSelectionAlert] = useState(false);
//   const [showViewRequisition, setShowViewRequisition] = useState(false);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showEditRequisition, setShowEditRequisition] = useState(false);


//   const [trigger, setTrigger] = useState(0);
//   const [lastUpdateTime, setLastUpdateTime] = useState(new Date('2025-06-13T08:23:00+02:00')); // 08:23 AM CEST

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTrigger((prev) => prev + 1);
//       setLastUpdateTime(new Date());
//     }, 50000); // Update every 50 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const formatTime = (date) => {
//     return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
//   };




//   const handleShowEditRequisition = () => {
//     setShowEditRequisition(true);
//   };

//   const handleHideEditRequisition = () => {
//     setShowEditRequisition(false);
//   };

//   const statuses = ['All', ...new Set(jobData.map(job => job.status))];

//   const filteredJobs = jobData.filter(job => {
//     const matchesSearch = 
//       job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.deadline.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.status.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    
//     return matchesSearch && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);
//   const startIdx = (currentPage - 1) * rowsPerPage;
//   const currentJobs = filteredJobs.slice(startIdx, startIdx + rowsPerPage);

//   const masterCheckboxRef = useRef(null);

//   useEffect(() => {
//     const allVisibleSelected = currentJobs.every((job) => selectedIds.includes(job.id));
//     const someSelected = currentJobs.some((job) => selectedIds.includes(job.id));
//     if (masterCheckboxRef.current) {
//       masterCheckboxRef.current.indeterminate = !allVisibleSelected && someSelected;
//     }
//   }, [selectedIds, currentJobs]);

//   useEffect(() => {
//     const maxPage = Math.ceil(filteredJobs.length / rowsPerPage);
//     if (currentPage > maxPage) {
//       setCurrentPage(maxPage || 1);
//     }
//   }, [rowsPerPage, filteredJobs.length, currentPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, statusFilter, rowsPerPage]);

//   const handleCheckboxChange = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAllVisible = () => {
//     const allVisibleIds = currentJobs.map((job) => job.id);
//     const areAllVisibleSelected = allVisibleIds.every((id) => selectedIds.includes(id));
//     if (areAllVisibleSelected) {
//       setSelectedIds((prev) => prev.filter((id) => !allVisibleIds.includes(id)));
//     } else {
//       setSelectedIds((prev) => [...new Set([...prev, ...allVisibleIds])]);
//     }
//   };

//   const handleDeleteMarked = () => {
//     if (selectedIds.length === 0) {
//       setShowNoSelectionAlert(true);
//       return;
//     }
//     setShowConfirmDelete(true);
//   };

//   const confirmDelete = () => {
//     const newJobs = jobData.filter((job) => !selectedIds.includes(job.id));
//     setJobData(newJobs);
//     setSelectedIds([]);
//     if (currentPage > Math.ceil(newJobs.length / rowsPerPage)) {
//       setCurrentPage((prev) => Math.max(prev - 1, 1));
//     }
//     setShowConfirmDelete(false);
//   };

//   const toggleSection = () => {
//     setIsVisible(prev => !prev);
//   };

//   const handleViewClick = (job) => {
//     setSelectedJob(job);
//     setShowViewRequisition(true);
//   };

//   const handleCloseViewRequisition = () => {
//     setShowViewRequisition(false);
//     setSelectedJob(null);
//   };

//   return (
//     <div className="JobAdvert-sec">
//        <div className='Dash-OO-Boas TTTo-POkay'>
        
//   <div className="glo-Top-Cards">
//       {[
//         { icon: BriefcaseIcon, label: 'Total Job Advertisements', value: 100 },
//         { icon: MegaphoneIcon, label: 'Open Advertisements', value: 25 },
//         { icon: LockClosedIcon, label: 'Closed Advertisements', value: 75 },
//       ].map((item, idx) => (
//         <div key={idx} className={`glo-Top-Card card-${idx + 1}`}>
//           <div className="ffl-TOp">
//             <span><item.icon /></span>
//             <p>{item.label}</p>
//           </div>
//           <h3>
//             <ArrowTrendingUpIcon />
//             <CountUp key={trigger + `-${idx}`} end={item.value} duration={2} />{' '}
//             <span className="ai-check-span">Last checked - {formatTime(lastUpdateTime)}</span>
//           </h3>
     
//         </div>
//       ))}
//     </div>

//     </div>

//       <div className='Dash-OO-Boas Gen-Boxshadow'>

//         <div className='Dash-OO-Boas-Top'>
//           <div className='Dash-OO-Boas-Top-1'>
//             <span onClick={toggleSection}><AdjustmentsHorizontalIcon /></span>
//             <h3>Job Advertisements</h3>
//           </div>
//           <div className='Dash-OO-Boas-Top-2'>
//             <div className='genn-Drop-Search'>
//               <span><MagnifyingGlassIcon /></span>
//               <input 
//                 type='text' 
//                 placeholder='Search advertisements...' 
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>


//         <AnimatePresence>
//           {isVisible && (
//             <motion.div className="filter-dropdowns"
//               initial={{ height: 0, opacity: 0, overflow: "hidden" }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.3 }}>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="filter-select"
//               >
//                 {statuses.map(status => (
//                   <option key={status} value={status}>
//                     {status === 'All' ? 'All Statuses' : status}
//                   </option>
//                 ))}
//               </select>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div className="table-container">
//           <table className="Gen-Sys-table">
//             <thead>
//               <tr>
//                 <th>
//                   <input
//                     type="checkbox"
//                     ref={masterCheckboxRef}
//                     onChange={handleSelectAllVisible}
//                     checked={currentJobs.length > 0 && currentJobs.every((job) => selectedIds.includes(job.id))}
//                   />
//                 </th>
//                 <th>Job ID</th>
//                 <th>Job Title</th>
//                 <th>Company Name</th>
//                 <th>Job Type</th>
//                 <th>Location</th>
//                 <th>Deadline for Applications</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentJobs.length === 0 ? (
//                 <tr>
//                   <td colSpan={9} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
//                     No matching job advertisements found
//                   </td>
//                 </tr>
//               ) : (
//                 currentJobs.map((job) => (
//                   <tr key={job.id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.includes(job.id)}
//                         onChange={() => handleCheckboxChange(job.id)}
//                       />
//                     </td>
//                     <td>{job.id}</td>
//                     <td>{job.title}</td>
//                     <td>{job.company}</td>
//                     <td>{job.jobType}</td>
//                     <td>{job.location}</td>
//                     <td>{job.deadline}</td>
//                     <td>
//                       <span className={`status ${job.status.toLowerCase()}`}>
//                         {job.status}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="gen-td-btns">
//                         <button 
//                           className="view-btn"
//                           onClick={() => handleViewClick(job)}
//                         >
//                           Details
//                         </button>
//                         <Link
//                           to='/job-application'
//                           className='link-btn btn-primary-bg'
//                         >
//                           <GlobeAltIcon />
//                           Site
//                         </Link>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {filteredJobs.length > 0 && (
//           <div className="pagination-controls">
//             <div className='Dash-OO-Boas-foot'>
//               <div className='Dash-OO-Boas-foot-1'>
//                 <div className="items-per-page">
//                   <p>Number of rows:</p>
//                   <select
//                     className="form-select"
//                     value={rowsPerPage}
//                     onChange={(e) => setRowsPerPage(Number(e.target.value))}
//                   >
//                     <option value={5}>5</option>
//                     <option value={10}>10</option>
//                     <option value={20}>20</option>
//                     <option value={50}>50</option>
//                   </select>
//                 </div>
//               </div>

//               <div className='Dash-OO-Boas-foot-2'>
//                 <button onClick={handleSelectAllVisible} className='mark-all-btn'>
//                   <CheckCircleIcon className='h-6 w-6' />
//                   {currentJobs.every((job) => selectedIds.includes(job.id)) ? 'Unmark All' : 'Mark All'}
//                 </button>
//                 <button onClick={handleDeleteMarked} className='delete-marked-btn'>
//                   <TrashIcon className='h-6 w-6' />
//                   Delete Marked
//                 </button>
//               </div>
//             </div>

//             <div className="page-navigation">
//               <span className="page-info">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <div className="page-navigation-Btns">
//                 <button
//                   className="page-button"
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                 >
//                   <ChevronLeftIcon className="h-5 w-5" />
//                 </button>
//                 <button
//                   className="page-button"
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                 >
//                   <ChevronRightIcon className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <AnimatePresence>
//         {showConfirmDelete && (
//           <Modal
//             title="Confirm Delete"
//             message={`Are you sure you want to delete ${selectedIds.length} marked advertisement(s)? This action cannot be undone.`}
//             onConfirm={confirmDelete}
//             onCancel={() => setShowConfirmDelete(false)}
//             confirmText="Delete"
//             cancelText="Cancel"
//           />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {showNoSelectionAlert && (
//           <AlertModal
//             title="No Selection"
//             message="You have not selected any advertisements to delete."
//             onClose={() => setShowNoSelectionAlert(false)}
//           />
//         )}
//       </AnimatePresence>

//       {showViewRequisition && (
//         <JobDetails job={selectedJob} onClose={handleCloseViewRequisition} 
//         onShowEditRequisition={handleShowEditRequisition}
//         />
//       )}

//       {showEditRequisition && <EditRequisition 
//         onHideEditRequisition={handleHideEditRequisition}
//       />}

//     </div>
//   );
// };

// export default JobAdvert;
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  TrashIcon,
  BriefcaseIcon,
  MegaphoneIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import JobDetails from './JobDetails';
import EditRequisition from './EditRequisition';
import CountUp from 'react-countup';
import axios from 'axios';
import config from '../../../config';

const Modal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onCancel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
    />
    <motion.div
      className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      role="dialog"
      aria-modal="true"
    >
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded bg-gray-300 px-4 py-2 font-semibold hover:bg-gray-400"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          autoFocus
        >
          {confirmText}
        </button>
      </div>
    </motion.div>
  </AnimatePresence>
);

const AlertModal = ({ title, message, onClose }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
    />
    <motion.div
      className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      role="alertdialog"
      aria-modal="true"
    >
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          autoFocus
        >
          OK
        </button>
      </div>
    </motion.div>
  </AnimatePresence>
);

// Mapping for job_type and location_type
const reverseJobTypeMap = {
  full_time: 'Full-Time',
  part_time: 'Part-Time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
};

const reverseLocationTypeMap = {
  on_site: 'On-site',
  remote: 'Remote',
  hybrid: 'Hybrid',
};

const JobAdvert = () => {
  const [jobData, setJobData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showNoSelectionAlert, setShowNoSelectionAlert] = useState(false);
  const [showViewRequisition, setShowViewRequisition] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showEditRequisition, setShowEditRequisition] = useState(false);
  const [alertModal, setAlertModal] = useState(null);
  const [trigger, setTrigger] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
  });

  const token = localStorage.getItem('accessToken');
  const API_BASE_URL = config.API_BASE_URL;
  const masterCheckboxRef = useRef(null);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).split('/').join('-');
  };

  // Format time for last update
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/talent-engine/requisitions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter for published jobs and map to component's format
        const publishedJobs = response.data
          .filter((job) => job.publish_status === true)
          .map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company_name || 'N/A',
            jobType: reverseJobTypeMap[job.job_type] || job.job_type,
            location: reverseLocationTypeMap[job.location_type] || job.location_type,
            deadline: formatDate(job.deadline_date),
            status: job.status.charAt(0).toUpperCase() + job.status.slice(1), // Capitalize (e.g., 'open' → 'Open')
          }));
        setJobData(publishedJobs);

        // Update stats
        setStats({
          total: publishedJobs.length,
          open: publishedJobs.filter((job) => job.status === 'Open').length,
          closed: publishedJobs.filter((job) => job.status === 'Closed' || job.status === 'Rejected').length,
        });
      } catch (error) {
        setAlertModal({
          title: 'Error',
          message: error.response?.data?.detail || 'Failed to fetch job advertisements.',
        });
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [trigger, token]);

  // Polling for updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrigger((prev) => prev + 1);
      setLastUpdateTime(new Date());
    }, 50000); // Update every 50 seconds
    return () => clearInterval(interval);
  }, []);

  // Filter jobs based on search and status
  const filteredJobs = jobData.filter((job) => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.deadline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentJobs = filteredJobs.slice(startIdx, startIdx + rowsPerPage);

  // Update master checkbox state
  useEffect(() => {
    const allVisibleSelected = currentJobs.every((job) => selectedIds.includes(job.id));
    const someSelected = currentJobs.some((job) => selectedIds.includes(job.id));
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = !allVisibleSelected && someSelected;
    }
  }, [selectedIds, currentJobs]);

  // Adjust page if rowsPerPage or filters change
  useEffect(() => {
    const maxPage = Math.ceil(filteredJobs.length / rowsPerPage);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage || 1);
    }
  }, [rowsPerPage, filteredJobs.length, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, rowsPerPage]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    const allVisibleIds = currentJobs.map((job) => job.id);
    const areAllVisibleSelected = allVisibleIds.every((id) => selectedIds.includes(id));
    if (areAllVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allVisibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allVisibleIds])]);
    }
  };

  const handleDeleteMarked = () => {
    if (selectedIds.length === 0) {
      setShowNoSelectionAlert(true);
      return;
    }
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      // Send DELETE requests for each selected job
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${API_BASE_URL}/api/talent-engine/requisitions/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      // Update local state
      setJobData((prev) => prev.filter((job) => !selectedIds.includes(job.id)));
      setSelectedIds([]);
      if (currentPage > Math.ceil(filteredJobs.length / rowsPerPage)) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
      setShowConfirmDelete(false);
    } catch (error) {
      setShowConfirmDelete(false);
      setAlertModal({
        title: 'Error',
        message: error.response?.data?.detail || 'Failed to delete selected job advertisements.',
      });
      console.error('Error deleting jobs:', error);
    }
  };

  const toggleSection = () => {
    setIsVisible((prev) => !prev);
  };

  const handleViewClick = (job) => {
    setSelectedJob(job);
    setShowViewRequisition(true);
  };

  const handleCloseViewRequisition = () => {
    setShowViewRequisition(false);
    setSelectedJob(null);
  };

  const handleShowEditRequisition = () => {
    setShowEditRequisition(true);
  };

  const handleHideEditRequisition = () => {
    setShowEditRequisition(false);
  };

  const closeAlert = () => {
    setAlertModal(null);
  };

  const statuses = ['All', ...new Set(jobData.map((job) => job.status))];

  return (
    <div className="JobAdvert-sec">
      <div className="Dash-OO-Boas TTTo-POkay">
        <div className="glo-Top-Cards">
          {[
            { icon: BriefcaseIcon, label: 'Total Job Advertisements', value: stats.total },
            { icon: MegaphoneIcon, label: 'Open Advertisements', value: stats.open },
            { icon: LockClosedIcon, label: 'Closed Advertisements', value: stats.closed },
          ].map((item, idx) => (
            <div key={idx} className={`glo-Top-Card card-${idx + 1}`}>
              <div className="ffl-TOp">
                <span>
                  <item.icon />
                </span>
                <p>{item.label}</p>
              </div>
              <h3>
                <CountUp key={trigger + `-${idx}`} end={item.value} duration={2} />{' '}
                <span className="ai-check-span">Last checked - {formatTime(lastUpdateTime)}</span>
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="Dash-OO-Boas Gen-Boxshadow">
        <div className="Dash-OO-Boas-Top">
          <div className="Dash-OO-Boas-Top-1">
            <span onClick={toggleSection}>
              <AdjustmentsHorizontalIcon />
            </span>
            <h3>Job Advertisements</h3>
          </div>
          <div className="Dash-OO-Boas-Top-2">
            <div className="genn-Drop-Search">
              <span>
                <MagnifyingGlassIcon />
              </span>
              <input
                type="text"
                placeholder="Search advertisements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="filter-dropdowns"
              initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="table-container">
          <table className="Gen-Sys-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    ref={masterCheckboxRef}
                    onChange={handleSelectAllVisible}
                    checked={currentJobs.length > 0 && currentJobs.every((job) => selectedIds.includes(job.id))}
                  />
                </th>
                <th>Job ID</th>
                <th>Job Title</th>
                <th>Company Name</th>
                <th>Job Type</th>
                <th>Location</th>
                <th>Deadline for Applications</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                    No matching job advertisements found
                  </td>
                </tr>
              ) : (
                currentJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(job.id)}
                        onChange={() => handleCheckboxChange(job.id)}
                      />
                    </td>
                    <td>{job.id}</td>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.jobType}</td>
                    <td>{job.location}</td>
                    <td>{job.deadline}</td>
                    <td>
                      <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span>
                    </td>
                    <td>
                      <div className="gen-td-btns">
                        <button className="view-btn" onClick={() => handleViewClick(job)}>
                          Details
                        </button>
                        <Link to="/job-application" className="link-btn btn-primary-bg">
                          <GlobeAltIcon />
                          Site
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredJobs.length > 0 && (
          <div className="pagination-controls">
            <div className="Dash-OO-Boas-foot">
              <div className="Dash-OO-Boas-foot-1">
                <div className="items-per-page">
                  <p>Number of rows:</p>
                  <select
                    className="form-select"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="Dash-OO-Boas-foot-2">
                <button onClick={handleSelectAllVisible} className="mark-all-btn">
                  <CheckCircleIcon className="h-6 w-6" />
                  {currentJobs.every((job) => selectedIds.includes(job.id)) ? 'Unmark All' : 'Mark All'}
                </button>
                <button onClick={handleDeleteMarked} className="delete-marked-btn">
                  <TrashIcon className="h-6 w-6" />
                  Delete Marked
                </button>
              </div>
            </div>

            <div className="page-navigation">
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <div className="page-navigation-Btns">
                <button
                  className="page-button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  className="page-button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showConfirmDelete && (
          <Modal
            title="Confirm Delete"
            message={`Are you sure you want to delete ${selectedIds.length} marked advertisement(s)? This action cannot be undone.`}
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirmDelete(false)}
            confirmText="Delete"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNoSelectionAlert && (
          <AlertModal
            title="No Selection"
            message="You have not selected any advertisements to delete."
            onClose={() => setShowNoSelectionAlert(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {alertModal && (
          <AlertModal title={alertModal.title} message={alertModal.message} onClose={closeAlert} />
        )}
      </AnimatePresence>

      {showViewRequisition && (
        <JobDetails
          job={selectedJob}
          onClose={handleCloseViewRequisition}
          onShowEditRequisition={handleShowEditRequisition}
        />
      )}

      {showEditRequisition && (
        <EditRequisition onHideEditRequisition={handleHideEditRequisition} />
      )}
    </div>
  );
};

export default JobAdvert;