import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  EyeIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

import ApplicantDocumentCheck from './ApplicantDocumentCheck';

// Function to generate mock applicant data
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

// Main ApplicantTable component
const ApplicantTable = () => {
  // State declarations
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [applicants, setApplicants] = useState(generateMockApplicants());
  const masterCheckboxRef = useRef(null);

  // Filter applicants based on search term only
  const filteredApplicants = applicants.filter((applicant) => {
    return (
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredApplicants.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, startIndex + rowsPerPage);

  // Handle checkbox selection for individual applicants
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  // Handle select all visible applicants
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

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    
    setApplicants(prev => prev.filter(app => !selectedIds.includes(app.id)));
    setSelectedIds([]);
  };

  // Reset master checkbox when page or rows change
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 italic">
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
                    <td>
                      <div>
                        <div />
                        {applicant.name}
                      </div>
                    </td>
                    <td>{applicant.dateApplied}</td>
                    <td>
                      <div className='ouk0UUJal-POl'>
                        <DocumentTextIcon />
                       <p>{applicant.documentsSubmitted}</p> 
                      </div>
                    </td>
                    <td>{applicant.totalFileSize}</td>
                    <td>
                      <span className={`status ${applicant.status.toLowerCase()} haggsb-status`}>
                        {applicant.status}
                      </span>
                    </td>
                    <td>
                       <div className="gen-td-btns">
                        <button className="view-btn">
                          <CheckCircleIcon />
                          Check Documents
                        </button>
                        <button className="link-btn btn-primary-bg">
                          <CheckCircleIcon />
                          Make Decision
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
      <ApplicantDocumentCheck />
    </div>
  );
};

export default ApplicantTable;