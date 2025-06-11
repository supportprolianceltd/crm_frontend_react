import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';
import NoAdvertBanner from '../../../assets/Img/noAdvertBanner.png';
import {
  InformationCircleIcon,
  EyeIcon,
  XMarkIcon,
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

const EditRequisition = ({ job, onClose, onHideEditRequisition, isFormMutable = true }) => {
  const navigate = useNavigate();
  // Set default date to today for deadlineDate and one month from now for startDate
  const today = new Date();
  const defaultStartDate = new Date(today);
  defaultStartDate.setMonth(today.getMonth() + 1);

  const [deadlineDate, setDeadlineDate] = useState(today);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [activeSection, setActiveSection] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showJobAdvert, setShowJobAdvert] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertModal, setAlertModal] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [advertBanner, setAdvertBanner] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Form data with default values
  const [formData, setFormData] = useState({
    jobTitle: 'Frontend Developer',
    companyName: 'ValueFlowTech Ltd',
    jobType: 'Full-time',
    locationType: 'On-site',
    companyAddress: '24 Marina Street, Lagos',
    salaryRange: '$50,000 - $70,000',
    jobDescription: 'Develop and maintain web applications using React, JavaScript, and CSS.',
    howToApply: 'Send your CV to hr@valueflow.com',
    numberOfCandidates: '5',
    qualificationRequirement: 'Bachelor’s degree in Computer Science',
    experienceRequirement: '3+ years in web development',
    knowledgeSkillRequirement: 'React, JavaScript, CSS',
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
    if (!formData.howToApply.trim()) newErrors.howToApply = 'How to Apply is required';
    if (!deadlineDate) newErrors.deadlineDate = 'Application Deadline is required';
    if (formData.numberOfCandidates && isNaN(formData.numberOfCandidates)) {
      newErrors.numberOfCandidates = 'Number of Candidates must be a valid number';
    }
    return newErrors;
  };

  const showAlert = (title, message) => {
    setAlertModal({ title, message });
  };

  const closeAlert = () => {
    setAlertModal(null);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    
    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccess(true);
    }, 5000);
  };

  // Auto-navigate and hide after success alert
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate('/company/recruitment/job-adverts');
        onHideEditRequisition(); // Hide the EditRequisition component
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate, onHideEditRequisition]);

  const handleNext = () => {
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
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      setErrors({});
    }
  };

  const handleTabClick = (index) => {
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

  const handleDeleteAdvert = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAdvert = () => {
    setFormData({
      jobTitle: 'Frontend Developer',
      companyName: 'ValueFlowTech Ltd',
      jobType: 'Full-time',
      locationType: 'On-site',
      companyAddress: '24 Marina Street, Lagos',
      salaryRange: '$50,000 - $70,000',
      jobDescription: 'Develop and maintain web applications using React, JavaScript, and CSS.',
      howToApply: 'Send your CV to hr@valueflow.com',
      numberOfCandidates: '5',
      qualificationRequirement: 'Bachelor’s degree in Computer Science',
      experienceRequirement: '3+ years in web development',
      knowledgeSkillRequirement: 'React, JavaScript, CSS',
    });
    setDeadlineDate(today);
    setStartDate(defaultStartDate);
    setAdvertBanner(null);
    setDocuments(['Resume']);
    setDocumentTitle('');
    setUserHasAdded(false);
    setCheckedItems(['Right to Work Check']);
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

  const [checkedItems, setCheckedItems] = useState(['Right to Work Check']);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documents, setDocuments] = useState(['Resume']);
  const [userHasAdded, setUserHasAdded] = useState(false);

  const toggleChecklistItem = (item) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    setErrors((prev) => ({ ...prev, compliance: '' }));
  };

  const handleAddDocument = () => {
    const trimmed = documentTitle.trim();
    if (trimmed && !documents.includes(trimmed)) {
      setDocuments((prev) => [...prev, trimmed]);
      setUserHasAdded(true);
      setDocumentTitle(''); // Clear the input field
      setErrors((prev) => ({ ...prev, documents: '' }));
    } else if (!trimmed) {
      setErrors((prev) => ({ ...prev, documents: 'Document title cannot be empty' }));
    } else {
      setErrors((prev) => ({ ...prev, documents: 'Document title already exists' }));
    }
  };

  const handleRemoveDocument = (titleToRemove) => {
    setDocuments((prev) => prev.filter((doc) => doc !== titleToRemove));
  };

  const hasAdvertData = () => {
    return (
      formData.jobTitle.trim() &&
      formData.companyName.trim() &&
      (formData.locationType !== 'On-site' || formData.companyAddress.trim()) &&
      formData.jobDescription.trim() &&
      formData.howToApply.trim() &&
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
           All set! Changes saved
          </motion.div>
        )}
      </AnimatePresence>

      <div className='VewRequisition-Bodddy' onClick={onHideEditRequisition}></div>
      <button className='VewRequisition-btn' onClick={onHideEditRequisition}>
        <XMarkIcon />
      </button>
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className='VewRequisition-Main uthath-sed'
      >
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
                    cursor: activeSection > 0 ? 'pointer' : 'not-allowed', 
                    opacity: activeSection > 0 ? 1 : 0.5 
                  }}
                >
                  <ArrowLeftIcon /> Prev
                </span>
                <span 
                  onClick={handleNext} 
                  style={{ 
                    cursor: activeSection < tabs.length ? 'pointer' : 'not-allowed', 
                    opacity: activeSection < tabs.length ? 1 : 0.5 
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
                          />
                          {errors.jobTitle && <p className='error'>{errors.jobTitle}</p>}
                        </div>

                        <div className='GHuh-Form-Input'>
                          <label>Advert Banner (optional)</label>
                          <input 
                            type='file' 
                            accept="image/*"
                            onChange={handleInputChange}
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
                          />
                          {errors.companyAddress && <p className='error'>{errors.companyAddress}</p>}
                        </div>
                      )}

                      <div className='GHuh-Form-Input'>
                        <label>Salary Range (optional)</label>
                        <input 
                          name="salaryRange"
                          type='text' 
                          placeholder='e.g. $0.00 - $0.00' 
                          value={formData.salaryRange}
                          onChange={handleInputChange}
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
                        ></textarea>
                        {errors.jobDescription && <p className='error'>{errors.jobDescription}</p>}
                      </div>

                      <h3>Application Details</h3>
                      <div className='GHuh-Form-Input'>
                        <label>How to Apply</label>
                        <input 
                          name="howToApply"
                          type='text' 
                          placeholder='e.g. Send your CV to hr@valueflow.com' 
                          value={formData.howToApply}
                          onChange={handleInputChange}
                          required 
                        />
                        {errors.howToApply && <p className='error'>{errors.howToApply}</p>}
                      </div>

                      <div className='Gland-All-Grid'>
                        <div className='GHuh-Form-Input'>
                          <label>Deadline for Applications</label>
                          <DatePicker
                            selected={deadlineDate}
                            onChange={(date) => {
                              setDeadlineDate(date);
                              setErrors((prev) => ({ ...prev, deadlineDate: '' }));
                            }}
                            placeholderText="yyyy-MM-dd"
                            dateFormat="yyyy-MM-dd"
                            className="custom-datepicker-input"
                            required
                          />
                          {errors.deadlineDate && <p className='error'>{errors.deadlineDate}</p>}
                        </div>

                        <div className='GHuh-Form-Input'>
                          <label>Start Date</label>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => {
                              setStartDate(date);
                              setErrors((prev) => ({ ...prev, startDate: '' }));
                            }}
                            placeholderText="yyyy-MM-dd"
                            dateFormat="yyyy-MM-dd"
                            className="custom-datepicker-input"
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
                          />
                          <span 
                            onClick={handleAddDocument}
                          >
                            <PlusIcon className='w-5 h-5' />
                            Add Document
                          </span>
                        </div>
                        {errors.documents && <p className='error'>{errors.documents}</p>}
                        <ul className='apooul-Ul'>
                          {documents.map((doc, index) => (
                            <li key={index} className='flex justify-between items-center'>
                              <p><MinusIcon className='w-4 h-4 inline-block mr-2' /> {doc}</p>
                              <button 
                                onClick={() => handleRemoveDocument(doc)}
                                className='text-red-600 hover:text-red-800'
                              >
                                <XMarkIcon className='w-4 h-4' />
                              </button>
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
                      Saving Changes...
                    </>
                  ) : (
                    'Save Changes'
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
                    {formData.numberOfCandidates && <p><span>Number of Candidates:</span> {formData.numberOfCandidates}</p>}
                    {formData.qualificationRequirement && <p><span>Qualification Requirement:</span> {formData.qualificationRequirement}</p>}
                    {formData.experienceRequirement && <p><span>Experience Requirement:</span> {formData.experienceRequirement}</p>}
                    {formData.knowledgeSkillRequirement && <p><span>Knowledge/Skill Requirement:</span> {formData.knowledgeSkillRequirement}</p>}
                    <p><span>Job Description:</span> <div dangerouslySetInnerHTML={{ __html: formData.jobDescription.replace(/\n/g, '<br/>') }} /></p>
                  </div>
                  
                  <div className='preview-section'>
                    <h3>Application Details</h3>
                    <p><span>How to Apply:</span> {formData.howToApply}</p>
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

export default EditRequisition;