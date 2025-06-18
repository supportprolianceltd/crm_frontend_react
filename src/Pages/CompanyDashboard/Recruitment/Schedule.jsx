import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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
  const [timeSelectionMode, setTimeSelectionMode] = useState('start');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [jobs, setJobs] = useState(jobList);
  const [errorMessage, setErrorMessage] = useState('');
  const timeDropdownRef = useRef(null);

  const activeJob = jobs.find(job => job.id === activeJobId);
  const currentApplicants = activeJob ? activeJob.applicants : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setShowTimeDropdown(false);
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

  const handleTimeSelect = (time) => {
    if (timeSelectionMode === 'start') {
      setStartTime(time);
      setTimeSelectionMode('end');
    } else {
      setEndTime(time);
      setTimeSelectionMode('start');
      setShowTimeDropdown(false);
    }
    setErrorMessage('');
  };

  const applySchedule = () => {
    if (!startTime) {
      setErrorMessage('Please select a start time for the interview.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // Hide error after 3 seconds
      return;
    }

    const scheduleString = `${formatFullDate(selectedDate)} - ${formatTime(startTime)}`;
    
    const applicantsToUpdate = selectedApplicants.length > 0 
      ? selectedApplicants 
      : currentApplicants.map(applicant => applicant.id);

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

    // Reset selection
    setStartTime(null);
    setEndTime(null);
    setTimeSelectionMode('start');
    setShowTimeDropdown(false);
    setSelectedApplicants([]);
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setStartTime(null);
    setEndTime(null);
    setTimeSelectionMode('start');
    setShowTimeDropdown(false);
    setErrorMessage('');
  };

  return (
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
                            onClick={() => handleTimeSelect(time)}
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
                          {startTime ? formatTime(startTime) : '00:00'} 
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
                    onChange={handleDateChange}
                    inline
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;