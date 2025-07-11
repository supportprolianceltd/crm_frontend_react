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
import { DateTime } from 'luxon';
import {
  fetchSchedules,
  updateSchedule,
  completeSchedule,
  cancelSchedule,
  bulkDeleteSchedules,
  fetchSoftDeletedSchedules,
  recoverSchedules,
  fetchTimezoneChoices, // Import the new API function
} from './ApiService';

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

const SuccessModal = ({ title, message, onClose }) => (
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
      <h3 className="mb-4 text-lg font-semibold text-green-600">{title}</h3>
      <p className="mb-6">{message}</p>
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

const EditScheduleModal = ({ schedule, onClose, onSave, onComplete, onCancelReject, timezoneChoices }) => {
  const [meetingMode, setMeetingMode] = useState(schedule.meeting_mode || 'Virtual');
  const [meetingLink, setMeetingLink] = useState(schedule.meeting_link || '');
  const [interviewAddress, setInterviewAddress] = useState(schedule.interview_address || '');
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date(schedule.interview_date_time));
  const [tempStartTime, setTempStartTime] = useState(new Date(schedule.interview_date_time));
  const [tempEndTime, setTempEndTime] = useState(
    new Date(new Date(schedule.interview_date_time).getTime() + 30 * 60000)
  );
  const [message, setMessage] = useState(schedule.message || '');
  const [timezone, setTimezone] = useState(schedule.timezone || 'UTC');
  const [timeSelectionMode, setTimeSelectionMode] = useState('start');
  const [modalShowTimeDropdown, setModalShowTimeDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelReasonSection, setShowCancelReasonSection] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmittingReason, setIsSubmittingReason] = useState(false);
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
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
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

  const handleSaveChanges = async () => {
    if (!tempStartTime) {
      setErrorMessage('Please select a start time for the interview.');
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

    if (!timezone) {
      setErrorMessage('Please select a timezone.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsSaving(true);

    try {
      const interviewDateTime = new Date(tempSelectedDate);
      interviewDateTime.setHours(tempStartTime.getHours(), tempStartTime.getMinutes());
      if (interviewDateTime <= new Date()) {
        throw new Error('Interview date and time must be in the future.');
      }
      const scheduleData = {
        interview_date_time: interviewDateTime.toISOString(),
        meeting_mode: meetingMode,
        meeting_link: meetingMode === 'Virtual' ? meetingLink : '',
        interview_address: meetingMode === 'Physical' ? interviewAddress : '',
        message,
        timezone,
      };
      await onSave(schedule.id, scheduleData);
      setIsSaving(false);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save schedule.');
      setIsSaving(false);
      setTimeout(() => setErrorMessage(''), 3000);
      console.error('Error saving schedule:', error);
    }
  };

  const handleCompleteSchedule = async () => {
    setIsCompleting(true);
    try {
      await onComplete(schedule.id);
      setIsCompleting(false);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to complete schedule.');
      setIsCompleting(false);
      setTimeout(() => setErrorMessage(''), 3000);
      console.error('Error completing schedule:', error);
    }
  };

  const handleCancelInitiate = () => {
    setShowCancelReasonSection(true);
  };

  const handleGoBack = () => {
    setShowCancelReasonSection(false);
    setCancelReason('');
  };

  const handleSubmitCancelReason = async () => {
    if (!cancelReason.trim()) {
      setErrorMessage('Please provide a reason for cancellation.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsSubmittingReason(true);

    try {
      await onCancelReject(schedule.id, cancelReason);
      setIsSubmittingReason(false);
      setIsCancelling(false);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to cancel schedule.');
      setIsSubmittingReason(false);
      setIsCancelling(false);
      setTimeout(() => setErrorMessage(''), 3000);
      console.error('Error cancelling schedule:', error);
    }
  };

  const isEditable = schedule.status === 'scheduled';

  return (
    <div>
      <style>
        {`
          .time-item:hover {
            background-color: #f0f0f0;
          }
        `}
      </style>
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
            padding: '1.5rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {!showCancelReasonSection ? (
            <>
              <h3>{isEditable ? 'Edit Schedule Details' : 'View Schedule Details'}</h3>

              {isEditable && (
                <div className="modal-top-buttons-OlaD">
                  <button
                    onClick={handleCancelInitiate}
                    disabled={isCancelling || isCompleting || isSaving}
                    className="btn-cancel-bg"
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

              <div className="GGtg-DDDVa">
                <h4>Timezone:</h4>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="oujka-Inpuauy"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                  disabled={!isEditable}
                >
                  {timezoneChoices.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>

              <div className="GGtg-DDDVa">
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
                  }}
                  disabled={!isEditable}
                >
                  <option value="Virtual">Virtual</option>
                  <option value="Physical">Physical</option>
                </select>

                {meetingMode === 'Virtual' && (
                  <div className="GGtg-DDDVa">
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
                        borderRadius: '0px',
                        border: '1px solid #ccc',
                      }}
                      disabled={!isEditable}
                    />
                  </div>
                )}

                {meetingMode === 'Physical' && (
                  <div className="GGtg-DDDVa" style={{ marginTop: '1rem' }}>
                    <label htmlFor="interviewAddress">Interview Address:</label>
                    <input
                      id="interviewAddress"
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
                      }}
                      disabled={!isEditable}
                    />
                  </div>
                )}
              </div>

              <div className="GGtg-DDDVa">
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="oujka-Inpuauy OIUja-Tettxa"
                  placeholder="Enter any additional message"
                  disabled={!isEditable}
                />
              </div>

              <div className="GGtg-DDDVa">
                <h4>Candidate:</h4>
                <p>{schedule.candidate_name}</p>
              </div>

              <div className="ouksks-pola">
                <h4>Schedule Details:</h4>
                <p>
                  <span>
                    <CalendarDaysIcon className="inline-block w-5 h-5 mr-2" />
                    Date:
                  </span>{' '}
                  {formatFullDate(tempSelectedDate)}
                </p>
                <p>
                  <span>
                    <ClockIcon className="inline-block w-5 h-5 mr-2" />
                    Time:
                  </span>{' '}
                  {formatTime(tempStartTime)} - {formatTime(tempEndTime)} ({timezoneChoices.find(tz => tz.value === timezone)?.label || timezone})
                </p>

                {!isEditable && schedule.status === 'cancelled' && schedule.cancellation_reason && (
                  <div className="GGtg-DDDVa">
                    <h4>Cancellation Reason:</h4>
                    <p className="aoiiksjs-OKka">{schedule.cancellation_reason}</p>
                  </div>
                )}

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
                              className="time-item"
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
                      minDate={new Date()}
                    />
                  </div>
                )}
              </div>

              <div className="oioak-POldj-BTn" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
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
            </>
          ) : (
            <>
              <h3>Cancel Interview</h3>
              <div className="GGtg-DDDVa">
                <label htmlFor="cancelReason">Reason for Cancellation:</label>
                <textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter the reason for cancelling the interview..."
                  className="oujka-Inpuauy OIUja-Tettxa"
                />
              </div>
              <div className="oioak-POldj-BTn" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={handleGoBack}
                  className="CLCLCjm-BNtn"
                >
                  Go Back
                </button>
                <button
                  onClick={handleSubmitCancelReason}
                  disabled={isSubmittingReason}
                  className="btn-primary-bg"
                >
                  {isSubmittingReason ? (
                    <>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          marginRight: '8px',
                          display: 'inline-block',
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [userTimezone, setUserTimezone] = useState(DateTime.local().zoneName || 'UTC');
  const [timezoneChoices, setTimezoneChoices] = useState([]); // State for dynamic timezone choices
  const masterCheckboxRef = useRef(null);
  const navigate = useNavigate();

  const statuses = ['All', 'scheduled', 'completed', 'cancelled'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const params = statusFilter !== 'All' ? { status: statusFilter } : {};
        const [scheduleData, timezoneData] = await Promise.all([
          fetchSchedules(params),
          fetchTimezoneChoices(),
        ]);
        setSchedules(scheduleData);
        setTimezoneChoices(timezoneData);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load data.');
        setIsLoading(false);
        setTimeout(() => setErrorMessage(''), 3000);
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [statusFilter]);

  const toggleSection = () => {
    setIsVisible((prev) => !prev);
  };

  const filteredSchedules = schedules.filter((item) => {
    const lowerSearch = searchTerm?.toLowerCase() || '';
    const id = String(item.id || '').toLowerCase();
    const title = item.job_requisition_title?.toLowerCase() || '';
    const name = item.candidate_name?.toLowerCase() || '';
    return id.includes(lowerSearch) || title.includes(lowerSearch) || name.includes(lowerSearch);
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

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      const response = await bulkDeleteSchedules(selectedIds);
      setSchedules((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      setShowConfirmDelete(false);
      setSuccessMessage(response.detail || `Successfully deleted ${selectedIds.length} schedule(s).`);
      setShowSuccessModal(true);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete schedules.');
      setIsLoading(false);
      setTimeout(() => setErrorMessage(''), 3000);
      console.error('Error deleting schedules:', error);
    }
  };

  const handleViewSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowEditModal(true);
  };

  const handleSaveSchedule = async (id, updatedSchedule) => {
    try {
      const response = await updateSchedule(id, updatedSchedule);
      setSchedules((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...response } : item))
      );
      setSuccessMessage('Schedule updated successfully.');
      setShowSuccessModal(true);
    } catch (error) {
      throw new Error(error.message || 'Failed to update schedule.');
    }
  };

  const handleCompleteSchedule = async (id) => {
    try {
      const response = await completeSchedule(id);
      setSchedules((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...response } : item))
      );
      setSuccessMessage('Schedule marked as completed.');
      setShowSuccessModal(true);
    } catch (error) {
      throw new Error(error.message || 'Failed to complete schedule.');
    }
  };

  const handleCancelReject = async (id, cancellationReason) => {
    try {
      const response = await cancelSchedule(id, cancellationReason);
      setSchedules((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...response } : item))
      );
      setSuccessMessage('Schedule cancelled successfully.');
      setShowSuccessModal(true);
    } catch (error) {
      throw new Error(error.message || 'Failed to cancel schedule.');
    }
  };

  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.checked = false;
    }
    setSelectedIds([]);
  }, [currentPage, rowsPerPage]);

  // Function to format date/time with timezone conversion
  const formatInterviewDateTime = (interviewDateTime, scheduleTimezone) => {
    const dt = DateTime.fromISO(interviewDateTime, { zone: scheduleTimezone || 'UTC' });
    const localDt = dt.setZone(userTimezone);
    const scheduleTzLabel = timezoneChoices.find(tz => tz.value === scheduleTimezone)?.label || scheduleTimezone || 'UTC';
    return `${localDt.toFormat('dd LLL yyyy, h:mm a')} (${scheduleTzLabel})`;
  };

  return (
    <div className="ScheduleList-sec">
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
        {showSuccessModal && (
          <SuccessModal
            title="Success"
            message={successMessage}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>

      <div className="Dash-OO-Boas OOOP-LOa">
        <div className="Dash-OO-Boas-Top">
          <div className="Dash-OO-Boas-Top-1">
            <span onClick={toggleSection} title='Filter'><AdjustmentsHorizontalIcon className="h-6 w-6" /></span>
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
                    {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
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
                    disabled={isLoading}
                  />
                </th>
                <th>Schedule ID</th>
                <th>Position</th>
                <th>Candidate</th>
                <th>Interview Date/Time</th>
                <th>Last Modified</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
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
              ) : currentSchedules.length === 0 ? (
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
                        disabled={isLoading}
                      />
                    </td>
                    <td>{item.id}</td>
                    <td>{item.job_requisition_title}</td>
                    <td>{item.candidate_name}</td>
                    <td>{formatInterviewDateTime(item.interview_date_time, item.timezone)}</td>
                    <td>
                      {DateTime.fromISO(item.updated_at, { zone: 'UTC' })
                        .setZone(userTimezone)
                        .toFormat('dd LLL yyyy, h:mm a')}
                    </td>
                    <td>
                      <span
                        className={`status oLIk-STatus ${
                          item.status === 'scheduled'
                            ? 'status-scheduled'
                            : item.status === 'completed'
                            ? 'status-completed'
                            : item.status === 'cancelled'
                            ? 'status-cancelled'
                            : ''
                        }`}
                      >
                        {item.status === 'scheduled' && <CalendarIcon className="h-5 w-5" />}
                        {item.status === 'completed' && <CheckIcon className="h-5 w-5" />}
                        {item.status === 'cancelled' && <XMarkIcon className="h-5 w-5" />}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="gen-td-btns">
                        <button
                          className="view-btn btn-primary-bg"
                          onClick={() => handleViewSchedule(item)}
                          disabled={isLoading}
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
        {!isLoading && filteredSchedules.length > 0 && (
          <div className="pagination-controls">
            <div className="Dash-OO-Boas-foot">
              <div className="Dash-OO-Boas-foot-1">
                <div className="items-per-page">
                  <p>Number of rows:</p>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    disabled={isLoading}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>

              <div className="Dash-OO-Boas-foot-2">
                <button
                  onClick={handleSelectAllVisible}
                  className="mark-all-btn"
                  disabled={isLoading}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <CheckCircleIcon className="h-6 w-6" />
                  {currentSchedules.every((item) => selectedIds.includes(item.id)) ? 'Unmark All' : 'Mark All'}
                </button>
                <button
                  onClick={handleDeleteMarked}
                  className="delete-marked-btn"
                  disabled={isLoading}
                  style={{ padding: '0.5rem 1rem' }}
                >
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
                  disabled={currentPage === 1 || isLoading}
                  style={{ padding: '0.5rem' }}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  className="page-button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || isLoading}
                  style={{ padding: '0.5rem' }}
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
            message={`Are you sure you want to soft delete ${selectedIds.length} selected schedule(s)? They will be moved to the recycle bin.`}
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
            timezoneChoices={timezoneChoices} // Pass timezone choices to modal
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduleList;
