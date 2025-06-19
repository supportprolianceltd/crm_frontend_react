import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const jobList = [
  { 
    id: 1, 
    title: "Frontend Website Developer", 
    posted: "5 days ago",
    applicants: [
      { id: 1, initials: 'PG', name: 'Prince Godson', schedule: '', hasSchedule: true },
      { id: 2, initials: 'OD', name: 'Orji Daniel', schedule: '', hasSchedule: true },
      { id: 3, initials: 'MJ', name: 'Mary Johnson', schedule: '', hasSchedule: false },
      { id: 4, initials: 'UC', name: 'Uche Chinedu', schedule: '', hasSchedule: true },
      { id: 5, initials: 'AN', name: 'Amaka Nwosu', schedule: '', hasSchedule: false },
      { id: 6, initials: 'EK', name: 'Emeka Kalu', schedule: '', hasSchedule: true }
    ]
  },
  { 
    id: 2, 
    title: "Security Analyst", 
    posted: "3 days ago",
    applicants: [
      { id: 1, initials: 'AB', name: 'Ali Bello', schedule: '', hasSchedule: false },
      { id: 2, initials: 'CN', name: 'Chinyere Nnaji', schedule: '', hasSchedule: false }
    ]
  },
  { 
    id: 3, 
    title: "Mobile Developer", 
    posted: "14 days ago",
    applicants: [
      { id: 1, initials: 'KS', name: 'Kemi Shola', schedule: '', hasSchedule: false },
      { id: 2, initials: 'ET', name: 'Emeka Tony', schedule: '', hasSchedule: false },
      { id: 3, initials: 'FA', name: 'Fatima Abubakar', schedule: '', hasSchedule: false }
    ]
  },
  { 
    id: 4, 
    title: "DevOps Engineer", 
    posted: "20 days ago",
    applicants: [
      { id: 1, initials: 'PG', name: 'Prince Godson', schedule: '', hasSchedule: true },
      { id: 2, initials: 'CN', name: 'Chinyere Nnaji', schedule: '', hasSchedule: false }
    ]
  },
  { 
    id: 5, 
    title: "Cloud Architect", 
    posted: "33 days ago",
    applicants: [
      { id: 1, initials: 'MJ', name: 'Mary Johnson', schedule: '', hasSchedule: false },
      { id: 2, initials: 'FA', name: 'Fatima Abubakar', schedule: '', hasSchedule: false }
    ]
  },
  { 
    id: 6, 
    title: "Data Scientist", 
    posted: "1 week ago",
    applicants: [
      { id: 1, initials: 'OD', name: 'Orji Daniel', schedule: '', hasSchedule: true },
      { id: 2, initials: 'AB', name: 'Ali Bello', schedule: '', hasSchedule: false }
    ]
  },
  { 
    id: 7, 
    title: "UI/UX Designer", 
    posted: "2 weeks ago",
    applicants: [
      { id: 1, initials: 'ET', name: 'Emeka Tony', schedule: '', hasSchedule: false },
      { id: 2, initials: 'KS', name: 'Kemi Shola', schedule: '', hasSchedule: false }
    ]
  },
  { 
    id: 8, 
    title: "Backend Developer", 
    posted: "6 days ago",
    applicants: [
      { id: 1, initials: 'PG', name: 'Prince Godson', schedule: '', hasSchedule: true },
      { id: 2, initials: 'MJ', name: 'Mary Johnson', schedule: '', hasSchedule: false }
    ]
  },
  { 
    id: 9, 
    title: "Cybersecurity Engineer", 
    posted: "4 days ago",
    applicants: [
      { id: 1, initials: 'CN', name: 'Chinyere Nnaji', schedule: '', hasSchedule: false },
      { id: 2, initials: 'FA', name: 'Fatima Abubakar', schedule: '', hasSchedule: false }
    ]
  },
  { 
    id: 10, 
    title: "Project Manager", 
    posted: "11 days ago",
    applicants: [
      { id: 1, initials: 'OD', name: 'Orji Daniel', schedule: '', hasSchedule: true },
      { id: 2, initials: 'AB', name: 'Ali Bello', schedule: '', hasSchedule: false }
    ]
  }
];

const Schedule = () => {
  const [activeJobId, setActiveJobId] = useState(jobList[0].id);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [modalShowTimeDropdown, setModalShowTimeDropdown] = useState(false);
  const [timeSelectionMode, setTimeSelectionMode] = useState('start');
  const [modalTimeSelectionMode, setModalTimeSelectionMode] = useState('start');
  
  // Set default start time to current system time rounded to nearest 30 minutes
  const getDefaultStartTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.round(minutes / 30) * 30;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    return new Date(now);
  };

  const [startTime, setStartTime] = useState(getDefaultStartTime());
  const [endTime, setEndTime] = useState(null);
  const [jobs, setJobs] = useState(jobList);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempSelectedApplicants, setTempSelectedApplicants] = useState([]);
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());
  const [tempStartTime, setTempStartTime] = useState(getDefaultStartTime());
  const [tempEndTime, setTempEndTime] = useState(null);
  const timeDropdownRef = useRef(null);
  const modalTimeDropdownRef = useRef(null);

  const activeJob = jobs.find(job => job.id === activeJobId);
  const currentApplicants = activeJob ? activeJob.applicants : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
      if (modalTimeDropdownRef.current && !modalTimeDropdownRef.current.contains(event.target)) {
        setModalShowTimeDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleJobClick = (jobId) => {
    setActiveJobId(jobId);
    setSelectedApplicants([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicantClick = (applicantId) => {
    setSelectedApplicants(prevSelected => {
      if (prevSelected.includes(applicantId)) {
        return prevSelected.filter(id => id !== applicantId);
      } else {
        return [...prevSelected, applicantId];
      }
    });
  };

  const handleTempApplicantClick = (applicantId) => {
    setTempSelectedApplicants(prevSelected => {
      if (prevSelected.includes(applicantId)) {
        return prevSelected.filter(id => id !== applicantId);
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
      setStartTime(getDefaultStartTime());
      setEndTime(null);
      setTimeSelectionMode('start');
    }
    setShowTimeDropdown(!showTimeDropdown);
  };

  const handleModalTimeButtonClick = () => {
    if (tempStartTime && tempEndTime) {
      setTempStartTime(getDefaultStartTime());
      setTempEndTime(null);
      setModalTimeSelectionMode('start');
    }
    setModalShowTimeDropdown(!modalShowTimeDropdown);
  };

  const handleTimeSelect = (time, isModal) => {
    if (isModal) {
      if (modalTimeSelectionMode === 'start') {
        setTempStartTime(time);
        setModalTimeSelectionMode('end');
      } else {
        setTempEndTime(time);
        setModalTimeSelectionMode('start');
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
    
    setTempSelectedApplicants(selectedApplicants.length > 0 ? selectedApplicants : currentApplicants.map(applicant => applicant.id));
    setTempSelectedDate(new Date(selectedDate));
    setTempStartTime(new Date(startTime));
    setTempEndTime(endTime ? new Date(endTime) : null);
    setModalTimeSelectionMode(timeSelectionMode);
    setShowModal(true);
  };

  const confirmSchedule = () => {
    if (!tempStartTime) {
      setErrorMessage('Please select a start time for the interview.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    const scheduleString = `${formatFullDate(tempSelectedDate)} - ${formatTime(tempStartTime)}`;
    
    const applicantsToUpdate = tempSelectedApplicants;

    setJobs(prevJobs => {
      return prevJobs.map(job => {
        if (job.id === activeJobId) {
          return {
            ...job,
            applicants: job.applicants.map(applicant => {
              if (applicantsToUpdate.includes(applicant.id)) {
                return {
                  ...applicant,
                  schedule: scheduleString,
                  hasSchedule: true
                };
              }
              return applicant;
            })
          };
        }
        return job;
      });
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    // Reset selection
    setStartTime(getDefaultStartTime());
    setEndTime(null);
    setTimeSelectionMode('start');
    setShowTimeDropdown(false);
    setModalShowTimeDropdown(false);
    setSelectedApplicants([]);
    setTempSelectedApplicants([]);
    setShowModal(false);
    setErrorMessage('');
  };

  const handleClearSchedule = (applicantId, e) => {
    e.stopPropagation();
    setJobs(prevJobs => {
      return prevJobs.map(job => {
        if (job.id === activeJobId) {
          return {
            ...job,
            applicants: job.applicants.map(applicant => {
              if (applicant.id === applicantId) {
                return {
                  ...applicant,
                  schedule: '',
                  hasSchedule: false
                };
              }
              return applicant;
            })
          };
        }
        return job;
      });
    });
  };

  const handleDateChange = (date, isModal) => {
    if (isModal) {
      setTempSelectedDate(new Date(date));
      setTempStartTime(getDefaultStartTime());
      setTempEndTime(null);
      setModalTimeSelectionMode('start');
    } else {
      setSelectedDate(new Date(date));
      setStartTime(getDefaultStartTime());
      setEndTime(null);
      setTimeSelectionMode('start');
    }
    setShowTimeDropdown(false);
    setModalShowTimeDropdown(false);
    setErrorMessage('');
  };

  return (
    <div className='Schedule-MMAin-Pais'>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-notification"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="success-content">
              <svg viewBox="0 0 24 24" className="success-icon">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>Interview scheduled successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='TTTy-Solka'>
        <h3>Interview Schedule</h3>
        <Link to='/company/recruitment/schedule-list' className='poli-BTn btn-primary-bg'>View all schedules</Link>
      </div>

      <div className='Schedule-PPao'>
        <div className='Schedule-PPao-main'>
          <div className='Schedule-PPao-1'>
            <div className='Schedule-PPao-1-Boxx'>
              <div className='Schedule-PPao-1-Boxx-Top'>
                <h3>Posted Jobs</h3>
              </div>
              <div className='Schedule-PPao-1-Boxx-Main Gen-Boxshadow custom-scroll-bar'>
                <ul>
                  {jobs.map(job => (
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

          <div className='Schedule-PPao-2'>
            <div className='Schedule-PPao-2-header'>
              <h3>
                {activeJob.title} <span><b>Posted:</b> {activeJob.posted}</span>
              </h3>
              <p>Date: {formatFullDate(new Date())}</p>
            </div>

            <div className='OOl_AGtg_Sec'>
              <div className='OOl_AGtg_Sec_1'>
                <div className='Schedule-PPao-1-Boxx-Top ooo-Hyha'>
                  <h3>
                    Shortlisted Applicants <span>{currentApplicants.length} total</span>
                  </h3>
                </div>

                <div className='OOl_AGtg_Sec_1_main'>
                  <ul>
                    {currentApplicants.map(applicant => (
                      <li
                        key={`${activeJobId}-${applicant.id}`}
                        className={selectedApplicants.includes(applicant.id) ? 'active-OLI-O' : ''}
                        onClick={() => handleApplicantClick(applicant.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className='LLia_DV'>
                          <div className='LLia_DV_1'>
                            <span>{applicant.initials}</span>
                          </div>
                          <div className='LLia_DV_2'>
                            <div>
                              <h3>{applicant.name}</h3>
                              <p>
                                <span>Schedule:</span> 
                                {applicant.schedule ? ` ${applicant.schedule}` : ' Not scheduled'}
                              </p>
                              {applicant.hasSchedule && (
                                <span 
                                  className='clear-schedule-Data'
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

              <div className='OOl_AGtg_Sec_2'>
                <div className='Sheccuc-BosXX Gen-Boxshadow'>
                  <div className='Schedule-PPao-1-Boxx-Top ooo-Hyha'>
                    <h3>Schedule Interview</h3>
                  </div>

                  <div className='ppol-Btns'>
                    <div className='oii-DDDDV'>
                      <button onClick={applySchedule}>Apply Schedule</button>
                      <p>Schedule for: 
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

                  {errorMessage && (
                    <p className='error OPP-YHag'>
                      {errorMessage}
                    </p>
                  )}

                  <div className='PPOli_Sea'>
                    <div className='PPOli_Sea_Card'>
                      <div className='PPOli_Sea_Card_1'>
                        <span className='DDat-IADf'>{formatMonth(selectedDate)}</span>
                        <span>{formatDay(selectedDate)}</span>
                      </div>
                      <div className='PPOli_Sea_Card_2'>
                        <div>
                          <h5>{formatFullDate(selectedDate)}</h5>
                          <h6>
                            {startTime ? formatTime(startTime) : formatTime(getDefaultStartTime())} 
                            {' - '}
                            {endTime ? formatTime(endTime) : '00:00'}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='realTime-Calendar-wrapper'>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => handleDateChange(date, false)}
                      inline
                    />
                  </div>
                </div>
              </div>
            </div>
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
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}
            >
              <h3>Confirm Schedule Details</h3>
              
              <div style={{ margin: '1rem 0' }}>
                <h4>Selected Candidates:</h4>
                <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {currentApplicants.map(applicant => (
                    <li
                      key={`${activeJobId}-${applicant.id}`}
                      className={tempSelectedApplicants.includes(applicant.id) ? 'active-OLI-O' : ''}
                      onClick={() => handleTempApplicantClick(applicant.id)}
                      style={{ cursor: 'pointer', padding: '0.5rem', borderBottom: '1px solid #eee' }}
                    >
                      {applicant.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ margin: '1rem 0' }}>
                <h4>Schedule Details:</h4>
                <p>Date: {formatFullDate(tempSelectedDate)}</p>
                <p>Time: {tempStartTime ? formatTime(tempStartTime) : formatTime(getDefaultStartTime())} - {tempEndTime ? formatTime(tempEndTime) : 'Not selected'}</p>
                
                <div className='ppol-Btns' style={{ marginTop: '1rem' }}>
                  <div className="time-select-container" ref={modalTimeDropdownRef}>
                    <button onClick={handleModalTimeButtonClick}>
                      {modalTimeSelectionMode === 'start' ? 'Start Time' : 'End Time'} 
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

                <div className='realTime-Calendar-wrapper' style={{ marginTop: '1rem' }}>
                  <DatePicker
                    selected={tempSelectedDate}
                    onChange={(date) => handleDateChange(date, true)}
                    inline
                  />
                </div>
              </div>

              {errorMessage && (
                <p style={{ color: 'red', margin: '1rem 0' }}>
                  {errorMessage}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmSchedule}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    background: '#2563eb',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Proceed
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

