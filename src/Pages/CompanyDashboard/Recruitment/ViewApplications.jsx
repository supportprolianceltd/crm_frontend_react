import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { ArrowTrendingUpIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, CheckCircleIcon, CheckIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PDFICON from '../../../assets/Img/pdf-icon.png';
import ApplicantDetails from './ApplicantDetails';
import { Link, useLocation } from 'react-router-dom';
import { fetchJobApplicationsByRequisition, updateJobApplicationStatus, bulkDeleteJobApplications, screenResumes } from './ApiService';

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
  const [applicantData, setApplicantData] = useState([]);
  const [jobTitle, setJobTitle] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screeningResults, setScreeningResults] = useState(null);
  const [showScreeningAlert, setShowScreeningAlert] = useState(false);

  const location = useLocation();
  const job = location.state?.job;
  const masterCheckboxRef = useRef(null);

  const fetchApplications = useCallback(async () => {
    if (!job) {
      setError('No job ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchJobApplicationsByRequisition(job.id);
      const transformedData = response.map(app => ({
        id: app.id,
        name: app.full_name,
        jobTitle: app.job_requisition?.title || 'Unknown',
        dateApplied: new Date(app.applied_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        source: app.source || 'Unknown',
        resumeUrl: app.documents.find(doc => doc.document_type === 'CV')?.file_url || '#',
        email: app.email || 'Not provided',
        phone: app.phone || 'Not provided',
        qualification: app.qualification || 'Not provided',
        experience: app.experience || 'Not provided',
        knowledge_skill: app.knowledge_skill || 'Not provided',
        cover_letter: app.cover_letter || 'No cover letter provided',
        documents: app.documents.map(doc => ({
          name: doc.document_type,
          type: doc.document_type,
          file_url: doc.file_url,
          size: doc.size || 'Unknown',
        })) || [],
        jobType: app.job_type || 'Not provided',
        location: app.location || 'Not provided',
        address: app.address || 'Not provided',
        salary: app.salary || 'Not provided',
        company: job.company_name || 'Not provided',
        screening_score: app.screening_score || 0,
      }));

      setApplicantData(transformedData);
      setJobTitle(transformedData[0]?.jobTitle || 'Job Applications');
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch applications');
      setLoading(false);
    }
  }, [job]);

  const handleScreenResumes = async () => {
    try {
      setLoading(true);
      const response = await screenResumes(job.id);
      setScreeningResults(response);
      setShowScreeningAlert(true);
      await fetchApplications(); // Refresh data to reflect updated statuses
    } catch (err) {
      setError(err.message || 'Failed to screen resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const calculateStats = useCallback(() => {
    const total = applicantData.length;
    const shortlisted = applicantData.filter(a => a.status === 'Shortlisted').length;
    const hired = applicantData.filter(a => a.status === 'Hired').length;
    const rejected = applicantData.filter(a => a.status === 'Rejected').length;

    return [
      { title: 'Total Applications', count: total, percentage: 100, color: '#6DD5FA' },
      { title: 'Shortlisted', count: shortlisted, percentage: total ? (shortlisted / total) * 100 : 0, color: '#FF9770' },
      { title: 'Hired', count: hired, percentage: total ? (hired / total) * 100 : 0, color: '#2DD4BF' },
      { title: 'Rejected', count: rejected, percentage: total ? (rejected / total) * 100 : 0, color: '#E54BFF' },
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

  const handleDeleteMarked = async () => {
    if (selectedIds.length === 0) {
      setShowNoSelectionAlert(true);
      return;
    }
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await bulkDeleteJobApplications(selectedIds);
      await fetchApplications();
      setSelectedIds([]);
      setShowConfirmDelete(false);
    } catch (err) {
      setError(err.message || 'Failed to delete applications');
      setShowConfirmDelete(false);
    }
  };

  const toggleSection = () => {
    setIsVisible(prev => !prev);
  };

  const handleViewClick = applicant => {
    setSelectedApplicant(applicant);
    setShowApplicantDetails(true);
  };

  const handleCloseDetails = () => {
    setShowApplicantDetails(false);
    setSelectedApplicant(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateJobApplicationStatus(id, newStatus.toLowerCase());
      await fetchApplications();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleCardClick = title => {
    const filterMap = {
      'Total Applications': 'All',
      Shortlisted: 'Shortlisted',
      Hired: 'Hired',
      Rejected: 'Rejected',
    };
    setStatusFilter(filterMap[title] || 'All');
    setCurrentPage(1);
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return (
      <AlertModal
        title="Error"
        message={error}
        onClose={() => setError(null)}
      />
    );
  }

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
                  <h3>
                    <CountUpNumber target={item.count} />
                  </h3>
                  <h4>
                    <span>
                      <ArrowTrendingUpIcon className="w-4 h-4 inline" />
                    </span>
                    {item.percentage.toFixed(1)}% from Start
                  </h4>
                </div>
                <div className="Gllla-SUboopaCard-2">
                  <div className="circular-section">
                    <CircularProgress percentage={item.percentage.toFixed(1)} color={item.color} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="Gllla-Toopa">
          <h3>{job?.title}</h3>
          <button className="screen-resumes-btn" onClick={handleScreenResumes}>
            <DocumentCheckIcon className="h-6 w-6 inline mr-1" />
            Screen Resumes
          </button>
        </div>

        {screeningResults && (
          <div className="screening-results Gen-Boxshadow">
            <h3>Screening Results</h3>
            <p>{screeningResults.detail}</p>
            <table className="Gen-Sys-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Screening Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {screeningResults.shortlisted_candidates.map(candidate => (
                  <tr key={candidate.application_id}>
                    <td>{candidate.full_name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.score}%</td>
                    <td>{candidate.screening_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="Dash-OO-Boas Gen-Boxshadow">
          <div className="Dash-OO-Boas-Top">
            <div className="Dash-OO-Boas-Top-1">
              <span onClick={toggleSection}>
                <AdjustmentsHorizontalIcon />
              </span>
              <h3>Applicant List</h3>
            </div>
            <div className="Dash-OO-Boas-Top-2">
              <div className="genn-Drop-Search">
                <span>
                  <MagnifyingGlassIcon />
                </span>
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
                initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                animate={{ height: 'auto', opacity: 1 }}
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
                  <th>Screening Score</th>
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
                          {applicant.status === 'Shortlisted' && <CheckIcon className="w-4 h-4 inline ml-1" />}
                        </span>
                      </td>
                      <td>{applicant.source}</td>
                      <td>
                        <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="resume-link">
                          <img src={PDFICON} alt="PDF Resume" className="pdf-icon" />
                          View
                        </a>
                      </td>
                      <td>{applicant.screening_score ? `${applicant.screening_score}%` : 'Not Screened'}</td>
                      <td>
                        <div className="gen-td-btns">
                          <button className="view-btn" onClick={() => handleViewClick(applicant)}>
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

          <AnimatePresence>
            {showScreeningAlert && screeningResults && (
              <AlertModal
                title="Screening Completed"
                message={screeningResults.detail}
                onClose={() => {
                  setShowScreeningAlert(false);
                  // Optionally clear results after viewing
                  // setScreeningResults(null);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="YUa-Opal-Part-2">
        <div className="Top-GHY-s">
          <Link to="/job-application" className="link-btn btn-primary-bg">
            Visit Site
          </Link>
          <p>
            Created on <span>2025-06-02 ✦ 9:21 AM</span>
          </p>
        </div>
        <div className="yyess-sec">
          <ApplicationStatsChart data={stats} />
        </div>
      </div>

      {showApplicantDetails && selectedApplicant && (
        <ApplicantDetails
          job={{ job }}
          applicant={selectedApplicant}
          onClose={handleCloseDetails}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ViewApplications;