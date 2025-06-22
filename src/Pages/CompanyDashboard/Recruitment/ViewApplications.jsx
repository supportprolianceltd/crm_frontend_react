import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  CheckIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import PDFICON from '../../../assets/Img/pdf-icon.png';
import ApplicantDetails from './ApplicantDetails';
import {
  fetchJobApplicationsByRequisition,
  updateJobApplicationStatus,
  bulkDeleteJobApplications,
  screenResumes,
} from './ApiService';
import Modal from './Modal'; // Reusable Modal component
import AlertModal from './AlertModal'; // Reusable AlertModal component

// Component for animating numbers
const CountUpNumber = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

// Component for circular progress
const CircularProgress = ({ percentage, color }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg className="circular-progress" width="50" height="50">
      <circle
        className="circle-bg"
        cx="25"
        cy="25"
        r={radius}
        stroke="#e6e6e6"
        strokeWidth="5"
        fill="none"
      />
      <circle
        className="circle"
        cx="25"
        cy="25"
        r={radius}
        stroke={color}
        strokeWidth="5"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
};

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
  const [screeningInProgress, setScreeningInProgress] = useState(false);

  const location = useLocation();
  const job = location.state?.job;
  const masterCheckboxRef = useRef(null);

  // Fetch applications for the job requisition
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
        resumeUrl: app.documents.find(doc => doc.document_type.toLowerCase() === 'cv')?.file_url || '#',
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
        screening_score: app.screening_score || 0,
        screening_status: app.screening_status || 'Pending',
      }));

      setApplicantData(transformedData);
      setJobTitle(transformedData[0]?.jobTitle || 'Job Applications');
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch applications');
      setLoading(false);
    }
  }, [job]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Trigger resume screening
  const handleScreenResumes = async () => {
    setScreeningInProgress(true);
    try {
      await screenResumes(job.id);
      await fetchApplications(); // Refresh data to show updated scores
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to screen resumes');
    } finally {
      setScreeningInProgress(false);
    }
  };

  // Calculate statistics for status cards
  const calculateStats = () => {
    const statusCounts = {
      New: 0,
      Shortlisted: 0,
      Rejected: 0,
      Hired: 0,
    };

    applicantData.forEach(applicant => {
      if (statusCounts.hasOwnProperty(applicant.status)) {
        statusCounts[applicant.status]++;
      }
    });

    const total = applicantData.length;
    return Object.entries(statusCounts).map(([title, count]) => ({
      title,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      color: {
        New: '#3b82f6',
        Shortlisted: '#10b981',
        Rejected: '#ef4444',
        Hired: '#8b5cf6',
      }[title],
    }));
  };

  const stats = calculateStats();

  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    const visibleApplicants = currentApplicants.map(app => app.id);
    const allSelected = visibleApplicants.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !visibleApplicants.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...visibleApplicants])]);
    }
  };

  // Handle bulk delete
  const handleDeleteMarked = () => {
    if (selectedIds.length === 0) {
      setShowNoSelectionAlert(true);
      return;
    }
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await bulkDeleteJobApplications(selectedIds);
      setSelectedIds([]);
      setShowConfirmDelete(false);
      fetchApplications();
    } catch (err) {
      setError(err.message || 'Failed to delete applications');
    }
  };

  // Toggle filter section visibility
  const toggleSection = () => {
    setIsVisible(!isVisible);
  };

  // Handle view details click
  const handleViewClick = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantDetails(true);
  };

  // Close applicant details
  const handleCloseDetails = () => {
    setShowApplicantDetails(false);
    setSelectedApplicant(null);
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateJobApplicationStatus(id, newStatus);
      fetchApplications();
      if (selectedApplicant && selectedApplicant.id === id) {
        setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  // Handle card click for filtering
  const handleCardClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Filter and paginate applicants
  const filteredApplicants = applicantData.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredApplicants.length / rowsPerPage);
  const currentApplicants = filteredApplicants.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Render table
  const renderTable = () => (
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
  );

  // Render pagination
  const renderPagination = () => (
    <div className="pagination">
      <div className="rows-per-page">
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div className="page-controls">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="YUa-Opal-sec ViewApplications-PPGA">
      <div className="YUa-Opal-Part-1">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
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
              <h3>{jobTitle}</h3>
              <button
                className="btn-primary-bg"
                onClick={handleScreenResumes}
                disabled={screeningInProgress}
              >
                {screeningInProgress ? 'Screening...' : 'Screen Resumes'}
              </button>
            </div>

            <div className="Dash-OO-Boas Gen-Boxshadow">
              <div className="Gllla-Toopa-2">
                <div className="Gllla-Toopa-2-Left">
                  <button
                    className="btn-primary-bg delete-marked-btn"
                    onClick={handleDeleteMarked}
                  >
                    Delete Marked
                  </button>
                </div>
                <div className="Gllla-Toopa-2-Right">
                  <div className="search-container">
                    <MagnifyingGlassIcon className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search Applicants"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <button className="filter-btn" onClick={toggleSection}>
                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="filter-section"
                  >
                    <h4>Filter By</h4>
                    <div className="filter-options">
                      <select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Hired">Hired</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="table-container">
                {renderTable()}
              </div>

              {renderPagination()}
            </div>
          </>
        )}
      </div>

      <div className="YUa-Opal-Part-2">
        {/* Sidebar or other content */}
      </div>

      {showApplicantDetails && selectedApplicant && (
        <ApplicantDetails
          job={job}
          applicant={selectedApplicant}
          onClose={handleCloseDetails}
          onStatusChange={handleStatusChange}
        />
      )}

      <AnimatePresence>
        {showConfirmDelete && (
          <Modal
            title="Confirm Delete"
            message={`Are you sure you want to delete ${selectedIds.length} application(s)?`}
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirmDelete(false)}
          />
        )}
        {showNoSelectionAlert && (
          <AlertModal
            title="No Selection"
            message="Please select at least one application to delete."
            onClose={() => setShowNoSelectionAlert(false)}
          />
        )}
        {error && (
          <AlertModal
            title="Error"
            message={error}
            onClose={() => setError(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewApplications;