import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePageTitle from '../../hooks/useMainPageTitle';
import { Link } from 'react-router-dom';
import SampleCV from '../../assets/resume.pdf';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import './Dashboard.css';

// CountUp component
const CountUp = ({ end, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = end / (duration / 16); // ~60fps
    const counter = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(counter);
  }, [end, duration]);

  return <span>{count}%</span>;
};

// CircularProgress component
const CircularProgress = ({ size = 70, strokeWidth = 6, percentage = 75, color = '#7226FF', number = 1, isActive }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="circular-progress">
      <circle
        stroke="#ebe6ff"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="23"
        fontWeight="500"
        fill={isActive ? '#7226FF' : '#111827'}
      >
        {number}
      </text>
    </svg>
  );
};

// Alert component for Framer Motion
const Alert = ({ message, onClose }) => {
  return (
    <motion.div
      className="alert"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#7226FF',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      {message}
    </motion.div>
  );
};

const stepTitles = [
  'Job Application',
  'Document Uploads',
  'Interview',
  'Compliance Check',
  'Decision',
];

const stepPercentages = [100, 100, 50, 0, 0];

const documentList = [
  {
    id: 1,
    type: 'CV',
    name: 'Curriculum Vitae',
    date: 'June 25, 2025',
    format: 'PDF',
    url: SampleCV,
  },
  {
    id: 2,
    type: 'Date of Birth',
    name: 'Birth Certificate',
    date: 'June 25, 2025',
    format: 'JPG',
    url: SampleCV,
  },
  {
    id: 3,
    type: 'Passport Photo',
    name: 'Passport Image',
    date: 'June 25, 2025',
    format: 'PNG',
    url: SampleCV,
  },
  {
    id: 4,
    type: 'National ID',
    name: 'NIN Slip',
    date: 'June 25, 2025',
    format: 'PDF',
    url: SampleCV,
  },
  {
    id: 5,
    type: 'Academic Transcript',
    name: 'University Transcript',
    date: 'June 25, 2025',
    format: 'PDF',
    url: SampleCV,
  },
];

// Calendar Component
const InterviewCalendar = ({ interviewDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(interviewDate);
  
  // Get current month and year
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  
  // Get the last day of the month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  
  // Get the last day of previous month
  const lastDayOfPrevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  );
  
  // Generate days array including previous and next month days
  const days = [];
  
  // Previous month days
  const prevMonthDays = firstDayOfMonth.getDay();
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const day = lastDayOfPrevMonth.getDate() - i;
    days.push({
      date: new Date(
        lastDayOfPrevMonth.getFullYear(),
        lastDayOfPrevMonth.getMonth(),
        day
      ),
      isCurrentMonth: false
    });
  }
  
  // Current month days
  const daysInMonth = lastDayOfMonth.getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      ),
      isCurrentMonth: true
    });
  }
  
  // Next month days
  const nextMonthDays = 42 - days.length;
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push({
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        i
      ),
      isCurrentMonth: false
    });
  }
  
  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    ));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    ));
  };
  
  // Check if a date is the interview date
  const isInterviewDate = (date) => {
    return (
      date.getDate() === interviewDate.getDate() &&
      date.getMonth() === interviewDate.getMonth() &&
      date.getFullYear() === interviewDate.getFullYear()
    );
  };
  
  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h3>{month} {year}</h3>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      
      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-days">
        {days.map((dayObj, index) => {
          const day = dayObj.date.getDate();
          const isCurrentMonth = dayObj.isCurrentMonth;
          const isInterview = isInterviewDate(dayObj.date);
          
          return (
            <div 
              key={index} 
              className={`calendar-day 
                ${isCurrentMonth ? '' : 'other-month'} 
                ${isInterview ? 'interview-day' : ''}
                ${dayObj.date.getDate() === selectedDate?.getDate() && 
                  dayObj.date.getMonth() === selectedDate?.getMonth() && 
                  dayObj.date.getFullYear() === selectedDate?.getFullYear() 
                  ? 'selected' : ''}`}
            >
              {day}
              {isInterview && (
                <div className="interview-time">
                  {formatTime(interviewDate)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  usePageTitle();
  const [activeCard, setActiveCard] = useState(3);
  const [showAlert, setShowAlert] = useState(false);
  
  // Set interview date to June 26, 2025 at 1:02 PM
  const interviewDate = new Date(2025, 5, 26, 13, 2);
  // Dynamic meeting link
  const meetingLink = 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_NjA1Nzk4YzItNzU5Zi00YjQzLWEzNjEtNjAxODc1NDVhNDk2%40thread.v2/0?context=%7b%22Tid%22%3a%22d1234567-abcd-8901-efgh-1234567890ab%22%2c%22Oid%22%3a%2298765432-abcd-1234-efgh-0987654321cd%22%7d';

  const handleCardClick = (cardNumber) => {
    setActiveCard(cardNumber);
  };

  const handleViewDocument = (url) => {
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink)
      .then(() => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000); // Hide alert after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
        alert('Failed to copy link. Please try again.');
      });
  };

  const handleLaunchMeeting = () => {
    window.open(meetingLink, '_blank');
  };

  // Animation variants for slide-down effect
  const slideDownVariants = {
    hidden: { y: -5, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className='Applicant-Dashboard'>
      <div className='site-container'>
        <div className='GHH-Top-GTga'>
          <p>
            <Link to='/'>Kaeft</Link>
            <ChevronRightIcon className='chevron-icon' />
            <Link to='/'>My applications</Link>
            <ChevronRightIcon className='chevron-icon' />
            <span>Frontend website developer</span>
          </p>
        </div>

        <div className='OLIK-NAVVVB'>
          <Link to='/'><FolderIcon className='icon-nav' /> My applications</Link>
          <Link to='/' className='active-OLika'><PlusCircleIcon className='icon-nav' /> New application</Link>
          <Link to='/'><Cog6ToothIcon className='icon-nav' /> Settings</Link>
        </div>

        <div className='Gyhat-HG'>
          <h3>Frontend website developer</h3>
          <p>Application Progress: <span>90%</span></p>
        </div>

        <div className='oik-pa'>
          <p>Posted by: <a href='#'>Proliance LTD</a></p>
        </div>

        <div className='GYhh-Cardss-SesC'>
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`GYhh-Card ${activeCard === num ? 'active' : ''}`}
              onClick={() => handleCardClick(num)}
            >
              <div className='progress-Chat'>
                <CircularProgress
                  percentage={stepPercentages[num - 1]}
                  color="#7226FF"
                  number={num}
                  isActive={activeCard === num}
                />
              </div>
              <p>
                <CountUp end={stepPercentages[num - 1]} /> {stepTitles[num - 1]}
              </p>
            </div>
          ))}
        </div>

        {/* Alert Component */}
        <AnimatePresence>
          {showAlert && <Alert message="Link copied" />}
        </AnimatePresence>

        {/* === Independent Box Sections === */}
        {activeCard === 1 && (
          <motion.div
            className='OL-Boxas'
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
          >
            <div className='OL-Boxas-Top'>
              <h3>Job Application <span>Progress: 100% <b className='completed'>Completed <CheckIcon /></b></span></h3>
              <p>You’ve successfully completed the first phase of your application for the Frontend Website Developer role. All required application information has been submitted and confirmed.</p>
            </div>

            <div className='OL-Boxas-Body'>
              <form className='Ol-Boxxx-Forms'>
                <div className='Grga-INpu-Grid'>
                  <div className="GHuh-Form-Input">
                    <label>
                      Full Name
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type='text' name='fullName' value='Prince Godson' readOnly />
                  </div>

                  <div className="GHuh-Form-Input">
                    <label>
                      Email Address
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type='email' name='email' value='prince@example.com' readOnly />
                  </div>
                </div>

                <div className='Grga-INpu-Grid'>
                  <div className="GHuh-Form-Input">
                    <label>
                      Confirm Email Address
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type='email' name='confirmEmail' value='prince@example.com' readOnly />
                  </div>

                  <div className="GHuh-Form-Input">
                    <label>
                      Phone Number
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type='tel' name='phone' value='+2348012345678' readOnly />
                  </div>
                </div>

                <div className='Grga-INpu-Grid'>
                  <div className="GHuh-Form-Input">
                    <label>
                      Date of Birth
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type='date' name='dob' value='1998-07-15' readOnly />
                  </div>

                  <div className="GHuh-Form-Input">
                    <label>
                      Qualification
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type='text' name='qualification' value='B.Sc. Computer Science' readOnly />
                  </div>
                </div>

                <div className='Grga-INpu-Grid'>
                  <div className="GHuh-Form-Input">
                    <label>
                      Experience
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type='text' name='experience' value='4 years' readOnly />
                  </div>

                  <div className="GHuh-Form-Input">
                    <label>
                      Knowledge/Skill
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type='text' name='knowledgeSkill' value='React, JavaScript, Tailwind CSS, Figma' readOnly />
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
        
        {activeCard === 2 && (
          <motion.div
            className='OL-Boxas'
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
          >
            <div className='OL-Boxas-Top'>
              <h3>
                Document Uploads
                <span>
                  Progress: 100% <b className='completed'>Completed <CheckIcon /></b>
                </span>
              </h3>
              <p>You’ve successfully uploaded all required supporting documents for your application.</p>
            </div>

            <div className='OL-Boxas-Body'>
              <div className="table-container">
                <table className="Gen-Sys-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Document Type</th>
                      <th>Document Name</th>
                      <th>Upload Date</th>
                      <th>File Format</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentList.map((doc, index) => (
                      <tr key={doc.id}>
                        <td>{index + 1}</td>
                        <td>{doc.type}</td>
                        <td>{doc.name}</td>
                        <td>{doc.date}</td>
                        <td>{doc.format}</td>
                        <td>
                          <span className="label-Sopppan">
                            Checked <CheckIcon className="w-4 h-4 ml-1" />
                          </span>
                        </td>
                        <td>
                          <div className="gen-td-btns">
                            <button
                              className="link-btn btn-primary-bg"
                              onClick={() => handleViewDocument(doc.url)}
                            >
                              View Document
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeCard === 3 && (
          <motion.div
            className='OL-Boxas'
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
          >
            <div className='OL-Boxas-Top'>
              <h3>Interview <span>Progress: 50% <b className='pending'>Pending <ClockIcon /></b></span></h3>
              <p>Your next step is the Interview phase, which is currently at 50% completion. Please monitor your email and application dashboard for further updates or interview scheduling.</p>
            </div>
            <div className='OL-Boxas-Body'>
              <div className='OUjauj-DAS'>
                <div className='OUjauj-DAS-1'>
                  <div className='Calender-Dspy'>
                    <InterviewCalendar interviewDate={interviewDate} />
                  </div>
                  <div className='OUauj-Biaoo'>
                    <h3>Scheduled for this day:</h3>
                    <div className='OUauj-Biaoo-ManD'>
                      <h4>Date and Time</h4>
                      <p>26, June 2025 - 1:02 PM</p>
                    </div>
                    <div className='OUauj-Biaoo-ManD'>
                      <h4>Location <span>Virtual</span></h4>
                      <h6 className='Gen-Boxshadow'>
                        <span className="meeting-link" onClick={handleCopyLink} aria-label="Copy meeting link">{meetingLink}</span>
                      </h6>
                      <button className="launch-meeting-btn btn-primary-bg" onClick={handleLaunchMeeting} aria-label="Launch virtual meeting">Launch Meeting</button>
                    </div>
                  </div>
                </div>
                <div className='Meeting-Box'></div>
              </div>
            </div>
          </motion.div>
        )}

        {activeCard === 4 && (
          <motion.div
            className='OL-Boxas'
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
          >
            <div className='OL-Boxas-Top'>
              <h3>Compliance Check <span>Progress: 0%</span></h3>
              <p>The compliance check has not yet started. You will be notified once this stage begins.</p>
            </div>
            <div className='OL-Boxas-Body'></div>
          </motion.div>
        )}

        {activeCard === 5 && (
          <motion.div
            className='OL-Boxas'
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
          >
            <div className='OL-Boxas-Top'>
              <h3>Decision <span>Progress: 0%</span></h3>
              <p>Final decisions will be made and communicated once previous stages are complete.</p>
            </div>
            <div className='OL-Boxas-Body'></div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;