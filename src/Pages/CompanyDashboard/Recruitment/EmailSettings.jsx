// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   MagnifyingGlassIcon,
//   AdjustmentsHorizontalIcon,
//   CheckCircleIcon,
//   TrashIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   PencilIcon,
//   PlusIcon,
//   ExclamationTriangleIcon,
// } from '@heroicons/react/24/outline';

// // Modal component for confirmation dialogs
// const Modal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => (
//   <AnimatePresence>
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-50 z-40"
//       onClick={onCancel}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 0.5 }}
//       exit={{ opacity: 0 }}
//     />
//     <motion.div
//       className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
//       initial={{ opacity: 0, scale: 0.75 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.75 }}
//       role="dialog"
//       aria-modal="true"
//     >
//       <h3 className="mb-4 text-lg font-semibold">{title}</h3>
//       <p className="mb-6">{message}</p>
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={onCancel}
//           className="rounded bg-gray-300 px-4 py-2 font-semibold hover:bg-gray-400"
//         >
//           {cancelText}
//         </button>
//         <button
//           onClick={onConfirm}
//           className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
//           autoFocus
//         >
//           {confirmText}
//         </button>
//       </div>
//     </motion.div>
//   </AnimatePresence>
// );

// // AlertModal component for simple alerts
// const AlertModal = ({ title, message, onClose }) => (
//   <AnimatePresence>
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-50 z-40"
//       onClick={onClose}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 0.5 }}
//       exit={{ opacity: 0 }}
//     />
//     <motion.div
//       className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
//       initial={{ opacity: 0, scale: 0.75 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.75 }}
//       role="alertdialog"
//       aria-modal="true"
//     >
//       <h3 className="mb-4 text-lg font-semibold">{title}</h3>
//       <p className="mb-6">{message}</p>
//       <div className="flex justify-end">
//         <button
//           onClick={onClose}
//           className="btn-primary-bg"
//           autoFocus
//         >
//           OK
//         </button>
//       </div>
//     </motion.div>
//   </AnimatePresence>
// );

// // Email Configuration Modal Component
// const EmailConfigModal = ({ isOpen, onClose, config, onSave, isSaving = false }) => {
//   const [emailHost, setEmailHost] = useState(config?.email_host || '');
//   const [emailPort, setEmailPort] = useState(config?.email_port || '');
//   const [emailUseSsl, setEmailUseSsl] = useState(config?.email_use_ssl ?? true);
//   const [emailHostUser, setEmailHostUser] = useState(config?.email_host_user || '');
//   const [emailHostPassword, setEmailHostPassword] = useState(config?.email_host_password || '');
//   const [defaultFromEmail, setDefaultFromEmail] = useState(config?.default_from_email || '');
//   const [error, setError] = useState('');
//   const modalContentRef = useRef(null);
//   const errorTimeoutRef = useRef(null);

//   useEffect(() => {
//     if (config) {
//       setEmailHost(config.email_host || '');
//       setEmailPort(config.email_port || '');
//       setEmailUseSsl(config.email_use_ssl ?? true);
//       setEmailHostUser(config.email_host_user || '');
//       setEmailHostPassword(config.email_host_password || '');
//       setDefaultFromEmail(config.default_from_email || '');
//     } else {
//       setEmailHost('');
//       setEmailPort('');
//       setEmailUseSsl(true);
//       setEmailHostUser('');
//       setEmailHostPassword('');
//       setDefaultFromEmail('');
//     }
//   }, [config]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalContentRef.current && !modalContentRef.current.contains(event.target) && isOpen) {
//         onClose();
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   useEffect(() => {
//     return () => {
//       if (errorTimeoutRef.current) {
//         clearTimeout(errorTimeoutRef.current);
//       }
//     };
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (errorTimeoutRef.current) {
//       clearTimeout(errorTimeoutRef.current);
//     }

//     if (!emailHost.trim()) {
//       setError('Email host is required');
//       errorTimeoutRef.current = setTimeout(() => setError(''), 3000);
//       return;
//     }
//     if (!emailPort || isNaN(emailPort) || emailPort <= 0) {
//       setError('Valid email port is required');
//       errorTimeoutRef.current = setTimeout(() => setError(''), 3000);
//       return;
//     }
//     if (!emailHostUser.trim()) {
//       setError('Email host user is required');
//       errorTimeoutRef.current = setTimeout(() => setError(''), 3000);
//       return;
//     }
//     if (!defaultFromEmail.trim()) {
//       setError('Default from email is required');
//       errorTimeoutRef.current = setTimeout(() => setError(''), 3000);
//       return;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(defaultFromEmail)) {
//       setError('Invalid email format for default from email');
//       errorTimeoutRef.current = setTimeout(() => setError(''), 3000);
//       return;
//     }

//     const configData = {
//       email_host: emailHost.trim(),
//       email_port: parseInt(emailPort),
//       email_use_ssl: emailUseSsl,
//       email_host_user: emailHostUser.trim(),
//       email_host_password: emailHostPassword.trim(),
//       default_from_email: defaultFromEmail.trim(),
//     };

//     onSave(configData);
//   };

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         className="modal-overlay"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'rgba(0,0,0,0.7)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 3000,
//         }}
//       >
//         <motion.div
//           className="modal-content custom-scroll-bar okauj-MOadad"
//           ref={modalContentRef}
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.8, opacity: 0 }}
//         >
//           <h3 className="modal-content h3">{config ? 'Edit Email Configuration' : 'Add Email Configuration'}</h3>
//           <form onSubmit={handleSubmit} className="p-6">
//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   className="error-notification"
//                   initial={{ opacity: 0, y: -50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -50 }}
//                   transition={{ duration: 0.3 }}
//                   style={{
//                     position: 'fixed',
//                     top: '20px',
//                     left: '50%',
//                     transform: 'translateX(-50%)',
//                     background: '#fee2e2',
//                     color: '#b91c1c',
//                     padding: '1rem',
//                     borderRadius: '8px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     zIndex: 4001,
//                     maxWidth: '500px',
//                     boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//                   }}
//                 >
//                   <ExclamationTriangleIcon style={{ width: '20px', height: '20px', color: '#fff', marginRight: '0.5rem' }} />
//                   <span style={{ color: '#fff' }}>{error}</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//             <div className="GGtg-DDDVa">
//               <label>Email Host *</label>
//               <input
//                 type="text"
//                 value={emailHost}
//                 onChange={(e) => setEmailHost(e.target.value)}
//                 className="oujka-Inpuauy"
//                 placeholder="e.g., smtp.gmail.com"
//               />
//             </div>
//             <div className="GGtg-DDDVa">
//               <label>Email Port *</label>
//               <input
//                 type="number"
//                 value={emailPort}
//                 onChange={(e) => setEmailPort(e.target.value)}
//                 className="oujka-Inpuauy"
//                 placeholder="e.g., 465"
//               />
//             </div>
//             <div className="GGtg-DDDVa">
//               <label className="GTha-POka">
//                 <input
//                   type="checkbox"
//                   checked={emailUseSsl}
//                   onChange={(e) => setEmailUseSsl(e.target.checked)}
//                 />
//                 Use SSL
//               </label>
//             </div>
//             <div className="GGtg-DDDVa">
//               <label>Email Host User *</label>
//               <input
//                 type="email"
//                 value={emailHostUser}
//                 onChange={(e) => setEmailHostUser(e.target.value)}
//                 className="oujka-Inpuauy"
//                 placeholder="e.g., user@example.com"
//               />
//             </div>
//             <div className="GGtg-DDDVa">
//               <label>Email Host Password</label>
//               <input
//                 type="password"
//                 value={emailHostPassword}
//                 onChange={(e) => setEmailHostPassword(e.target.value)}
//                 className="oujka-Inpuauy"
//                 placeholder="Enter password"
//               />
//             </div>
//             <div className="GGtg-DDDVa">
//               <label>Default From Email *</label>
//               <input
//                 type="email"
//                 value={defaultFromEmail}
//                 onChange={(e) => setDefaultFromEmail(e.target.value)}
//                 className="oujka-Inpuauy"
//                 placeholder="e.g., no-reply@example.com"
//               />
//             </div>
//             <div className="oioak-POldj-BTn">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="CLCLCjm-BNtn"
//                 disabled={isSaving}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn-primary-bg"
//                 disabled={isSaving}
//               >
//                 {isSaving ? (
//                   <>
//                     <motion.div
//                       initial={{ rotate: 0 }}
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//                       style={{
//                         width: 18,
//                         height: 18,
//                         borderRadius: '50%',
//                         border: '3px solid rgba(255,255,255,0.3)',
//                         borderTopColor: '#fff',
//                         marginRight: '5px',
//                       }}
//                     />
//                     {config ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : config ? 'Update Configuration' : 'Add Configuration'}
//               </button>
//             </div>
//           </form>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// // Function to generate mock email configuration data
// const generateMockEmailConfigs = () => {
//   const configs = [];
//   const hosts = ['smtp.gmail.com', 'smtp.office365.com', 'smtp.mail.yahoo.com', 'smtp.zoho.com', 'smtp.sendgrid.net'];
//   for (let i = 1; i <= 50; i++) {
//     const createdDate = `2025-${String((i % 3) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`;
//     const lastModified = new Date(`2025-04-01`);
//     lastModified.setDate(lastModified.getDate() + Math.floor(Math.random() * 10) + 1);
//     lastModified.setHours(Math.floor(Math.random() * 24));
//     lastModified.setMinutes(Math.floor(Math.random() * 60));
//     const lastModifiedFormatted = `${lastModified.toISOString().split('T')[0]} ${String(lastModified.getHours()).padStart(2, '0')}:${String(lastModified.getMinutes()).padStart(2, '0')}`;

//     configs.push({
//       id: `CONFIG-${String(i).padStart(3, '0')}`,
//       email_host: hosts[i % hosts.length],
//       email_port: [25, 465, 587, 2525][Math.floor(Math.random() * 4)],
//       email_use_ssl: Math.random() > 0.5,
//       email_host_user: `user${i}@example.com`,
//       email_host_password: `pass${Math.random().toString(36).substr(2, 8)}`,
//       default_from_email: `no-reply${i}@example.com`,
//       created_date: createdDate,
//       last_modified: lastModifiedFormatted,
//     });
//   }
//   return configs;
// };

// // Main EmailSettings component
// const EmailSettings = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isVisible, setIsVisible] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [showNoSelectionAlert, setShowNoSelectionAlert] = useState(false);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [deleteConfigId, setDeleteConfigId] = useState(null);
//   const [showEmailConfigModal, setShowEmailConfigModal] = useState(false);
//   const [currentEmailConfig, setCurrentEmailConfig] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const masterCheckboxRef = useRef(null);

//   const toggleSection = () => {
//     setIsVisible((prev) => !prev);
//   };

//   const [emailConfigs, setEmailConfigs] = useState(generateMockEmailConfigs());

//   const filteredEmailConfigs = emailConfigs.filter((config) =>
//     config.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     config.email_host.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     config.email_host_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     config.default_from_email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredEmailConfigs.length / rowsPerPage);
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const currentEmailConfigs = filteredEmailConfigs.slice(startIndex, startIndex + rowsPerPage);

//   const handleCheckboxChange = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((configId) => configId !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAllVisible = () => {
//     if (currentEmailConfigs.every((config) => selectedIds.includes(config.id))) {
//       setSelectedIds((prev) =>
//         prev.filter((id) => !currentEmailConfigs.some((config) => config.id === id))
//       );
//     } else {
//       setSelectedIds((prev) => [
//         ...prev,
//         ...currentEmailConfigs.filter((config) => !prev.includes(config.id)).map((config) => config.id),
//       ]);
//     }
//   };

//   const handleDeleteMarked = () => {
//     if (selectedIds.length === 0) {
//       setShowNoSelectionAlert(true);
//       return;
//     }
//     setShowConfirmDelete(true);
//   };

//   const handleDeleteSingle = (id) => {
//     setDeleteConfigId(id);
//     setShowConfirmDelete(true);
//   };

//   const confirmDelete = () => {
//     if (deleteConfigId) {
//       setEmailConfigs((prev) => prev.filter((config) => config.id !== deleteConfigId));
//       setSelectedIds((prev) => prev.filter((id) => id !== deleteConfigId));
//       setDeleteConfigId(null);
//     } else {
//       setEmailConfigs((prev) => prev.filter((config) => !selectedIds.includes(config.id)));
//       setSelectedIds([]);
//     }
//     setShowConfirmDelete(false);
//   };

//   const handleAddEmailConfig = () => {
//     setCurrentEmailConfig(null);
//     setShowEmailConfigModal(true);
//   };

//   const handleEditEmailConfig = (config) => {
//     setCurrentEmailConfig(config);
//     setShowEmailConfigModal(true);
//   };

//   const handleSaveEmailConfig = (formData) => {
//     setIsSaving(true);
//     const currentTimestamp = new Date();
//     const lastModifiedFormatted = `${currentTimestamp.toISOString().split('T')[0]} ${String(currentTimestamp.getHours()).padStart(2, '0')}:${String(currentTimestamp.getMinutes()).padStart(2, '0')}`;

//     setTimeout(() => {
//       if (currentEmailConfig) {
//         setEmailConfigs((prev) =>
//           prev.map((config) =>
//             config.id === currentEmailConfig.id ? { ...config, ...formData, last_modified: lastModifiedFormatted } : config
//           )
//         );
//       } else {
//         const newConfig = {
//           id: `CONFIG-${String(emailConfigs.length + 1).padStart(3, '0')}`,
//           ...formData,
//           created_date: new Date().toISOString().split('T')[0],
//           last_modified: lastModifiedFormatted,
//         };
//         setEmailConfigs((prev) => [newConfig, ...prev]);
//         setCurrentPage(1);
//       }
//       setIsSaving(false);
//       setShowEmailConfigModal(false);
//     }, 3000);
//   };

//   useEffect(() => {
//     if (masterCheckboxRef.current) {
//       masterCheckboxRef.current.checked = false;
//     }
//     setSelectedIds([]);
//   }, [currentPage, rowsPerPage]);

//   return (
//     <div className="APISettings-sec">

//       <div className="Dash-OO-Boas Gen-Boxshadow">
//         <div className="Dash-OO-Boas-Top">
//             <div className='OOOu-KJa'>
//           <div className="Dash-OO-Boas-Top-1">

//             <h3>Email Configurations</h3>
//           </div>
//           <div className="Dash-OO-Boas-Top-2">
//             <div className="genn-Drop-Search">
//               <span>
//                 <MagnifyingGlassIcon className="h-6 w-6" />
//               </span>
//               <input
//                 type="text"
//                 placeholder="Search email configurations..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//           </div>
//           </div>
//             <button
//             className="poli-BTn btn-primary-bg"
//             onClick={handleAddEmailConfig}
//           >
//             <PlusIcon className="h-5 w-5 mr-1" />
//             Add Email Configuration
//           </button>
//         </div>

//         <div className="table-container">
//           <table className="Gen-Sys-table">
//             <thead>
//               <tr>
//                 <th>
//                   <input
//                     type="checkbox"
//                     ref={masterCheckboxRef}
//                     onChange={handleSelectAllVisible}
//                     checked={
//                       currentEmailConfigs.length > 0 &&
//                       currentEmailConfigs.every((config) => selectedIds.includes(config.id))
//                     }
//                   />
//                 </th>
//                 <th><span className="flex items-center gap-1">Config ID</span></th>
//                 <th><span className="flex items-center gap-1">Email Host</span></th>
//                 <th><span className="flex items-center gap-1">Port</span></th>
//                 <th><span className="flex items-center gap-1">SSL</span></th>
//                 <th><span className="flex items-center gap-1">Host User</span></th>
//                 <th><span className="flex items-center gap-1">Default From Email</span></th>
//                 <th><span className="flex items-center gap-1">Created Date</span></th>
//                 <th><span className="flex items-center gap-1">Last Modified</span></th>
//                 <th><span className="flex items-center gap-1">Actions</span></th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentEmailConfigs.length === 0 ? (
//                 <tr>
//                   <td colSpan={10} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
//                     No matching email configurations found
//                   </td>
//                 </tr>
//               ) : (
//                 currentEmailConfigs.map((config) => (
//                   <tr key={config.id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.includes(config.id)}
//                         onChange={() => handleCheckboxChange(config.id)}
//                       />
//                     </td>
//                     <td>{config.id}</td>
//                     <td>{config.email_host}</td>
//                     <td>{config.email_port}</td>
//                     <td>{config.email_use_ssl ? 'Yes' : 'No'}</td>
//                     <td>{config.email_host_user}</td>
//                     <td>{config.default_from_email}</td>
//                     <td>{config.created_date}</td>
//                     <td>{config.last_modified}</td>
//                     <td>
//                       <div className="gen-td-btns">
//                         <button
//                           onClick={() => handleEditEmailConfig(config)}
//                           className="link-btn btn-primary-bg"
//                         >
//                           <PencilIcon className="h-4 w-4 mr-1" />
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteSingle(config.id)}
//                           className="view-btn"
//                         >
//                           <TrashIcon className="h-4 w-4 mr-1" />
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//         {filteredEmailConfigs.length > 0 && (
//           <div className="pagination-controls">
//             <div className="Dash-OO-Boas-foot">
//               <div className="items-per-page">
//                 <p>Number of rows:</p>
//                 <select
//                   className="form-select"
//                   value={rowsPerPage}
//                   onChange={(e) => setRowsPerPage(Number(e.target.value))}
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value={50}>50</option>
//                 </select>
//               </div>
//               <div className="Dash-OO-Boas-foot-2">
//                 <button onClick={handleSelectAllVisible} className="mark-all-btn">
//                   <CheckCircleIcon className="h-5 w-5 mr-1" />
//                   {currentEmailConfigs.every((config) => selectedIds.includes(config.id)) ? 'Unmark All' : 'Mark All'}
//                 </button>
//                 <button onClick={handleDeleteMarked} className="delete-marked-btn">
//                   <TrashIcon className="h-5 w-5 mr-1" />
//                   Delete Marked
//                 </button>
//               </div>
//             </div>
//             <div className="page-navigation">
//               <span className="page-info">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <div className="page-navigation-Btns">
//                 <button
//                   className="page-button"
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                 >
//                   <ChevronLeftIcon className="h-5 w-5" />
//                 </button>
//                 <button
//                   className="page-button"
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                 >
//                   <ChevronRightIcon className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <EmailConfigModal
//         isOpen={showEmailConfigModal}
//         onClose={() => setShowEmailConfigModal(false)}
//         config={currentEmailConfig}
//         onSave={handleSaveEmailConfig}
//         isSaving={isSaving}
//       />
//       <AnimatePresence>
//         {showNoSelectionAlert && (
//           <AlertModal
//             title="No Selection"
//             message="You have not selected any email configurations to delete."
//             onClose={() => setShowNoSelectionAlert(false)}
//           />
//         )}
//         {showConfirmDelete && (
//           <Modal
//             title="Confirm Delete"
//             message={
//               deleteConfigId
//                 ? `Are you sure you want to delete the email configuration ${
//                     emailConfigs.find((c) => c.id === deleteConfigId)?.email_host
//                   }? This action cannot be undone.`
//                 : `Are you sure you want to delete ${selectedIds.length} selected email configuration(s)? This action cannot be undone.`
//             }
//             onConfirm={confirmDelete}
//             onCancel={() => {
//               setShowConfirmDelete(false);
//               setDeleteConfigId(null);
//             }}
//             confirmText="Delete"
//             cancelText="Cancel"
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default EmailSettings;


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { fetchTenantConfig, updateTenantConfig } from './ApiService';

// Modal component for confirmation dialogs
const Modal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onCancel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
    />
    <motion.div
      className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
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

// AlertModal component for simple alerts
const AlertModal = ({ title, message, onClose }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
    />
    <motion.div
      className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      role="alertdialog"
      aria-modal="true"
    >
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="btn-primary-bg"
          autoFocus
        >
          OK
        </button>
      </div>
    </motion.div>
  </AnimatePresence>
);

// Email Configuration Modal Component
const EmailConfigModal = ({ isOpen, onClose, config, onSave, isSaving = false }) => {
  const [emailHost, setEmailHost] = useState(config?.email_host || '');
  const [emailPort, setEmailPort] = useState(config?.email_port || '');
  const [emailUseSsl, setEmailUseSsl] = useState(config?.email_use_ssl ?? true);
  const [emailHostUser, setEmailHostUser] = useState(config?.email_host_user || '');
  const [emailHostPassword, setEmailHostPassword] = useState(config?.email_host_password || '');
  const [defaultFromEmail, setDefaultFromEmail] = useState(config?.default_from_email || '');
  const [error, setError] = useState('');
  const modalContentRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    if (config) {
      setEmailHost(config.email_host || '');
      setEmailPort(config.email_port || '');
      setEmailUseSsl(config.email_use_ssl ?? true);
      setEmailHostUser(config.email_host_user || '');
      setEmailHostPassword(config.email_host_password || '');
      setDefaultFromEmail(config.default_from_email || '');
    } else {
      setEmailHost('');
      setEmailPort('');
      setEmailUseSsl(true);
      setEmailHostUser('');
      setEmailHostPassword('');
      setDefaultFromEmail('');
    }
  }, [config]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    if (!emailHost.trim()) {
      setError('Email host is required');
      errorTimeoutRef.current = setTimeout(() => setError(''), 3000);
      return;
    }
    if (!emailPort || isNaN(emailPort) || emailPort <= 0) {
      setError('Valid email port is required');
      errorTimeoutRef.current = setTimeout(() => setError(''), 3000);
      return;
    }
    if (!emailHostUser.trim()) {
      setError('Email host user is required');
      errorTimeoutRef.current = setTimeout(() => setError(''), 3000);
      return;
    }
    if (!defaultFromEmail.trim()) {
      setError('Default from email is required');
      errorTimeoutRef.current = setTimeout(() => setError(''), 3000);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(defaultFromEmail)) {
      setError('Invalid email format for default from email');
      errorTimeoutRef.current = setTimeout(() => setError(''), 3000);
      return;
    }

    const configData = {
      email_host: emailHost.trim(),
      email_port: parseInt(emailPort),
      email_use_ssl: emailUseSsl,
      email_host_user: emailHostUser.trim(),
      email_host_password: emailHostPassword.trim(),
      default_from_email: defaultFromEmail.trim(),
    };

    onSave(configData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3000,
        }}
      >
        <motion.div
          className="modal-content custom-scroll-bar okauj-MOadad"
          ref={modalContentRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h3 className="modal-content h3">{config ? 'Edit Email Configuration' : 'Add Email Configuration'}</h3>
          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  className="error-notification"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fee2e2',
                    icolor: '#b91c1c',
                    padding: '1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 4001,
                    maxWidth: '500px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  <ExclamationTriangleIcon style={{ width: '20px', height: '20px', color: '#fff', marginRight: '0.5rem' }} />
                  <span style={{ color: '#fff' }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="GGtg-DDDVa">
              <label>Email Host *</label>
              <input
                type="text"
                value={emailHost}
                onChange={(e) => setEmailHost(e.target.value)}
                className="oujka-Inpuauy"
                placeholder="e.g., smtp.gmail.com"
              />
            </div>
            <div className="GGtg-DDDVa deliVa">
              <label>Email Port *</label>
              <input
                type="number"
                value={emailPort}
                onChange={(e) => setEmailPort(e.target.value)}
                className="oujka-Inpuauy"
                placeholder="e.g., 465"
              />
            </div>
            <div className="GGtg-DDDVa">
              <label className="GTha-POka">
                <input
                  type="checkbox"
                  checked={emailUseSsl}
                  onChange={(e) => setEmailUseSsl(e.target.checked)}
                />
                Use SSL
              </label>
            </div>
            <div className="GGtg-DDDVa">
              <label>Email Host User *</label>
              <input
                type="email"
                value={emailHostUser}
                onChange={(e) => setEmailHostUser(e.target.value)}
                className="oujka-Inpuauy"
                placeholder="e.g., user@example.com"
              />
            </div>
            <div className="GGtg-DDDVa">
              <label>Email Host Password</label>
              <input
                type="password"
                value={emailHostPassword}
                onChange={(e) => setEmailHostPassword(e.target.value)}
                className="oujka-Inpuauy"
                placeholder="Enter password"
              />
            </div>
            <div className="GGtg-DDDVa">
              <label>Default From Email *</label>
              <input
                type="email"
                value={defaultFromEmail}
                onChange={(e) => setDefaultFromEmail(e.target.value)}
                className="oujka-Inpuauy"
                placeholder="e.g., no-reply@example.com"
              />
            </div>
            <div className="oioak-POldj-BTn">
              <button
                type="button"
                onClick={onClose}
                className="CLCLCjm-BNtn"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary-bg"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        marginRight: '5px',
                      }}
                    />
                    {config ? 'Updating...' : 'Creating...'}
                  </>
                ) : config ? 'Update Configuration' : 'Add Configuration'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main EmailSettings component
const EmailSettings = () => {
  const [emailConfig, setEmailConfig] = useState(null);
  const [showEmailConfigModal, setShowEmailConfigModal] = useState(false);
  const [currentEmailConfig, setCurrentEmailConfig] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch tenant email configuration from the backend
  const fetchEmailConfig = async () => {
    setIsLoading(true);
    try {
      const tenant = await fetchTenantConfig();
      if (tenant) {
        setEmailConfig({
          id: tenant.id,
          email_host: tenant.email_host || '',
          email_port: tenant.email_port || '',
          email_use_ssl: tenant.email_use_ssl ?? true,
          email_host_user: tenant.email_host_user || '',
          email_host_password: tenant.email_host_password || '',
          default_from_email: tenant.default_from_email || '',
          created_date: tenant.created_at.split('T')[0],
          last_modified: tenant.created_at, // Adjust if backend provides a last_modified field
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch email configuration');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailConfig();
  }, []);

  const handleEditEmailConfig = () => {
    setCurrentEmailConfig(emailConfig);
    setShowEmailConfigModal(true);
  };

  const handleSaveEmailConfig = async (formData) => {
    setIsSaving(true);
    try {
      const currentTimestamp = new Date();
      const lastModifiedFormatted = `${currentTimestamp.toISOString().split('T')[0]} ${String(currentTimestamp.getHours()).padStart(2, '0')}:${String(currentTimestamp.getMinutes()).padStart(2, '0')}`;

      if (currentEmailConfig) {
        // Update existing tenant
        const updatedTenant = await updateTenantConfig(currentEmailConfig.id, formData);
        setEmailConfig({
          ...emailConfig,
          ...formData,
          last_modified: lastModifiedFormatted,
        });
      }
      setShowEmailConfigModal(false);
    } catch (err) {
      setError(err.message || 'Failed to save email configuration');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="APISettings-sec">
      <div className="Dash-OO-Boas Gen-Boxshadow">
        <div className="Dash-OO-Boas-Top">
          <div className="OOOu-KJa">
            <div className="Dash-OO-Boas-Top-1">
              <h3>Email Configuration</h3>
            </div>
          </div>
          <button
            className="poli-BTn btn-primary-bg"
            onClick={handleEditEmailConfig}
            disabled={!emailConfig || isLoading}
          >
            <PencilIcon className="h-5 w-5 mr-1" />
            Edit Email Configuration
          </button>
        </div>

        {error && (
          <motion.div
            className="error-notification"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#fee2e2',
              color: '#b91c1c',
              padding: '1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              zIndex: 4001,
              maxWidth: '500px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <ExclamationTriangleIcon style={{ width: '20px', height: '20px', color: '#fff', marginRight: '0.5rem' }} />
            <span style={{ color: '#fff' }}>{error}</span>
          </motion.div>
        )}

        <div className="table-container">
          <table className="Gen-Sys-table">
            <thead>
              <tr>
                <th><span className="flex items-center gap-1">S/N</span></th>
                <th><span className="flex items-center gap-1">Email Host</span></th>
                <th><span className="flex items-center gap-1">Port</span></th>
                <th><span className="flex items-center gap-1">SSL</span></th>
                <th><span className="flex items-center gap-1">Host User</span></th>
                <th><span className="flex items-center gap-1">Default From Email</span></th>
                <th><span className="flex items-center gap-1">Created Date</span></th>
                <th><span className="flex items-center gap-1">Last Modified</span></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                    <ul className="tab-Loadding-AniMMA">
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>
                  </td>
                </tr>
              ) : emailConfig ? (
                <tr key={emailConfig.id}>
                  <td>1</td>
                  <td>{emailConfig.email_host}</td>
                  <td>{emailConfig.email_port}</td>
                  <td>{emailConfig.email_use_ssl ? 'Yes' : 'No'}</td>
                  <td>{emailConfig.email_host_user}</td>
                  <td>{emailConfig.default_from_email}</td>
                  <td>{emailConfig.created_date}</td>
                  <td>{emailConfig.last_modified}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                    No email configuration found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <EmailConfigModal
        isOpen={showEmailConfigModal}
        onClose={() => setShowEmailConfigModal(false)}
        config={currentEmailConfig}
        onSave={handleSaveEmailConfig}
        isSaving={isSaving}
      />
      <AnimatePresence>
        {error && (
          <AlertModal
            title="Error"
            message={error}
            onClose={() => setError('')}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailSettings;
