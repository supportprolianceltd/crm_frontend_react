import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckIcon,
  XMarkIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Dummy candidate data
const dummyCandidates = [
  { id: 1, name: 'Prince Godson' },
  { id: 2, name: 'Orji Daniel' },
  { id: 3, name: 'Mary Johnson' },
  { id: 4, name: 'Uche Chinedu' },
  { id: 5, name: 'Amaka Nwosu' },
];

// Generate mock schedules with candidate names and meeting details
const generateMockSchedules = () => {
  const positions = [
    'Frontend Developer', 'Backend Engineer', 'UI/UX Designer', 'DevOps Engineer',
    'Data Scientist', 'Full Stack Developer'
  ];
  const statuses = ['Scheduled', 'Completed', 'Cancelled'];
  const meetingModes = ['Virtual', 'Physical'];
  const meetingLinks = ['https://zoom.us/j/123456789', 'https://teams.microsoft.com/l/meetup-join/abc123', ''];
  const interviewAddresses = ['123 Tech St, Lagos', '456 Innovation Ave, Abuja', '789 Dev Road, Kano'];

  const schedules = [];
  for (let i = 1; i <= 40; i++) {
    const date = new Date();
    date.setDate(date.getDate() + (i % 15));
    date.setHours(9 + (i % 8));
    date.setMinutes((i % 4) * 15);

    const interviewDateTime = `${date.toISOString().split('T')[0]} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    const lastModifiedDate = new Date();
    lastModifiedDate.setDate(lastModifiedDate.getDate() - (i % 5));
    const lastModified = `${lastModifiedDate.toISOString().split('T')[0]} ${String(lastModifiedDate.getHours()).padStart(2, '0')}:${String(lastModifiedDate.getMinutes()).padStart(2, '0')}`;

    const candidateCount = Math.floor(Math.random() * 5) + 1;
    const selectedCandidates = dummyCandidates.slice(0, candidateCount).map(c => c.id);

    const meetingMode = meetingModes[i % meetingModes.length];
    const meetingLink = meetingMode === 'Virtual' ? meetingLinks[i % meetingLinks.length] : '';
    const interviewAddress = meetingMode === 'Physical' ? interviewAddresses[i % interviewAddresses.length] : '';

    schedules.push({
      id: `SCH-${String(i).padStart(3, '0')}`,
      position: positions[i % positions.length],
      candidateIds: selectedCandidates,
      candidateCount: candidateCount,
      interviewDateTime,
      lastModified,
      status: statuses[i % statuses.length],
      meetingMode,
      meetingLink,
      interviewAddress,
    });
  }
  return schedules;
};

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

const EditScheduleModal = ({ schedule, onClose, onSave, onComplete, onCancelReject }) => {
  const [meetingMode, setMeetingMode] = useState(schedule.meetingMode);
  const [meetingLink, setMeetingLink] = useState(schedule.meetingLink);
  const [interviewAddress, setInterviewAddress] = useState(schedule.interviewAddress);
  const [tempSelectedApplicants, setTempSelectedApplicants] = useState(schedule.candidateIds);
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date(schedule.interviewDateTime));
  const [tempStartTime, setTempStartTime] = useState(new Date(schedule.interviewDateTime));
  const [tempEndTime, setTempEndTime] = useState(new Date(new Date(schedule.interviewDateTime).getTime() + 30 * 60000));
  const [timeSelectionMode, setTimeSelectionMode] = useState('start');
  const [modalShowTimeDropdown, setModalShowTimeDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const modalTimeDropdownRef = useRef(null);
  const modalContentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalTimeDropdownRef.current && !modalTimeDropdownRef.current.contains(event.target)) {
        setModalShowTimeDropdown(false);
      }
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const formatFullDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const monthShort = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${monthShort} ${year}`;
  };

  const formatTime = (date) => {
    if (!date) return 'Not selected';
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour);
        time.setMinutes(minute);
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleModalTimeButtonClick = () => {
    if (tempStartTime && tempEndTime) {
      setTempStartTime(null);
      setTempEndTime(null);
      setTimeSelectionMode('start');
    }
    setModalShowTimeDropdown(!modalShowTimeDropdown);
  };

  const handleTimeSelect = (time) => {
    if (timeSelectionMode === 'start') {
      setTempStartTime(time);
      setTimeSelectionMode('end');
    } else {
      setTempEndTime(time);
      setTimeSelectionMode('start');
      setModalShowTimeDropdown(false);
    }
    setErrorMessage('');
  };

  const handleTempApplicantClick = (applicantId) => {
    setTempSelectedApplicants((prevSelected) => {
      if (prevSelected.includes(applicantId)) {
        return prevSelected.filter((id) => id !== applicantId);
      } else {
        return [...prevSelected, applicantId];
      }
    });
  };

  const handleDateChange = (date) => {
    setTempSelectedDate(date);
    setTempStartTime(null);
    setTempEndTime(null);
    setTimeSelectionMode('start');
    setModalShowTimeDropdown(false);
    setErrorMessage('');
  };

  const isValidUrl = (url) => {
    const urlPattern = /^(https?:\/\/)([\w-]+(\.[\w-]+)+)(\/[\w- ./?%&=]*)?$/;
    return urlPattern.test(url);
  };

  const handleSaveChanges = () => {
    if (!tempStartTime) {
      setErrorMessage('Please select a start time for the interview.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (tempSelectedApplicants.length === 0) {
      setErrorMessage('Please select at least one candidate for the interview.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (meetingMode === 'Virtual' && !meetingLink.trim()) {
      setErrorMessage('Please provide a meeting link for the virtual interview.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (meetingMode === 'Virtual' && !isValidUrl(meetingLink.trim())) {
      setErrorMessage('Please provide a valid URL for the meeting link (e.g., https://zoom.us/j/123456789).');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (meetingMode === 'Physical' && !interviewAddress.trim()) {
      setErrorMessage('Please provide an address for the physical interview.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsSaving(true);

    const scheduleString = `${formatFullDate(tempSelectedDate)} ${formatTime(tempStartTime)}`;
    const updatedSchedule = {
      ...schedule,
      candidateIds: tempSelectedApplicants,
      candidateCount: tempSelectedApplicants.length,
      interviewDateTime: scheduleString,
      lastModified: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].slice(0, 5),
      meetingMode,
      meetingLink: meetingMode === 'Virtual' ? meetingLink : '',
      interviewAddress: meetingMode === 'Physical' ? interviewAddress : '',
    };

    onSave(updatedSchedule);

    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  const handleCompleteSchedule = () => {
    setIsCompleting(true);
    onComplete(schedule.id);
    setTimeout(() => {
      setIsCompleting(false);
      onClose();
    }, 1000);
  };

  const handleCancelReject = () => {
    setIsCancelling(true);
    onCancelReject(schedule.id);
    setTimeout(() => {
      setIsCancelling(false);
      onClose();
    }, 1000);
  };

  const isEditable = schedule.status === 'Scheduled';

  return (
    <div>
      <AnimatePresence>
        {errorMessage && (
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
              padding: '1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              zIndex: 4001,
              maxWidth: '500px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{ width: '20px', height: '20px', marginRight: '0.5rem', fill: '#fff' }}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span style={{ color: '#fff' }}>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <h3>{isEditable ? 'Edit Schedule Details' : 'View Schedule Details'}</h3>

            {isEditable && (
              <div
                className="modal-top-buttons-OlaD"
              >
                <button
                  onClick={handleCancelReject}
                  disabled={isCancelling || isCompleting || isSaving}
                  className="btn-cancel-bg"
                  style={{
                    cursor: (isCancelling || isCompleting || isSaving) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isCancelling ? (
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
                          borderTopColor: '#d32e2e',
                          marginRight: '5px',
                          display: 'inline-block',
                        }}
                      />
                      Processing...
                    </>
                  ) : (
                    'Cancel Interview'
                  )}
                </button>
                <button
                  onClick={handleCompleteSchedule}
                  disabled={isCompleting || isCancelling || isSaving}
                  className="btn-complete-bg"
                  style={{
                    cursor: (isCompleting || isCancelling || isSaving) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isCompleting ? (
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
                          borderTopColor: '#199534',
                          marginRight: '5px',
                          display: 'inline-block',
                        }}
                      />
                      Processing...
                    </>
                  ) : (
                    'Complete Interview'
                  )}
                </button>
              </div>
            )}

            <div className="GGtg-DDDVa" style={{ marginBottom: '1rem' }}>
              <h4>Meeting Mode:</h4>
              <select
                value={meetingMode}
                onChange={(e) => {
                  setMeetingMode(e.target.value);
                  setMeetingLink('');
                  setInterviewAddress('');
                }}
                className="oujka-Inpuauy"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginTop: '0.5rem',
                }}
                disabled={!isEditable}
              >
                <option value="Virtual">Virtual</option>
                <option value="Physical">Physical</option>
              </select>

              {meetingMode === 'Virtual' && (
                <div className="GGtg-DDDVa" style={{ marginTop: '1rem' }}>
                  <label>Meeting Link:</label>
                  <input
                    type="text"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="Enter meeting link (e.g., https://zoom.us/j/123456789)"
                    className="oujka-Inpuauy"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      marginTop: '0.5rem',
                    }}
                    disabled={!isEditable}
                  />
                </div>
              )}

              {meetingMode === 'Physical' && (
                <div className="GGtg-DDDVa" style={{ marginTop: '1rem' }}>
                  <label>Interview Address:</label>
                  <input
                    type="text"
                    value={interviewAddress}
                    onChange={(e) => setInterviewAddress(e.target.value)}
                    placeholder="Enter interview address"
                    className="oujka-Inpuauy"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      marginTop: '0.5rem',
                    }}
                    disabled={!isEditable}
                  />
                </div>
              )}
            </div>

            <div className="GGtg-DDDVa" style={{ marginBottom: '1rem' }}>
              <h4>Select Candidates ({tempSelectedApplicants.length} selected):</h4>
              <ul
                className="UUl-Uuja Gen-Boxshadow"
              >
                {dummyCandidates.map((applicant) => (
                  <li
                    key={applicant.id}
                    className={tempSelectedApplicants.includes(applicant.id) ? 'active-OLI-O' : ''}
                    onClick={() => isEditable && handleTempApplicantClick(applicant.id)}
                    style={{
                      cursor: isEditable ? 'pointer' : 'default',
                      backgroundColor: tempSelectedApplicants.includes(applicant.id)
                        ? '#ebe6ff'
                        : '#f7f5ff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    <span>{applicant.name}</span>
                    <span
                      className="oaikks-Ioks"
                      style={{
                        color: tempSelectedApplicants.includes(applicant.id) ? '#7226FF' : '#666',
                      }}
                    >
                      {tempSelectedApplicants.includes(applicant.id) ? 'Selected' : '+ Add'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ouksks-pola">
              <h4>Schedule Details:</h4>
              <p>
                <span>
                  <CalendarDaysIcon style={{ width: '20px', marginRight: '0.5rem' }} />
                  Date:
                </span>{' '}
                {formatFullDate(tempSelectedDate)}
              </p>
              <p>
                <span>
                  <ClockIcon style={{ width: '20px', marginRight: '0.5rem' }} />
                  Time:
                </span>{' '}
                {formatTime(tempStartTime)} - {formatTime(tempEndTime)}
              </p>

              {isEditable && (
                <div className="ppol-Btns" style={{ marginTop: '1rem' }}>
                  <div className="time-select-container" ref={modalTimeDropdownRef}>
                    <button
                      onClick={handleModalTimeButtonClick}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {timeSelectionMode === 'start' ? 'Start Time' : 'End Time'}
                      <ChevronDownIcon
                        className={`icon ${modalShowTimeDropdown ? 'rotate-180' : ''}`}
                        style={{ width: '20px', marginLeft: '0.5rem' }}
                      />
                    </button>

                    {modalShowTimeDropdown && (
                      <div
                        className="time-dropdown custom-scroll-bar"
                        style={{
                          maxHeight: '150px',
                          overflowY: 'auto',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          background: '#fff',
                          position: 'absolute',
                          zIndex: 10,
                          width: '150px',
                        }}
                      >
                        {timeOptions.map((time, index) => (
                          <div
                            key={index}
                            className="time-option"
                            onClick={() => handleTimeSelect(time)}
                            style={{
                              padding: '0.5rem',
                              cursor: 'pointer',
                            }}
                          >
                            {formatTime(time)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isEditable && (
                <div className="realTime-Calendar-wrapper" style={{ marginTop: '1rem' }}>
                  <DatePicker
                    selected={tempSelectedDate}
                    onChange={(date) => handleDateChange(date)}
                    inline
                  />
                </div>
              )}
            </div>

          <div className='oioak-POldj-BTn'>
              <button
                onClick={onClose}
                className="CLCLCjm-BNtn"
              >
                Close
              </button>
              {isEditable && (
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving || isCompleting || isCancelling}
                  className="btn-primary-bg"
                  style={{
                    cursor: (isSaving || isCompleting || isCancelling) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: '3px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          marginRight: '8px',
                          display: 'inline-block',
                        }}
                      />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ScheduleList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showNoSelectionAlert, setShowNoSelectionAlert] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const masterCheckboxRef = useRef(null);
  const navigate = useNavigate();

  const statuses = ['All', 'Scheduled', 'Completed', 'Cancelled'];

  const toggleSection = () => {
    setIsVisible(prev => !prev);
  };

  const [schedules, setSchedules] = useState(generateMockSchedules());

  const filteredSchedules = schedules.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSchedules.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentSchedules = filteredSchedules.slice(startIndex, startIndex + rowsPerPage);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    if (currentSchedules.every((item) => selectedIds.includes(item.id))) {
      setSelectedIds((prev) => prev.filter((id) => !currentSchedules.some((item) => item.id === id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...currentSchedules.filter((item) => !prev.includes(item.id)).map((item) => item.id),
      ]);
    }
  };

  const handleDeleteMarked = () => {
    if (selectedIds.length === 0) {
      setShowNoSelectionAlert(true);
      return;
    }
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    setSchedules((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setShowConfirmDelete(false);
  };

  const handleViewSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowEditModal(true);
  };

  const handleSaveSchedule = (updatedSchedule) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === updatedSchedule.id ? updatedSchedule : item))
    );
  };

  const handleCompleteSchedule = (scheduleId) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === scheduleId ? { ...item, status: 'Completed' } : item
      )
    );
  };

  const handleCancelReject = (scheduleId) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === scheduleId ? { ...item, status: 'Cancelled' } : item
      )
    );
  };

  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.checked = false;
    }
    setSelectedIds([]);
  }, [currentPage, rowsPerPage]);

  return (
    <div className="ScheduleList-sec">
      <div className="Dash-OO-Boas OOOP-LOa">
        <div className="Dash-OO-Boas-Top">
          <div className="Dash-OO-Boas-Top-1">
            <span onClick={toggleSection}><AdjustmentsHorizontalIcon className="h-6 w-6" /></span>
            <h3>Scheduled Interviews</h3>
          </div>
          <div className="Dash-OO-Boas-Top-2">
            <div className="genn-Drop-Search">
              <span><MagnifyingGlassIcon className="h-6 w-6" /></span>
              <input
                type="text"
                placeholder="Search scheduled interviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="filter-dropdown"
              initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="Dash-OO-Boas Gen-Boxshadow">
        <div className="table-container">
          <table className="Gen-Sys-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    ref={masterCheckboxRef}
                    onChange={handleSelectAllVisible}
                    checked={currentSchedules.length > 0 && currentSchedules.every((item) => selectedIds.includes(item.id))}
                  />
                </th>
                <th>Schedule ID</th>
                <th>Position</th>
                <th>Candidates</th>
                <th>Interview Date/Time</th>
                <th>Last Modified</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSchedules.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                    No matching scheduled interviews found
                  </td>
                </tr>
              ) : (
                currentSchedules.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </td>
                    <td>{item.id}</td>
                    <td>{item.position}</td>
                    <td>{item.candidateCount}</td>
                    <td>{item.interviewDateTime}</td>
                    <td>{item.lastModified}</td>
                    <td>
                      <span
                        className={`status oLIk-STatus ${
                          item.status === 'Scheduled'
                            ? 'status-scheduled'
                            : item.status === 'Completed'
                            ? 'status-completed'
                            : item.status === 'Cancelled'
                            ? 'status-cancelled'
                            : ''
                        }`}
                      >
                        {item.status === 'Scheduled' && <CalendarIcon className="h-5 w-5" />}
                        {item.status === 'Completed' && <CheckIcon className="h-5 w-5" />}
                        {item.status === 'Cancelled' && <XMarkIcon className="h-5 w-5" />}
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="gen-td-btns">
                        <button
                          className="view-btn btn-primary-bg"
                          onClick={() => handleViewSchedule(item)}
                        >
                          View Schedule
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredSchedules.length > 0 && (
          <div className="pagination-controls">
            <div className="Dash-OO-Boas-foot">
              <div className="Dash-OO-Boas-foot-1">
                <div className="items-per-page">
                  <p>Number of rows:</p>
                  <select
                    className="form-select"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>

              <div className="Dash-OO-Boas-foot-2">
                <button onClick={handleSelectAllVisible} className="mark-all-btn">
                  <CheckCircleIcon className="h-6 w-6" />
                  {currentSchedules.every((item) => selectedIds.includes(item.id)) ? 'Unmark All' : 'Mark All'}
                </button>
                <button onClick={handleDeleteMarked} className="delete-marked-btn">
                  <TrashIcon className="h-6 w-6" />
                  Delete Marked
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
            message="You have not selected any scheduled interviews to delete."
            onClose={() => setShowNoSelectionAlert(false)}
          />
        )}
        {showConfirmDelete && (
          <Modal
            title="Confirm Delete"
            message={`Are you sure you want to delete ${selectedIds.length} selected schedule(s)? This action cannot be undone.`}
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirmDelete(false)}
            confirmText="Delete"
            cancelText="Cancel"
          />
        )}
        {showEditModal && selectedSchedule && (
          <EditScheduleModal
            schedule={selectedSchedule}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveSchedule}
            onComplete={handleCompleteSchedule}
            onCancelReject={handleCancelReject}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduleList;