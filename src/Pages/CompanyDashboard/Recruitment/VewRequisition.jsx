import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';
import NoAdvertBanner from '../../../assets/Img/noAdvertBanner.png';
import {
  InformationCircleIcon,
  PencilIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

// Backdrop component
const Backdrop = ({ onClick }) => (
  <motion.div
    className="fixed inset-0 z-40 bg-black bg-opacity-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.5 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
  />
);

// Modal animation variants
const modalVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: 25, 
    scale: 0.95, 
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

// Modal component
const Modal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => (
  <AnimatePresence>
    <Backdrop onClick={onCancel} />
    <motion.div
      className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="dialog"
      aria-modal="true"
    >
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded bg-gray-300 px-4 py-2 font-semibold hover:bg-gray-400"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          autoFocus
        >
          {confirmText}
        </button>
      </div>
    </motion.div>
  </AnimatePresence>
);

// AlertModal component
const AlertModal = ({ title, message, onClose }) => (
  <AnimatePresence>
    <Backdrop onClick={onClose} />
    <motion.div
      className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="alertdialog"
      aria-modal="true"
    >
      <h3 className="mb-4 text-lg font-semibold text-center">{title}</h3>
      <p className="mb-6 text-center">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          autoFocus
        >
          OK
        </button>
      </div>
    </motion.div>
  </AnimatePresence>
);

const VewRequisition = ({ job, onClose }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [deadlineDate, setDeadlineDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showJobAdvert, setShowJobAdvert] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertModal, setAlertModal] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [advertBanner, setAdvertBanner] = useState(null);
  const [isFormMutable, setIsFormMutable] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [responsibilities, setResponsibilities] = useState(['']); // Initialize with one empty responsibility

  // Form data
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobType: 'Full-time',
    locationType: 'On-site',
    companyAddress: '',
    salaryRange: '',
    jobDescription: '',
    numberOfCandidates: '',
    qualificationRequirement: '',
    experienceRequirement: '',
    knowledgeSkillRequirement: '',
    reasonForRequisition: '',
  });

  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === 'file') {
      if (files[0]) {
        setAdvertBanner(URL.createObjectURL(files[0]));
      } else {
        setAdvertBanner(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleResponsibilityChange = (index, value) => {
    if (!isFormMutable) return;
    const newResponsibilities = [...responsibilities];
    newResponsibilities[index] = value;
    setResponsibilities(newResponsibilities);
    setErrors((prev) => ({ ...prev, responsibilities: '' }));
  };

  const handleAddResponsibility = () => {
    if (!isFormMutable) return;
    setResponsibilities([...responsibilities, '']);
  };

  const handleRemoveResponsibility = (index) => {
    if (!isFormMutable || index === 0) return; // Prevent removing the first responsibility
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  // Tab navigation
  const tabs = ['Job details', 'Document uploads', 'Compliance check'];

  const validateJobDetails = () => {
    const newErrors = {};
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job Title is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company Name is required';
    if (formData.locationType === 'On-site' && !formData.companyAddress.trim()) {
      newErrors.companyAddress = 'Company Address is required for on-site jobs';
    }
    if (!formData.jobDescription.trim()) newErrors.jobDescription = 'Job Description is required';
    if (responsibilities.length === 0 || responsibilities.every(resp => !resp.trim())) {
      newErrors.responsibilities = 'At least one responsibility is required';
    }
    if (!deadlineDate) newErrors.deadlineDate = 'Application Deadline is required';
    return newErrors;
  };

  const showAlert = (title, message) => {
    setAlertModal({ title, message });
  };

  const closeAlert = () => {
    setAlertModal(null);
  };

  const handlePublish = () => {
    if (!isFormMutable) {
      showAlert('Action Restricted', 'Please accept the job request to publish.');
      return;
    }

    setIsPublishing(true);
    
    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccess(true);
    }, 5000);
  };

  // Auto-navigate after success alert
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate('/company/recruitment/job-adverts');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  const handleNext = () => {
    if (!isFormMutable) {
      showAlert('Action Restricted', 'Please accept the job request to proceed with drafting.');
      return;
    }

    if (activeSection === 0) {
      const jobDetailsErrors = validateJobDetails();
      if (Object.keys(jobDetailsErrors).length > 0) {
        setErrors(jobDetailsErrors);
        showAlert('Validation Error', 'Please fill in all required fields in Job Details');
        return;
      }
    } else if (activeSection === 1) {
      if (documents.length === 0) {
        setErrors({ documents: 'At least one document title is required' });
        showAlert('Document Error', 'Please add at least one document');
        return;
      }
    } else if (activeSection === 2) {
      if (checkedItems.length === 0) {
        setErrors({ compliance: 'At least one compliance item must be checked' });
        showAlert('Compliance Error', 'Please check at least one compliance item');
        return;
      }
    }

    if (activeSection < tabs.length - 1) {
      setActiveSection(activeSection + 1);
      setErrors({});
    } else {
      setShowPreview(true);
      setShowJobAdvert(true);
    }
  };

  const handlePrev = () => {
    if (!isFormMutable) {
      showAlert('Action Restricted', 'Please accept the job request to proceed with drafting.');
      return;
    }

    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      setErrors({});
    }
  };

  const handleTabClick = (index) => {
    if (!isFormMutable) {
      showAlert('Action Restricted', 'Please accept the job request to proceed with drafting.');
      return;
    }

    if (index > activeSection) {
      if (activeSection === 0) {
        const jobDetailsErrors = validateJobDetails();
        if (Object.keys(jobDetailsErrors).length > 0) {
          setErrors(jobDetailsErrors);
          showAlert('Validation Error', 'Please fill in all required fields in Job Details');
          return;
        }
      } else if (activeSection === 1 && documents.length === 0) {
        setErrors({ documents: 'At least one document title is required' });
        showAlert('Document Error', 'Please add at least one document title');
        return;
      } else if (activeSection === 2 && checkedItems.length === 0) {
        setErrors({ compliance: 'At least one compliance item must be checked' });
        showAlert('Compliance Error', 'Please check at least one compliance item');
        return;
      }
    }
    setActiveSection(index);
    setErrors({});
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setShowJobAdvert(false);
  };

  const handleAccept = () => {
    setStatus('Accepted');
    setIsFormMutable(true);
  };

  const handleReject = () => {
    setStatus('Rejected');
    setIsFormMutable(false);
  };

  const handleEditStatus = () => {
    setStatus(null);
    setIsFormMutable(false);
  };

  const handleDeleteAdvert = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAdvert = () => {
    setFormData({
      jobTitle: '',
      companyName: '',
      jobType: 'Full-time',
      locationType: 'On-site',
      companyAddress: '',
      salaryRange: '',
      jobDescription: '',
      numberOfCandidates: '',
      qualificationRequirement: '',
      experienceRequirement: '',
      knowledgeSkillRequirement: '',
      reasonForRequisition: '',
    });
    setDeadlineDate(null);
    setStartDate(null);
    setAdvertBanner(null);
    setDocuments([]);
    setDocumentTitle('');
    setUserHasAdded(false);
    setCheckedItems([]);
    setResponsibilities(['']); // Reset to one empty responsibility
    setActiveSection(0);
    setShowPreview(false);
    setShowJobAdvert(false);
    setErrors({});
    setShowDeleteModal(false);
  };

  const cancelDeleteAdvert = () => {
    setShowDeleteModal(false);
  };

  const checklistItems = [
    'Passport / Driver’s Licence',
    'Shared Code or Date of Birth',
    'DBS (Background Check)',
    'Training Certificate',
    'Proof of Address',
    'Right to Work Check',
    'References (Links to previous jobs/projects)',
  ];

  const [checkedItems, setCheckedItems] = useState([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documents, setDocuments] = useState([]);
  const [userHasAdded, setUserHasAdded] = useState(false);

  const toggleChecklistItem = (item) => {
    if (!isFormMutable) return;
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    setErrors((prev) => ({ ...prev, compliance: '' }));
  };

  const handleAddDocument = () => {
    if (!isFormMutable) return;
    const trimmed = documentTitle.trim();
    if (trimmed && !documents.includes(trimmed)) {
      const newDocs = [...documents, trimmed];
      setDocuments(userHasAdded ? newDocs : [trimmed]);
      setUserHasAdded(true);
      setDocumentTitle('');
      setErrors((prev) => ({ ...prev, documents: '' }));
    }
  };

  const handleRemoveDocument = (titleToRemove) => {
    if (!isFormMutable) return;
    setDocuments((prev) => prev.filter((doc) => doc !== titleToRemove));
  };

  const hasAdvertData = () => {
    return (
      formData.jobTitle.trim() &&
      formData.companyName.trim() &&
      (formData.locationType !== 'On-site' || formData.companyAddress.trim()) &&
      formData.jobDescription.trim() &&
      responsibilities.length > 0 &&
      deadlineDate
    );
  };

  const tabVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className='VewRequisition'>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-alert"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              top: 10,
              right: 10,
              backgroundColor: '#38a169',
              color: 'white',
              padding: '10px 20px',
              fontSize: '12px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 9999,
            }}
          >
            Job advert has been published successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className='VewRequisition-Bodddy' onClick={onClose}></div>
      <button className='VewRequisition-btn' onClick={onClose}>
        <XMarkIcon />
      </button>
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className='VewRequisition-Main'
      >
        <div className='VewRequisition-Part'>
          <div className='VewRequisition-Part-Top'>
            <h3>Job Request</h3>
          </div>

          <div className='ssen-regs'>
            <div className='ssen-regs-1'>
              <span>DO</span>
            </div>
            <div className='ssen-regs-2'>
              <div>
                <h4>Daniel Okoro</h4>
                <p>Admin</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className='oola-Toa'>
              <h3>Request ID: REQ-001</h3>
              <span>2025-06-02</span>
            </div>

            <div className='oluj-Seccco'>
              <div className='oluj-Seccco-Main custom-scroll-bar'>
         
                {status && (
                  <div className='polau-se'>
                     <div className='status-container' style={{ display: 'flex', alignItems: 'center' }}>
                        <p className={status.toLowerCase()}><span>Status:</span> {status}</p>
                        {status === 'Accepted' ? (
                          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#7226FF' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' style={{ marginLeft: '6px' }}>
                            <path d='M20 6L9 17l-5-5' />
                          </svg>
                        ) : (
                          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#991b1b' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' style={{ marginLeft: '6px' }}>
                            <line x1='18' y1='6' x2='6' y2='18' />
                            <line x1='6' y1='6' x2='18' y2='18' />
                          </svg>
                        )}
                        <button
                          className='edit-status-btn'
                          onClick={handleEditStatus}
                        >
                          <PencilIcon className='w-4 h-4' />
                          Edit
                        </button>
                      </div>
                  </div>
                
                )}
         <div className='polau-se'>
          <h4>Reason</h4>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          
         </div>

              </div>

              {!status && (
                <div className='Desaa-Btns'>
                  <button className='accept-Btn' onClick={handleAccept}>
                    <CheckIcon /> Accept
                  </button>
                  <button className='reject-Btn' onClick={handleReject}>
                    <XMarkIcon /> Reject
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className='VewRequisition-Part'>
          <div className='VewRequisition-Part-Top'>
            <h3>Job Advert Drafting</h3>
          </div>
          <div className='ssol-Subam'>
            {tabs.map((tab, index) => (
              <span 
                key={index}
                className={index === activeSection ? 'active-ssol-Subam' : ''}
                onClick={() => handleTabClick(index)}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className='GHuh-Form-Sec'>
            <div className='GHuh-Form-Sec-Top'>
              <h3>{tabs[activeSection]}</h3>
              <div className='GHuh-Form-Sec-Top-Btns'>
                <span 
                  onClick={handlePrev} 
                  style={{ 
                    cursor: activeSection > 0 && isFormMutable ? 'pointer' : 'not-allowed', 
                    opacity: activeSection > 0 && isFormMutable ? 1 : 0.5 
                  }}
                >
                  <ArrowLeftIcon /> Prev
                </span>
                <span 
                  onClick={handleNext} 
                  style={{ 
                    cursor: activeSection < tabs.length && isFormMutable ? 'pointer' : 'not-allowed', 
                    opacity: activeSection < tabs.length && isFormMutable ? 1 : 0.5 
                  }}
                >
                  {activeSection === tabs.length - 1 ? (
                    <>View Advert <EyeIcon /></>
                  ) : (
                    <>Next <ArrowRightIcon /></>
                  )}
                </span>
              </div>
            </div>

            <div className='GHuh-Form-Sec-Main custom-scroll-bar'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeSection}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabVariants}
                  className='w-full'
                >
                  {activeSection === 0 && (
                    <>
                      <h3>Basic Job Information</h3>

                      <div className='Gland-All-Grid'>
                        <div className='GHuh-Form-Input'>
                          <label>Job Title</label>
                          <input 
                            name="jobTitle"
                            type='text' 
                            placeholder='e.g. Frontend Developer' 
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            required 
                            disabled={!isFormMutable}
                          />
                          {errors.jobTitle && <p className='error'>{errors.jobTitle}</p>}
                        </div>

                        <div className='GHuh-Form-Input'>
                          <label>Advert Banner (optional)</label>
                          <input 
                            type='file' 
                            accept="image/*"
                            onChange={handleInputChange}
                            disabled={!isFormMutable}
                          />
                        </div>
                      </div>

                      <div className='GHuh-Form-Input'>
                        <label>Company Name</label>
                        <input 
                          name="companyName"
                          type='text' 
                          placeholder='e.g. ValueFlowTech Ltd' 
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required 
                          disabled={!isFormMutable}
                        />
                        {errors.companyName && <p className='error'>{errors.companyName}</p>}
                      </div>

                      <div className='Gland-All-Grid'>
                        <div className='GHuh-Form-Input'>
                          <label>Job Type</label>
                          <select 
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleInputChange}
                            disabled={!isFormMutable}
                          >
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Freelance</option>
                            <option>Internship</option>
                          </select>
                        </div>
                        <div className='GHuh-Form-Input'>
                          <label>Location</label>
                          <select 
                            name="locationType"
                            value={formData.locationType}
                            onChange={handleInputChange}
                            disabled={!isFormMutable}
                          >
                            <option>On-site</option>
                            <option>Remote</option>
                            <option>Hybrid</option>
                          </select>
                        </div>
                      </div>

                      {formData.locationType === 'On-site' && (
                        <div className='GHuh-Form-Input'>
                          <label>Company Address</label>
                          <input 
                            name="companyAddress"
                            type='text' 
                            placeholder='e.g. 24 Marina Street, Lagos' 
                            value={formData.companyAddress}
                            onChange={handleInputChange}
                            required 
                            disabled={!isFormMutable}
                          />
                          {errors.companyAddress && <p className='error'>{errors.companyAddress}</p>}
                        </div>
                      )}

                      <div className='GHuh-Form-Input'>
                        <label>Salary Range (optional)</label>
                        <input 
                          name="salaryRange"
                          type='text' 
                          placeholder='eg. $0.00 - $0.00' 
                          value={formData.salaryRange}
                          onChange={handleInputChange}
                          disabled={!isFormMutable}
                        />
                      </div>

                      <div className='GHuh-Form-Input'>
                        <label>Number of Candidates (Needed for Interview) (optional)</label>
                        <input 
                          name="numberOfCandidates"
                          type='text' 
                          placeholder='e.g. 10' 
                          value={formData.numberOfCandidates}
                          onChange={handleInputChange}
                          disabled={!isFormMutable}
                        />
                        {errors.numberOfCandidates && <p className='error'>{errors.numberOfCandidates}</p>}
                      </div>

                      <div className='GHuh-Form-Input'>
                        <label>Qualification Requirement (optional)</label>
                        <input 
                          name="qualificationRequirement"
                          type='text' 
                          placeholder='e.g. Bachelor’s degree in Computer Science' 
                          value={formData.qualificationRequirement}
                          onChange={handleInputChange}
                          disabled={!isFormMutable}
                        />
                        {errors.qualificationRequirement && <p className='error'>{errors.qualificationRequirement}</p>}
                      </div>

                      <div className='GHuh-Form-Input'>
                        <label>Experience Requirement (optional)</label>
                        <input 
                          name="experienceRequirement"
                          type='text' 
                          placeholder='e.g. 3+ years in web development' 
                          value={formData.experienceRequirement}
                          onChange={handleInputChange}
                          disabled={!isFormMutable}
                        />
                        {errors.experienceRequirement && <p className='error'>{errors.experienceRequirement}</p>}
                      </div>

                      <div className='GHuh-Form-Input'>
                        <label>Knowledge/Skill Requirement (optional)</label>
                        <input 
                          name="knowledgeSkillRequirement"
                          type='text' 
                          placeholder='e.g. React, JavaScript, CSS' 
                          value={formData.knowledgeSkillRequirement}
                          onChange={handleInputChange}
                          disabled={!isFormMutable}
                        />
                        {errors.knowledgeSkillRequirement && <p className='error'>{errors.knowledgeSkillRequirement}</p>}
                      </div>

                      <h3>Job Description</h3>
                      <div className='GHuh-Form-Input'>
                        <textarea 
                          name="jobDescription"
                          placeholder='Enter job responsibilities, requirements, etc.' 
                          value={formData.jobDescription}
                          onChange={handleInputChange}
                          required
                          disabled={!isFormMutable}
                        ></textarea>
                        {errors.jobDescription && <p className='error'>{errors.jobDescription}</p>}
                      </div>

                      <h3>Key Responsibilities <span onClick={handleAddResponsibility} className={isFormMutable ? 'cursor-pointer' : 'cursor-not-allowed'}><PlusIcon /> Add</span></h3>
                      <div className='GHuh-Form-Input'>
                        <label>Responsibilities</label>
                        <input
                          type='text'
                          placeholder='Add a responsibility'
                          value={responsibilities[0] || ''}
                          onChange={(e) => handleResponsibilityChange(0, e.target.value)}
                          disabled={!isFormMutable}
                        />
                        {responsibilities.slice(1).map((resp, index) => (
                          <div key={index + 1} className='responsibility-Inn-Box' style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                            <input
                              type='text'
                              placeholder='Add a responsibility'
                              value={resp}
                              onChange={(e) => handleResponsibilityChange(index + 1, e.target.value)}
                              disabled={!isFormMutable}
                            />
                            <span 
                              onClick={() => handleRemoveResponsibility(index + 1)}
                              style={{ 
                                cursor: isFormMutable ? 'pointer' : 'not-allowed',
                                marginLeft: '8px'
                              }}
                            >
                              <XMarkIcon className='w-4 h-4' />
                            </span>
                          </div>
                        ))}
                        {errors.responsibilities && <p className='error'>{errors.responsibilities}</p>}
                      </div>

                      <h3>Application Details</h3>
                      <div className='Gland-All-Grid'>
                        <div className='GHuh-Form-Input'>
                          <label>Deadline for Applications</label>
                          <DatePicker
                            selected={deadlineDate}
                            onChange={(date) => {
                              if (!isFormMutable) return;
                              setDeadlineDate(date);
                              setErrors((prev) => ({ ...prev, deadlineDate: '' }));
                            }}
                            placeholderText="yyyy-MM-dd"
                            dateFormat="yyyy-MM-dd"
                            className="custom-datepicker-input"
                            required
                            disabled={!isFormMutable}
                          />
                          {errors.deadlineDate && <p className='error'>{errors.deadlineDate}</p>}
                        </div>

                        <div className='GHuh-Form-Input'>
                          <label>Start Date</label>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => {
                              if (!isFormMutable) return;
                              setStartDate(date);
                              setErrors((prev) => ({ ...prev, startDate: '' }));
                            }}
                            placeholderText="yyyy-MM-dd"
                            dateFormat="yyyy-MM-dd"
                            className="custom-datepicker-input"
                            disabled={!isFormMutable}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeSection === 1 && (
                    <>
                      <h3>Document Uploads</h3>
                      <div className='GHuh-Form-Input'>
                        <label>Title</label>
                        <div className='ooi-flex'>
                          <input
                            type='text'
                            placeholder='Enter Document Title'
                            value={documentTitle}
                            onChange={(e) => setDocumentTitle(e.target.value)}
                            required
                            disabled={!isFormMutable}
                          />
                          <span 
                            className='cursor-pointer' 
                            onClick={handleAddDocument}
                            style={{ 
                              cursor: isFormMutable ? 'pointer' : 'not-allowed', 
                              opacity: isFormMutable ? 1 : 0.5 
                            }}
                          >
                            <PlusIcon className='w-5 h-5' />
                            Add Document
                          </span>
                        </div>
                        {errors.documents && <p className='error'>{errors.documents}</p>}
                        <ul className='apooul-Ul'>
                          {documents.map((doc, index) => (
                            <li key={index}>
                              <p><MinusIcon className='w-4 h-4' /> {doc}</p>
                              <span 
                                onClick={() => handleRemoveDocument(doc)}
                                style={{ 
                                  cursor: isFormMutable ? 'pointer' : 'not-allowed', 
                                  opacity: isFormMutable ? 1 : 0.5 
                                }}
                              >
                                <XMarkIcon className='w-4 h-4 cursor-pointer' />
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {activeSection === 2 && (
                    <>
                      <h3>Compliance Item</h3>
                      <div className='GHuh-Form-Input'>
                        <ul className='checcck-lissT'>
                          {checklistItems.map((item, index) => (
                            <li
                              key={index}
                              className={checkedItems.includes(item) ? 'active-Li-Check' : ''}
                              onClick={() => toggleChecklistItem(item)}
                              style={{ 
                                cursor: isFormMutable ? 'pointer' : 'not-allowed', 
                                opacity: isFormMutable ? 1 : 0.5 
                              }}
                            >
                              <p>{item}</p>
                              <span></span>
                            </li>
                          ))}
                        </ul>
                        {errors.compliance && <p className='error'>{errors.compliance}</p>}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className={`VewRequisition-Part ${showJobAdvert ? 'active-preview' : ''}`}>
          <div className='VewRequisition-Part-Top'>
            <h3>Job Advert</h3>
            {showPreview && (
              <button 
                className='close-preview-btn'
                onClick={handleClosePreview}
              >
                <XMarkIcon className='w-4 h-4' />
              </button>
            )}
          </div>
          
          {!showPreview ? (
            <div className='no-advert-message'>
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <img src={NoAdvertBanner} alt="No Advert" />
                <h4>No advert yet!</h4>
                <p>There are currently no advertisement details available for display.</p>
              </motion.div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className='job-preview-container'
            >
              <div className='preview-buttons'>
                <button 
                  className='publish-btn btn-primary-bg' 
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: '50%',
                          border: '3px solid #fff',
                          borderTopColor: 'transparent',
                          marginRight: '5px',
                          display: 'inline-block',
                        }}
                      />
                      Publishing...
                    </>
                  ) : (
                    'Publish Job Advert'
                  )}
                </button>
                <button className='delete-btn' onClick={handleDeleteAdvert}>
                  <TrashIcon className='w-5 h-5' /> Delete
                </button>
              </div>

              <div className='main-Prevs-Sec custom-scroll-bar'>
                {advertBanner && (
                  <div className='advert-banner'>
                    <img 
                      src={advertBanner} 
                      alt="Job Advert Banner" 
                      className='w-full h-auto object-cover rounded-md mb-4'
                    />
                    <span><InformationCircleIcon /> Advert Banner</span>
                  </div>
                )}
                
                <div className='preview-section-All'>
                  <div className='preview-section'>
                    <h3>Basic Job Information</h3>
                    <p><span>Job Title:</span> {formData.jobTitle}</p>
                    <p><span>Company Name:</span> {formData.companyName}</p>
                    <p><span>Job Type:</span> {formData.jobType}</p>
                    <p><span>Location:</span> {formData.locationType}</p>
                    {formData.companyAddress && <p><span>Company Address:</span> {formData.companyAddress}</p>}
                    {formData.salaryRange && <p><span>Salary Range:</span> {formData.salaryRange}</p>}
                    {formData.numberOfCandidates && <p><span>Number of Candidates (Needed for Interview):</span> {formData.numberOfCandidates}</p>}
                    {formData.qualificationRequirement && <p><span>Qualification Requirement:</span> {formData.qualificationRequirement}</p>}
                    {formData.experienceRequirement && <p><span>Experience Requirement:</span> {formData.experienceRequirement}</p>}
                    {formData.knowledgeSkillRequirement && <p><span>Knowledge/Skill Requirement:</span> {formData.knowledgeSkillRequirement}</p>}
                    {formData.reasonForRequisition && <p><span>Reason for Requisition:</span> <div dangerouslySetInnerHTML={{ __html: formData.reasonForRequisition.replace(/\n/g, '<br/>') }} /></p>}

                  </div>

                         <div className='preview-section aadda-poa'>
                    <h3>Job Description</h3>
                    <p><div dangerouslySetInnerHTML={{ __html: formData.jobDescription.replace(/\n/g, '<br/>') }} /></p>
                   </div>

                   <div className='preview-section'>
                    <h3>Responsibilities</h3>
                    {responsibilities.length > 0 && (
                        <ul>
                          {responsibilities.filter(resp => resp.trim()).map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                    )}
                   </div>
                  
                  <div className='preview-section'>
                    <h3>Application Details</h3>
                    <p><span>Deadline for Applications:</span> {deadlineDate ? deadlineDate.toDateString() : 'Not specified'}</p>
                    <p><span>Start Date:</span> {startDate ? startDate.toDateString() : 'Not specified'}</p>
                  </div>
                  
                  <div className='preview-section'>
                    <h3>Documents Required</h3>
                    <ul>
                      {documents.length > 0 ? (
                        documents.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))
                      ) : (
                        <li>No documents specified</li>
                      )}
                    </ul>
                  </div>
                  
                  <div className='preview-section'>
                    <h3>Compliance Checklist</h3>
                    <ul>
                      {checkedItems.length > 0 ? (
                        checkedItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))
                      ) : (
                        <li>No compliance items specified</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {showDeleteModal && (
        <Modal
          title="Delete Job Advert"
          message="Are you sure you want to delete this job advert? This will clear all entered data."
          onConfirm={confirmDeleteAdvert}
          onCancel={cancelDeleteAdvert}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}

      {alertModal && (
        <AlertModal
          title={alertModal.title}
          message={alertModal.message}
          onClose={closeAlert}
        />
      )}
    </div>
  );
};

export default VewRequisition;