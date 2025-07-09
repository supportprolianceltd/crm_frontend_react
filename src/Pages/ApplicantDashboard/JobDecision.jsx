
import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import './Dashboard.css';

const JobDecision = ({ jobApplication, jobRequisition }) => {
  const handleDashboardLogin = () => {
    window.location.href = '/staff-dashboard';
  };

  // console.log(jobApplication)
  // console.log(jobApplication)
  // console.log(jobApplication)

  const isHired = jobApplication.status === 'hired';

  return (
    <div className="job-decision-wrapper">
      <div className="job-decision-box Gen-Boxshadow">
        <h2 className="job-title">{jobRequisition.title}</h2>
        <p className="job-status">
          Status: <span className={`status-${jobApplication.status}`}>{jobApplication.status}</span>
        </p>

        <div className="job-details">
          <p><strong>Company:</strong> {jobRequisition.company_name}</p>
          <p><strong>Start Date:</strong> {jobRequisition.start_date || 'TBD'}</p>
          <p><strong>Location:</strong> {jobRequisition.location_type}</p>
          <p><strong>Company Address:</strong> {jobRequisition.company_address}</p>
        </div>

        <div className="job-progress-summary">
          <h4>Hiring Process Summary</h4>
          <ul className="checklist">
            <li><CheckCircleIcon className="check-icon" /> Job Application Completed</li>
            <li>
              <CheckCircleIcon className="check-icon" /> Document Uploads{' '}
              {jobApplication.documents.length >= jobRequisition.documents_required.length
                ? 'Completed'
                : 'Pending'}
            </li>
            <li>
              <CheckCircleIcon className="check-icon" /> Interview{' '}
              Scheduled
            </li>
            <li>
              <CheckCircleIcon className="check-icon" /> Compliance Check{' '}
              {jobRequisition.compliance_checklist.every((item) =>
                jobApplication.documents.some((doc) => doc.document_type === item)
              )
                ? 'Completed'
                : 'Pending'}
            </li>
          </ul>
        </div>

        {isHired && (
          <div className="congrats-message">
            <h3>Congratulations!</h3>
            <p>
              You have been successfully hired as the {jobRequisition.title} at {jobRequisition.company_name}. Please
              expect your onboarding email shortly with further instructions and project assignments.
            </p>
          </div>
        )}

        {isHired && (
          <button className="dashboard-button btn-primary-bg" onClick={handleDashboardLogin}>
            Login to Staff Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDecision;