import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, EyeIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import PDFICON from '../../../assets/Img/pdf-icon.png';
import config from '../../../config';

const ApplicantDetails = ({ job, applicant, onClose, onStatusChange }) => {
  // Fallback if applicant or job data is missing
  if (!applicant || !job) {
    return (
      <div className="VewRequisition">
        <div className="VewRequisition-Bodddy" onClick={onClose}></div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="VewRequisition-Main JobDell-gab"
        >
          <div className="VewRequisition-Part">
            <div className="VewRequisition-Part-Top">
              <h3>Applicant Details</h3>
              <button className="close-preview-btn" onClick={onClose}>
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <p>{!applicant ? 'No applicant data available.' : 'No job data available.'}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const {
    name,
    jobTitle,
    dateApplied,
    status,
    resumeUrl,
    email = 'Not provided',
    phone = 'Not provided',
    qualification = 'Not provided',
    experience = 'Not provided',
    knowledge_skill = 'Not provided',
    cover_letter = 'No cover letter provided.',
    documents = [],
    screening_score = 0,
    employment_gaps = [], // Add employment_gaps
    date_of_birth = null, // Add date_of_birth
  } = applicant;

  // Extract job fields with fallbacks
  const {
    title = job.job?.title,
    job_type = job.job?.job_type,
    location_type = 'Not provided',
    company_name = job.job?.company_name || 'Not provided',
    salary_range = job.job?.salary_range || 'Not provided',
    job_description = job.job?.job_description || 'Not provided',
    qualification_requirement = job.job?.qualification_requirement || 'Not provided',
    experience_requirement = job.job?.experience_requirement || 'Not provided',
    knowledge_requirement = job.job?.knowledge_requirement || 'Not provided',
    responsibilities = job.job?.responsibilities || [],
    documents_required = job.job?.documents_required || [],
    compliance_checklist = job.job?.compliance_checklist || [],
    deadline_date = job.job?.deadline,
    start_date = job.job?.start_date,
    requested_by = {
      first_name: job.job?.requested_by?.first_name || 'Unknown',
      last_name: job.job?.requested_by?.last_name || '',
    },
    company_address = job.job?.company_address || 'Not provided',
  } = job;

  // Format job type and location type for display
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

  const formattedJobType = reverseJobTypeMap[job_type.toLowerCase()] || job_type;
  const formattedLocationType = reverseLocationTypeMap[location_type.toLowerCase()] || location_type;

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format date of birth
  const formattedDateOfBirth = formatDate(date_of_birth);

  // Handle status change
  const handleStatusChange = (newStatus) => {
    onStatusChange(applicant.id, newStatus);
  };

  return (
    <div className="VewRequisition">
      <div className="VewRequisition-Bodddy" onClick={onClose}></div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="VewRequisition-Main JobDell-gab"
      >
        <div className="VewRequisition-Part">
          <div className="VewRequisition-Part-Top">
            <h3>Applicant Details</h3>
            <button className="close-preview-btn" onClick={onClose}>
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="job-preview-container">
            <div className="ddaol-headrr">
              <h3>{title}</h3>
            </div>
            <div className="preview-buttons">
              <div>
                <a
                  href={`${config.API_BASE_URL}/${resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="publish-btn btn-primary-bg"
                >
                  <EyeIcon className="w-5 h-5 inline mr-1" /> View Resume
                </a>
              </div>
              <div>
                <button className="delete-btn" onClick={() => onStatusChange(applicant.id, 'Deleted')}>
                  <TrashIcon className="w-5 h-5 inline mr-1" /> Delete
                </button>
              </div>
            </div>
            <div className="main-Prevs-Sec custom-scroll-bar">
              <div className="preview-section-All">
                <div className="preview-section">
                  <h3>Applicant Information</h3>
                  <p><span>Full Name:</span> {name}</p>
                  <p><span>Email Address:</span> {email}</p>
                  <p><span>Phone Number:</span> {phone}</p>
                  <p><span>Date of Birth:</span> {formattedDateOfBirth}</p>
                  <p><span>Qualification:</span> {qualification}</p>
                  <p><span>Experience:</span> {experience}</p>
                  <p><span>Knowledge/Skill:</span> {knowledge_skill}</p>
                  <p><span>Screening Score:</span> {screening_score ? `${screening_score}%` : 'Not Screened'}</p>
                  <p><span>Application Date:</span> {dateApplied}</p>
                  <p><span>Employment Gaps:</span> 
                    {employment_gaps.length > 0 ? (
                      <ul className="list-disc pl-5 mt-1">
                        {employment_gaps.map((gap, index) => (
                          <li key={index}>
                            {gap.gap_start} to {gap.gap_end} ({gap.duration_months} months)
                          </li>
                        ))}
                      </ul>
                    ) : (
                      ' None detected'
                    )}
                  </p>
                </div>

                <div className="preview-section">
                  <h3>Job Details</h3>
                  <p><span>Job Title:</span> {title}</p>
                  <p><span>Company Name:</span> {company_name}</p>
                  <p><span>Job Type:</span> {formattedJobType}</p>
                  <p><span>Company Address:</span> {company_address}</p>
                  <p><span>Salary Range:</span> {salary_range}</p>
                  <p><span>Deadline Date:</span> {formatDate(deadline_date)}</p>
                  <p><span>Start Date:</span> {formatDate(start_date)}</p>
                  <p><span>Requested By:</span> {`${requested_by.first_name} ${requested_by.last_name}`}</p>
                </div>

                <div className="preview-section aadda-poa">
                  <h3>Job Description</h3>
                  <p>{job_description}</p>
                </div>

                <div className="preview-section">
                  <h3>Documents Required</h3>
                  {documents_required.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {documents_required.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No documents required.</p>
                  )}
                </div>

                <div className="preview-section">
                  <h3>Compliance Checklist</h3>
                  {compliance_checklist.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {compliance_checklist.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No compliance checklist provided.</p>
                  )}
                </div>

                <div className="preview-section aadda-poa">
                  <h3>Cover Letter</h3>
                  <p>{cover_letter}</p>
                </div>

                <div className="preview-section">
                  <h3>Status</h3>
                  <p>
                    <span>Application status:</span> {status}{' '}
                    <b className={`bB-status status ${status.toLowerCase()}`}>{status}</b>
                  </p>
                  <p><span>Date:</span> {dateApplied}</p>
                  <div>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="status-select border rounded p-2 w-full"
                    >
                      {['New', 'Shortlisted', 'Rejected', 'Hired'].map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="preview-section">
                  <h3>Uploaded Document(s)</h3>
                  <div className="poola-apiks">
                    {documents.length > 0 ? (
                      documents.map((doc, index) => (
                        <div className="Gtahy-SSa Gen-Boxshadow" key={index}>
                          <div className="Gtahy-SSa-1">
                            <div className="Gtahy-SSa-11">
                              <div>
                                <h4>{doc.name || 'Document'} ({doc.type || 'Unknown'})</h4>
                                <p>
                                  <span>{doc.size || 'Unknown'}</span>
                                  <i></i>
                                  <span><CheckCircleIcon className="w-4 h-4 inline" /> File size</span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="Gtahy-SSa-2">
                            <a href={`${config.API_BASE_URL}/${doc.file_url}`} target="_blank" rel="noopener noreferrer">
                              <EyeIcon className="w-5 h-5" />
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No documents uploaded.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicantDetails;