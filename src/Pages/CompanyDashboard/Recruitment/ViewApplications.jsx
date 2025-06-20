import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { ArrowTrendingUpIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, CheckCircleIcon, CheckIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PDFICON from '../../../assets/Img/pdf-icon.png';
import ApplicantDetails from './ApplicantDetails';
import { Link } from 'react-router-dom';

// Generate static applicant data once
const staticApplicantData = (() => {
  const baseApplicants = [
    {
      id: 'APP-001',
      name: 'John Doe',
      jobTitle: 'UI Designer',
      dateApplied: 'Jun 11, 2025',
      status: 'Rejected',
      source: 'Website',
    },
    {
      id: 'APP-002',
      name: 'Jane Smith',
      jobTitle: 'Product Manager',
      dateApplied: 'Jun 10, 2025',
      status: 'Shortlisted',
      source: 'LinkedIn',
    },
    {
      id: 'APP-003',
      name: 'Alex Chuka',
      jobTitle: 'Frontend Developer',
      dateApplied: 'Jun 9, 2025',
      status: 'Rejected',
      source: 'Referral',
    },
    {
      id: 'APP-004',
      name: 'Emma Wilson',
      jobTitle: 'Backend Developer',
      dateApplied: 'Jun 8, 2025',
      status: 'Rejected',
      source: 'Website',
    },
    {
      id: 'APP-005',
      name: 'Michael Brown',
      jobTitle: 'Full Stack Developer',
      dateApplied: 'Jun 7, 2025',
      status: 'Shortlisted',
      source: 'Website',
    },
  ];

  const jobTitles = [
    'UI Designer', 'Product Manager', 'Frontend Developer', 
    'Backend Developer', 'Full Stack Developer', 'UX Designer',
    'DevOps Engineer', 'Data Scientist', 'Mobile Developer'
  ];
  
  const sources = ['Website', 'LinkedIn', 'Referral', 'Indeed', 'Glassdoor'];

  // Define status distribution for remaining applicants (100 - 5 = 95)
  // Base applicants have: 3 Rejected, 2 Shortlisted
  // Need: 80 - 3 = 77 Rejected, 20 - 2 = 18 Shortlisted, 0 Hired
  const statusDistribution = [
    ...Array(77).fill('Rejected'),
    ...Array(18).fill('Shortlisted'),
  ];

  // Shuffle the status distribution
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledStatuses = shuffleArray([...statusDistribution]);

  const additionalApplicants = Array.from({ length: 95 }, (_, i) => {
    const id = `APP-${(i + 6).toString().padStart(3, '0')}`;
    const baseIndex = i % baseApplicants.length;
    const baseDate = new Date(2025, 5, 14 - Math.floor(i/10));
    
    return {
      id,
      name: `${baseApplicants[baseIndex].name.split(' ')[0]} ${String.fromCharCode(65 + (i % 10))}`,
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      dateApplied: baseDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      status: shuffledStatuses[i],
      source: sources[Math.floor(Math.random() * sources.length)],
    };
  });

  // Combine base and additional applicants
  const allApplicants = [...baseApplicants, ...additionalApplicants];

  // Verify status counts
  const statusCounts = allApplicants.reduce((acc, { status }) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Ensure exact counts: 80 Rejected, 20 Shortlisted, 0 Hired
  if (statusCounts.Rejected !== 80 || statusCounts.Shortlisted !== 20 || statusCounts.Hired !== 0) {
    console.warn('Status counts mismatch:', statusCounts);
    // Adjust statuses if necessary
    const targetCounts = { Rejected: 80, Shortlisted: 20, Hired: 0 };
    let adjustedApplicants = [...allApplicants];
    let availableIndices = adjustedApplicants.map((_, i) => i).slice(5); // Skip base applicants

    for (const [status, target] of Object.entries(targetCounts)) {
      let currentCount = statusCounts[status] || 0;
      while (currentCount > target && availableIndices.length > 0) {
        const randomIndex = availableIndices.splice(Math.floor(Math.random() * availableIndices.length), 1)[0];
        adjustedApplicants[randomIndex].status = 'Placeholder';
        currentCount--;
        statusCounts[status] = (statusCounts[status] || 0) - 1;
      }
    }

    for (let i = 5; i < adjustedApplicants.length; i++) {
      if (adjustedApplicants[i].status === 'Placeholder') {
        if (statusCounts.Rejected < 80) {
          adjustedApplicants[i].status = 'Rejected';
          statusCounts.Rejected = (statusCounts.Rejected || 0) + 1;
        } else if (statusCounts.Shortlisted < 20) {
          adjustedApplicants[i].status = 'Shortlisted';
          statusCounts.Shortlisted = (statusCounts.Shortlisted || 0) + 1;
        }
      }
    }

    return adjustedApplicants;
  }

  return allApplicants;
})();

const Modal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
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
          className="rounded bg-gray-300 px-4 py-2 font-semibold hover:bg-gray-400"
          onClick={onCancel}
        >
          {cancelText}
        </button>
        <button
          className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          onClick={onConfirm}
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
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
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={onClose}
          autoFocus
        >
          OK
        </button>
      </div>
    </motion.div>
  </AnimatePresence>
);

const CountUpNumber = ({ target, duration = 1 }) => {
  const count = useMotionValue(0);
  const [current, setCurrent] = useState(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setCurrent(Math.round(latest)),
    });
    return () => controls.stop();
  }, [count, target, duration]);

  return <motion.span>{current}</motion.span>;
};

const CircularProgress = ({ percentage, color }) => {
  const radius = 30;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.svg
      height={radius * 2}
      width={radius * 2}
      className="circular-progress"
    >
      <circle
        stroke="#f0f0f0"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <motion.circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1 }}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="10"
        fill="#333"
        fontWeight="500"
      >
        {percentage}%
      </text>
    </motion.svg>
  );
};

const ApplicationStatsChart = ({ data }) => (
  <div style={{ width: '100%', height: 180 }}>
    <h3>Applications Overview</h3>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <XAxis
          dataKey="title"
          tick={{ fontSize: 7 }}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={30}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 7 }}
          width={30}
        />
        <Tooltip wrapperStyle={{ fontSize: '0.85rem' }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const ViewApplications = () => {
  const [applicantData, setApplicantData] = useState(staticApplicantData);

  const [applicantData, setApplicantData] = useState(generateApplicantData());
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showNoSelectionAlert, setShowNoSelectionAlert] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);

  const calculateStats = useCallback(() => {
    const total = applicantData.length;
    const shortlisted = applicantData.filter(a => a.status === 'Shortlisted').length;
    const hired = applicantData.filter(a => a.status === 'Hired').length;
    const rejected = applicantData.filter(a => a.status === 'Rejected').length;

    return [
      { title: 'Total Applications', count: total, percentage: 100, color: '#6DD5FA' },
      { title: 'Shortlisted', count: shortlisted, percentage: (shortlisted / total) * 100, color: '#FF9770' },
      { title: 'Hired', count: hired, percentage: (hired / total) * 100, color: '#2DD4BF' },
      { title: 'Rejected', count: rejected, percentage: (rejected / total) * 100, color: '#E54BFF' },
    ];
  }, [applicantData]);

  const stats = calculateStats();

  const statuses = ['All', ...new Set(applicantData.map(applicant => applicant.status))];

  const filteredApplicants = applicantData.filter(applicant => {
    const matchesSearch =
      applicant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.dateApplied.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || applicant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredApplicants.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentApplicants = filteredApplicants.slice(startIdx, startIdx + rowsPerPage);

  const masterCheckboxRef = useRef(null);

  useEffect(() => {
    const allVisibleSelected = currentApplicants.every(applicant => selectedIds.includes(applicant.id));
    const someSelected = currentApplicants.some(applicant => selectedIds.includes(applicant.id));
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = !allVisibleSelected && someSelected;
    }
  }, [selectedIds, currentApplicants]);

  useEffect(() => {
    const maxPage = Math.ceil(filteredApplicants.length / rowsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
  }, [rowsPerPage, filteredApplicants.length, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, rowsPerPage]);

  const handleCheckboxChange = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    const allVisibleIds = currentApplicants.map(applicant => applicant.id);
    const areAllVisibleSelected = allVisibleIds.every(id => selectedIds.includes(id));
    if (areAllVisibleSelected) {
      setSelectedIds(prev => prev.filter(id => !allVisibleIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...allVisibleIds])]);
    }
  };

  const handleDeleteMarked = () => {
    if (selectedIds.length === 0) {
      setShowNoSelectionAlert(true);
      return;
    }
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    const newApplicants = applicantData.filter(applicant => !selectedIds.includes(applicant.id));
    setApplicantData(newApplicants);
    setSelectedIds([]);
    if (currentPage > Math.ceil(newApplicants.length / rowsPerPage)) {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    }
    setShowConfirmDelete(false);
  };

  const toggleSection = () => {
    setIsVisible(prev => !prev);
  };

  const handleViewClick = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantDetails(true);
  };

  const handleCloseDetails = () => {
    setShowApplicantDetails(false);
    setSelectedApplicant(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setApplicantData(prev => 
      prev.map(applicant => 
        applicant.id === id ? {...applicant, status: newStatus} : applicant
      )
    );
  };

  const handleCardClick = (title) => {
    const filterMap = {
      'Total Applications': 'All',
      'Shortlisted': 'Shortlisted',
      'Hired': 'Hired',
      'Rejected': 'Rejected',
    };
    setStatusFilter(filterMap[title] || 'All');
    setCurrentPage(1);
  };

  return (
    <div className="YUa-Opal-sec ViewApplications-PPGA">
      <div className="YUa-Opal-Part-1">
        <div className="Gtah-Cardaa">
          {stats.map((item, index) => (
            <div
              className="glo-Top-Card Gen-Boxshadow uayh-AccraD"
              key={index}
              onClick={() => handleCardClick(item.title)}
              style={{ cursor: 'pointer' }}
            >
              <p>{item.title}</p>
              <div className="Gllla-SUboopaCard">
                <div className="Gllla-SUboopaCard-1">
                  <h3><CountUpNumber target={item.count} /></h3>
                  <h4>
                    <span><ArrowTrendingUpIcon className="w-4 h-4 inline" /></span>
                    {item.percentage}% from Start
                  </h4>
                </div>
                <div className="Gllla-SUboopaCard-2">
                  <div className="circular-section">
                    <CircularProgress percentage={item.percentage} color={item.color} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="Gllla-Toopa">
          <h3>Frontend Website Developer</h3>
        </div>

        <div className="Dash-OO-Boas Gen-Boxshadow">
          <div className="Dash-OO-Boas-Top">
            <div className="Dash-OO-Boas-Top-1">
              <span onClick={toggleSection}><AdjustmentsHorizontalIcon /></span>
              <h3>Applicant List</h3>
            </div>
            <div className="Dash-OO-Boas-Top-2">
              <div className="genn-Drop-Search">
                <span><MagnifyingGlassIcon /></span>
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
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
                  onChange={e => setStatusFilter(e.target.value)}
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

          <div className="table-container">
            <table className="Gen-Sys-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      ref={masterCheckboxRef}
                      onChange={handleSelectAllVisible}
                      checked={currentApplicants.length > 0 && currentApplicants.every(applicant => selectedIds.includes(applicant.id))}
                    />
                  </th>
                  <th>Applicant Name</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Resume</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentApplicants.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                      No matching applicants found
                    </td>
                  </tr>
                ) : (
                  currentApplicants.map(applicant => (
                    <tr key={applicant.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(applicant.id)}
                          onChange={() => handleCheckboxChange(applicant.id)}
                        />
                      </td>
                      <td>{applicant.name}</td>
                      <td>{applicant.dateApplied}</td>
                      <td>
                        <span className={`status ${applicant.status.toLowerCase()}`}>
                          {applicant.status}
                          {applicant.status === 'Shortlisted' && (
                            <CheckIcon className="w-4 h-4 inline ml-1" />
                          )}
                        </span>
                      </td>
                      <td>{applicant.source}</td>
                      <td>
                        <a href="#" target='_blank' className="resume-link">
                          <img src={PDFICON} alt="PDF Resume" className="pdf-icon" />
                          View
                        </a>
                      </td>
                      <td>
                        <div className="gen-td-btns">
                          <button
                            className="view-btn"
                            onClick={() => handleViewClick(applicant)}
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredApplicants.length > 0 && (
            <div className="pagination-controls">
              <div className="Dash-OO-Boas-foot">
                <div className="Dash-OO-Boas-foot-1">
                  <div className="items-per-page">
                    <p>Number of rows:</p>
                    <select
                      className="form-select"
                      value={rowsPerPage}
                      onChange={e => setRowsPerPage(Number(e.target.value))}
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
                    {currentApplicants.every(applicant => selectedIds.includes(applicant.id)) ? 'Unmark All' : 'Mark All'}
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
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="page-button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence>
            {showConfirmDelete && (
              <Modal
                title="Confirm Delete"
                message={`Are you sure you want to delete ${selectedIds.length} applicant(s)? This action cannot be undone.`}
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
                message="You have not selected any applicants to delete."
                onClose={() => setShowNoSelectionAlert(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="YUa-Opal-Part-2">
        <div className="Top-GHY-s">
          <Link to='/job-application' className='link-btn btn-primary-bg'>
            Visit Site
          </Link>
          <p>Created on <span>2025-06-02 ✦ 9:21 AM</span></p>
        </div>
        <div className="yyess-sec">
          <ApplicationStatsChart data={stats} />
        </div>
      </div>

      {showApplicantDetails && selectedApplicant && (
        <ApplicantDetails 
          job={{ title: 'Frontend Website Developer' }}
          applicant={selectedApplicant}
          onClose={handleCloseDetails}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ViewApplications;