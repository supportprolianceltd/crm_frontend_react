import React from 'react';
import AdvertBanner from '../../../assets/Img/Advert-Banner.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  EyeIcon,
    PencilIcon,
  XMarkIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const ApplicantDetails = ({ job, onClose, onShowEditRequisition}) => {
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
            <h3>Applicant Details</h3>
            <button className="close-preview-btn">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="job-preview-container">
            <div className='ddaol-headrr'>
              <h3>Frontend website developer</h3>
              </div>
            <div className="preview-buttons">
              <div onClick={onClose}>
                <a href='#' target='_blank' className="publish-btn btn-primary-bg"><EyeIcon /> View Resume</a>
             </div>

                <div onClick={onClose}>  
                  <button className='delete-btn'>
                     <TrashIcon className='w-5 h-5' /> Delete
                  </button>
                </div>
            </div>
            <div className="main-Prevs-Sec custom-scroll-bar">
              <div className="preview-section-All">
              <div className="preview-section">
                  <h3>Basic Details</h3>
                  <p><span>Full Name:</span> Ndubuisi Prince Godson</p>
                  <p><span>Email Address:</span> princegodson@example.com</p>
                  <p><span>Phone Number:</span> +234 812 345 6789</p>
                  <p><span>Qualification:</span> Bachelor’s Degree in Computer Science</p>
                  <p><span>Experience:</span> 6 Years</p>
                  <p><span>Knowledge/Skill:</span> Frontend Development, UI/UX Design, React, Tailwind CSS</p>
                  <p><span>Job Title:</span> Frontend Developer</p>
                  <p><span>Company Name:</span> Proliance Ltd</p>
                  <p><span>Job Type:</span> Full-time</p>
                  <p><span>Location:</span> Lagos, Nigeria</p>
                  <p><span>Address:</span> 123 Allen Avenue, Ikeja, Lagos</p>
                  <p><span>Salary:</span> ₦250,000/month</p>
                  <p><span>Application Date:</span> 6-14-2025</p>
                </div>

                <div className='preview-section aadda-poa'>
                  <h3>Cover Letter</h3>
                  <p>
                    I am a passionate and dedicated frontend developer with a Bachelor's Degree in Computer Science.
                    With over three years of experience building responsive and user-focused web applications, I
                    believe I would be a great fit for this role. I am proficient in React, Tailwind CSS, and UI/UX
                    best practices, and I am eager to contribute to your team at Proliance Ltd.
                  </p>
                </div>


                <div className="preview-section">
                  <h3>Status</h3>
                  <p><span>Application status:</span> Shortlisted <b className='bB-status status shortlisted'>Open</b></p>
                  <p><span>Date:</span> 6-14-2025</p>
                </div>

                <div className="preview-section">
                  <h3>Uploaded Document(s)</h3>
                  <div className='poola-apiks'>
                        <div className="Gtahy-SSa Gen-Boxshadow">
                        <div className="Gtahy-SSa-1">
                          <div className="Gtahy-SSa-11">
                            <div>
                              <h4>Blue and Gray Simple Professional CV Resume.pdf (Birth Certificate)</h4>
                              <p>
                                <span>1.4MB</span>
                                <i></i>
                                <span><CheckCircleIcon /> File size</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="Gtahy-SSa-2">
                          <a href='#' target='_blank'><EyeIcon /></a>
                        </div>
                      </div>

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