import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowPathIcon, ChevronDownIcon, ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPublishedRequisitionsWithShortlisted, createSchedule, deleteSchedule } from './ApiService'; // Adjust path as needed

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
  const timeDropdownRef = useRef(null);
  const modalTimeDropdownRef = useRef(null);
  const modalContentRef = useRef(null);
  const navigate = useNavigate();

  // Fetch jobs and schedules from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsFetching(true);
        const data = await fetchPublishedRequisitionsWithShortlisted();

        // Transform API data to match jobList structure
        const transformedJobs = data.map((item, index) => {
          const postedDate = new Date(item.job_requisition.created_at);
          const now = new Date();
          const diffTime = Math.abs(now - postedDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const postedText = diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;

          return {
            id: index + 1,
            title: item.job_requisition.title,
            posted: postedText,
            applicants: item.shortlisted_applications.map((app, appIndex) => {
              const schedule = app.schedules?.[0]; // Assume one schedule per application
              const scheduleString = schedule
                ? `${new Date(schedule.interview_date_time).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })} - ${new Date(schedule.interview_date_time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })} | ${schedule.meeting_mode === 'Virtual' ? schedule.meeting_link : schedule.interview_address}`
                : '';
              return {
                id: app.id, // Use actual job_application id
                initials: app.full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2),
                name: app.full_name,
                schedule: scheduleString,
                hasSchedule: !!schedule,
                scheduleId: schedule?.tenant_unique_id,
              };
            }),
          };
        });

        setJobs(transformedJobs);
        if (transformedJobs.length > 0) {
          setActiveJobId(transformedJobs[0].id);
        }
        setIsFetching(false);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load jobs. Please try again later.');
        setIsFetching(false);
        setTimeout(() => setErrorMessage(''), 3000);
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const activeJob = jobs.find((job) => job.id === activeJobId);
  const currentApplicants = activeJob ? activeJob.applicants : [];

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const handleJobClick = (jobId) => {
    setActiveJobId(jobId);
    setSelectedApplicants([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicantClick = (applicantId) => {
    setSelectedApplicants((prevSelected) => {
      if (prevSelected.includes(applicantId)) {
        return prevSelected.filter((id) => id !== applicantId);
      } else {
        return [...prevSelected, applicantId];
      }
    });
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

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'short' });
  };

  const formatDay = (date) => {
    return date.getDate();
  };

  const formatFullDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const monthShort = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${monthShort} ${year}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
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
  };

  const applySchedule = () => {
    if (!startTime) {
      setErrorMessage('Please select a start time for the interview.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
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
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    if (tempSelectedApplicants.length === 0) {
      setErrorMessage('Please select at least one candidate for the interview.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    if (meetingMode === 'Virtual' && !meetingLink.trim()) {
      setErrorMessage('Please provide a meeting link for the virtual interview.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    if (meetingMode === 'Physical' && !interviewAddress.trim()) {
      setErrorMessage('Please provide an address for the physical interview.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    setIsLoading(true);

    try {
      const interviewDateTime = new Date(tempSelectedDate);
      interviewDateTime.setHours(tempStartTime.getHours(), tempStartTime.getMinutes());

      for (const applicantId of tempSelectedApplicants) {
        const scheduleData = {
          job_application: applicantId,
          interview_date_time: interviewDateTime.toISOString(),
          meeting_mode: meetingMode,
          meeting_link: meetingMode === 'Virtual' ? meetingLink : '',
          interview_address: meetingMode === 'Physical' ? interviewAddress : '',
          message: `Dear Applicant, your interview has been scheduled for ${formatFullDate(tempSelectedDate)} at ${formatTime(tempStartTime)}. Please check your email for further details. We look forward to speaking with you!`,
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
            border: '4px solid rgba(114, 38, 255, 0.3)',
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
                                      <ArrowPathIcon />
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
                            <ChevronDownIcon className={`icon ${showTimeDropdown ? 'rotate-180' : ''}`} />
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
                                {startTime ? formatTime(startTime) : '00:00'} {' - '}
                                {endTime ? formatTime(endTime) : '00:00'}
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
                  }}
                  className="oujka-Inpuauy"
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
                      placeholder="Enter meeting link (e.g., Zoom, Teams)"
                      className="oujka-Inpuauy"
                    />
                  </div>
                )}

                {meetingMode === 'Physical' && (
                  <div className="GGtg-DDDVa">
                    <label>Interview Address:</label>
                    <input
                      type="text"
                      value={interviewAddress}
                      onChange={(e) => setInterviewAddress(e.target.value)}
                      placeholder="Enter interview address"
                      className="oujka-Inpuauy"
                    />
                  </div>
                )}
              </div>

              <div className="GGtg-DDDVa">
                <label>Message:</label>
                <textarea
                  className="oujka-Inpuauy OIUja-Tettxa"
                >
                  {`Dear Applicant, your interview has been scheduled for ${formatFullDate(tempSelectedDate)} at ${formatTime(tempStartTime)}. Please check your email for further details. We look forward to speaking with you!`}
                </textarea>
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
                    <CalendarDaysIcon />Date:
                  </span>{' '}
                  {formatFullDate(tempSelectedDate)}
                </p>
                <p>
                  <span>
                    <ClockIcon /> Time:
                  </span>{' '}
                  {tempStartTime ? formatTime(tempStartTime) : 'Not selected'} -{' '}
                  {tempEndTime ? formatTime(tempEndTime) : 'Not selected'}
                </p>

                <div className="ppol-Btns" style={{ marginTop: '1rem' }}>
                  <div className="time-select-container" ref={modalTimeDropdownRef}>
                    <button onClick={handleModalTimeButtonClick}>
                      {timeSelectionMode === 'start' ? 'Start Time' : 'End Time'}
                      <ChevronDownIcon className={`icon ${modalShowTimeDropdown ? 'rotate-180' : ''}`} />
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

              <div className="oioak-POldj-BTn">
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