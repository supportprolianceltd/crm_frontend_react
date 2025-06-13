import usePageTitle from '../../hooks/usecrmPageTitle';
import { useState, useRef } from 'react';
import { ShareIcon } from '@heroicons/react/20/solid';
import { 
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
  ArrowUpTrayIcon, 
  GlobeAltIcon 
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

import PDFICON from '../../assets/Img/pdf-icon.png';
import AdvertBanner from '../../assets/Img/Advert-Banner.jpg';

function JobApplication() {
  usePageTitle('Frontend Website Developer - Proliance Ltd');

  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    knowledgeSkill: '',
    coverLetter: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const documentsInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Only PDF files are allowed for resume upload.');
      return;
    }
    setErrorMessage('');
    setUploadedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1),
    });
  };

  const removeFile = () => setUploadedFile(null);

  const handleClickUpload = () => fileInputRef.current.click();

  const handleDocumentUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.type === 'application/pdf');

    if (validFiles.length !== selectedFiles.length) {
      setErrorMessage('Some files were not PDFs and were skipped.');
    } else {
      setErrorMessage('');
    }

    const newDocs = validFiles.map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1),
    }));

    setDocuments(prev => [...prev, ...newDocs]);
  };

  const removeDocument = (index) => {
    const newDocs = [...documents];
    newDocs.splice(index, 1);
    setDocuments(newDocs);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage(''); // Clear error on input change
  };

  const handleSubmit = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'qualification', 'experience'];
    const isFormValid = requiredFields.every(field => formData[field].trim() !== '');
    const isResumeUploaded = activeTab === 'noresume' || !!uploadedFile;

    if (!isFormValid) {
      setErrorMessage('Please fill all required fields: Full Name, Email, Phone, Qualification, and Experience.');
      return;
    }

    if (!isResumeUploaded) {
      setErrorMessage('Please upload your resume or select "Don\'t have Resume" option.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload(); // Refresh the page after alert disappears
      }, 3000); // Hide alert after 3 seconds
    }, 2000);
  };

  return (
    <div className="ool-Apply-Seco">
      <header className="ool-Apply-Seco-header">
        <div className="site-container">
          <div className="ouoau-Hero">
            <h2>Frontend Website Developer</h2>
          </div>
          <div className="aoik-fffot">
            <div className="aoik-fffot-1">
              <div className="aoik-fffot-10">
                <h3>PR</h3>
              </div>
              <div className="aoik-fffot-11">
                <div>
                  <p>Proliance Ltd</p>
                  <span>Posted on: 6-12-2025</span>
                </div>
              </div>
            </div>
            <div className="aoik-fffot-2">
              <button><ShareIcon className="h-5 w-5 inline-block mr-1" /> Share job</button>
              <a href="https://prolianceltd.com" target="_blank" rel="noopener noreferrer">
                <GlobeAltIcon className="h-5 w-5 inline-block mr-1" /> Company site
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="gtht-secs">
        <div className="site-container">
          <div className="gtht-secs-Main">
            <div className="gtht-secs-Part1">
              <div className="gtht-secs-IIjah-Box">
                <h3>Job Description</h3>
                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <p>
                    We are looking for a passionate Frontend Website Developer to join our remote team.
                    You will be responsible for building and maintaining responsive, user-friendly web interfaces
                    using modern frontend technologies.
                  </p>
                </div>
              </div>

              <div className="gtht-secs-IIjah-Box">
                <h3>Key Responsibilities</h3>
                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <ul>
                    <li>Develop and maintain user interfaces using React.js</li>
                    <li>Translate UI/UX designs into functional code</li>
                    <li>Ensure cross-browser and cross-device compatibility</li>
                    <li>Collaborate with designers and backend developers</li>
                    <li>Write clean, efficient, and maintainable code</li>
                    <li>Optimize applications for speed and scalability</li>
                    <li>Participate in code reviews and agile development processes</li>
                  </ul>
                </div>
              </div>

              <div className="gtht-secs-IIjah-Box">
                <h3>Basic Job Information</h3>
                <div className='ggg-Grids'>
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Job Title</h4>
                    <p>Frontend Website Developer</p>
                  </div>

                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Company Name</h4>
                    <p>Proliance Ltd</p>
                  </div>

                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Job Type</h4>
                    <p>Full-time</p>
                  </div>

                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Location</h4>
                    <p>Remote</p>
                  </div>

                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Company Address</h4>
                    <p>Lagos, Nigeria</p>
                  </div>

                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Salary Range</h4>
                    <p>$120 Monthly</p>
                  </div>

                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Qualification Requirement</h4>
                    <p>Bachelor’s degree in Computer Science or related field (optional but preferred)</p>
                  </div>

                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Experience Requirement</h4>
                    <p>1–2 years experience in frontend development</p>
                  </div>

                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Knowledge/Skill Requirement</h4>
                    <p>Proficient in HTML, CSS, JavaScript, React.js; familiar with Git and responsive design</p>
                  </div>

                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Deadline for Applications</h4>
                    <p>20-06-2025</p>
                  </div>

                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Start Date</h4>
                    <p>01-07-2025</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="gtht-secs-Part2">
              <div className="gtht-secs-Part2-Box Gen-Boxshadow">
                <div className="gtht-secs-Part2-Box-Top">
                  <h3>Apply for this Job</h3>
                  <p>Please complete the form below to apply for this position.</p>
                </div>

                <div className="hhgh-btbs">
                  <span 
                    className={activeTab === 'upload' ? 'active-Hgh' : ''} 
                    onClick={() => setActiveTab('upload')}
                  >
                    Upload CV
                  </span>
                  <span 
                    className={activeTab === 'noresume' ? 'active-Hgh' : ''} 
                    onClick={() => setActiveTab('noresume')}
                  >
                    Don't have Resume
                  </span>
                </div>

                <div className="gtht-secs-Part2-Box-Mainna">
                  {activeTab === 'upload' && (
                    <div className="cv-upload-sec">
                      <h4>Upload Resume</h4>
                      <div className="cv-uploa-box">
                        <div 
                          className="cv-uploa-box-Top"
                          onClick={handleClickUpload}
                          onDrop={handleFileDrop}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <span><ArrowUpTrayIcon /></span>
                          <h4>Drag & Drop or <u>Choose File</u> to upload</h4>
                          <p>Upload your Resume in PDF format. File size limit: 50 MB.</p>
                          <input 
                            type="file" 
                            accept=".pdf"
                            ref={fileInputRef} 
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                          />
                        </div>
                        {uploadedFile && (
                          <div className="cv-uploa-box-Foot Gen-Boxshadow">
                            <div className="cv-uploa-box-Foot-1">
                              <div className="cv-uploa-box-Foot-10">
                                <img src={PDFICON} alt="PDF Icon" />
                              </div>
                              <div className="cv-uploa-box-Foot-11">
                                <div>
                                  <h4>{uploadedFile.name}</h4>
                                  <p>
                                    <span>{uploadedFile.size}MB</span>
                                    <i></i>
                                    <span><CheckCircleIcon /> File size</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="cv-uploa-box-Foot-2">
                              <span onClick={removeFile}><TrashIcon /></span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="FooorM-Sec">
                    {[
                      { label: 'Full Name', placeholder: 'Enter your full name', name: 'fullName', required: true },
                      { label: 'Email Address', placeholder: 'Enter your email address', name: 'email', required: true },
                      { label: 'Phone Number', placeholder: 'Enter your phone number', name: 'phone', required: true },
                      { label: 'Qualification', placeholder: 'Enter your highest qualification', name: 'qualification', required: true },
                      { label: 'Experience', placeholder: 'Enter your years of experience', name: 'experience', required: true },
                      { label: 'Knowledge/Skill (Optional)', placeholder: 'List relevant skills or knowledge', name: 'knowledgeSkill', required: false },
                    ].map((field, idx) => (
                      <div className="GHuh-Form-Input" key={idx}>
                        <label>{field.label}</label>
                        <input
                          type="text"
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          required={field.required}
                        />
                      </div>
                    ))}

                    <div className="GHuh-Form-Input">
                      <label>Cover Letter (Optional)</label>
                      <textarea
                        name="coverLetter"
                        placeholder="Write your cover letter here"
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="GHuh-Form-Input">
                      <label>Document Uploads (Optional)</label>
                      <input 
                        type="file" 
                        accept=".pdf"
                        ref={documentsInputRef}
                        multiple
                        onChange={handleDocumentUpload}
                      />

                      {documents.length > 0 && documents.map((doc, index) => (
                        <div className="Gtahy-SSa" key={index}>
                          <div className="Gtahy-SSa-1">
                            <div className="Gtahy-SSa-11">
                              <div>
                                <h4>{doc.name}</h4>
                                <p>
                                  <span>{doc.size}MB</span>
                                  <i></i>
                                  <span><CheckCircleIcon /> File size</span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="Gtahy-SSa-2">
                            <span onClick={() => removeDocument(index)}><XMarkIcon /></span>
                          </div>
                        </div>
                      ))}

                      <div className="pol-ffols">
                        <p>Recommended documents to upload:</p>
                        <ul>
                          <li>Birth certificate</li>
                          <li>Degree certificate</li>
                          <li>Training certificate</li>
                          <li>NYSC certificate</li>
                        </ul>
                      </div>
                    </div>

                    <div className="GHuh-Form-Input">
                      <button
                        className="submiii-btnn btn-primary-bg"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting && (
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
                        )}
                        {isSubmitting ? 'Submitting...' : 'Submit application'}
                      </button>
                      {errorMessage && <p className='error'>{errorMessage}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            Application sent successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default JobApplication;