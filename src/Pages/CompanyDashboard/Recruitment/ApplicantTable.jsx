import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import ApplicantDocumentCheck from './ApplicantDocumentCheck';
import { fetchPublishedRequisitionsWithShortlisted, bulkDeleteJobApplications, updateApplicantComplianceStatus } from './ApiService';

const ApplicantTable = ({ jobId, complianceChecklist }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [showApplicantDocumentCheck, setShowApplicantDocumentCheck] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const masterCheckboxRef = useRef(null);

  // Fetch applicants for the selected job
  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        const data = await fetchPublishedRequisitionsWithShortlisted();

        // console.log("data")
        // console.log(data)
        // console.log("data")

        const selectedJob = data.find((job) => job.job_requisition.id === jobId);
        const applicantsWithCompliance = selectedJob?.shortlisted_applications || [];

        //applicantsWithCompliance.forEach(app => console.log('Applicant compliance_status:', app.compliance_status));
        setApplicants(applicantsWithCompliance);
      } catch (err) {
        setError(err.message || 'Failed to load applicants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  // Track applicants with failed compliance items for warning icon
  const checkedWithWarningIds = applicants
    .filter((app) =>
      app.compliance_status?.some((status) => status.status === 'failed')
    )
    .map((app) => app.id);

  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.id?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDeleteJobApplications(selectedIds);
      setApplicants((prev) => prev.filter((app) => !selectedIds.includes(app.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting applications:', error);
      alert('Failed to delete selected applications. Please try again.');
    }
  };

const handleViewClick = (applicant) => {
  console.log('Selected applicant:', applicant); // Verify id and compliance_status
  if (!applicant?.id) {
    console.warn('Applicant ID is missing');
    alert('Cannot view applicant: Missing ID');
    return;
  }
  setSelectedApplicant(applicant);
  setShowApplicantDocumentCheck(true);
};

  const handleHideApplicantDocumentCheck = () => {
    setShowApplicantDocumentCheck(false);
    setSelectedApplicant(null);
  };

const handleComplianceStatusChange = async (applicationId, itemId, data) => {
  console.log("applicationId:", applicationId);
  console.log("itemId:", itemId);
  console.log("data:", data);

  if (!applicationId || !itemId || !data) {
    console.error('Missing required parameters:', { applicationId, itemId, data });
    alert('Failed to update compliance status: Missing application ID, item ID, or data.');
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const payload = {
      name: data.name || '', // Ensure name is included
      status: data.status === 'Accepted' ? 'completed' : data.status.toLowerCase() === 'rejected' ? 'failed' : 'pending',
      checked_by: user?.id ? parseInt(user.id, 10) : null, // Ensure integer
      notes: data.notes || '',
      checked_at: user?.id ? new Date().toISOString() : null, // Add checked_at when checked_by is provided
    };

    await updateApplicantComplianceStatus(applicationId, itemId, payload);
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              compliance_status: app.compliance_status.map((item) =>
                item.id === itemId
                  ? { ...item, ...payload, checked_at: new Date().toISOString() }
                  : item
              ),
            }
          : app
      )
    );
  } catch (error) {
    console.error('Error updating compliance status:', error);
    alert('Failed to update compliance status. Please try again.');
  }
};
  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.checked = false;
    }
    setSelectedIds([]);
  }, [currentPage, rowsPerPage]);

  // Calculate total file size for display
  const calculateTotalFileSize = (documents) => {
    if (!documents || documents.length === 0) return '0 MB';
    const totalSize = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
    return `${(totalSize / 1024 / 1024).toFixed(1)} MB`; // Convert bytes to MB
  };

  // Determine status based on compliance_status
  const getApplicantStatus = (complianceStatus) => {
    if (!complianceStatus || complianceStatus.length === 0) return 'Pending';
    const allCompleted = complianceStatus.every((item) => item.status === 'completed');
    return allCompleted ? 'Checked' : 'Pending';
  };

  return (
    <div className="DocumentVerification-sec">
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && (
        <>
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
                        checked={currentApplicants.length > 0 && currentApplicants.every((app) => selectedIds.includes(app.id))}
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
                        <td>{applicant.full_name || 'N/A'}</td>
                        <td>{applicant.applied_at ? new Date(applicant.applied_at).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="ouk0UUJal-POl">
                            <DocumentTextIcon className="h-5 w-5 mr-1" />
                            <p>{applicant.documents?.length || 0} out of {complianceChecklist?.length || 0}</p>
                          </div>
                        </td>
                        <td>{calculateTotalFileSize(applicant.documents)}</td>
                        <td>
                          <div className="oaiks-OOikakushj">
                            <span
                              className={`status ${getApplicantStatus(applicant.compliance_status).toLowerCase()} haggsb-status ${
                                getApplicantStatus(applicant.compliance_status) === 'Checked' ? 'status-padge completed' : ''
                              }`}
                            >
                              {getApplicantStatus(applicant.compliance_status)}
                            </span>
                            {checkedWithWarningIds.includes(applicant.id) && (
                              <ExclamationTriangleIcon className="Warrri-Iocn" title="Rejected file(s)" />
                            )}
                          </div>
                        </td>
                        <td>
                          {getApplicantStatus(applicant.compliance_status) === 'Checked' ? (
                            <div className="gen-td-btns">
                              <button
                                className="view-btn inline-flex items-center"
                                onClick={() => handleViewClick(applicant)}
                              >
                                <DocumentTextIcon className="h-5 w-5 mr-1" />
                                View Report
                              </button>
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
        </>
      )}

      {showApplicantDocumentCheck && selectedApplicant && (
        <ApplicantDocumentCheck
          applicant={selectedApplicant}
          complianceChecklist={complianceChecklist}
          onHide={handleHideApplicantDocumentCheck}
          onComplianceStatusChange={handleComplianceStatusChange}
        />
      )}
    </div>
  );
};

export default ApplicantTable;
