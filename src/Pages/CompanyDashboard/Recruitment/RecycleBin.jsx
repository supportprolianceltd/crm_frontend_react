import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  UserIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Record type mapping to icons
const RECORD_TYPE_ICONS = {
  contact: <UserIcon className="h-5 w-5" />,
  company: <BuildingOfficeIcon className="h-5 w-5" />,
  deal: <BriefcaseIcon className="h-5 w-5" />,
  transaction: <CurrencyDollarIcon className="h-5 w-5" />,
  other: <BriefcaseIcon className="h-5 w-5" />
};

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
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          autoFocus
        >
          OK
        </button>
      </div>
    </motion.div>
  </AnimatePresence>
);

// Function to generate mock deleted records data
const generateMockDeletedRecords = () => {
  const records = [];
  const recordTypes = ['contact', 'company', 'deal', 'transaction', 'other'];
  const deletedByUsers = ['admin@company.com', 'manager@company.com', 'user@company.com', 'support@company.com'];
  
  for (let i = 1; i <= 50; i++) {
    const recordType = recordTypes[Math.floor(Math.random() * recordTypes.length)];
    const deletedDate = new Date();
    deletedDate.setDate(deletedDate.getDate() - Math.floor(Math.random() * 30));
    
    records.push({
      id: `REC-${String(i).padStart(3, '0')}`,
      name: `Record ${i}`,
      type: recordType,
      deletedBy: deletedByUsers[Math.floor(Math.random() * deletedByUsers.length)],
      deletedDate: deletedDate.toISOString().split('T')[0],
      daysLeft: Math.floor(Math.random() * 30) + 1,
      originalData: {
        email: `contact${i}@example.com`,
        phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        value: recordType === 'deal' ? `$${(Math.random() * 100000).toFixed(2)}` : 'N/A'
      }
    });
  }
  return records;
};

// Main RecycleBin component
const RecycleBin = () => {
  // State declarations
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showNoSelectionAlert, setShowNoSelectionAlert] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const masterCheckboxRef = useRef(null);

  const toggleSection = () => {
    setIsVisible(prev => !prev);
  };

  const recordTypes = ['All', 'contact', 'company', 'deal', 'transaction', 'other'];

  // Initialize deleted records with mock data
  const [deletedRecords, setDeletedRecords] = useState(generateMockDeletedRecords());

  // Filter records based on search term and type
  const filteredRecords = deletedRecords.filter((record) => {
    const matchesSearch = 
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.deletedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.originalData.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || record.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + rowsPerPage);

  // Handle checkbox selection for individual records
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((recordId) => recordId !== id) : [...prev, id]
    );
  };

  // Handle select all visible records
  const handleSelectAllVisible = () => {
    if (currentRecords.every((record) => selectedIds.includes(record.id))) {
      setSelectedIds((prev) => prev.filter((id) => !currentRecords.some((record) => record.id === id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...currentRecords.filter((record) => !prev.includes(record.id)).map((record) => record.id),
      ]);
    }
  };

  // Handle permanent deletion of marked records
  const handleDeleteMarked = () => {
    if (selectedIds.length === 0) {
      setShowNoSelectionAlert(true);
      return;
    }
    setShowConfirmDelete(true);
  };

  // Handle single record deletion
  const handleDeleteSingle = (id) => {
    setDeleteItemId(id);
    setShowConfirmDelete(true);
  };

  // Handle record restoration
  const handleRestore = (id) => {
    setIsRestoring(true);
    
    // Simulate restore process
    setTimeout(() => {
      // Remove from deleted records
      setDeletedRecords(prev => prev.filter(record => record.id !== id));
      setSelectedIds(prev => prev.filter(recordId => recordId !== id));
      setIsRestoring(false);
    }, 1000);
  };

  // Handle restore all selected records
  const handleRestoreSelected = () => {
    if (selectedIds.length === 0) {
      setShowNoSelectionAlert(true);
      return;
    }
    
    setIsRestoring(true);
    
    // Simulate restore process
    setTimeout(() => {
      // Remove selected records from deleted records
      setDeletedRecords(prev => prev.filter(record => !selectedIds.includes(record.id)));
      setSelectedIds([]);
      setIsRestoring(false);
    }, 1000);
  };

  // Confirm deletion of selected or single record
  const confirmDelete = () => {
    setIsDeleting(true);
    
    // Simulate deletion process
    setTimeout(() => {
      if (deleteItemId) {
        // Single record deletion
        setDeletedRecords(prev => prev.filter(record => record.id !== deleteItemId));
        setSelectedIds(prev => prev.filter(id => id !== deleteItemId));
        setDeleteItemId(null);
      } else {
        // Multiple record deletion
        setDeletedRecords(prev => prev.filter(record => !selectedIds.includes(record.id)));
        setSelectedIds([]);
      }
      setShowConfirmDelete(false);
      setIsDeleting(false);
    }, 1000);
  };

  // Reset master checkbox when page or rows change
  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.checked = false;
    }
    setSelectedIds([]);
  }, [currentPage, rowsPerPage]);

  return (
    <div className="RecycleBin-sec">
      <div className="Dash-OO-Boas OOOP-LOa">
        <div className="Dash-OO-Boas-Top">
          <div className="Dash-OO-Boas-Top-1">
            <span onClick={toggleSection}><AdjustmentsHorizontalIcon className="h-6 w-6" /></span>
            <h3>Recycle Bin</h3>
          </div>
          <div className="Dash-OO-Boas-Top-2">
            <div className="genn-Drop-Search">
              <span><MagnifyingGlassIcon className="h-6 w-6" /></span>
              <input 
                type="text" 
                placeholder="Search deleted records..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="filter-dropdowns"
              initial={{ height: 0, opacity: 0, overflow: "hidden" }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                {recordTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="Dash-OO-Boas Gen-Boxshadow">
        <div className='oujah-Oujka'>
          <h3>Deleted Records</h3>
          <div className="flex gap-2">
            <button 
              className='poli-BTn btn-primary-bg flex items-center'
              onClick={handleRestoreSelected}
              disabled={isRestoring || selectedIds.length === 0}
            >
              {isRestoring ? (
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
                  Restoring...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-1" /> 
                  Restore Selected
                </>
              )}
            </button>
            <button 
              className='poli-BTn bg-red-600 hover:bg-red-700 flex items-center'
              onClick={handleDeleteMarked}
              disabled={isDeleting || selectedIds.length === 0}
            >
              <TrashIcon className="h-5 w-5 mr-1" /> 
              Delete Permanently
            </button>
          </div>
        </div>
        <div className="table-container">
          <table className="Gen-Sys-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    ref={masterCheckboxRef}
                    onChange={handleSelectAllVisible}
                    checked={currentRecords.length > 0 && currentRecords.every((record) => selectedIds.includes(record.id))}
                  />
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    Record ID
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    Name
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    Type
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    Details
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    Deleted By
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    Deleted Date
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    Days Left
                  </span>
                </th>
                <th>
                  <span className="flex items-center gap-1">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                    No deleted records found
                  </td>
                </tr>
              ) : (
                currentRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(record.id)}
                        onChange={() => handleCheckboxChange(record.id)}
                      />
                    </td>
                    <td>{record.id}</td>
                    <td className="flex items-center gap-2">
                      <span className="text-blue-500">
                        {RECORD_TYPE_ICONS[record.type] || RECORD_TYPE_ICONS.other}
                      </span>
                      {record.name}
                    </td>
                    <td>
                      <span className="capitalize">{record.type}</span>
                    </td>
                    <td>
                      {record.type === 'contact' ? (
                        <div className="text-xs">
                          <div>Email: {record.originalData.email}</div>
                          <div>Phone: {record.originalData.phone}</div>
                        </div>
                      ) : record.type === 'deal' ? (
                        <div className="text-xs">
                          Value: {record.originalData.value}
                        </div>
                      ) : (
                        <div className="text-xs">N/A</div>
                      )}
                    </td>
                    <td>{record.deletedBy}</td>
                    <td>{record.deletedDate}</td>
                    <td>
                      <span className={`status ${record.daysLeft <= 7 ? 'expiring' : 'normal'}`}>
                        {record.daysLeft} days
                      </span>
                    </td>
                    <td>
                      <div className="gen-td-btns">
                        <button
                          onClick={() => handleRestore(record.id)}
                          className="link-btn btn-primary-bg"
                          disabled={isRestoring}
                        >
                          <ArrowPathIcon className="h-4 w-4 mr-1" />
                          Restore
                        </button>
                        <button
                          onClick={() => handleDeleteSingle(record.id)}
                          className="view-btn bg-red-600 hover:bg-red-700"
                          disabled={isDeleting}
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredRecords.length > 0 && (
          <div className="pagination-controls">
            <div className="Dash-OO-Boas-foot">
              <div className="Dash-OO-Boas-foot-1">
                <div className="items-per-page">
                  <p>Records per page:</p>
                  <select
                    className="form-select"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="Dash-OO-Boas-foot-2">
                <button onClick={handleSelectAllVisible} className="mark-all-btn">
                  {currentRecords.every((record) => selectedIds.includes(record.id)) ? 'Unselect All' : 'Select All'}
                </button>
              </div>
            </div>

            <div className="page-navigation">
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <div className="page-navigation-Btns">
                <button
                  className="page-button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  className="page-button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showNoSelectionAlert && (
          <AlertModal
            title="No Selection"
            message="You have not selected any records to perform this action."
            onClose={() => setShowNoSelectionAlert(false)}
          />
        )}
        {showConfirmDelete && (
          <Modal
            title={deleteItemId ? "Permanently Delete Record" : "Permanently Delete Records"}
            message={
              deleteItemId
                ? `Are you sure you want to permanently delete this record? This action cannot be undone.`
                : `Are you sure you want to permanently delete ${selectedIds.length} selected record(s)? This action cannot be undone.`
            }
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowConfirmDelete(false);
              setDeleteItemId(null);
            }}
            confirmText={isDeleting ? "Deleting..." : "Delete Permanently"}
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .RecycleBin-sec {
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }
        
        .Dash-OO-Boas {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          margin-bottom: 20px;
          overflow: hidden;
        }
        
        .Dash-OO-Boas-Top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .Dash-OO-Boas-Top-1 {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .Dash-OO-Boas-Top-1 span {
          cursor: pointer;
          display: flex;
          padding: 6px;
          border-radius: 6px;
          background: #f3f4f6;
        }
        
        .Dash-OO-Boas-Top-1 h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .genn-Drop-Search {
          display: flex;
          align-items: center;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          width: 300px;
        }
        
        .genn-Drop-Search input {
          border: none;
          background: transparent;
          padding: 4px 8px;
          width: 100%;
          font-size: 14px;
          outline: none;
        }
        
        .filter-dropdowns {
          padding: 0 24px 16px;
        }
        
        .filter-select {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          font-size: 14px;
        }
        
        .oujah-Oujka {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .oujah-Oujka h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .poli-BTn {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .btn-primary-bg {
          background-color: #3b82f6;
          color: white;
        }
        
        .btn-primary-bg:hover {
          background-color: #2563eb;
        }
        
        .btn-primary-bg:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .bg-red-600 {
          background-color: #dc2626;
          color: white;
        }
        
        .bg-red-600:hover {
          background-color: #b91c1c;
        }
        
        .table-container {
          overflow-x: auto;
          padding: 0 16px;
        }
        
        .Gen-Sys-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        
        .Gen-Sys-table th {
          background-color: #f9fafb;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .Gen-Sys-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          color: #4b5563;
        }
        
        .Gen-Sys-table tr:hover td {
          background-color: #f9fafb;
        }
        
        .status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .status.normal {
          background-color: #e0f2fe;
          color: #0369a1;
        }
        
        .status.expiring {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        
        .gen-td-btns {
          display: flex;
          gap: 8px;
        }
        
        .link-btn {
          padding: 6px 12px;
          border-radius: 6px;
          background-color: #3b82f6;
          color: white;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          border: none;
          cursor: pointer;
        }
        
        .link-btn:hover {
          background-color: #2563eb;
        }
        
        .link-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .view-btn {
          padding: 6px 12px;
          border-radius: 6px;
          background-color: #ef4444;
          color: white;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          border: none;
          cursor: pointer;
        }
        
        .view-btn:hover {
          background-color: #dc2626;
        }
        
        .view-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-controls {
          padding: 16px 24px;
        }
        
        .Dash-OO-Boas-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .items-per-page {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #4b5563;
        }
        
        .form-select {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
        }
        
        .mark-all-btn {
          padding: 8px 16px;
          background-color: #e5e7eb;
          border-radius: 6px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        
        .mark-all-btn:hover {
          background-color: #d1d5db;
        }
        
        .page-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .page-info {
          font-size: 14px;
          color: #4b5563;
        }
        
        .page-navigation-Btns {
          display: flex;
          gap: 8px;
        }
        
        .page-button {
          padding: 6px 12px;
          border-radius: 6px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        
        .page-button:hover {
          background-color: #e5e7eb;
        }
        
        .page-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default RecycleBin;