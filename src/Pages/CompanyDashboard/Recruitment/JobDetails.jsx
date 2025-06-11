import React from 'react';
import AdvertBanner from '../../../assets/Img/Advert-Banner.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PencilIcon,
  XMarkIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const JobDetails = ({ job, onClose, onShowEditRequisition}) => {
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
        className="VewRequisition-Main JobDell-gab">
        <div className="VewRequisition-Part">
          <div className="VewRequisition-Part-Top">
            <h3>Job Advert</h3>
            <button className="close-preview-btn">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="job-preview-container">
            <div className="preview-buttons">
              <div onClick={onClose}><button className="publish-btn btn-primary-bg" onClick={onShowEditRequisition}><PencilIcon /> Edit Job Advert</button>
             </div>
            </div>
            <div className="main-Prevs-Sec custom-scroll-bar">
              <div className="advert-banner">
                <img
                  src={AdvertBanner}
                  alt="Job Advert Banner"
                  className="w-full h-auto object-cover rounded-md mb-4"
                />
                <span>
                  <InformationCircleIcon /> Advert Banner
                </span>
              </div>
              <div className="preview-section-All">
                <div className="preview-section">
                  <h3>Basic Job Information</h3>
                  <p><span>Job Title:</span> Job Title</p>
                  <p><span>Company Name:</span> Company Name</p>
                  <p><span>Job Type:</span> Job Type</p>
                  <p><span>Location:</span> Location</p>
                  <p><span>Company Address:</span> Address</p>
                  <p><span>Salary Range:</span> Salary</p>
                  <p><span>Job Description:</span> Description</p>
                  <p><span>Qualification Requirement:</span> Not Specified</p>
                  <p><span>Experience Requirement:</span> Not Specified</p>
                  <p><span>Knowledge/Skill Requirement:</span> Not Specified</p>
                  <p><span>Reason for Requisition:</span> Not Specified</p>
                  <p><span>Job Description:</span> Not Specified</p>
                </div>
                <div className="preview-section">
                  <h3>Application Details</h3>
                  <p><span>How to Apply:</span> How to Apply</p>
                  <p><span>Deadline for Applications:</span> Deadline <b className='bB-status status open'>Open</b></p>
                  <p><span>Start Date:</span> Start Date</p>
                </div>
                <div className="preview-section">
                  <h3>Documents Required</h3>
                  <ul>
                    <li>No documents specified</li>
                  </ul>
                </div>
                <div className="preview-section">
                  <h3>Compliance Checklist</h3>
                  <ul>
                    <li>No compliance items specified</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDetails;