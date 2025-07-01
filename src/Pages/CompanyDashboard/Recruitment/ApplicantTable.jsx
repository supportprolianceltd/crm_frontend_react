import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import ApplicantDocumentCheck from './ApplicantDocumentCheck';
import SampleCV from '../../../assets/resume.pdf';

const generateMockApplicants = () => {
  const applicants = [];
  const names = [
    'Emma Johnson', 'Noah Williams', 'Olivia Brown', 'Liam Jones', 'Ava Garcia',
    'Lucas Miller', 'Mia Davis', 'Ethan Rodriguez', 'Isabella Martinez', 'James Wilson'
  ];
  const statuses = ['Pending', 'Checked'];

  for (let i = 1; i <= 50; i++) {
    const appliedDate = new Date();
    appliedDate.setDate(appliedDate.getDate() - Math.floor(Math.random() * 30));
    const formattedDate = appliedDate.toISOString().split('T')[0];
    const submitted = `${Math.floor(Math.random() * 7) + 1} out of 7`;
    const fileSize = `${(Math.random() * 15 + 0.5).toFixed(1)} MB`;

    applicants.push({
      id: `APP-${String(i).padStart(3, '0')}`,
      name: names[i % names.length],
      dateApplied: formattedDate,
      documentsSubmitted: submitted,
      totalFileSize: fileSize,
      status: statuses[i % 2]
    });
  }
  return applicants;
};

const ApplicantTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [applicants, setApplicants] = useState(generateMockApplicants());
  const [showApplicantDocumentCheck, setShowApplicantDocumentCheck] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const masterCheckboxRef = useRef(null);

  // Track two applicants (by ID) to show danger icon
  const checkedWithWarningIds = applicants
    .filter(app => app.status === 'Checked')
    .slice(0, 2)
    .map(app => app.id);

  const handleViewClick = (job) => {
    setSelectedJob(job);
    setShowApplicantDocumentCheck(true);
  };

  const handleHideApplicantDocumentCheck = () => {
    setShowApplicantDocumentCheck(false);
    setSelectedJob(null);
  };

  const filteredApplicants = applicants.filter((applicant) =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApplicants.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, startIndex + rowsPerPage);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    if (currentApplicants.every((app) => selectedIds.includes(app.id))) {
      setSelectedIds((prev) => prev.filter((id) => !currentApplicants.some((app) => app.id === id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...currentApplicants.filter((app) => !prev.includes(app.id)).map((app) => app.id),
      ]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setApplicants(prev => prev.filter(app => !selectedIds.includes(app.id)));
    setSelectedIds([]);
  };

  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.checked = false;
    }
    setSelectedIds([]);
  }, [currentPage, rowsPerPage]);

  return (
    <div className="DocumentVerification-sec">
      <div className="Dash-OO-Boas OOOP-LOa OILUJ-Pla">
        <div className="Dash-OO-Boas-Top ouka-OpOl">
          <div className="Dash-OO-Boas-Top-1">
            <h3>Applicants</h3>
          </div>
          <div className="Dash-OO-Boas-Top-2">
            <div className="genn-Drop-Search">
              <span><MagnifyingGlassIcon className="h-6 w-6" /></span>
              <input 
                type="text" 
                placeholder="Search applicants..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="Dash-OO-Boas dOikpO-PPol oluja-PPPl">
        <div className="table-container">
          <table className="Gen-Sys-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    ref={masterCheckboxRef}
                    onChange={handleSelectAllVisible}
                    checked={currentApplicants.length > 0 && 
                            currentApplicants.every(app => selectedIds.includes(app.id))}
                  />
                </th>
                <th>Applicant Name</th>
                <th>Date Applied</th>
                <th>Submitted Documents</th>
                <th>Total File Size</th>
                <th>Status</th>
                <th>Compliance Report</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentApplicants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 italic">
                    No matching applicants found
                  </td>
                </tr>
              ) : (
                currentApplicants.map((applicant) => (
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
                      <div className='ouk0UUJal-POl'>
                        <DocumentTextIcon className="h-5 w-5 mr-1" />
                        <p>{applicant.documentsSubmitted}</p> 
                      </div>
                    </td>
                    <td>{applicant.totalFileSize}</td>
                    <td>
                      <div className='oaiks-OOikakushj'>
                      <span className={`status ${applicant.status.toLowerCase()} haggsb-status ${applicant.status === 'Checked' ? 'status-padge completed' : ''}`}>
                        {applicant.status}
                      </span>
                      {checkedWithWarningIds.includes(applicant.id) && (
                        <ExclamationTriangleIcon className="Warrri-Iocn" title='Rejected file(s)' />
                      )}
                      </div>
                    </td>
                    <td>
                      {applicant.status === 'Checked' ? (
                        <div className="gen-td-btns">
                          <a
                            href={SampleCV}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-btn inline-flex items-center"
                          >
                            <DocumentTextIcon className="h-5 w-5 mr-1" />
                            View Report
                          </a>
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td>
                      <div className="gen-td-btns">
                        <button
                          className="link-btn btn-primary-bg"
                          onClick={() => handleViewClick(applicant)}
                        >
                          <CheckCircleIcon className="h-5 w-5 mr-1" />
                          Check Documents
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
                <button 
                  onClick={handleBulkDelete}
                  className="delete-marked-btn"
                  disabled={selectedIds.length === 0}
                >
                  <TrashIcon className="h-5 w-5 mr-1" />
                  Delete Selected
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

      {showApplicantDocumentCheck && selectedJob && (
        <ApplicantDocumentCheck 
          applicant={selectedJob}
          onHide={handleHideApplicantDocumentCheck}
        />
      )}
    </div>
  );
};

export default ApplicantTable;
