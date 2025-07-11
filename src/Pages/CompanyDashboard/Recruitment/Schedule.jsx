import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowPathIcon, ChevronDownIcon, ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPublishedRequisitionsWithShortlisted, createSchedule, deleteSchedule, fetchTenantEmailConfig } from './ApiService';
import config from '../../../config';

const Schedule = () => {
  const [activeJobId, setActiveJobId] = useState(null);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [modalShowTimeDropdown, setModalShowTimeDropdown] = useState(false);
  const [timeSelectionMode, setTimeSelectionMode] = useState('start');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tempSelectedApplicants, setTempSelectedApplicants] = useState([]);
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());
  const [tempStartTime, setTempStartTime] = useState(null);
  const [tempEndTime, setTempEndTime] = useState(null);
  const [meetingMode, setMeetingMode] = useState('Virtual');
  const [meetingLink, setMeetingLink] = useState('');
  const [interviewAddress, setInterviewAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [emailTemplate, setEmailTemplate] = useState(null);
  const [emailMessages, setEmailMessages] = useState({});
  const timeDropdownRef = useRef(null);
  const modalTimeDropdownRef = useRef(null);
  const modalContentRef = useRef(null);
  const navigate = useNavigate();

  const WEB_PAGE_URL = config.WEB_PAGE__URL;

  // Fetch jobs and tenant config with retry
  const fetchData = async (retryCount = 3, delay = 1000) => {
    try {
      setIsFetching(true);
      const [jobData, tenantConfig] = await Promise.all([
        fetchPublishedRequisitionsWithShortlisted(),
        fetchTenantEmailConfig(),
      ]);

      const transformedJobs = jobData.map((item, index) => {
        const postedDate = new Date(item.job_requisition.created_at);
        const now = new Date();
        const diffTime = Math.abs(now - postedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const postedText = diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;

        return {
          id: index + 1,
          title: item.job_requisition.title || 'Untitled Job',
          posted: postedText,
          job_location: item.job_requisition.job_location || '',
          company_address: item.job_requisition.company_address || '',
          job_application_code: item.job_requisition.job_application_code || '',
          unique_link: item.job_requisition.unique_link || '',
          applicants: item.shortlisted_applications.map((app) => ({
            id: app.id,
            initials: app.full_name
              ? app.full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'NA',
            name: app.full_name || 'Unknown Applicant',
            email: app.email || '',
            schedule: app.schedules?.[0]
              ? `${new Date(app.schedules[0].interview_date_time).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })} - ${new Date(app.schedules[0].interview_date_time).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })} | ${app.schedules[0].meeting_mode === 'Virtual' ? app.schedules[0].meeting_link : app.schedules[0].interview_address}`
              : '',
            hasSchedule: !!app.schedules?.[0],
            scheduleId: app.schedules?.[0]?.tenant_unique_id || null,
          })),
        };
      });

      setJobs(transformedJobs);
      if (transformedJobs.length > 0) {
        setActiveJobId(transformedJobs[0].id);
      }
      const templateContent = tenantConfig.email_templates?.interviewScheduling?.content;
      if (!templateContent) {
        throw new Error('Interview scheduling template not found in TenantConfig');
      }
      setEmailTemplate(templateContent);
      setIsFetching(false);
    } catch (error) {
      if (retryCount > 0) {
        console.warn(`Retrying fetchData (${retryCount} attempts left)...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchData(retryCount - 1, delay * 2);
      }
      setErrorMessage('Failed to load interview scheduling template. Please configure it in Notification Settings.');
      setIsFetching(false);
      setTimeout(() => setErrorMessage(''), 5000);
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh template on window focus or tenant config update
  useEffect(() => {
    const handleFocus = () => fetchData(1, 500);
    const handleTenantConfigUpdate = () => fetchData(1, 500);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('tenantConfigUpdated', handleTenantConfigUpdate);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('tenantConfigUpdated', handleTenantConfigUpdate);
    };
  }, []);

  const activeJob = jobs.find((job) => job.id === activeJobId) || null;
  const currentApplicants = activeJob?.applicants || [];

  // Initialize email messages when modal opens
  useEffect(() => {
    if (showModal && tempSelectedApplicants.length > 0 && activeJob) {
      const newMessages = {};
      tempSelectedApplicants.forEach((applicantId) => {
        const applicant = currentApplicants.find((app) => app.id === applicantId);
        if (applicant) {
          newMessages[applicantId] = renderEmailTemplate(applicant);
        }
      });
      setEmailMessages(newMessages);
    }
  }, [showModal, tempSelectedApplicants, activeJob]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
      if (modalTimeDropdownRef.current && !modalTimeDropdownRef.current.contains(event.target)) {
        setModalShowTimeDropdown(false);
      }
      if (modalContentRef.current && !modalContentRef.current.contains(event.target) && showModal) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  const handleJobClick = (jobId) => {
    setActiveJobId(jobId);
    setSelectedApplicants([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicantClick = (applicantId) => {
    setSelectedApplicants((prev) =>
      prev.includes(applicantId) ? prev.filter((id) => id !== applicantId) : [...prev, applicantId]
    );
  };

  const handleTempApplicantClick = (applicantId) => {
    setTempSelectedApplicants((prev) => {
      const newSelected = prev.includes(applicantId)
        ? prev.filter((id) => id !== applicantId)
        : [...prev, applicantId];
      const newMessages = {};
      newSelected.forEach((id) => {
        const applicant = currentApplicants.find((app) => app.id === id);
        if (applicant && activeJob) {
          newMessages[id] = emailMessages[id] || renderEmailTemplate(applicant);
        }
      });
      setEmailMessages(newMessages);
      return newSelected;
    });
  };

  const formatMonth = (date) => date.toLocaleString('default', { month: 'short' });
  const formatDay = (date) => date.getDate();
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

  const handleTimeButtonClick = () => {
    if (startTime && endTime) {
      setStartTime(null);
      setEndTime(null);
      setTimeSelectionMode('start');
    }
    setShowTimeDropdown(!showTimeDropdown);
  };

  const handleModalTimeButtonClick = () => {
    if (tempStartTime && tempEndTime) {
      setTempStartTime(null);
      setTempEndTime(null);
      setTimeSelectionMode('start');
    }
    setModalShowTimeDropdown(!modalShowTimeDropdown);
  };

  const handleTimeSelect = (time, isModal) => {
    if (isModal) {
      if (timeSelectionMode === 'start') {
        setTempStartTime(time);
        setTimeSelectionMode('end');
      } else {
        setTempEndTime(time);
        setTimeSelectionMode('start');
        setModalShowTimeDropdown(false);
      }
    } else {
      if (timeSelectionMode === 'start') {
        setStartTime(time);
        setTimeSelectionMode('end');
      } else {
        setEndTime(time);
        setTimeSelectionMode('start');
        setShowTimeDropdown(false);
      }
    }
    setErrorMessage('');
    if (isModal && tempSelectedApplicants.length > 0 && activeJob) {
      const newMessages = {};
      tempSelectedApplicants.forEach((applicantId) => {
        const applicant = currentApplicants.find((app) => app.id === applicantId);
        if (applicant) {
          newMessages[applicantId] = renderEmailTemplate(applicant);
        }
      });
      setEmailMessages(newMessages);
    }
  };

  const handleDateChange = (date, isModal) => {
    if (isModal) {
      setTempSelectedDate(date);
      setTempStartTime(null);
      setTempEndTime(null);
    } else {
      setSelectedDate(date);
      setStartTime(null);
      setEndTime(null);
    }
    setTimeSelectionMode('start');
    setShowTimeDropdown(false);
    setModalShowTimeDropdown(false);
    setErrorMessage('');
    if (isModal && tempSelectedApplicants.length > 0 && activeJob) {
      const newMessages = {};
      tempSelectedApplicants.forEach((applicantId) => {
        const applicant = currentApplicants.find((app) => app.id === applicantId);
        if (applicant) {
          newMessages[applicantId] = renderEmailTemplate(applicant);
        }
      });
      setEmailMessages(newMessages);
    }
  };

  const renderEmailTemplate = (applicant) => {
    if (!emailTemplate) {
      return 'Template not loaded. Please configure in Notification Settings.';
    }
    if (!applicant || !activeJob) {
      return 'Applicant or job data not available.';
    }
    const interviewDateTime = new Date(tempSelectedDate);
    if (tempStartTime) {
      interviewDateTime.setHours(tempStartTime.getHours(), tempStartTime.getMinutes());
    }
    const interviewDate = interviewDateTime.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const interviewTime = tempStartTime
      ? interviewDateTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      : 'TBD';
    const location = meetingMode === 'Virtual' 
      ? (meetingLink || 'TBD')
      : (interviewAddress || activeJob.company_address || activeJob.job_location || 'TBD');
    const dashboardLink = `${WEB_PAGE_URL}/application-dashboard/${activeJob.job_application_code}/${encodeURIComponent(applicant.email)}/${activeJob.unique_link}`;

    const placeholders = {
      '\\[Candidate Name\\]': applicant.name,
      '\\[Job Title\\]': activeJob.title,
      '\\[Position\\]': activeJob.title,
      '\\[Company\\]': localStorage.getItem('tenantName') || 'Proliance',
      '\\[Insert Date\\]': interviewDate,
      '\\[Insert Time\\]': interviewTime,
      '\\[Meeting Mode\\]': meetingMode === 'Virtual' ? 'Virtual (Zoom)' : 'On-site',
      '\\[Zoom / Google Meet / On-site – Insert Address or Link\\]': location,
      '\\[Name\\(s\\) & Position\\(s\\)\\]': localStorage.getItem('userName') || 'Hiring Team',
      '\\[Your Name\\]': localStorage.getItem('userName') || 'Hiring Team',
      '\\[your.email@proliance.com\\]': localStorage.getItem('tenantEmail') || 'no-reply@proliance.com',
      '\\[Dashboard Link\\]': dashboardLink,
    };

    let renderedTemplate = emailTemplate;
    for (const [key, value] of Object.entries(placeholders)) {
      renderedTemplate = renderedTemplate.replace(new RegExp(key, 'g'), value || 'N/A');
    }
    // Append dashboard link if not present in template
    if (!renderedTemplate.includes(dashboardLink)) {
      renderedTemplate += `\n\nPlease check your application dashboard for further details: ${dashboardLink}`;
    }
    return renderedTemplate;
  };

  const handleMessageChange = (applicantId, value) => {
    setEmailMessages((prev) => ({ ...prev, [applicantId]: value }));
  };

  const applySchedule = () => {
    if (!startTime) {
      setErrorMessage('Please select a start time for the interview.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (!emailTemplate) {
      setErrorMessage('Interview scheduling template not loaded. Please configure it in Notification Settings.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setTempSelectedApplicants(selectedApplicants.length > 0 ? selectedApplicants : currentApplicants.map((applicant) => applicant.id));
    setTempSelectedDate(selectedDate);
    setTempStartTime(startTime);
    setTempEndTime(endTime);
    setTimeSelectionMode('start');
    setShowModal(true);
  };

  const confirmSchedule = async () => {
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
    if (meetingMode === 'Physical' && !interviewAddress.trim()) {
      setErrorMessage('Please provide an address for the physical interview.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (tempSelectedApplicants.some((id) => !emailMessages[id]?.trim())) {
      setErrorMessage('Please provide an email message for each selected candidate.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const interviewDateTime = new Date(tempSelectedDate);
      interviewDateTime.setHours(tempStartTime.getHours(), tempStartTime.getMinutes());

      for (const applicantId of tempSelectedApplicants) {
        const applicant = currentApplicants.find((app) => app.id === applicantId);
        if (!applicant) continue;
        const scheduleData = {
          job_application: applicantId,
          interview_date_time: interviewDateTime.toISOString(),
          meeting_mode: meetingMode,
          meeting_link: meetingMode === 'Virtual' ? meetingLink : '',
          interview_address: meetingMode === 'Physical' ? interviewAddress : '',
          message: emailMessages[applicantId],
        };
        await createSchedule(scheduleData);
      }

      setShowModal(false);
      setIsLoading(false);
      navigate('/company/recruitment/schedule-list');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create schedules. Please try again.');
      setIsLoading(false);
      setTimeout(() => setErrorMessage(''), 3000);
      console.error('Error creating schedules:', error);
    }
  };

  const handleClearSchedule = async (applicantId, e) => {
    e.stopPropagation();
    const applicant = currentApplicants.find((app) => app.id === applicantId);
    if (!applicant?.scheduleId) return;

    try {
      await deleteSchedule(applicant.scheduleId);
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.id === activeJobId) {
            return {
              ...job,
              applicants: job.applicants.map((app) => {
                if (app.id === applicantId) {
                  return { ...app, schedule: '', hasSchedule: false, scheduleId: null };
                }
                return app;
              }),
            };
          }
          return job;
        })
      );
    } catch (error) {
      setErrorMessage(error.message || 'Failed to clear schedule. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
      console.error('Error clearing schedule:', error);
    }
  };

  if (isFetching) {
    return (
      <div className="Schedule-MMAin-Pais" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '4px solid rgba(114, 38, 255, 0.2)',
            borderTopColor: '#7226FF',
          }}
        />
      </div>
    );
  }

  return (
    <div className="Schedule-MMAin-Pais">
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
            <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', marginRight: '0.5rem', fill: '#fff' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span style={{ color: '#fff' }}>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="TTTy-Solka">
        <h3>Interview Schedule</h3>
        <Link to="/company/recruitment/schedule-list" className="poli-BTn btn-primary-bg">
          View all schedules
        </Link>
      </div>

      <div className="Schedule-PPao">
        <div className="Schedule-PPao-main">
          <div className="Schedule-PPao-1">
            <div className="Schedule-PPao-1-Boxx">
              <div className="Schedule-PPao-1-Boxx-Top">
                <h3>Posted Jobs</h3>
              </div>
              <div className="Schedule-PPao-1-Boxx-Main Gen-Boxshadow custom-scroll-bar">
                <ul>
                  {jobs.map((job) => (
                    <li
                      key={job.id}
                      className={activeJobId === job.id ? 'active-ggarg-Li' : ''}
                      onClick={() => handleJobClick(job.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div>
                        <h3>{job.title}</h3>
                        <p>{job.applicants.length} applicants</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="Schedule-PPao-2">
            {activeJob && (
              <>
                <div className="Schedule-PPao-2-header">
                  <h3>
                    {activeJob.title} <span><b>Posted:</b> {activeJob.posted}</span>
                  </h3>
                  <p>Date: {formatFullDate(new Date())}</p>
                </div>

                <div className="OOl_AGtg_Sec">
                  <div className="OOl_AGtg_Sec_1">
                    <div className="Schedule-PPao-1-Boxx-Top ooo-Hyha">
                      <h3>
                        Shortlisted Applicants <span>{currentApplicants.length} total</span>
                      </h3>
                    </div>
                    <div className="OOl_AGtg_Sec_1_main">
                      <ul>
                        {currentApplicants.map((applicant) => (
                          <li
                            key={`${activeJobId}-${applicant.id}`}
                            className={selectedApplicants.includes(applicant.id) ? 'active-OLI-O' : ''}
                            onClick={() => handleApplicantClick(applicant.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="LLia_DV">
                              <div className="LLia_DV_1">
                                <span>{applicant.initials}</span>
                              </div>
                              <div className="LLia_DV_2">
                                <div>
                                  <h3>{applicant.name}</h3>
                                  <p>
                                    <span>Schedule:</span>
                                    {applicant.schedule ? ` ${applicant.schedule}` : ' Not scheduled'}
                                  </p>
                                  {applicant.hasSchedule && (
                                    <span
                                      className="clear-schedule-Data"
                                      onClick={(e) => handleClearSchedule(applicant.id, e)}
                                    >
                                      <ArrowPathIcon style={{ width: '20px', height: '20px' }} />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="OOl_AGtg_Sec_2">
                    <div className="Sheccuc-BosXX Gen-Boxshadow">
                      <div className="Schedule-PPao-1-Boxx-Top ooo-Hyha">
                        <h3>Schedule Interview</h3>
                      </div>
                      <div className="ppol-Btns">
                        <div className="oii-DDDDV">
                          <button onClick={applySchedule}>Apply Schedule</button>
                          <p>
                            Schedule for:
                            <span>
                              {selectedApplicants.length > 0
                                ? ` ${selectedApplicants.length} selected`
                                : ' all applicants'}
                            </span>
                          </p>
                        </div>
                        <div className="time-select-container" ref={timeDropdownRef}>
                          <button onClick={handleTimeButtonClick}>
                            {timeSelectionMode === 'start' ? 'Start Time' : 'End Time'}
                            <ChevronDownIcon className={`icon ${showTimeDropdown ? 'rotate-180' : ''}`} style={{ width: '20px', height: '20px' }} />
                          </button>
                          {showTimeDropdown && (
                            <div className="time-dropdown custom-scroll-bar">
                              {timeOptions.map((time, index) => (
                                <div
                                  key={index}
                                  className="time-option"
                                  onClick={() => handleTimeSelect(time, false)}
                                >
                                  {formatTime(time)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="PPOli_Sea">
                        <div className="PPOli_Sea_Card">
                          <div className="PPOli_Sea_Card_1">
                            <span className="DDat-IADf">{formatMonth(selectedDate)}</span>
                            <span>{formatDay(selectedDate)}</span>
                          </div>
                          <div className="PPOli_Sea_Card_2">
                            <div>
                              <h5>{formatFullDate(selectedDate)}</h5>
                              <h6>
                                {formatTime(startTime)} - {formatTime(endTime)}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="realTime-Calendar-wrapper">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => handleDateChange(date, false)}
                          inline
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
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
              style={{ maxHeight: '80vh', overflowY: 'auto', maxWidth: '600px', width: '100%', padding: '20px', background: '#fff', borderRadius: '8px' }}
            >
              <h3>Confirm Schedule Details</h3>

              <div className="GGtg-DDDVa">
                <h4>Meeting Mode:</h4>
                <select
                  value={meetingMode}
                  onChange={(e) => {
                    setMeetingMode(e.target.value);
                    setMeetingLink('');
                    setInterviewAddress('');
                    const newMessages = {};
                    tempSelectedApplicants.forEach((applicantId) => {
                      const applicant = currentApplicants.find((app) => app.id === applicantId);
                      if (applicant && activeJob) {
                        newMessages[applicantId] = renderEmailTemplate(applicant);
                      }
                    });
                    setEmailMessages(newMessages);
                  }}
                  className="oujka-Inpuauy"
                >
                  <option value="Virtual">Virtual</option>
                  <option value="Physical">Physical</option>
                </select>
              </div>

              {meetingMode === 'Virtual' && (
                <div className="GGtg-DDDVa">
                  <label>Meeting Link:</label>
                  <input
                    type="text"
                    value={meetingLink}
                    onChange={(e) => {
                      setMeetingLink(e.target.value);
                      const newMessages = {};
                      tempSelectedApplicants.forEach((applicantId) => {
                        const applicant = currentApplicants.find((app) => app.id === applicantId);
                        if (applicant && activeJob) {
                          newMessages[applicantId] = renderEmailTemplate(applicant);
                        }
                      });
                      setEmailMessages(newMessages);
                    }}
                    placeholder="Enter meeting link (e.g., Zoom, Teams)"
                    className="oujka-Inpuauy"
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              {meetingMode === 'Physical' && (
                <div className="GGtg-DDDVa">
                  <label>Interview Address:</label>
                  <input
                    type="text"
                    value={interviewAddress}
                    onChange={(e) => {
                      setInterviewAddress(e.target.value);
                      const newMessages = {};
                      tempSelectedApplicants.forEach((applicantId) => {
                        const applicant = currentApplicants.find((app) => app.id === applicantId);
                        if (applicant && activeJob) {
                          newMessages[applicantId] = renderEmailTemplate(applicant);
                        }
                      });
                      setEmailMessages(newMessages);
                    }}
                    placeholder="Enter interview address"
                    className="oujka-Inpuauy"
                    style={{ width: '100%' }}
                  />
                  {(activeJob?.company_address || activeJob?.job_location) ? (
                    <div className="address-suggestions" style={{ marginTop: '0.5rem' }}>
                      <p>Suggested Addresses:</p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {activeJob.company_address && (
                          <li
                            style={{
                              cursor: 'pointer',
                              padding: '0.5rem',
                              backgroundColor: interviewAddress === activeJob.company_address ? '#ebe6ff' : '#f7f5ff',
                              borderRadius: '4px',
                              marginBottom: '0.25rem',
                            }}
                            onClick={() => {
                              setInterviewAddress(activeJob.company_address);
                              const newMessages = {};
                              tempSelectedApplicants.forEach((applicantId) => {
                                const applicant = currentApplicants.find((app) => app.id === applicantId);
                                if (applicant && activeJob) {
                                  newMessages[applicantId] = renderEmailTemplate(applicant);
                                }
                              });
                              setEmailMessages(newMessages);
                            }}
                          >
                            <span style={{ color: '#7226FF' }}>Company Address:</span> {activeJob.company_address}
                          </li>
                        )}
                        {activeJob.job_location && (
                          <li
                            style={{
                              cursor: 'pointer',
                              padding: '0.5rem',
                              backgroundColor: interviewAddress === activeJob.job_location ? '#ebe6ff' : '#f7f5ff',
                              borderRadius: '4px',
                            }}
                            onClick={() => {
                              setInterviewAddress(activeJob.job_location);
                              const newMessages = {};
                              tempSelectedApplicants.forEach((applicantId) => {
                                const applicant = currentApplicants.find((app) => app.id === applicantId);
                                if (applicant && activeJob) {
                                  newMessages[applicantId] = renderEmailTemplate(applicant);
                                }
                              });
                              setEmailMessages(newMessages);
                            }}
                          >
                            <span style={{ color: '#7226FF' }}>Job Location:</span> {activeJob.job_location}
                          </li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <div className="no-suggestions" style={{ marginTop: '0.5rem' }}>
                      <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                        No suggested addresses available. Please enter a custom address.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="GGtg-DDDVa">
                <h4>Messages:</h4>
                {tempSelectedApplicants.length === 0 ? (
                  <p>No candidates selected. Please select at least one candidate.</p>
                ) : (
                  tempSelectedApplicants.map((applicantId) => {
                    const applicant = currentApplicants.find((app) => app.id === applicantId);
                    if (!applicant) return null;
                    return (
                      <div key={applicantId} style={{ marginBottom: '1rem' }}>
                        <label>{applicant.name} ({applicant.email}):</label>
                        <textarea
                          className="oujka-Inpuauy OIUja-Tettxa"
                          value={emailMessages[applicantId] || ''}
                          onChange={(e) => handleMessageChange(applicantId, e.target.value)}
                          style={{ minHeight: '150px', width: '100%', whiteSpace: 'pre-wrap', resize: 'vertical' }}
                        />
                      </div>
                    );
                  })
                )}
              </div>

              <div className="GGtg-DDDVa">
                <h4>Select Candidates ({tempSelectedApplicants.length} selected):</h4>
                <ul className="UUl-Uuja Gen-Boxshadow">
                  {currentApplicants.map((applicant) => (
                    <li
                      key={`${activeJobId}-${applicant.id}`}
                      className={tempSelectedApplicants.includes(applicant.id) ? 'active-OLI-O' : ''}
                      onClick={() => handleTempApplicantClick(applicant.id)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: tempSelectedApplicants.includes(applicant.id) ? '#ebe6ff' : '#f7f5ff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem',
                      }}
                    >
                      <span>{applicant.name}</span>
                      <span
                        className="oaikks-Ioks"
                        style={{ color: tempSelectedApplicants.includes(applicant.id) ? '#7226FF' : '#666' }}
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
                    <CalendarDaysIcon style={{ width: '20px', height: '20px', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Date:
                  </span>{' '}
                  {formatFullDate(tempSelectedDate)}
                </p>
                <p>
                  <span>
                    <ClockIcon style={{ width: '20px', height: '20px', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Time:
                  </span>{' '}
                  {formatTime(tempStartTime)} - {formatTime(tempEndTime)}
                </p>
                <div className="ppol-Btns" style={{ marginTop: '1rem' }}>
                  <div className="time-select-container" ref={modalTimeDropdownRef}>
                    <button onClick={handleModalTimeButtonClick}>
                      {timeSelectionMode === 'start' ? 'Start Time' : 'End Time'}
                      <ChevronDownIcon className={`icon ${modalShowTimeDropdown ? 'rotate-180' : ''}`} style={{ width: '20px', height: '20px' }} />
                    </button>
                    {modalShowTimeDropdown && (
                      <div className="time-dropdown custom-scroll-bar">
                        {timeOptions.map((time, index) => (
                          <div
                            key={index}
                            className="time-option"
                            onClick={() => handleTimeSelect(time, true)}
                          >
                            {formatTime(time)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="realTime-Calendar-wrapper" style={{ marginTop: '1rem' }}>
                  <DatePicker
                    selected={tempSelectedDate}
                    onChange={(date) => handleDateChange(date, true)}
                    inline
                  />
                </div>
              </div>

              <div className="oioak-POldj-BTn" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button onClick={() => setShowModal(false)} className="CLCLCjm-BNtn">
                  Close
                </button>
                <button onClick={confirmSchedule} disabled={isLoading} className="btn-primary-bg">
                  {isLoading ? (
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
                          verticalAlign: 'middle',
                        }}
                      />
                      Scheduling...
                    </>
                  ) : (
                    'Proceed'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Schedule;