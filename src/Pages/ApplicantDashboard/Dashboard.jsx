import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import usePageTitle from '../../hooks/useMainPageTitle';
import { Route, Routes, Link } from 'react-router-dom';
import { ChevronRightIcon, FolderIcon, PlusCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import './Dashboard.css';

// CountUp component
const CountUp = ({ end, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16); // approx 60fps
    let current = start;

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
                animate={{
                    strokeDashoffset: offset
                }}
                transition={{
                    duration: 1,
                    ease: "easeInOut"
                }}
                style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%'
                }}
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

const Dashboard = () => {
    usePageTitle();

    const [activeCard, setActiveCard] = useState(3);

    const handleCardClick = (cardNumber) => {
        setActiveCard(cardNumber);
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
                    <Link to='/'>
                        <FolderIcon className='icon-nav' />
                        My applications
                    </Link>
                    <Link to='/' className='active-OLika'>
                        <PlusCircleIcon className='icon-nav' />
                        New application
                    </Link>
                    <Link to='/'>
                        <Cog6ToothIcon className='icon-nav' />
                        Settings
                    </Link>
                </div>

                <div className='Gyhat-HG'>
                    <h3>Frontend website developer</h3>
                    <p>Application Progress: <span>90%</span></p>
                </div>

                <div className='oik-pa'>
                    <p>Posted by: <a href='#'>Proliance LTD</a></p>
                </div>

                <div className='GYhh-Cardss-SesC'>
                    <div
                        className={`GYhh-Card ${activeCard === 1 ? 'active' : ''}`}
                        onClick={() => handleCardClick(1)}
                    >
                        <div className='progress-Chat'>
                            <CircularProgress percentage={100} color="#7226FF" number={1} isActive={activeCard === 1} />
                        </div>
                        <p><CountUp end={100} /> Job Application</p>
                    </div>

                    <div
                        className={`GYhh-Card ${activeCard === 2 ? 'active' : ''}`}
                        onClick={() => handleCardClick(2)}
                    >
                        <div className='progress-Chat'>
                            <CircularProgress percentage={100} color="#7226FF" number={2} isActive={activeCard === 2} />
                        </div>
                        <p><CountUp end={100} /> Document Uploads</p>
                    </div>

                    <div
                        className={`GYhh-Card ${activeCard === 3 ? 'active' : ''}`}
                        onClick={() => handleCardClick(3)}
                    >
                        <div className='progress-Chat'>
                            <CircularProgress percentage={50} color="#7226FF" number={3} isActive={activeCard === 3} />
                        </div>
                        <p><CountUp end={50} /> Interview</p>
                    </div>

                    <div
                        className={`GYhh-Card ${activeCard === 4 ? 'active' : ''}`}
                        onClick={() => handleCardClick(4)}
                    >
                        <div className='progress-Chat'>
                            <CircularProgress percentage={0} color="#7226FF" number={4} isActive={activeCard === 4} />
                        </div>
                        <p><CountUp end={0} /> Compliance Check</p>
                    </div>

                    <div
                        className={`GYhh-Card ${activeCard === 5 ? 'active' : ''}`}
                        onClick={() => handleCardClick(5)}
                    >
                        <div className='progress-Chat'>
                            <CircularProgress percentage={0} color="#7226FF" number={5} isActive={activeCard === 5} />
                        </div>
                        <p><CountUp end={0} /> Decision</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
