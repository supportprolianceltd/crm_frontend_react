// import { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import usePageTitle from '../../hooks/usePageTitle';
// import { ShareIcon } from '@heroicons/react/20/solid';
// import { Link, useNavigate } from 'react-router-dom';

// import LOGO from '../../assets/Img/logo-lite.png';
// import NoAdvert from '../../assets/Img/noAdvert.png';
// import {
//   CheckCircleIcon,
//   XMarkIcon,
//   TrashIcon,
//   ArrowUpTrayIcon,
//   GlobeAltIcon,
// } from '@heroicons/react/24/outline';
// import { motion, AnimatePresence } from 'framer-motion';
// import config from '../../config';
// import PDFICON from '../../assets/Img/pdf-icon.png';
// import AdvertBanner from '../../assets/Img/Advert-Banner.jpg';
// import { TagIcon } from '@heroicons/react/24/solid';
// const API_BASE_URL = `${config.API_BASE_URL}`;

// function JobApplication() {
//   const { unique_link } = useParams();
//   const [job, setJob] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [availableDocTypes, setAvailableDocTypes] = useState([]);
//   const [selectedResumeType, setSelectedResumeType] = useState('');
//   const [isLinkCopied, setIsLinkCopied] = useState(false);
//   const [isDeadlineExpired, setIsDeadlineExpired] = useState(false); // New state for deadline



//   const handleCopyLink = () => {
//   const jobLink = window.location.href; // Gets the current page URL
//   navigator.clipboard.writeText(jobLink).then(() => {
//     setIsLinkCopied(true);
//     setTimeout(() => setIsLinkCopied(false), 2000); // Hide message after 2 seconds
//   }).catch((err) => {
//     console.error('Failed to copy link:', err);
//     setErrorMessage('Failed to copy link. Please try again.');
//   });
// };

//   usePageTitle(job.title && job.company_name ? `${job.title} - ${job.company_name}` : 'Job Application');

//   const [activeTab, setActiveTab] = useState('upload');
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [documents, setDocuments] = useState([]);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//      confirmEmail: '', 
//     phone: '',
//     qualification: '',
//     date_of_birth: '',
//     experience: '',
//     knowledgeSkill: '',
//     coverLetter: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const fileInputRef = useRef(null);
//   const documentsInputRef = useRef(null);
//   const [selectedDocType, setSelectedDocType] = useState('');

//   useEffect(() => {
//     const fetchJob = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/talent-engine/requisitions/by-link/${unique_link}/`);
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.detail || 'Job not found or not published');
//         }
//         const data = await response.json();
//         //console.log('Fetched job data:', data);
//         setJob({
//           id: data.id,
//           title: data.title,
//           company: data.company_name,
//           jobType: data.job_type
//             ? {
//                 full_time: 'Full-Time',
//                 part_time: 'Part-Time',
//                 contract: 'Contract',
//                 freelance: 'Freelance',
//                 internship: 'Internship',
//               }[data.job_type] || data.job_type
//             : 'N/A',
//           location: data.location_type
//             ? {
//                 on_site: 'On-site',
//                 remote: 'Remote',
//                 hybrid: 'Hybrid',
//               }[data.location_type] || data.location_type
//             : 'N/A',
//           company_address: data.company_address,
//           company_web_address: data.tenant_domain,
//           salary_range: data.salary_range,
//           job_description: data.job_description,
//           qualification_requirement: data.qualification_requirement,
//           experience_requirement: data.experience_requirement,
//           knowledge_requirement: data.knowledge_requirement,
//           deadline: data.deadline_date
//             ? new Date(data.deadline_date).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: '2-digit',
//                 year: 'numeric',
//               }).split('/').join('-')
//             : 'N/A',
//           start_date: data.start_date,
//           responsibilities: data.responsibilities,
//           documents_required: data.documents_required || [],
//           created_at: data.created_at,
//           deadline_date: data.deadline_date, // Store raw deadline_date
//         });
//         setAvailableDocTypes(data.documents_required || []);
//         // Check if deadline has expired
//         if (data.deadline_date) {
//           const deadlineDate = new Date(data.deadline_date);
//           const currentDate = new Date();
//           setIsDeadlineExpired(deadlineDate < currentDate);
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching job:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchJob();
//   }, [unique_link]);

//   const handleFileDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     processFile(file);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     processFile(file);
//   };

//   const processFile = (file) => {
//     if (!file) return;
//     const allowedTypes = [
//       'application/pdf',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     ];
//     if (!allowedTypes.includes(file.type)) {
//       setErrorMessage('Only PDF and Word (.doc, .docx) files are allowed for resume upload.');
//       return;
//     }
//     if (file.size > 50 * 1024 * 1024) {
//       setErrorMessage('File size exceeds 50 MB limit.');
//       return;
//     }
//     setErrorMessage('');
//     setUploadedFile({
//       file: file,
//       name: file.name,
//       size: (file.size / (1024 * 1024)).toFixed(1),
//       type: selectedResumeType,
//     });
//   };

//   const removeFile = () => {
//     setUploadedFile(null);
//     setSelectedResumeType('');
//   };

//   const handleClickUpload = () => fileInputRef.current.click();

//   const handleDocumentUpload = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (selectedFiles.length === 0) {
//       setErrorMessage('No files selected. Please choose a file to upload.');
//       setSelectedDocType('');
//       return;
//     }

//     const allowedTypes = [
//       'application/pdf',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     ];
//     const validFiles = selectedFiles.filter((file) => allowedTypes.includes(file.type));
//     if (validFiles.length !== selectedFiles.length) {
//       setErrorMessage('Some files were not PDF or Word (.doc, .docx) and were skipped.');
//     } else {
//       setErrorMessage('');
//     }

//     const newDocs = validFiles.map((file) => ({
//       file: file,
//       name: file.name,
//       size: (file.size / (1024 * 1024)).toFixed(1),
//       type: selectedDocType,
//     }));

//     setDocuments((prev) => [...prev, ...newDocs]);
//     if (selectedDocType) {
//       setAvailableDocTypes((prev) => prev.filter((type) => type !== selectedDocType));
//       setSelectedDocType('');
//     }
//   };

//   const removeDocument = (index) => {
//     const docToRemove = documents[index];
//     if (docToRemove.type) {
//       setAvailableDocTypes((prev) => [...prev, docToRemove.type].sort());
//     }
//     const newDocs = [...documents];
//     newDocs.splice(index, 1);
//     setDocuments(newDocs);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrorMessage('');
//   };
  

//   const handleDocTypeChange = (e) => {
//     const selectedType = e.target.value;
//     if (selectedType !== '') {
//       setSelectedDocType(selectedType);
//       documentsInputRef.current.click();
//     } else {
//       setSelectedDocType('');
//     }
//   };

//   const handleSubmit = async () => {
//   if (!job.id) {
//     setErrorMessage('Job details not loaded. Please try again.');
//     return;
//   }
//     // Add email match validation
//   if (formData.email !== formData.confirmEmail) {
//     setErrorMessage('Email addresses do not match');
//     return;
//   }


//   const requiredFields = ['fullName', 'email', 'confirmEmail', 'phone', 'date_of_birth', 'qualification', 'experience'];
//   const isFormValid = requiredFields.every((field) => formData[field].trim() !== '');
//   const isResumeUploaded = activeTab === 'noresume' || !!uploadedFile;

//   const requiredDocs = job.documents_required || [];
//   const uploadedDocTypes = [
//     ...new Set([
//       // ...(selectedResumeType && uploadedFile && activeTab === 'upload' ? [selectedResumeType] : []),
//       ...documents.map((doc) => doc.type),
//     ]),
//   ];
//   const missingDocs = requiredDocs.filter((docType) => !uploadedDocTypes.includes(docType));

//   if (!isFormValid) {
//     setErrorMessage(
//       'Please fill all required fields: Full Name, Email, Phone, Qualification, and Experience.'
//     );
//     return;
//   }

//   if (!isResumeUploaded) {
//     setErrorMessage('Please upload your resume or select "Don\'t have Resume" option.');
//     return;
//   }

//   if (requiredDocs.length > 0 && missingDocs.length > 0) {
//     setErrorMessage(`Missing required documents: ${missingDocs.join(', ')}.`);
//     return;
//   }

//   // Validate character limits for qualification and experience fields
//   if (formData.qualification.length > 255) {
//     setErrorMessage('Qualification field must not exceed 255 characters.');
//     return;
//   }
//   if (formData.experience.length > 255) {
//     setErrorMessage('Experience field must not exceed 255 characters.');
//     return;
//   }

//   setErrorMessage('');
//   setIsSubmitting(true);

//   try {
//     const formDataToSend = new FormData();
//     formDataToSend.append('unique_link', unique_link);
//     formDataToSend.append('job_requisition', job.id);
//     formDataToSend.append('full_name', formData.fullName);
//     formDataToSend.append('email', formData.email);
//     formDataToSend.append('phone', formData.phone);
//     formDataToSend.append('date_of_birth', formData.date_of_birth); // Append DOB
//     formDataToSend.append('qualification', formData.qualification);
//     formDataToSend.append('experience', formData.experience);
//     formDataToSend.append('knowledge_skill', formData.knowledgeSkill);
//     formDataToSend.append('cover_letter', formData.coverLetter);
//     formDataToSend.append('resume_status', activeTab === 'upload');

//     // if (uploadedFile && activeTab === 'upload' && !selectedResumeType) {
//     //   setErrorMessage('Please select a document type for the resume.');
//     //   setIsSubmitting(false);
//     //   return;
//     // }

//     let docIndex = 0;
//     const providedDocTypes = [];

//     if (uploadedFile && activeTab === 'upload' && selectedResumeType) {
//       if (job.documents_required.includes(selectedResumeType)) {
//         formDataToSend.append(`documents[${docIndex}][document_type]`, selectedResumeType);
//         formDataToSend.append(`documents[${docIndex}][file]`, uploadedFile.file, uploadedFile.name);
//         providedDocTypes.push(selectedResumeType);
//         docIndex++;
//       } else {
//         setErrorMessage(
//           `Invalid resume type: ${selectedResumeType}. Must be one of ${job.documents_required.join(', ')}.`
//         );
//         setIsSubmitting(false);
//         return;
//       }
//     }

//     documents.forEach((doc) => {
//       if (!providedDocTypes.includes(doc.type)) {
//         formDataToSend.append(`documents[${docIndex}][document_type]`, doc.type);
//         formDataToSend.append(`documents[${docIndex}][file]`, doc.file, doc.name);
//         providedDocTypes.push(doc.type);
//         docIndex++;
//       }
//     });

//     const response = await fetch(`${API_BASE_URL}/api/talent-engine-job-applications/applications/`, {
//       method: 'POST',
//       body: formDataToSend,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Backend error response:', errorData);

//       // Handle duplicate application error
//       if (
//         errorData.detail &&
//         errorData.detail.includes('duplicate key value violates unique constraint')
//       ) {
//         setErrorMessage(
//           'You have already applied for this job. Please check your application status or contact support for assistance.'
//         );
//       } else if (errorData.qualification || errorData.experience) {
//         // Handle specific validation errors for qualification and experience
//         const errors = [];
//         if (errorData.qualification) {
//           errors.push('Qualification field must not exceed 255 characters.');
//         }
//         if (errorData.experience) {
//           errors.push('Experience field must not exceed 255 characters.');
//         }
//         setErrorMessage(errors.join(' '));
//       } else if (errorData.errors) {
//         // Handle other validation errors
//         const errorMessages = Object.entries(errorData.errors)
//           .map(([field, errors]) => {
//             if (Array.isArray(errors)) {
//               return `${field}: ${errors.join(', ')}`;
//             } else if (typeof errors === 'object' && errors.length > 0) {
//               return `${field}: ${errors.map((err) => err.detail || JSON.stringify(err)).join(', ')}`;
//             }
//             return `${field}: ${errors}`;
//           })
//           .join('; ');
//         setErrorMessage(errorMessages || errorData.detail || 'Failed to submit application');
//       } else {
//         setErrorMessage(errorData.detail || 'Failed to submit application');
//       }
//       setIsSubmitting(false);
//       return;
//     }

//     setIsSubmitting(false);
//     setShowSuccess(true);
//     setTimeout(() => {
//       setShowSuccess(false);
//       window.location.reload();
//     }, 3000);
//   } catch (err) {
//     console.error('Submission error:', err);
//     setErrorMessage(
//       err.message.includes('duplicate key value')
//         ? 'You have already applied for this job. Please check your application status or contact support for assistance.'
//         : err.message || 'An unexpected error occurred. Please try again later.'
//     );
//     setIsSubmitting(false);
//   }
// };
// //   const handleSubmit = async () => {
// //   if (!job.id) {
// //     setErrorMessage('Job details not loaded. Please try again.');
// //     return;
// //   }

// //   const requiredFields = ['fullName', 'email', 'phone', 'qualification', 'experience'];
// //   const isFormValid = requiredFields.every((field) => formData[field].trim() !== '');
// //   const isResumeUploaded = activeTab === 'noresume' || !!uploadedFile;

// //   const requiredDocs = job.documents_required || [];
// //   const uploadedDocTypes = [
// //     ...new Set([
// //       ...(selectedResumeType && uploadedFile && activeTab === 'upload' ? [selectedResumeType] : []),
// //       ...documents.map((doc) => doc.type),
// //     ]),
// //   ];
// //   const missingDocs = requiredDocs.filter((docType) => !uploadedDocTypes.includes(docType));

// //   if (!isFormValid) {
// //     setErrorMessage(
// //       'Please fill all required fields: Full Name, Email, Phone, Qualification, and Experience.'
// //     );
// //     return;
// //   }

// //   if (!isResumeUploaded) {
// //     setErrorMessage('Please upload your resume or select "Don\'t have Resume" option.');
// //     return;
// //   }

// //   if (requiredDocs.length > 0 && missingDocs.length > 0) {
// //     setErrorMessage(`Missing required documents: ${missingDocs.join(', ')}.`);
// //     return;
// //   }

// //   setErrorMessage('');
// //   setIsSubmitting(true);

// //   try {
// //     const formDataToSend = new FormData();
// //     formDataToSend.append('unique_link', unique_link);
// //     formDataToSend.append('job_requisition', job.id);
// //     formDataToSend.append('full_name', formData.fullName);
// //     formDataToSend.append('email', formData.email);
// //     formDataToSend.append('phone', formData.phone);
// //     formDataToSend.append('qualification', formData.qualification);
// //     formDataToSend.append('experience', formData.experience);
// //     formDataToSend.append('knowledge_skill', formData.knowledgeSkill);
// //     formDataToSend.append('cover_letter', formData.coverLetter);
// //     formDataToSend.append('resume_status', activeTab === 'upload');

// //     if (uploadedFile && activeTab === 'upload' && !selectedResumeType) {
// //       setErrorMessage('Please select a document type for the resume.');
// //       setIsSubmitting(false);
// //       return;
// //     }

// //     let docIndex = 0;
// //     const providedDocTypes = [];

// //     if (uploadedFile && activeTab === 'upload' && selectedResumeType) {
// //       if (job.documents_required.includes(selectedResumeType)) {
// //         formDataToSend.append(`documents[${docIndex}][document_type]`, selectedResumeType);
// //         formDataToSend.append(`documents[${docIndex}][file]`, uploadedFile.file, uploadedFile.name);
// //         providedDocTypes.push(selectedResumeType);
// //         docIndex++;
// //       } else {
// //         setErrorMessage(
// //           `Invalid resume type: ${selectedResumeType}. Must be one of ${job.documents_required.join(', ')}.`
// //         );
// //         setIsSubmitting(false);
// //         return;
// //       }
// //     }

// //     documents.forEach((doc) => {
// //       if (!providedDocTypes.includes(doc.type)) {
// //         formDataToSend.append(`documents[${docIndex}][document_type]`, doc.type);
// //         formDataToSend.append(`documents[${docIndex}][file]`, doc.file, doc.name);
// //         providedDocTypes.push(doc.type);
// //         docIndex++;
// //       }
// //     });

// //     //console.log('FormData contents:');
// //     // for (const [key, value] of formDataToSend.entries()) {
// //     //   if (value instanceof File) {
// //     //     console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
// //     //   } else {
// //     //     console.log(`${key}: ${value}`);
// //     //   }
// //     // }

// //     const response = await fetch(`${API_BASE_URL}/api/talent-engine-job-applications/applications/`, {
// //       method: 'POST',
// //       body: formDataToSend,
// //     });

// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       console.error('Backend error response:', errorData);

// //       // Check for duplicate application error
// //       if (
// //         errorData.detail &&
// //         errorData.detail.includes('duplicate key value violates unique constraint')
// //       ) {
// //         setErrorMessage(
// //           'You have already applied for this job. Please check your application status or contact support for assistance.'
// //         );
// //       } else if (errorData.errors) {
// //         const errorMessages = Object.entries(errorData.errors)
// //           .map(([field, errors]) => {
// //             if (Array.isArray(errors)) {
// //               return `${field}: ${errors.join(', ')}`;
// //             } else if (typeof errors === 'object' && errors.length > 0) {
// //               return `${field}: ${errors.map((err) => err.detail || JSON.stringify(err)).join(', ')}`;
// //             }
// //             return `${field}: ${errors}`;
// //           })
// //           .join('; ');
// //         setErrorMessage(errorMessages || errorData.detail || 'Failed to submit application');
// //       } else {
// //        UNO: setErrorMessage(errorData.detail || 'Failed to submit application');
// //       }
// //       setIsSubmitting(false);
// //       return;
// //     }

// //     setIsSubmitting(false);
// //     setShowSuccess(true);
// //     setTimeout(() => {
// //       setShowSuccess(false);
// //       window.location.reload();
// //     }, 3000);
// //   } catch (err) {
// //     console.error('Submission error:', err);
// //     setErrorMessage(
// //       err.message.includes('duplicate key value')
// //         ? 'You have already applied for this job. Please check your application status or contact support for assistance.'
// //         : err.message || 'An unexpected error occurred. Please try again later.'
// //     );
// //     setIsSubmitting(false);
// //   }
// // };
//   const renderResponsibilities = () => {
//     try {
//       const responsibilities = job.responsibilities
//         ? Array.isArray(job.responsibilities)
//           ? job.responsibilities
//           : JSON.parse(job.responsibilities)
//         : [];
//       return responsibilities.length > 0 ? (
//         <ul>
//           {responsibilities.map((resp, idx) => (
//             <li key={idx}>{resp}</li>
//           ))}
//         </ul>
//       ) : (
//         <p>No responsibilities listed.</p>
//       );
//     } catch (error) {
//       return <p>No responsibilities listed.</p>;
//     }
//   };

//   const postedDate = job.created_at
//     ? new Date(job.created_at).toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//       }).split('/').join('-')
//     : '06-12-2025';

//   if (isLoading) {
//     return (
//       <div className="Alll_OOo_LODer">
//         <div className="loader"></div>
//           <p>Loading job details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="ool-Apply-Seco">
//         <div className="site-container" style={{ textAlign: 'center', padding: '50px' }}>
//           <p style={{ color: 'red' }}>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="ool-Apply-Seco">
//       <div className='gggyh-dalik'>
//         <div className='large-container gggyh-dalik-main'>
//         <Link to="/" className="Nav-Brand GUK-Loffoa">
//             <img src={LOGO} alt="logo" />
//             <span>Jobs</span>
//           </Link>
//           <h4><TagIcon /> #JOB ID: POL-00002</h4>
//           </div>
//           </div>
//       <header className="ool-Apply-Seco-header">
//         <div className="large-container">
//           <div className="ouoau-Hero">
//             <h2>{job.title || 'Job Title'}</h2>
//           </div>
//           <div className="aoik-fffot">
//             <div className="aoik-fffot-1">
//               <div className="aoik-fffot-10">
//                 <h3>{job.id?.slice(0, 3) || 'N/A'}</h3>
//               </div>
//               <div className="aoik-fffot-11">
//                 <div>
//                   <p>{job.company || 'Company Name'}</p>
//                   <span>Posted on: {postedDate}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="aoik-fffot-2">
//               {/* <button>
//                 <ShareIcon className="h-5 w-5 inline-block mr-1" /> Share job
//               </button> */}
//                 <button onClick={handleCopyLink}>
//                   <ShareIcon className="h-5 w-5 inline-block mr-1" /> 
//                   {isLinkCopied ? 'Link copied!' : 'Share job'}
//                 </button>
//                 {/* href={job.company_web_address}  */}
//                 <a 
//                     href={job.company_web_address?.startsWith('http') 
//                       ? job.company_web_address 
//                       : `https://${job.company_web_address}`} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                   >
//                     <GlobeAltIcon className="h-5 w-5 inline-block mr-1" /> Company site
//                   </a>
//             </div>
//           </div>
//         </div>
//       </header>

//       <section className="gtht-secs">
//         <div className="large-container">
//           <div className="gtht-secs-Main">
//             <div className="gtht-secs-Part1">
//               <div className="gtht-secs-IIjah-Box">
//                 <h3>Job Description</h3>
//                 <div className="gtht-secs-IIjah-Box-Ddfa">
//                   <p>{job.job_description || 'No job description provided.'}</p>
//                 </div>
//               </div>

//               <div className="gtht-secs-IIjah-Box">
//                 <h3>Key Responsibilities</h3>
//                 <div className="gtht-secs-IIjah-Box-Ddfa">{renderResponsibilities()}</div>
//               </div>

//               <div className="gtht-secs-IIjah-Box">
//                 <h3>Basic Job Information</h3>
//                 <div className="ggg-Grids">
//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Job Title</h4>
//                     <p>{job.title || 'N/A'}</p>
//                   </div>

//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Company Name</h4>
//                     <p>{job.company || 'N/A'}</p>
//                   </div>

//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Job Type</h4>
//                     <p>{job.jobType || 'N/A'}</p>
//                   </div>

//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Location</h4>
//                     <p>{job.location || 'N/A'}</p>
//                   </div>

//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Company Address</h4>
//                     <p>{job.company_address || 'N/A'}</p>
//                   </div>

//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Salary Range</h4>
//                     <p>{job.salary_range || 'N/A'}</p>
//                   </div>

//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Qualification Requirement</h4>
//                     <p>{job.qualification_requirement || 'N/A'}</p>
//                   </div>

//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Experience Requirement</h4>
//                     <p>{job.experience_requirement || 'N/A'}</p>
//                   </div>

//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Knowledge/Skill Requirement</h4>
//                     <p>{job.knowledge_requirement || 'N/A'}</p>
//                   </div>

//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Deadline for Applications</h4>
//                     <p>{job.deadline || 'N/A'}</p>
//                   </div>
// {/* 
//                   <div className="gtht-secs-IIjah-Box-Ddfa">
//                     <h4>Start Date</h4>
//                     <p>
//                       {job.start_date
//                         ? new Date(job.start_date)
//                             .toLocaleDateString('en-GB', {
//                               day: '2-digit',
//                               month: '2-digit',
//                               year: 'numeric',
//                             })
//                             .split('/')
//                             .join('-')
//                         : 'N/A'}
//                     </p>
//                   </div> */}
//                 </div>
//               </div>
//             </div>
//             <div className="gtht-secs-Part2">
//               <div className="gtht-secs-Part2-Box Gen-Boxshadow">
//                 <div className="gtht-secs-Part2-Box-Top">
//                   <h3>Apply for this Job</h3>
//                   <p>Please complete the form below to apply for this position.</p>
//                 </div>

//                 {isDeadlineExpired ? (
//                   <div className="deadline-expired-message">
//                     <img src={NoAdvert} />
//                     <p>The company has stopped taking applications.</p>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="hhgh-btbs">
//                       <span
//                         className={activeTab === 'upload' ? 'active-Hgh' : ''}
//                         onClick={() => setActiveTab('upload')}
//                       >
//                         Upload CV
//                       </span>
//                       <span
//                         className={activeTab === 'noresume' ? 'active-Hgh' : ''}
//                         onClick={() => setActiveTab('noresume')}
//                       >
//                         Don't have Resume
//                       </span>
//                     </div>

//                     <div className="gtht-secs-Part2-Box-Mainna">
//                       {activeTab === 'upload' && (
//                       <div className="cv-upload-sec">
//                         <h4>Upload Your File</h4>
//                         <div className="cv-uploa-box">
//                           <div
//                             className="cv-uploa-box-Top"
//                             onClick={handleClickUpload}
//                             onDrop={handleFileDrop}
//                             onDragOver={(e) => e.preventDefault()}
//                           >
//                             <span>
//                               <ArrowUpTrayIcon />
//                             </span>
//                             <h4>
//                               Drag & Drop or <u>Choose File</u> to upload
//                             </h4>
//                             <p>Upload a file to auto-fill your application details (PDF or Word, .doc, .docx). File size limit: 50 MB.</p>
//                             <input
//                               type="file"
//                               accept=".pdf,.doc,.docx"
//                               ref={fileInputRef}
//                               style={{ display: 'none' }}
//                               onChange={handleFileChange}
//                             />
//                           </div>
//                           {uploadedFile && (
//                             <div className="cv-uploa-box-Foot Gen-Boxshadow">
//                               <div className="cv-uploa-box-Foot-1">
//                                 <div className="cv-uploa-box-Foot-10">
//                                   <img src={PDFICON} alt="Document Icon" />
//                                 </div>
//                                 <div className="cv-uploa-box-Foot-11">
//                                   <div>
//                                     <h4>{uploadedFile.name}</h4>
//                                     <p>
//                                       <span>{uploadedFile.size}MB</span>
//                                       <i></i>
//                                       <span>
//                                         <CheckCircleIcon /> File size
//                                       </span>
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="cv-uploa-box-Foot-2">
//                                 <span onClick={removeFile}>
//                                   <TrashIcon />
//                                 </span>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       )}

//                       <div className="FooorM-Sec">
//                         {[
//                           {
//                             label: 'Full Name',
//                             placeholder: 'Enter your full name',
//                             name: 'fullName',
//                             required: true,
//                           },
//                           {
//                             label: 'Email Address',
//                             placeholder: 'Enter your email address',
//                             name: 'email',
//                             required: true,
//                           },
//                           {
//                             label: 'Confirm Email Address',
//                             placeholder: 'Enter your confirm email address',
//                             name: 'confirmEmail',
//                             required: true,
//                           },
//                           {
//                             label: 'Phone Number',
//                             placeholder: 'Enter your phone number',
//                             name: 'phone',
//                             required: true,
//                           },
//                              {
//                             label: 'Date of Birth',
//                             placeholder: 'Enter your date of birth',
//                             name: 'date_of_birth',
//                             type: 'date', 
//                             required: true,
//                           },
//                           {
//                             label: 'Qualification',
//                             placeholder: 'Enter your highest qualification',
//                             name: 'qualification',
//                             required: true,
//                           },
//                           {
//                             label: 'Experience',
//                             placeholder: 'Enter your years of experience',
//                             name: 'experience',
//                             required: true,
//                           },
//                           {
//                             label: 'Knowledge/Skill (Optional)',
//                             placeholder: 'List relevant skills or knowledge',
//                             name: 'knowledgeSkill',
//                             required: false,
//                           },
//                         ].map((field, idx) => (
//                           <div className="GHuh-Form-Input" key={idx}>
//                             <label>{field.label}</label>
//                             {field.type === 'date' ? (
//                               <input
//                                 type="date"
//                                 name={field.name}
//                                 value={formData[field.name]}
//                                 onChange={handleInputChange}
//                                 required={field.required}
//                                 max={new Date().toISOString().split('T')[0]} // Prevent future dates
//                               />
//                             ) : (
//                               <input
//                                 type="text"
//                                 name={field.name}
//                                 placeholder={field.placeholder}
//                                 value={formData[field.name]}
//                                 onChange={handleInputChange}
//                                 required={field.required}
//                               />
//                             )}
//                           </div>
//                         ))}

//                         {job.documents_required && job.documents_required.length > 0 ? (
//                           <div className="GHuh-Form-Input">
//                             <label>Document Uploads (Required)</label>
//                             <select onChange={handleDocTypeChange} value={selectedDocType}>
//                               <option value="">--Select document to upload--</option>
//                               {availableDocTypes.map((type, idx) => (
//                                 <option key={idx} value={type}>{type}</option>
//                               ))}
//                             </select>
//                             <input
//                               type="file"
//                               accept=".pdf,.doc,.docx"
//                               ref={documentsInputRef}
//                               multiple
//                               style={{ display: 'none' }}
//                               onChange={handleDocumentUpload}
//                             />
//                           </div>
//                         ) : (
//                           <p>No additional documents required for this job.</p>
//                         )}

//                         {documents.length > 0 &&
//                           documents.map((doc, index) => (
//                             <div className="Gtahy-SSa" key={index}>
//                               <div className="Gtahy-SSa-1">
//                                 <div className="Gtahy-SSa-11">
//                                   <div>
//                                     <h4>
//                                       {doc.name} ({doc.type})
//                                     </h4>
//                                     <p>
//                                       <span>{doc.size}MB</span>
//                                       <i></i>
//                                       <span>
//                                         <CheckCircleIcon /> File size
//                                       </span>
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="Gtahy-SSa-2">
//                                 <span onClick={() => removeDocument(index)}>
//                                   <XMarkIcon />
//                                 </span>
//                               </div>
//                             </div>
//                           ))}

//                         <div className="GHuh-Form-Input">
//                           <label>Cover Letter (Optional)</label>
//                           <textarea
//                             name="coverLetter"
//                             placeholder="Write your cover letter here"
//                             value={formData.coverLetter}
//                             onChange={handleInputChange}
//                           />
//                         </div>

//                         <div className="GHuh-Form-Input">
//                           <button
//                             className="submiii-btnn btn-primary-bg"
//                             onClick={handleSubmit}
//                             disabled={isSubmitting || isDeadlineExpired}
//                           >
//                             {isSubmitting && (
//                               <motion.div
//                                 initial={{ rotate: 0 }}
//                                 animate={{ rotate: 360 }}
//                                 transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//                                 style={{
//                                   width: 15,
//                                   height: 15,
//                                   borderRadius: '50%',
//                                   border: '3px solid #fff',
//                                   borderTopColor: 'transparent',
//                                   marginRight: '5px',
//                                   display: 'inline-block',
//                                 }}
//                               />
//                             )}
//                             {isSubmitting ? 'Submitting...' : 'Submit application'}
//                           </button>
//                           {errorMessage && <p className="error">{errorMessage}</p>}
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <AnimatePresence>
//         {showSuccess && (
//           <motion.div
//             className="success-alert"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.4 }}
//             style={{
//               position: 'fixed',
//               top: 10,
//               right: 10,
//               backgroundColor: '#38a169',
//               color: 'white',
//               padding: '10px 20px',
//               fontSize: '12px',
//               borderRadius: '6px',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//               zIndex: 9999,
//             }}
//           >
//             Application sent successfully!
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default JobApplication;
















import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';
import { ShareIcon } from '@heroicons/react/20/solid';
import { Link, useNavigate } from 'react-router-dom';

import LOGO from '../../assets/Img/logo-lite.png';
import NoAdvert from '../../assets/Img/noAdvert.png';
import {
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../../config';
import PDFICON from '../../assets/Img/pdf-icon.png';
import AdvertBanner from '../../assets/Img/Advert-Banner.jpg';
import { TagIcon } from '@heroicons/react/24/solid';
const API_BASE_URL = `${config.API_BASE_URL}`;

function JobApplication() {
  const { unique_link } = useParams();
  const [job, setJob] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDocTypes, setAvailableDocTypes] = useState([]);
  const [selectedResumeType, setSelectedResumeType] = useState('');
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isDeadlineExpired, setIsDeadlineExpired] = useState(false);

  const handleCopyLink = () => {
    const jobLink = window.location.href;
    navigator.clipboard.writeText(jobLink).then(() => {
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    }).catch((err) => {
      console.error('Failed to copy link:', err);
      setErrorMessage('Failed to copy link. Please try again.');
    });
  };

  usePageTitle(job.title && job.company_name ? `${job.title} - ${job.company_name}` : 'Job Application');

  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    qualification: '',
    date_of_birth: '',
    experience: '',
    knowledgeSkill: '',
    coverLetter: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const documentsInputRef = useRef(null);
  const [selectedDocType, setSelectedDocType] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/talent-engine/requisitions/by-link/${unique_link}/`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Job not found or not published');
        }
        const data = await response.json();
        setJob({
          id: data.id,
          title: data.title,
          company: data.company_name,
          jobType: data.job_type
            ? {
                full_time: 'Full-Time',
                part_time: 'Part-Time',
                contract: 'Contract',
                freelance: 'Freelance',
                internship: 'Internship',
              }[data.job_type] || data.job_type
            : 'N/A',
          location: data.location_type
            ? {
                on_site: 'On-site',
                remote: 'Remote',
                hybrid: 'Hybrid',
              }[data.location_type] || data.location_type
            : 'N/A',
          company_address: data.company_address,
          company_web_address: data.tenant_domain,
          salary_range: data.salary_range,
          job_application_code: data.job_application_code,
          advert_banner: data.advert_banner,
          job_description: data.job_description,
          qualification_requirement: data.qualification_requirement,
          experience_requirement: data.experience_requirement,
          knowledge_requirement: data.knowledge_requirement,
          deadline: data.deadline_date
            ? new Date(data.deadline_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }).split('/').join('-')
            : 'N/A',
          start_date: data.start_date,
          responsibilities: data.responsibilities,
          documents_required: data.documents_required || [],
          created_at: data.created_at,
          deadline_date: data.deadline_date,
        });
        setAvailableDocTypes(data.documents_required || []);
        if (data.deadline_date) {
          const deadlineDate = new Date(data.deadline_date);
          const currentDate = new Date();
          setIsDeadlineExpired(deadlineDate < currentDate);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching job:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [unique_link]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = async (file) => {
    if (!file) return;
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Only PDF and Word (.doc, .docx) files are allowed for resume upload.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds 50 MB limit.');
      return;
    }

    setErrorMessage('');
    setUploadedFile({
      file: file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1),
      type: selectedResumeType,
    });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('resume', file);
      formDataToSend.append('unique_link', unique_link);

      const response = await fetch(`${API_BASE_URL}/api/talent-engine-job-applications/applications/parse-resume/autofil/`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || 'Failed to parse resume. Please fill the form manually.');
        return;
      }

      const { data } = await response.json();
      setFormData((prev) => ({
        ...prev,
        fullName: data.full_name || prev.fullName,
        email: data.email || prev.email,
        confirmEmail: data.email || prev.confirmEmail,
        phone: data.phone || prev.phone,
        qualification: data.qualification || prev.qualification,
        date_of_birth: data.date_of_birth || prev.date_of_birth,
        experience: data.experience || prev.experience,
        knowledgeSkill: data.knowledge_skill || prev.knowledgeSkill,
      }));
      setErrorMessage('');
    } catch (err) {
      console.error('Error parsing resume:', err);
      setErrorMessage('Failed to parse resume. Please fill the form manually.');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setSelectedResumeType('');
  };

  const handleClickUpload = () => fileInputRef.current.click();

  const handleDocumentUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) {
      setErrorMessage('No files selected. Please choose a file to upload.');
      setSelectedDocType('');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const validFiles = selectedFiles.filter((file) => allowedTypes.includes(file.type));
    if (validFiles.length !== selectedFiles.length) {
      setErrorMessage('Some files were not PDF or Word (.doc, .docx) and were skipped.');
    } else {
      setErrorMessage('');
    }

    const newDocs = validFiles.map((file) => ({
      file: file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1),
      type: selectedDocType,
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
    if (selectedDocType) {
      setAvailableDocTypes((prev) => prev.filter((type) => type !== selectedDocType));
      setSelectedDocType('');
    }
  };

  const removeDocument = (index) => {
    const docToRemove = documents[index];
    if (docToRemove.type) {
      setAvailableDocTypes((prev) => [...prev, docToRemove.type].sort());
    }
    const newDocs = [...documents];
    newDocs.splice(index, 1);
    setDocuments(newDocs);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleDocTypeChange = (e) => {
    const selectedType = e.target.value;
    if (selectedType !== '') {
      setSelectedDocType(selectedType);
      documentsInputRef.current.click();
    } else {
      setSelectedDocType('');
    }
  };

  const handleSubmit = async () => {
    if (!job.id) {
      setErrorMessage('Job details not loaded. Please try again.');
      return;
    }

    if (formData.email !== formData.confirmEmail) {
      setErrorMessage('Email addresses do not match');
      return;
    }

    const requiredFields = ['fullName', 'email', 'confirmEmail', 'phone', 'qualification', 'experience'];
    const isFormValid = requiredFields.every((field) => formData[field].trim() !== '');
    const isResumeUploaded = activeTab === 'noresume' || !!uploadedFile;

    const requiredDocs = job.documents_required || [];
    const uploadedDocTypes = [
      ...new Set([
        ...documents.map((doc) => doc.type),
      ]),
    ];
    const missingDocs = requiredDocs.filter((docType) => !uploadedDocTypes.includes(docType));

    if (!isFormValid) {
      setErrorMessage(
        'Please fill all required fields: Full Name, Email, Phone, Qualification, and Experience.'
      );
      return;
    }

    if (!isResumeUploaded) {
      setErrorMessage('Please upload your resume or select "Don\'t have Resume" option.');
      return;
    }

    if (requiredDocs.length > 0 && missingDocs.length > 0) {
      setErrorMessage(`Missing required documents: ${missingDocs.join(', ')}.`);
      return;
    }

    if (formData.qualification.length > 255) {
      setErrorMessage('Qualification field must not exceed 255 characters.');
      return;
    }
    if (formData.experience.length > 255) {
      setErrorMessage('Experience field must not exceed 255 characters.');
      return;
    }

    // Validate date_of_birth format
    if (formData.date_of_birth) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date_of_birth)) {
        setErrorMessage('Date of Birth must be in YYYY-MM-DD format (e.g., 2025-07-01).');
        return;
      }
      // Optionally, validate if the date is valid
      const date = new Date(formData.date_of_birth);
      if (isNaN(date.getTime())) {
        setErrorMessage('Invalid Date of Birth. Please select a valid date.');
        return;
      }
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('unique_link', unique_link);
      formDataToSend.append('job_requisition', job.id);
      formDataToSend.append('full_name', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      // Only append date_of_birth if it exists and is valid
      if (formData.date_of_birth) {
        formDataToSend.append('date_of_birth', formData.date_of_birth);
      }
      formDataToSend.append('qualification', formData.qualification);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('knowledge_skill', formData.knowledgeSkill);
      formDataToSend.append('cover_letter', formData.coverLetter);
      formDataToSend.append('resume_status', activeTab === 'upload');

      let docIndex = 0;
      const providedDocTypes = [];

      if (uploadedFile && activeTab === 'upload' && selectedResumeType) {
        if (job.documents_required.includes(selectedResumeType)) {
          formDataToSend.append(`documents[${docIndex}][document_type]`, selectedResumeType);
          formDataToSend.append(`documents[${docIndex}][file]`, uploadedFile.file, uploadedFile.name);
          providedDocTypes.push(selectedResumeType);
          docIndex++;
        } else {
          setErrorMessage(
            `Invalid resume type: ${selectedResumeType}. Must be one of ${job.documents_required.join(', ')}.`
          );
          setIsSubmitting(false);
          return;
        }
      }

      documents.forEach((doc) => {
        if (!providedDocTypes.includes(doc.type)) {
          formDataToSend.append(`documents[${docIndex}][document_type]`, doc.type);
          formDataToSend.append(`documents[${docIndex}][file]`, doc.file, doc.name);
          providedDocTypes.push(doc.type);
          docIndex++;
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/talent-engine-job-applications/applications/`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);

        if (
          errorData.detail &&
          errorData.detail.includes('duplicate key value violates unique constraint')
        ) {
          setErrorMessage(
            'You have already applied for this job. Please check your application status or contact support for assistance.'
          );
        } else if (errorData.qualification || errorData.experience) {
          const errors = [];
          if (errorData.qualification) {
            errors.push('Qualification field must not exceed 255 characters.');
          }
          if (errorData.experience) {
            errors.push('Experience field must not exceed 255 characters.');
          }
          setErrorMessage(errors.join(' '));
        } else if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              } else if (typeof errors === 'object' && errors.length > 0) {
                return `${field}: ${errors.map((err) => err.detail || JSON.stringify(err)).join(', ')}`;
              }
              return `${field}: ${errors}`;
            })
            .join('; ');
          setErrorMessage(errorMessages || errorData.detail || 'Failed to submit application');
        } else if (errorData.date_of_birth) {
          setErrorMessage('Date of Birth must be in YYYY-MM-DD format or left empty.');
        } else {
          setErrorMessage(errorData.detail || 'Failed to submit application');
        }
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(
        err.message.includes('duplicate key value')
          ? 'You have already applied for this job. Please check your application status or contact support for assistance.'
          : err.message || 'An unexpected error occurred. Please try again later.'
      );
      setIsSubmitting(false);
    }
  };

  const renderResponsibilities = () => {
    try {
      const responsibilities = job.responsibilities
        ? Array.isArray(job.responsibilities)
          ? job.responsibilities
          : JSON.parse(job.responsibilities)
        : [];
      return responsibilities.length > 0 ? (
        <ul>
          {responsibilities.map((resp, idx) => (
            <li key={idx}>{resp}</li>
          ))}
        </ul>
      ) : (
        <p>No responsibilities listed.</p>
      );
    } catch (error) {
      return <p>No responsibilities listed.</p>;
    }
  };

  const postedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).split('/').join('-')
    : '06-12-2025';

  if (isLoading) {
    return (
      <div className="Alll_OOo_LODer">
        <div className="loader"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ool-Apply-Seco">
        <div className="site-container" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ool-Apply-Seco">
      <div className='gggyh-dalik'>
        <div className='large-container gggyh-dalik-main'>
          <Link to="/" className="Nav-Brand GUK-Loffoa">
            <img src={job.advert_banner} alt="logo" />
            <span>Jobs</span>
          </Link>
          <h4><TagIcon /> {job.job_application_code}</h4>
        </div>
      </div>
      <header className="ool-Apply-Seco-header">
        <div className="large-container">
          <div className="ouoau-Hero">
            <h2>{job.title || 'Job Title'}</h2>
          </div>
          <div className="aoik-fffot">
            <div className="aoik-fffot-1">
              <div className="aoik-fffot-10">
                <h3>{job.id?.slice(0, 3) || 'N/A'}</h3>
              </div>
              <div className="aoik-fffot-11">
                <div>
                  <p>{job.company || 'Company Name'}</p>
                  <span>Posted on: {postedDate}</span>
                </div>
              </div>
            </div>
            <div className="aoik-fffot-2">
              <button onClick={handleCopyLink}>
                <ShareIcon className="h-5 w-5 inline-block mr-1" />
                {isLinkCopied ? 'Link copied!' : 'Share job'}
              </button>
              <a
                href={job.company_web_address?.startsWith('http')
                  ? job.company_web_address
                  : `https://${job.company_web_address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlobeAltIcon className="h-5 w-5 inline-block mr-1" /> Company site
              </a>
            </div>
          </div>
        </div>
      </header>
      <section className="gtht-secs">
        <div className="large-container">
          <div className="gtht-secs-Main">
            <div className="gtht-secs-Part1">
              <div className="gtht-secs-IIjah-Box">
                <h3>Job Description</h3>
                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <p>{job.job_description || 'No job description provided.'}</p>
                </div>
              </div>
              <div className="gtht-secs-IIjah-Box">
                <h3>Key Responsibilities</h3>
                <div className="gtht-secs-IIjah-Box-Ddfa">{renderResponsibilities()}</div>
              </div>
              <div className="gtht-secs-IIjah-Box">
                <h3>Basic Job Information</h3>
                <div className="ggg-Grids">
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Job Title</h4>
                    <p>{job.title || 'N/A'}</p>
                  </div>
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Company Name</h4>
                    <p>{job.company || 'N/A'}</p>
                  </div>
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Job Type</h4>
                    <p>{job.jobType || 'N/A'}</p>
                  </div>
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Location</h4>
                    <p>{job.location || 'N/A'}</p>
                  </div>
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Company Address</h4>
                    <p>{job.company_address || 'N/A'}</p>
                  </div>
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Salary Range</h4>
                    <p>{job.salary_range || 'N/A'}</p>
                  </div>
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Qualification Requirement</h4>
                    <p>{job.qualification_requirement || 'N/A'}</p>
                  </div>
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Experience Requirement</h4>
                    <p>{job.experience_requirement || 'N/A'}</p>
                  </div>
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Knowledge/Skill Requirement</h4>
                    <p>{job.knowledge_requirement || 'N/A'}</p>
                  </div>
                  <div className="gtht-secs-IIjah-Box-Ddfa">
                    <h4>Deadline for Applications</h4>
                    <p>{job.deadline || 'N/A'}</p>
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
                {isDeadlineExpired ? (
                  <div className="deadline-expired-message">
                    <img src={NoAdvert} />
                    <p>The company has stopped taking applications.</p>
                  </div>
                ) : (
                  <>
                    <div className="gtht-secs-Part2-Box-Mainna">
                      {activeTab === 'upload' && (
                        <div className="cv-upload-sec">
                          <h4>Upload Your File</h4>
                          <div className="cv-uploa-box">
                            <div
                              className="cv-uploa-box-Top"
                              onClick={handleClickUpload}
                              onDrop={handleFileDrop}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              <span>
                                <ArrowUpTrayIcon />
                              </span>
                              <h4>
                                Drag & Drop or <u>Choose File</u> to upload
                              </h4>
                              <p>Upload a file to auto-fill your application details (PDF or Word, .doc, .docx). File size limit: 50 MB.</p>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                              />
                            </div>
                            {uploadedFile && (
                              <div className="cv-uploa-box-Foot Gen-Boxshadow">
                                <div className="cv-uploa-box-Foot-1">
                                  <div className="cv-uploa-box-Foot-10">
                                    <img src={PDFICON} alt="Document Icon" />
                                  </div>
                                  <div className="cv-uploa-box-Foot-11">
                                    <div>
                                      <h4>{uploadedFile.name}</h4>
                                      <p>
                                        <span>{uploadedFile.size}MB</span>
                                        <i></i>
                                        <span>
                                          <CheckCircleIcon /> File size
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="cv-uploa-box-Foot-2">
                                  <span onClick={removeFile}>
                                    <TrashIcon />
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="FooorM-Sec">
                        {[
                          {
                            label: 'Full Name',
                            placeholder: 'Enter your full name',
                            name: 'fullName',
                            required: true,
                          },
                          {
                            label: 'Email Address',
                            placeholder: 'Enter your email address',
                            name: 'email',
                            required: true,
                          },
                          {
                            label: 'Confirm Email Address',
                            placeholder: 'Enter your confirm email address',
                            name: 'confirmEmail',
                            required: true,
                          },
                          {
                            label: 'Phone Number',
                            placeholder: 'Enter your phone number',
                            name: 'phone',
                            required: true,
                          },
                          {
                            label: 'Date of Birth (Optional)',
                            placeholder: 'Enter your date of birth',
                            name: 'date_of_birth',
                            type: 'date',
                            required: false,
                          },
                          {
                            label: 'Qualification',
                            placeholder: 'Enter your highest qualification',
                            name: 'qualification',
                            required: true,
                          },
                          {
                            label: 'Experience',
                            placeholder: 'Enter your years of experience',
                            name: 'experience',
                            required: true,
                          },
                          {
                            label: 'Knowledge/Skill (Optional)',
                            placeholder: 'List relevant skills or knowledge',
                            name: 'knowledgeSkill',
                            required: false,
                          },
                        ].map((field, idx) => (
                          <div className="GHuh-Form-Input" key={idx}>
                            <label>{field.label}</label>
                            {field.type === 'date' ? (
                              <input
                                type="date"
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                required={field.required}
                                max={new Date().toISOString().split('T')[0]}
                              />
                            ) : (
                              <input
                                type="text"
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                required={field.required}
                              />
                            )}
                          </div>
                        ))}
                        {job.documents_required && job.documents_required.length > 0 ? (
                          <div className="GHuh-Form-Input">
                            <label>Document Uploads (Required)</label>
                            <select onChange={handleDocTypeChange} value={selectedDocType}>
                              <option value="">--Select document to upload--</option>
                              {availableDocTypes.map((type, idx) => (
                                <option key={idx} value={type}>{type}</option>
                              ))}
                            </select>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              ref={documentsInputRef}
                              multiple
                              style={{ display: 'none' }}
                              onChange={handleDocumentUpload}
                            />
                          </div>
                        ) : (
                          <p>No additional documents required for this job.</p>
                        )}
                        {documents.length > 0 &&
                          documents.map((doc, index) => (
                            <div className="Gtahy-SSa" key={index}>
                              <div className="Gtahy-SSa-1">
                                <div className="Gtahy-SSa-11">
                                  <div>
                                    <h4>
                                      {doc.name} ({doc.type})
                                    </h4>
                                    <p>
                                      <span>{doc.size}MB</span>
                                      <i></i>
                                      <span>
                                        <CheckCircleIcon /> File size
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="Gtahy-SSa-2">
                                <span onClick={() => removeDocument(index)}>
                                  <XMarkIcon />
                                </span>
                              </div>
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
                          <button
                            className="submiii-btnn btn-primary-bg"
                            onClick={handleSubmit}
                            disabled={isSubmitting || isDeadlineExpired}
                          >
                            {isSubmitting && (
                              <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
                          {errorMessage && <p className="error">{errorMessage}</p>}
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
              backgroundColor: '#4caf50',
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
