import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { FaRecycle } from 'react-icons/fa';
import {
  UsersIcon as UsersOutline,
  CalendarDaysIcon as CalendarOutline,
  BriefcaseIcon as BriefcaseOutline,
  ChartBarIcon as ChartBarOutline,
  ServerStackIcon as ServerStackOutline,
} from '@heroicons/react/24/outline';
import {
  UsersIcon as UsersSolid,
  CalendarDaysIcon as CalendarSolid,
  BriefcaseIcon as BriefcaseSolid,
  ChartBarIcon as ChartBarSolid,
  ServerStackIcon as ServerStackSolid,
} from '@heroicons/react/24/solid';

const tabs = [
  { id: 'job-requisition', label: 'Job Requisition', OutlineIcon: BriefcaseOutline, SolidIcon: BriefcaseSolid },
  { id: 'job-adverts', label: 'Job Adverts', OutlineIcon: ChartBarOutline, SolidIcon: ChartBarSolid },
  { id: 'applications', label: 'Applications', OutlineIcon: UsersOutline, SolidIcon: UsersSolid },
  { id: 'scheduled-interviews', label: 'Scheduled Interviews', OutlineIcon: CalendarOutline, SolidIcon: CalendarSolid },
  { id: 'api-integrations', label: 'API Integrations', OutlineIcon: ServerStackOutline, SolidIcon: ServerStackSolid },
];

const ROLES = ['Admin', 'User', 'Manager', 'Editor', 'Viewer'];
const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
const LOCATIONS = ['New York', 'London', 'Tokyo', 'Remote'];
const JOB_BOARDS = ['Indeed', 'LinkedIn', 'Glassdoor', 'Monster'];

// Generate mock data for each tab
const generateMockData = (type, count = 50) => {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const date = `2025-${String((i % 3) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`;
    const dateTime = `2025-${String((i % 3) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:00`;
    let item;
    switch (type) {
      case 'job-requisition':
        item = {
          id: `REQ-${String(i).padStart(3, '0')}`,
          title: `Requisition-${String(i).padStart(2, '0')}`,
          status: 'Deleted',
          requestDate: date,
          requestedBy: `User${i}`,
          role: ROLES[i % ROLES.length]
        };
        break;
      case 'job-adverts':
        item = {
          id: `ADV-${String(i).padStart(3, '0')}`,
          jobTitle: `Job-Ad-${String(i).padStart(2, '0')}`,
          jobType: JOB_TYPES[i % JOB_TYPES.length],
          location: LOCATIONS[i % LOCATIONS.length],
          deadline: date,
          status: 'Deleted',
          applicationLink: `https://example.com/apply/${i}`
        };
        break;
      case 'applications':
        item = {
          id: `APP-${String(i).padStart(3, '0')}`,
          jobTitle: `Job-App-${String(i).padStart(2, '0')}`,
          noOfApplications: i % 100,
          deadline: date,
          lastModified: date,
          status: 'Deleted'
        };
        break;
      case 'scheduled-interviews':
        item = {
          id: `INT-${String(i).padStart(3, '0')}`,
          position: `Position-${String(i).padStart(2, '0')}`,
          candidate: `Candidate${i}`,
          interviewDateTime: dateTime,
          lastModified: date,
          status: 'Deleted'
        };
        break;
      case 'api-integrations':
        item = {
          id: `API-${String(i).padStart(3, '0')}`,
          jobBoard: JOB_BOARDS[i % JOB_BOARDS.length],
          apiKey: `key-${String(i).padStart(3, '0')}`,
          activePostings: i % 10,
          createdDate: date,
          lastSync: date,
          status: 'Deleted'
        };
        break;
      default:
        item = {};
    }
    data.push(item);
  }
  return data;
};

// Modal component
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

// AlertModal component
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
    >
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="rounded bg-blue-600 px-7 py-2 font-semibold text-white hover:bg-blue-700"
          autoFocus
        >
          OK
        </button>
      </div>
    </motion.div>
  </AnimatePresence>
);

const RecycleBin = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showNoSelectionAlert, setShowNoSelectionAlert] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  const [restoreRequestId, setRestoreRequestId] = useState(null);
  const masterCheckboxRef = useRef(null);

  // Initialize data for each tab
  const [data, setData] = useState({
    'job-requisition': generateMockData('job-requisition'),
    'job-adverts': generateMockData('job-adverts'),
    'applications': generateMockData('applications'),
    'scheduled-interviews': generateMockData('scheduled-interviews'),
    'api-integrations': generateMockData('api-integrations'),
  });

  // Reset selections and checkbox when page, rows, or tab changes
  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.checked = false;
    }
    setSelectedIds([]);
  }, [currentPage, rowsPerPage, activeTab]);

  // Filter data for the active tab
  const filteredData = data[activeTab].filter((item) => {
    switch (activeTab) {
      case 'job-requisition':
        return (
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'job-adverts':
        return (
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.applicationLink.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'applications':
        return (
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(item.noOfApplications).includes(searchTerm.toLowerCase())
        );
      case 'scheduled-interviews':
        return (
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.interviewDateTime.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'api-integrations':
        return (
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.jobBoard.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.apiKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(item.activePostings).includes(searchTerm.toLowerCase())
        );
      default:
        return true;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((requestId) => requestId !== id) : [...prev, id]
    );
  };

  // Handle select all visible items
  const handleSelectAllVisible = () => {
    if (currentData.every((item) => selectedIds.includes(item.id))) {
      setSelectedIds((prev) => prev.filter((id) => !currentData.some((item) => item.id === id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...currentData.filter((item) => !prev.includes(item.id)).map((item) => item.id),
      ]);
    }
  };

  // Handle permanent delete marked items
  const handleDeleteMarked = () => {
    if (selectedIds.length === 0) {
      setShowNoSelectionAlert(true);
      return;
    }
    setShowConfirmDelete(true);
  };

  // Handle single item permanent deletion
  const handleDeleteSingle = (id) => {
    setDeleteRequestId(id);
    setShowConfirmDelete(true);
  };

  // Handle single item restoration
  const handleRestoreSingle = (id) => {
    setRestoreRequestId(id);
    setShowConfirmRestore(true);
  };

  // Confirm permanent deletion
  const confirmDelete = () => {
    if (deleteRequestId) {
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((item) => item.id !== deleteRequestId)
      }));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteRequestId));
      setDeleteRequestId(null);
    } else {
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((item) => !selectedIds.includes(item.id))
      }));
      setSelectedIds([]);
    }
    setShowConfirmDelete(false);
  };

  // Confirm restoration
  const confirmRestore = () => {
    setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((item) => item.id !== restoreRequestId)
      }));
      setSelectedIds((prev) => prev.filter((id) => id !== restoreRequestId));
      setRestoreRequestId(null);
      setShowConfirmRestore(false);
    };
  
    // Render table headers based on tab
    const renderTableHeaders = () => {
      let headers = [];
      switch (activeTab) {
        case 'job-requisition':
          headers = ['Request ID', 'Title', 'Status', 'Request Date', 'Requested By', 'Role'];
          break;
        case 'job-adverts':
          headers = ['Job ID', 'Job Title', 'Job Type', 'Location', 'Deadline for Applications', 'Status', 'Application Link'];
          break;
        case 'applications':
          headers = ['Job ID', 'Job Title', 'No. of Applications', 'Deadline for Applications', 'Last Modified', 'Status'];
          break;
        case 'scheduled-interviews':
          headers = ['Schedule ID', 'Position', 'Candidate', 'Interview Date/Time', 'Last Modified', 'Status'];
          break;
        case 'api-integrations':
          headers = ['Board ID', 'Job Board', 'API Key', 'Active Postings', 'Created Date', 'Last Sync', 'Status'];
          break;
        default:
          break;
      }
      return headers.map((header) => (
        <th key={header}><span className="flex items-center gap-1">{header}</span></th>
      ));
    };
  
    // Render table row data based on tab
    const renderTableRow = (item) => {
      let rowData = [];
      switch (activeTab) {
        case 'job-requisition':
          rowData = [
            item.id,
            item.title,
            <span className={`status deleted haggsb-status`}>{item.status}</span>,
            item.requestDate,
            item.requestedBy,
            item.role
          ];
          break;
        case 'job-adverts':
          rowData = [
            item.id,
            item.jobTitle,
            item.jobType,
            item.location,
            item.deadline,
            <span className={`status deleted haggsb-status`}>{item.status}</span>,
            <a href={item.applicationLink} target="_blank" rel="noopener noreferrer">Apply</a>
          ];
          break;
        case 'applications':
          rowData = [
            item.id,
            item.jobTitle,
            item.noOfApplications,
            item.deadline,
            item.lastModified,
            <span className={`status deleted haggsb-status`}>{item.status}</span>
          ];
          break;
        case 'scheduled-interviews':
          rowData = [
            item.id,
            item.position,
            item.candidate,
            item.interviewDateTime,
            item.lastModified,
            <span className={`status deleted haggsb-status`}>{item.status}</span>
          ];
          break;
        case 'api-integrations':
          rowData = [
            item.id,
            item.jobBoard,
            item.apiKey,
            item.activePostings,
            item.createdDate,
            item.lastSync,
            <span className={`status deleted haggsb-status`}>{item.status}</span>
          ];
          break;
        default:
          break;
      }
      return rowData.map((cell, index) => <td key={index}>{cell}</td>);
    };
  
    return (
      <div className="RecycleBin-sec">
        <div className="OLIK-NAVVVB OLik-Srfga">
          {tabs.map(({ id, label, OutlineIcon, SolidIcon }) => {
            const isActive = activeTab === id;
            const Icon = isActive ? SolidIcon : OutlineIcon;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setCurrentPage(1);
                  setSelectedIds([]);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                  isActive
                    ? 'active-OLika bg-blue-100 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            );
          })}
        </div>
  
        <div className="Dash-OO-Boas OOOP-LOa">
          <div className="Dash-OO-Boas-Top">
            <div className="Dash-OO-Boas-Top-1">
              <h3>Recycle Bin - {tabs.find(tab => tab.id === activeTab).label}</h3>
            </div>
            <div className="Dash-OO-Boas-Top-2">
              <div className="genn-Drop-Search">
                <span><MagnifyingGlassIcon className="h-6 w-6" /></span>
                <input
                  type="text"
                  placeholder={`Search deleted ${activeTab.replace('-', ' ')}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
  
        <div className="Dash-OO-Boas Gen-Boxshadow">
          <div className="oujah-Oujka">
            <h3>Deleted {tabs.find(tab => tab.id === activeTab).label}</h3>
          </div>
          <div className="table-container">
            <table className="Gen-Sys-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      ref={masterCheckboxRef}
                      onChange={handleSelectAllVisible}
                      checked={currentData.length > 0 && currentData.every((item) => selectedIds.includes(item.id))}
                    />
                  </th>
                  {renderTableHeaders()}
                  <th><span className="flex items-center gap-1">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={renderTableHeaders().length + 2} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                      No deleted {activeTab.replace('-', ' ')} found
                    </td>
                  </tr>
                ) : (
                  currentData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                      </td>
                      {renderTableRow(item)}
                      <td>
                        <div className="gen-td-btns">
                          <button
                            onClick={() => handleRestoreSingle(item.id)}
                            className="link-btn btn-primary-bg"
                          >
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            Restore
                          </button>
                          <button
                            onClick={() => handleDeleteSingle(item.id)}
                            className="view-btn"
                          >
                            <FaRecycle className="h-4 w-4 mr-1" />
                            Permanently Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
  
          {filteredData.length > 0 && (
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
                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                    {currentData.every((item) => selectedIds.includes(item.id)) ? 'Unmark All' : 'Mark All'}
                  </button>
                  <button onClick={handleDeleteMarked} className="delete-marked-btn">
                    <FaRecycle className="h-5 w-5 mr-1" />
                    Permanently Delete Marked
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
              message="You have not selected any items to delete."
              onClose={() => setShowNoSelectionAlert(false)}
            />
          )}
          {showConfirmDelete && (
            <Modal
              title="Confirm Permanent Deletion"
              message={
                deleteRequestId
                  ? `Are you sure you want to permanently delete the ${activeTab.replace('-', ' ')} "${
                      activeTab === 'job-requisition' ? data[activeTab].find(r => r.id === deleteRequestId)?.title :
                      activeTab === 'job-adverts' ? data[activeTab].find(r => r.id === deleteRequestId)?.jobTitle :
                      activeTab === 'applications' ? data[activeTab].find(r => r.id === deleteRequestId)?.jobTitle :
                      activeTab === 'scheduled-interviews' ? data[activeTab].find(r => r.id === deleteRequestId)?.position :
                      data[activeTab].find(r => r.id === deleteRequestId)?.jobBoard
                    }"? This action cannot be undone.`
                  : `Are you sure you want to permanently delete ${selectedIds.length} selected ${activeTab.replace('-', ' ')}(s)? This action cannot be undone.`
              }
              onConfirm={confirmDelete}
              onCancel={() => {
                setShowConfirmDelete(false);
                setDeleteRequestId(null);
              }}
              confirmText="Permanently Delete"
              cancelText="Cancel"
            />
          )}
          {showConfirmRestore && (
            <Modal
              title="Confirm Restore"
              message={`Are you sure you want to restore the ${activeTab.replace('-', ' ')} "${
                activeTab === 'job-requisition' ? data[activeTab].find(r => r.id === restoreRequestId)?.title :
                activeTab === 'job-adverts' ? data[activeTab].find(r => r.id === restoreRequestId)?.jobTitle :
                activeTab === 'applications' ? data[activeTab].find(r => r.id === restoreRequestId)?.jobTitle :
                activeTab === 'scheduled-interviews' ? data[activeTab].find(r => r.id === restoreRequestId)?.position :
                data[activeTab].find(r => r.id === restoreRequestId)?.jobBoard
              }"?`}
              onConfirm={confirmRestore}
              onCancel={() => {
                setShowConfirmRestore(false);
                setRestoreRequestId(null);
              }}
              confirmText="Restore"
              cancelText="Cancel"
            />
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  export default RecycleBin;