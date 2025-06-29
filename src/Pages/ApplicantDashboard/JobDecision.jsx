import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Requires Heroicons installed

const JobDecision = () => {
  const handleDashboardLogin = () => {
    window.location.href = '/staff-dashboard';
  };

  return (
    <div className="job-decision-wrapper">
      <div className="job-decision-box Gen-Boxshadow">
        <h2 className="job-title">Frontend Website Developer</h2>
        <p className="job-status">
          Status: <span className="status-hired">Hired</span>
        </p>

        <div className="job-details">
          <p><strong>Company:</strong> Proliance Ltd</p>
          <p><strong>Start Date:</strong> July 1, 2025</p>
          <p><strong>Reporting Time:</strong> 9:00 AM</p>
          <p><strong>Location:</strong> On site</p>
          <p><strong>Company Address:</strong> Plot 5 Owule Ojuan Street, off Peter Odili Road, Trans Amadi, Port Harcourt, Rivers State.</p>
        </div>

        <div className="job-progress-summary">
          <h4>Hiring Process Summary</h4>
          <ul className="checklist">
            <li><CheckCircleIcon className="check-icon" /> Job Application Completed</li>
            <li><CheckCircleIcon className="check-icon" /> Document Uploads Completed</li>
            <li><CheckCircleIcon className="check-icon" /> Interview Completed (Score: 89%)</li>
            <li><CheckCircleIcon className="check-icon" /> Compliance Check Completed</li>
          </ul>
        </div>

        <div className="congrats-message">
          <h3>Congratulations!</h3>
          <p>
            You have been successfully hired as the Frontend Website Developer at Proliance Ltd. 
            Please expect your onboarding email shortly with further instructions and project assignments.
          </p>
        </div>

        <button className="dashboard-button btn-primary-bg" onClick={handleDashboardLogin}>
          Login to Staff Dashboard
        </button>
      </div>
    </div>
  );
};

export default JobDecision;
