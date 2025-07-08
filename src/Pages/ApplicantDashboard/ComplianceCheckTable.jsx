import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import './ComplianceCheckTable.css';
import pdfIcon from '../../assets/icons/pdf.png';
import imageIcon from '../../assets/icons/image.png';
import { CloudArrowUpIcon, PencilIcon, XMarkIcon, EyeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import config from '../../config'; // Assuming config contains API_BASE_URL

const getFileTypeInfo = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  if (extension === 'pdf') {
    return { type: 'PDF', icon: pdfIcon };
  } else if (extension === 'jpg' || extension === 'jpeg') {
    return { type: 'JPG Image', icon: imageIcon };
  } else if (extension === 'png') {
    return { type: 'PNG Image', icon: imageIcon };
  }
  return { type: 'Unknown', icon: imageIcon };
};

const ComplianceCheckTable = ({ complianceChecklist = [], jobApplicationId }) => {
  const { job_application_code, email, unique_link } = useParams();

  console.log("jobApplicationId");
  console.log(jobApplicationId.job_application);
  console.log("jobApplicationId");

  // Initialize complianceData with jobApplicationId.job_application.compliance_status or default display
  const initialComplianceData = jobApplicationId?.job_application?.compliance_status?.length > 0
    ? jobApplicationId.job_application.compliance_status.map(item => ({
        id: item.id,
        title: item.name,
        fileName: item.document?.file_url?.split('/').pop() || '',
        fileType: getFileTypeInfo(item.document?.file_url || '').type,
        fileIcon: getFileTypeInfo(item.document?.file_url || '').icon,
        fileUrl: item.document?.file_url || '',
        status: item.status || 'Not Uploaded',
        rejectionReason: item.notes || '',
      }))
    : complianceChecklist.map((item, index) => {
        if (index === 0) {
          return {
            id: item.id,
            title: item.name,
            file: null,
            fileName: 'invalid_passport.pdf',
            fileType: 'PDF',
            fileIcon: pdfIcon,
            fileUrl: '',
            status: 'Rejected',
            rejectionReason: 'The document uploaded was blurry and unreadable.',
          };
        }
        return {
          id: item.id,
          title: item.name,
          file: null,
          fileName: '',
          fileType: '',
          fileIcon: '',
          fileUrl: '',
          status: 'Not Uploaded',
        };
      });

  const [complianceData, setComplianceData] = useState(initialComplianceData);

  const [alertMessage, setAlertMessage] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const fileInputRefs = useRef(complianceData.map(() => null)); // Initialize based on initialComplianceData length

  const handleOutsideClick = (e, closeFunc) => {
    if (e.target === e.currentTarget) {
      closeFunc(false);
    }
  };

  const triggerFileInput = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  const handleViewRejectionReason = (reason) => {
    setRejectionReason(reason);
    setShowRejectionModal(true);
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isDuplicate = complianceData.some((item, idx) => idx !== index && item.fileName === file.name);
    if (isDuplicate) {
      showAlert('This file has already been uploaded for another requirement.', 'error');
      return;
    }

    const fileInfo = getFileTypeInfo(file.name);
    if (!['PDF', 'JPG Image', 'PNG Image'].includes(fileInfo.type)) {
      showAlert('Only PDF, JPG, and PNG files are allowed.', 'error');
      return;
    }

    const newData = [...complianceData];
    const isEdit = !!newData[index].file;
    newData[index] = {
      ...newData[index],
      file: file,
      fileName: file.name,
      fileType: fileInfo.type,
      fileIcon: fileInfo.icon,
      status: 'Uploaded',
      rejectionReason: '',
    };
    setComplianceData(newData);
    showAlert(isEdit ? 'Successfully edited file.' : 'Successfully uploaded file.', 'success');
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Before upload - complianceData:', complianceData);
      const formData = new FormData();
      complianceData.forEach((item, index) => {
        if (item.file) {
          formData.append(`documents[${index}][document_type]`, item.id); // Use id as document_type
          formData.append(`documents[${index}][file]`, item.file);
        }
      });
      formData.append('submit', 'true');
      formData.append('ids', complianceData.filter((item) => item.status === 'Uploaded').map((item) => item.id));
      formData.append('unique_link', unique_link);

      const response = await axios.put(
        `${config.API_BASE_URL}/api/talent-engine-job-applications/applications/applicant/upload/${jobApplicationId.job_application.id}/compliance-items/`,
        formData,
        {
          headers: {
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('After upload - response.data:', response.data);
      const { job_application } = response.data;
      if (!job_application) {
        throw new Error('Job application data not found in response');
      }

      const updatedData = job_application.compliance_status.map((item) => ({
        id: item.id,
        title: item.name,
        fileName: item.document?.file_url?.split('/').pop() || '',
        fileType: getFileTypeInfo(item.document?.file_url || '').type,
        fileIcon: getFileTypeInfo(item.document?.file_url || '').icon,
        fileUrl: item.document?.file_url || '',
        status: item.status || 'In Review',
        rejectionReason: item.notes || '',
      }));
      setComplianceData(updatedData);
      setShowPrompt(false);
      setIsSubmitted(true);
      setIsSubmitting(false);
      showAlert('Successfully submitted for compliance review.', 'success');
    } catch (error) {
      console.error('Error submitting for review:', error.response ? error.response.data : error.message);
      showAlert('Failed to submit for review. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlertMessage({ text: message, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  return (
    <div className="table-container">
      {/* Alerts */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            className={`alert-box ${alertMessage.type}`}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {alertMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="confirm-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => handleOutsideClick(e, setShowPrompt)}
          >
            <motion.div
              className="confirm-box"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p>Are you sure you want to submit all uploaded documents for compliance check?</p>
              <div className="confirm-actions">
                <button
                  onClick={confirmSubmit}
                  className="confirm-yes btn-primary-bg"
                  disabled={isSubmitting}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: '3px solid #fff',
                          borderTopColor: '#646669',
                          display: 'inline-block',
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    'Yes, Submit'
                  )}
                </button>
                <button onClick={() => setShowPrompt(false)} className="confirm-cancel" disabled={isSubmitting}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Modal */}
      <AnimatePresence>
        {showRejectionModal && (
          <motion.div
            className="confirm-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => handleOutsideClick(e, setShowRejectionModal)}
          >
            <motion.div
              className="confirm-box"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative' }}
            >
              <motion.div
                style={{ display: 'inline-block' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 10,
                }}
              >
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
              </motion.div>
              <h3 style={{ margin: 0 }}>Rejection Reason</h3>
              <p style={{ marginBottom: '1rem' }}>{rejectionReason}</p>
              <div className="confirm-actions">
                <button className="confirm-cancel" onClick={() => setShowRejectionModal(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <table className="Gen-Sys-table Complt-Sys-table">
        <thead>
          <tr>
            <th>Compliance Requirement</th>
            <th>Icon</th>
            <th>File Name</th>
            <th>File Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complianceData.map((item, index) => {
            const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
            return (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.fileName ? <img src={item.fileIcon} alt="file icon" className="file-icon" /> : <span className="no-file">—</span>}</td>
                <td>{item.fileName || <span className="no-file">No file</span>}</td>
                <td>{item.fileType || <span className="no-file">—</span>}</td>
                <td>
                  <div className="oLL-TTDD">
                    {item.status === 'In Review' ? (
                      <span className="status-badge in-review">
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: '50%',
                            border: '3px solid #fff',
                            borderTopColor: '#646669',
                            marginRight: 5,
                            display: 'inline-block',
                          }}
                        />
                        In Review
                      </span>
                    ) : item.status === 'Rejected' ? (
                      <span className="status-badge rejected" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <XMarkIcon
                          className="status-icon"
                          title="Rejected"
                          style={{ width: 14, height: 14 }}
                        />
                        Rejected{' '}
                        <button
                          className="Resss-POla"
                          title="View/Edit Rejection Reason"
                          onClick={() => handleViewRejectionReason(item.rejectionReason)}
                        >
                          <EyeIcon /> Reason
                        </button>
                      </span>
                    ) : (
                      <span className={`status-badge ${statusClass}`}>{item.status}</span>
                    )}
                  </div>
                </td>
                <td>
                  {isSubmitted ? (
                    item.fileUrl ? (
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="submitted-link">Submitted</a>
                    ) : (
                      <span className="submitted-text">Submitted</span>
                    )
                  ) : (
                    <div className="gen-td-btns">
                      <button className="oooka-BBTns link-btn" onClick={() => triggerFileInput(index)}>
                        {item.file ? (
                          <>
                            <PencilIcon />
                            Edit Upload
                          </>
                        ) : (
                          <>
                            <CloudArrowUpIcon />
                            Upload File
                          </>
                        )}
                      </button>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        ref={(el) => (fileInputRefs.current[index] = el)} // Assign to specific index
                        onChange={(e) => handleFileChange(index, e)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!isSubmitted && (
        <div className="submit-wrapper">
          <button
            className="submit-btn btn-primary-bg"
            onClick={() => {
              const allUploaded = complianceData.every(
                (item) => item.status === 'Uploaded' || item.status === 'In Review'
              );
              if (!allUploaded) {
                showAlert('Please upload all required compliance documents before submitting.', 'error');
              } else {
                setShowPrompt(true);
              }
            }}
          >
            Submit for Compliance Check
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplianceCheckTable;