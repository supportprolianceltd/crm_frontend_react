import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import usePageTitle from '../../hooks/useMainPageTitle';
import { Link } from 'react-router-dom';
import SampleCV from '../../assets/resume.pdf';
import {
  ChevronRightIcon,
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

const Dashboard = () => {
  usePageTitle();
  const [activeCard, setActiveCard] = useState(3); // Interview as default

  const handleCardClick = (cardNumber) => {
    setActiveCard(cardNumber);
  };

  const handleViewDocument = (url) => {
    window.open(url, '_blank');
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

                <div className='Grga-INpu-Grid'>
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
            <div className='OL-Boxas-Body'></div>
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