import React from 'react';
import AdvertBanner from '../../../assets/Img/Advert-Banner.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const ApplicantDetails = ({ job, applicant, onClose, onStatusChange }) => {

  console.log("QWERTY")
  console.log(job)
  console.log("QWERTY")
  
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

  // Extract applicant fields
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
  } = applicant;

  // Extract job fields
  const {
    title =job.job.title,
    job_type = job.job.job_type,
    location_type = 'Not provided',
    company = job.job.company_name || 'Not provided',
    jobType = job.job.job_type || 'Not provided',
    location = job.job.location_type || 'Not provided',
    address = job.job.company_address || 'Not provided',
    company_name = job.job.company_name || "Unknown",
    salary_range = job.job.salary_range || 'Not provided',
    job_description = job.job.job_description || 'Not provided',
    qualification_requirement = job.job.qualification_requirement,
    experience_requirement = job.job.experience_requirement,
    knowledge_requirement = job.job.knowledge_requirement,
    responsibilities = [],
    documents_required = [],
    compliance_checklist = [],
    deadline_date = job.job.deadline,
    start_date = job.job.start_date,
    requested_by = { first_name: job?.job?.requested_by?.first_name, last_name: job?.job?.requested_by?.last_name},
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

  // Handle status change
  const handleStatusChange = (newStatus) => {
    onStatusChange(applicant.id, newStatus);
  };

  return (
    <div className="VewRequisition">
      <div className="VewRequisition-Bodddy" onClick={onClose}></div>
      <button className="VewRequisition-btn" onClick={onClose}>
        <XMarkIcon />
      </button>
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
              <h3>{title || jobTitle}</h3>
            </div>
            <div className="preview-buttons">
              <div>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="publish-btn btn-primary-bg">
                  <EyeIcon /> View Resume
                </a>
              </div>
              <div>
                <button className="delete-btn" onClick={() => onStatusChange(applicant.id, 'Deleted')}>
                  <TrashIcon className="w-5 h-5" /> Delete
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
                  <p><span>Qualification:</span> {qualification}</p>
                  <p><span>Experience:</span> {experience}</p>
                  <p><span>Knowledge/Skill:</span> {knowledge_skill}</p>
                  <p><span>Application Date:</span> {dateApplied}</p>
                </div>

                <div className="preview-section">
                  <h3>Job Details</h3>
                  <p><span>Job Title:</span> {title}</p>
                  <p><span>Company Name:</span> {company_name}</p>
                  <p><span>Job Type:</span> {formattedJobType}</p>
                  <p><span>Company Address:</span> {address}</p>
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
                  <h3>Requirements</h3>
                  <p><span>Qualification:</span> {qualification_requirement}</p>
                  <p><span>Experience:</span> {experience_requirement}</p>
                  <p><span>Knowledge:</span> {knowledge_requirement}</p>
                </div>

                <div className="preview-section">
                  <h3>Responsibilities</h3>
                  {responsibilities.length > 0 ? (
                    <ul>
                      {responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No responsibilities listed.</p>
                  )}
                </div>

                <div className="preview-section">
                  <h3>Documents Required</h3>
                  {documents_required.length > 0 ? (
                    <ul>
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
                    <ul>
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
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
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
                                  <span><CheckCircleIcon /> File size</span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="Gtahy-SSa-2">
                            <a href={doc.file_url || '#'} target="_blank" rel="noopener noreferrer">
                              <EyeIcon />
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