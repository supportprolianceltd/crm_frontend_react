import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  LockClosedIcon,
  LockOpenIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

// Modal component for confirmation dialogs
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

// AlertModal component for simple alerts
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

// Function to generate mock job data
const generateMockJobs = () => {
  const titles = [
    'Frontend Developer', 'Backend Engineer', 'UI/UX Designer', 'DevOps Engineer', 'Data Scientist',
    'Full Stack Developer', 'QA Engineer', 'Product Manager', 'Mobile Developer', 'Security Analyst',
    'Cloud Architect', 'Database Administrator', 'Machine Learning Engineer', 'Technical Writer',
    'Business Analyst', 'Software Engineer', 'Systems Analyst', 'Network Engineer', 'Data Analyst',
    'Project Manager'
  ];
  const statuses = ['Open', 'Closed'];
  const jobs = [];
  for (let i = 1; i <= 50; i++) {
    const deadlineMonth = (i % 3) + 5; // Spread deadlines in May, June, July
    const deadline = `2025-${String(deadlineMonth).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`;
    // Generate lastModified datetime: 2025-04-01 + 1 to 10 days, with random time
    const baseDate = new Date(`2025-04-01`);
    baseDate.setDate(baseDate.getDate() + Math.floor(Math.random() * 10) + 1);
    baseDate.setHours(Math.floor(Math.random() * 24)); // Random hours (0-23)
    baseDate.setMinutes(Math.floor(Math.random() * 60)); // Random minutes (0-59)
    const lastModified = `${baseDate.toISOString().split('T')[0]} ${String(baseDate.getHours()).padStart(2, '0')}:${String(baseDate.getMinutes()).padStart(2, '0')}`; // Format as YYYY-MM-DD HH:MM
    jobs.push({
      id: `JOB-${String(i).padStart(3, '0')}`,
      title: titles[i % titles.length],
      numApplications: Math.floor(Math.random() * 40) + 5, // Random between 5 and 45
      deadline,
      lastModified,
      status: statuses[i % 2] // Alternates between Open and Closed (25 each)
    });
  }
  return jobs;
};

// Main JobApplication component
const JobApplication = () => {
  // State declarations
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showNoSelectionAlert, setShowNoSelectionAlert] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const masterCheckboxRef = useRef(null);

  const statuses = ['All', 'Open', 'Closed'];

  // Function to toggle filter dropdown visibility
  const toggleSection = () => {
    setIsVisible(prev => !prev);
  };

  // Initialize jobs with mock data
  const [jobs, setJobs] = useState(generateMockJobs());

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + rowsPerPage);

  // Handle checkbox selection for individual jobs
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  // Handle select all visible jobs
  const handleSelectAllVisible = () => {
    if (currentJobs.every((job) => selectedIds.includes(job.id))) {
      setSelectedIds((prev) => prev.filter((id) => !currentJobs.some((job) => job.id === id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...currentJobs.filter((job) => !prev.includes(job.id)).map((job) => job.id),
      ]);
    }
  };

  // Handle delete marked jobs
  const handleDeleteMarked = () => {
    if (selectedIds.length === 0) {
      setShowNoSelectionAlert(true);
      return;
    }
    setShowConfirmDelete(true);
  };

  // Confirm deletion of selected jobs
  const confirmDelete = () => {
    setJobs((prev) => prev.filter((job) => !selectedIds.includes(job.id)));
    setSelectedIds([]);
    setShowConfirmDelete(false);
  };

  // Reset master checkbox when page or rows change
  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.checked = false;
    }
    setSelectedIds([]);
  }, [currentPage, rowsPerPage]);

  return (
    <div className="JobApplication-sec">
      <div className="Dash-OO-Boas OOOP-LOa">
        <div className="Dash-OO-Boas-Top">
          <div className="Dash-OO-Boas-Top-1">
            <span onClick={toggleSection}><AdjustmentsHorizontalIcon className="h-6 w-6" /></span>
            <h3>Job Applications</h3>
          </div>
          <div className="Dash-OO-Boas-Top-2">
            <div className="genn-Drop-Search">
              <span><MagnifyingGlassIcon className="h-6 w-6" /></span>
              <input 
                type="text" 
                placeholder="Search applications..." 
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
              initial={{ height: 0, opacity: 0, overflow: "hidden" }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="Dash-OO-Boas Gen-Boxshadow">
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
                <th>
                  <span className="flex items-center gap-1">
                    <GlobeAltIcon className="h-5 w-5" />
                    Job ID
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    <BriefcaseIcon className="h-5 w-5" />
                    Job Title
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    <UsersIcon className="h-5 w-5" />
                    No. of Applications
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-5 w-5" />
                    Deadline for Applications
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-5 w-5" />
                    Last Modified
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    <LockClosedIcon className="h-5 w-5" />
                    Status
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    <Cog6ToothIcon className="h-5 w-5" />
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                    No matching job applications found
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
                    <td>{job.numApplications}</td>
                    <td>{job.deadline}</td>
                    <td>{job.lastModified}</td>
                    <td>
                      <span className={`status ${job.status.toLowerCase()} haggsb-status`}>
                        {job.status === 'Open' ? (
                          <LockOpenIcon className="h-5 w-5" />
                        ) : (
                          <LockClosedIcon className="h-5 w-5" />
                        )}
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <div className="gen-td-btns">
                        <Link
                          to='/company/recruitment/view-applications'
                          className="view-btn"
                        >
                          View Applications
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
        {showNoSelectionAlert && (
          <AlertModal
            title="No Selection"
            message="You have not selected any applications to delete."
            onClose={() => setShowNoSelectionAlert(false)}
          />
        )}
        {showConfirmDelete && (
          <Modal
            title="Confirm Delete"
            message={`Are you sure you want to delete ${selectedIds.length} selected application(s)? This action cannot be undone.`}
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirmDelete(false)}
            confirmText="Delete"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobApplication;