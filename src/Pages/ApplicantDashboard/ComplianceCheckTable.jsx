// import React, { useState, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import './ComplianceCheckTable.css';

// import pdfIcon from '../../assets/icons/pdf.png';
// import imageIcon from '../../assets/icons/image.png';

// import { CloudArrowUpIcon, PencilIcon } from '@heroicons/react/24/outline';

// const initialComplianceData = [
//   'Passport / Drivers Licence',
//   'Shared Code or DOB',
//   'DBS',
//   'Training Cert',
//   'Proof of Address',
//   'Right to Work Check',
//   'References (Links to previous)',
// ].map((item) => ({
//   title: item,
//   file: null,
//   fileName: '',
//   fileType: '',
//   fileIcon: '',
//   fileUrl: '',
//   status: 'Not Uploaded',
// }));

// const getFileTypeInfo = (filename) => {
//   const extension = filename.split('.').pop().toLowerCase();
//   if (extension === 'pdf') {
//     return { type: 'PDF', icon: pdfIcon };
//   } else if (extension === 'jpg' || extension === 'jpeg') {
//     return { type: 'JPG Image', icon: imageIcon };
//   } else if (extension === 'png') {
//     return { type: 'PNG Image', icon: imageIcon };
//   }
//   return null;
// };

// const ComplianceCheckTable = () => {
//   const [complianceData, setComplianceData] = useState(initialComplianceData);
//   const [alertMessage, setAlertMessage] = useState(null);
//   const [showPrompt, setShowPrompt] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRefs = useRef([]);

//   const triggerFileInput = (index) => {
//     if (fileInputRefs.current[index]) {
//       fileInputRefs.current[index].click();
//     }
//   };

//   const handleFileChange = (index, file) => {
//     if (!file) return;

//     const isDuplicate = complianceData.some(
//       (item, idx) => idx !== index && item.fileName === file.name
//     );
//     if (isDuplicate) {
//       showAlert('This file has already been uploaded for another requirement.', 'error');
//       return;
//     }

//     const fileInfo = getFileTypeInfo(file.name);
//     if (!fileInfo) {
//       showAlert('Only PDF, JPG, and PNG files are allowed.', 'error');
//       return;
//     }

//     const newData = [...complianceData];
//     const isEdit = !!newData[index].file;

//     if (newData[index].fileUrl) {
//       URL.revokeObjectURL(newData[index].fileUrl);
//     }

//     const fileUrl = URL.createObjectURL(file);

//     newData[index].file = file;
//     newData[index].fileName = file.name;
//     newData[index].fileType = fileInfo.type;
//     newData[index].fileIcon = fileInfo.icon;
//     newData[index].fileUrl = fileUrl;
//     newData[index].status = 'Uploaded';
//     setComplianceData(newData);

//     showAlert(isEdit ? 'Successfully edited file.' : 'Successfully uploaded file.', 'success');
//   };

//   const confirmSubmit = () => {
//     setIsSubmitting(true);

//     setTimeout(() => {
//       const updated = complianceData.map((item) => {
//         if (item.file && item.status === 'Uploaded') {
//           return { ...item, status: 'In Review' };
//         }
//         return item;
//       });
//       setComplianceData(updated);
//       setShowPrompt(false);
//       setIsSubmitted(true);
//       setIsSubmitting(false);
//       showAlert('Successfully submitted for compliance review.', 'success');
//     }, 3000);
//   };

//   const showAlert = (message, type = 'success') => {
//     setAlertMessage({ text: message, type });
//     setTimeout(() => setAlertMessage(null), 3000);
//   };

//   return (
//     <div className="table-container">
//       {/* Alert Message */}
//       <AnimatePresence>
//         {alertMessage && (
//           <motion.div
//             className={`alert-box ${alertMessage.type}`}
//             initial={{ y: -40, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -20, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             {alertMessage.text}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Confirmation Prompt */}
//       <AnimatePresence>
//         {showPrompt && (
//           <motion.div
//             className="confirm-modal"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="confirm-box"
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               transition={{ duration: 0.3 }}
//             >
//               <p>Are you sure you want to submit all uploaded documents for compliance check?</p>
//               <div className="confirm-actions">
//                 <button
//                   onClick={confirmSubmit}
//                   className="confirm-yes btn-primary-bg"
//                   disabled={isSubmitting}
//                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <motion.div
//                         initial={{ rotate: 0 }}
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//                         style={{
//                           width: 16,
//                           height: 16,
//                           borderRadius: '50%',
//                           border: '3px solid #fff',
//                           borderTopColor: '#646669',
//                           display: 'inline-block',
//                         }}
//                       />
//                       Submitting...
//                     </>
//                   ) : (
//                     'Yes, Submit'
//                   )}
//                 </button>
//                 <button
//                   onClick={() => setShowPrompt(false)}
//                   className="confirm-cancel"
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Compliance Table */}
//       <table className="Gen-Sys-table Complt-Sys-table">
//         <thead>
//           <tr>
//             <th>Compliance Requirement</th>
//             <th>Icon</th>
//             <th>File Name</th>
//             <th>File Type</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {complianceData.map((item, index) => {
//             const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');

//             return (
//               <tr key={index}>
//                 <td>{item.title}</td>

//                 {/* Clickable file icon to open file in new tab */}
//                 <td>
//                   {item.file ? (
//                     <a
//                       href={item.fileUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       title={`View uploaded file: ${item.fileName}`}
//                       style={{ display: 'inline-block' }}
//                     >
//                       <img src={item.fileIcon} alt="file icon" className="file-icon" />
//                     </a>
//                   ) : (
//                     <span className="no-file">—</span>
//                   )}
//                 </td>

//                 <td>{item.fileName || <span className="no-file">No file</span>}</td>
//                 <td>{item.fileType || <span className="no-file">—</span>}</td>

//                 {/* Status column with rotating spinner for In Review */}
//                 <td>
//                   {item.status === 'In Review' ? (
//                     <span className={`status-badge in-review`}>
//                       <motion.div
//                         initial={{ rotate: 0 }}
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//                         style={{
//                           width: 15,
//                           height: 15,
//                           borderRadius: '50%',
//                           border: '3px solid #fff',
//                           borderTopColor: '#646669',
//                           marginRight: 5,
//                           display: 'inline-block',
//                         }}
//                       />
//                       In Review
//                     </span>
//                   ) : (
//                     <span className={`status-badge ${statusClass}`}>{item.status}</span>
//                   )}
//                 </td>

//                 {/* Upload column: Upload/Edit buttons or clickable Submitted link */}
//                 <td>
//                   {isSubmitted ? (
//                     item.fileUrl ? (
//                       <a
//                         href={item.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="submitted-link"
//                         title={`View uploaded file: ${item.fileName}`}
//                       >
//                         Submitted
//                       </a>
//                     ) : (
//                       <span className="submitted-text">Submitted</span>
//                     )
//                   ) : (
//                     item.status !== 'In Review' && (
//                       <div className="gen-td-btns">
//                         <button
//                           className="oooka-BBTns link-btn"
//                           onClick={() => triggerFileInput(index)}
//                         >
//                           {item.file ? (
//                             <>
//                               <PencilIcon />
//                               Edit Upload
//                             </>
//                           ) : (
//                             <>
//                               <CloudArrowUpIcon />
//                               Upload File
//                             </>
//                           )}
//                         </button>
//                         <input
//                           type="file"
//                           accept=".pdf,.jpg,.jpeg,.png"
//                           style={{ display: 'none' }}
//                           ref={(el) => (fileInputRefs.current[index] = el)}
//                           onChange={(e) => handleFileChange(index, e.target.files[0])}
//                         />
//                       </div>
//                     )
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       {/* Submit Button */}
//       {!isSubmitted && (
//         <div className="submit-wrapper">
//           <button
//             className="submit-btn btn-primary-bg"
//             onClick={() => {
//               const allUploaded = complianceData.every(
//                 (item) => item.status === 'Uploaded' || item.status === 'In Review'
//               );
//               if (!allUploaded) {
//                 showAlert('Please upload all required compliance documents before submitting.', 'error');
//               } else {
//                 setShowPrompt(true);
//               }
//             }}
//           >
//             Submit for Compliance Check
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ComplianceCheckTable;
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ComplianceCheckTable.css';
import pdfIcon from '../../assets/icons/pdf.png';
import imageIcon from '../../assets/icons/image.png';
import { CloudArrowUpIcon, PencilIcon } from '@heroicons/react/24/outline';

const getFileTypeInfo = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  if (extension === 'pdf') {
    return { type: 'PDF', icon: pdfIcon };
  } else if (extension === 'jpg' || extension === 'jpeg') {
    return { type: 'JPG Image', icon: imageIcon };
  } else if (extension === 'png') {
    return { type: 'PNG Image', icon: imageIcon };
  }
  return { type: 'Unknown', icon: imageIcon };
};

const ComplianceCheckTable = ({ complianceChecklist = [] }) => {
  const [complianceData, setComplianceData] = useState(
    complianceChecklist.map((item) => ({
      title: item,
      file: null,
      fileName: '',
      fileType: '',
      fileIcon: '',
      fileUrl: '',
      status: 'Not Uploaded',
    }))
  );
  const [alertMessage, setAlertMessage] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef([]);

  const triggerFileInput = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  const handleFileChange = (index, file) => {
    if (!file) return;

    const isDuplicate = complianceData.some(
      (item, idx) => idx !== index && item.fileName === file.name
    );
    if (isDuplicate) {
      showAlert('This file has already been uploaded for another requirement.', 'error');
      return;
    }

    const fileInfo = getFileTypeInfo(file.name);
    if (!fileInfo) {
      showAlert('Only PDF, JPG, and PNG files are allowed.', 'error');
      return;
    }

    const newData = [...complianceData];
    const isEdit = !!newData[index].file;

    if (newData[index].fileUrl) {
      URL.revokeObjectURL(newData[index].fileUrl);
    }

    const fileUrl = URL.createObjectURL(file);

    newData[index].file = file;
    newData[index].fileName = file.name;
    newData[index].fileType = fileInfo.type;
    newData[index].fileIcon = fileInfo.icon;
    newData[index].fileUrl = fileUrl;
    newData[index].status = 'Uploaded';
    setComplianceData(newData);

    showAlert(isEdit ? 'Successfully edited file.' : 'Successfully uploaded file.', 'success');
  };

  const confirmSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const updated = complianceData.map((item) => {
        if (item.file && item.status === 'Uploaded') {
          return { ...item, status: 'In Review' };
        }
        return item;
      });
      setComplianceData(updated);
      setShowPrompt(false);
      setIsSubmitted(true);
      setIsSubmitting(false);
      showAlert('Successfully submitted for compliance review.', 'success');
    }, 3000);
  };

  const showAlert = (message, type = 'success') => {
    setAlertMessage({ text: message, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  return (
    <div className="table-container">
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            className={`alert-box ${alertMessage.type}`}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {alertMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="confirm-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="confirm-box"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <p>Are you sure you want to submit all uploaded documents for compliance check?</p>
              <div className="confirm-actions">
                <button
                  onClick={confirmSubmit}
                  className="confirm-yes btn-primary-bg"
                  disabled={isSubmitting}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: '3px solid #fff',
                          borderTopColor: '#646669',
                          display: 'inline-block',
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    'Yes, Submit'
                  )}
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="confirm-cancel"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <table className="Gen-Sys-table Complt-Sys-table">
        <thead>
          <tr>
            <th>Compliance Requirement</th>
            <th>Icon</th>
            <th>File Name</th>
            <th>File Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complianceData.map((item, index) => {
            const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
            return (
              <tr key={index}>
                <td>{item.title}</td>
                <td>
                  {item.file ? (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`View uploaded file: ${item.fileName}`}
                    >
                      <img src={item.fileIcon} alt="file icon" className="file-icon" />
                    </a>
                  ) : (
                    <span className="no-file">—</span>
                  )}
                </td>
                <td>{item.fileName || <span className="no-file">No file</span>}</td>
                <td>{item.fileType || <span className="no-file">—</span>}</td>
                <td>
                  {item.status === 'In Review' ? (
                    <span className={`status-badge in-review`}>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: '50%',
                          border: '3px solid #fff',
                          borderTopColor: '#646669',
                          marginRight: 5,
                          display: 'inline-block',
                        }}
                      />
                      In Review
                    </span>
                  ) : (
                    <span className={`status-badge ${statusClass}`}>{item.status}</span>
                  )}
                </td>
                <td>
                  {isSubmitted ? (
                    item.fileUrl ? (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="submitted-link"
                      >
                        Submitted
                      </a>
                    ) : (
                      <span className="submitted-text">Submitted</span>
                    )
                  ) : (
                    item.status !== 'In Review' && (
                      <div className="gen-td-btns">
                        <button
                          className="oooka-BBTns link-btn"
                          onClick={() => triggerFileInput(index)}
                        >
                          {item.file ? (
                            <>
                              <PencilIcon />
                              Edit Upload
                            </>
                          ) : (
                            <>
                              <CloudArrowUpIcon />
                              Upload File
                            </>
                          )}
                        </button>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          ref={(el) => (fileInputRefs.current[index] = el)}
                          onChange={(e) => handleFileChange(index, e.target.files[0])}
                        />
                      </div>
                    )
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!isSubmitted && (
        <div className="submit-wrapper">
          <button
            className="submit-btn btn-primary-bg"
            onClick={() => {
              const allUploaded = complianceData.every(
                (item) => item.status === 'Uploaded' || item.status === 'In Review'
              );
              if (!allUploaded) {
                showAlert('Please upload all required compliance documents before submitting.', 'error');
              } else {
                setShowPrompt(true);
              }
            }}
          >
            Submit for Compliance Check
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplianceCheckTable;