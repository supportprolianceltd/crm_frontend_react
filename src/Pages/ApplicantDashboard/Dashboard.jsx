import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import CountUp from 'react-countup';
import usePageTitle from '../../hooks/useMainPageTitle';
import {
  ChevronRightIcon,
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import './Dashboard.css';
import DailySchedule from './ScheduleTable';
import ComplianceCheckTable from './ComplianceCheckTable';
import JobDecision from './JobDecision';
import InterviewCalendar from './InterviewCalendar';

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
        transition={{ duration: 1, ease: 'easeInOut' }}
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
const Alert = ({ message, type = 'success' }) => {
  return (
    <motion.div
      className={`alert alert-${type}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#7226FF' : '#f44336',
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

// Animation variants for slide-down effect
const slideDownVariants = {
  hidden: { y: -5, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stepTitles = [
  'Job Application',
  'Document Uploads',
  'Interview',
  'Compliance Check',
  'Decision',
];

const Dashboard = () => {
  usePageTitle('Applicant Dashboard');
  const { job_application_code, email, unique_link } = useParams();
  const [activeCard, setActiveCard] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // Calculate step percentages based on data
  const getStepPercentages = (data) => {
    if (!data) return [0, 0, 0, 0, 0];
    return [
      100, // Job Application: Always 100% if data is fetched
      data.job_application.documents.length >= data.job_requisition.documents_required.length ? 100 : 50,
      data.schedule_count > 0 ? 50 : 0, // Interview: 50% if scheduled, 0% if not
      data.job_requisition.compliance_checklist.every((item) =>
        data.job_application.documents.some((doc) => doc.document_type === item)
      ) ? 100 : 0, // Compliance Check: 100% if all required documents uploaded
      data.job_application.status === 'hired' ? 100 : 0, // Decision: 100% if hired
    ];
  };

  const stepPercentages = data ? getStepPercentages(data) : [0, 0, 0, 0, 0];

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:9090/api/talent-engine-job-applications/applications/code/${job_application_code}/email/${email}/with-schedules/schedules/?unique_link=${unique_link}`
        );
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch application data');
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [job_application_code, email, unique_link]);

  // Function to generate initials from full name
  const getInitials = (fullName) => {
    if (!fullName) return 'NA';
    const nameParts = fullName.trim().split(' ').filter(part => part);
    if (nameParts.length === 0) return 'NA';
    if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || 'NA';
    return `${nameParts[0][0]?.toUpperCase() || ''}${nameParts[nameParts.length - 1][0]?.toUpperCase() || ''}` || 'NA';
  };

  const handleCardClick = (cardNumber) => {
    setActiveCard(cardNumber);
  };

  if (loading) {
    return <div className="Applicant-Dashboard">Loading...</div>;
  }

  if (error) {
    return (
      <div className="Applicant-Dashboard">
        <div className="site-container">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Applicant-Dashboard">
      <div className="site-container">
        <div className="AAPpl-NAvsb">
          <div className="AAPpl-NAvsb-Main">
            <div className="AAPpl-NAvsb-1">
              <span>{data ? getInitials(data.job_application.full_name) : 'NA'}</span>
            </div>
            <div className="AAPpl-NAvsb-2">
              <h3>{data?.job_application.full_name || 'N/A'}</h3>
              <p>{data?.job_application.email || 'N/A'}</p>
            </div>
            <div className="AAPpl-NAvsb-3"></div>
          </div>
        </div>
        <div className="GHH-Top-GTga">
          <p>
            <Link to="/">Kaeft</Link>
            <ChevronRightIcon className="chevron-icon" />
            <Link to="/application-dashboard">Applications</Link>
            <ChevronRightIcon className="chevron-icon" />
            <span>{data.job_requisition.title}</span>
          </p>
        </div>

        <div className="OLIK-NAVVVB">
          {stepTitles.map((title, index) => (
            <button
              key={index}
              className={activeCard === index + 1 ? 'active-OLika' : ''}
              onClick={() => handleCardClick(index + 1)}
            >
              {title}
            </button>
          ))}
        </div>

        <div className="Gyhat-HG">
          <h3>{data.job_requisition.title}</h3>
          <p>
            Application Progress: <span><CountUp end={Math.max(...stepPercentages)} duration={2} />%</span>
          </p>
        </div>

        <div className="oik-pa">
          <p>
            Posted by: <a href="#">{data.job_requisition.company_name}</a>
          </p>
        </div>

        <div className="GYhh-Cardss-SesC">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`GYhh-Card ${activeCard === num ? 'active' : ''}`}
              onClick={() => handleCardClick(num)}
            >
              <div className="progress-Chat">
                <CircularProgress
                  percentage={stepPercentages[num - 1]}
                  color="#7226FF"
                  number={num}
                  isActive={activeCard === num}
                />
              </div>
              <p>
                <CountUp end={stepPercentages[num - 1]} duration={2} />% {stepTitles[num - 1]}
              </p>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showAlert && <Alert message="Link copied" />}
        </AnimatePresence>

        {activeCard === 1 && (
          <motion.div
            className="OL-Boxas"
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="OL-Boxas-Top">
              <h3>
                Job Application{' '}
                <span>
                  Progress: 100%{' '}
                  <b className="completed">
                    Completed <CheckIcon className="w-4 h-4 ml-1" />
                  </b>
                </span>
              </h3>
              <p>
                You've successfully completed the first phase of your application for the{' '}
                {data.job_requisition.title} role.
              </p>
            </div>

            <div className="OL-Boxas-Body">
              <div className="Ol-Boxxx-Forms">
                <div className="Grga-INpu-Grid">
                  <div className="GHuh-Form-Input">
                    <label>
                      Full Name
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type="text" name="fullName" value={data.job_application.full_name} readOnly />
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>
                      Email Address
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type="email" name="email" value={data.job_application.email} readOnly />
                  </div>
                </div>
                <div className="Grga-INpu-Grid">
                  <div className="GHuh-Form-Input">
                    <label>
                      Phone Number
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input type="tel" name="phone" value={data.job_application.phone || 'N/A'} readOnly />
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>
                      Date of Birth
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={data.job_application.date_of_birth || ''}
                      readOnly
                    />
                  </div>
                </div>
                <div className="Grga-INpu-Grid">
                  <div className="GHuh-Form-Input">
                    <label>
                      Qualification
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={data.job_application.qualification || 'N/A'}
                      readOnly
                    />
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>
                      Experience
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={data.job_application.experience || 'N/A'}
                      readOnly
                    />
                  </div>
                </div>
                <div className="Grga-INpu-Grid">
                  <div className="GHuh-Form-Input">
                    <label>
                      Knowledge/Skill
                      <span className="label-Sopppan">
                        Checked <CheckIcon className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <input
                      type="text"
                      name="knowledgeSkill"
                      value={data.job_application.knowledge_skill || 'N/A'}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeCard === 2 && (
          <motion.div
            className="OL-Boxas"
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="OL-Boxas-Top">
              <h3>
                Document Uploads{' '}
                <span>
                  Progress: {stepPercentages[1]}%{' '}
                  <b className={stepPercentages[1] === 100 ? 'completed' : 'pending'}>
                    {stepPercentages[1] === 100 ? 'Completed' : 'Pending'}{' '}
                    <CheckIcon className="w-4 h-4 ml-1" />
                  </b>
                </span>
              </h3>
              <p>
                You've {stepPercentages[1] === 100 ? 'successfully uploaded all' : 'partially uploaded the'} required
                supporting documents for your application.
              </p>
            </div>
            <div className="OL-Boxas-Body">
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
                  {data.job_application.documents.map((doc, index) => (
                    <tr key={doc.id || index}>
                      <td>{index + 1}</td>
                      <td>{doc.document_type}</td>
                      <td>{doc.file_url.split('/').pop()}</td>
                      <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                      <td>{doc.file_url.split('.').pop().toUpperCase()}</td>
                      <td>
                        <span className="label-Sopppan">
                          Checked <CheckIcon className="w-4 h-4 ml-1" />
                        </span>
                      </td>
                      <td>
                        <div className="gen-td-btns">
                          <button
                            className="link-btn btn-primary-bg"
                            onClick={() => window.open(doc.file_url, '_blank')}
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
          </motion.div>
        )}

        {activeCard === 3 && (
          <motion.div
            className="OL-Boxas"
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="OL-Boxas-Top">
              <h3>
                Interview{' '}
                <span>
                  Progress: {stepPercentages[2]}%{' '}
                  <b className={stepPercentages[2] === 50 ? 'pending' : 'not-started'}>
                    {stepPercentages[2] === 50 ? 'Pending' : 'Not Started'}{' '}
                    <ClockIcon className="w-4 h-4 ml-1" />
                  </b>
                </span>
              </h3>
              <p>
                {data.schedules.length > 0
                  ? `You are invited to interview for the ${data.job_requisition.title} role at ${data.job_requisition.company_name} — Scheduled for ${new Date(data.schedules[0].interview_date_time).toLocaleString()}.`
                  : `No interview has been scheduled yet for the ${data.job_requisition.title} role.`}
              </p>
            </div>
            <div className="OL-Boxas-Body">
              {data.schedules.length > 0 ? (
                <div className="OUjauj-DAS">
                  <div className="OUjauj-DAS-1">
                    <div className="OUjauj-DAS-1Main">
                      <div className="Calender-Dspy">
                        <InterviewCalendar interviewDate={new Date(data.schedules[0].interview_date_time)} />
                      </div>
                      <div className="OUauj-Biaoo">
                        <h3>Scheduled for this day:</h3>
                        <div className="OUauj-Biaoo-ManD">
                          <h4>Date and Time</h4>
                          <p>{new Date(data.schedules[0].interview_date_time).toLocaleString()}</p>
                        </div>
                        <div className="OUauj-Biaoo-ManD">
                          <h4>
                            Location <span>{data.schedules[0].meeting_mode}</span>
                          </h4>
                          {data.schedules[0].meeting_link && (
                            <>
                              <h6
                                className="Gen-Boxshadow"
                                onClick={() => {
                                  navigator.clipboard.writeText(data.schedules[0].meeting_link);
                                  setShowAlert(true);
                                  setTimeout(() => setShowAlert(false), 2000);
                                }}
                              >
                                <span className="meeting-link">{data.schedules[0].meeting_link}</span>
                              </h6>
                              <button
                                className="launch-meeting-btn btn-primary-bg"
                                onClick={() => window.open(data.schedules[0].meeting_link, '_blank')}
                              >
                                Launch Meeting
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="OUjauj-DAS-2">
                    <div className="HYha-POla">
                      <div className="HYha-POla-Main">
                        <DailySchedule schedules={data.schedules} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No interviews scheduled yet.</p>
              )}
            </div>
          </motion.div>
        )}

        {activeCard === 4 && (
          <motion.div
            className="OL-Boxas"
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="OL-Boxas-Top ooik-PPOla">
              <h3>
                Compliance Check <span>Progress: {stepPercentages[3]}%</span>
              </h3>
              <p>
                As part of the final stages of our recruitment process, we kindly request that you upload the listed
                documents for a mandatory compliance check.
              </p>
            </div>
            <div className="OL-Boxas-Body">
              <ComplianceCheckTable complianceChecklist={data.job_requisition.compliance_checklist} />
            </div>
          </motion.div>
        )}

        {activeCard === 5 && (
          <motion.div
            className="OL-Boxas"
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="OL-Boxas-Top ooik-PPOla LLok-PPola">
              <h3>
                Decision <span>Progress: {stepPercentages[4]}%</span>
              </h3>
            </div>
            <div className="OL-Boxas-Body">
              <JobDecision jobApplication={data.job_application} jobRequisition={data.job_requisition} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;