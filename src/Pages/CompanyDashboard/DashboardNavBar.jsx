
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LOGO from '../../assets/Img/logo-lite.png';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  UserIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import {
  HomeIcon as HomeIconOutline,
  ChatBubbleLeftRightIcon as ChatIconOutline,
  CalendarDaysIcon as CalendarIconOutline,
  BellIcon as BellIconOutline,
  Cog6ToothIcon as SettingsIconOutline,
} from '@heroicons/react/24/outline';

import RecruitmentIcon from '../../assets/Img/CRMPack/Recruitment.svg';
import ComplianceIcon from '../../assets/Img/CRMPack/Compliance.svg';
import TrainingIcon from '../../assets/Img/CRMPack/Training.svg';
import AssetmanagementIcon from '../../assets/Img/CRMPack/Assetmanagement.svg';
import RosteringIcon from '../../assets/Img/CRMPack/Rostering.svg';
import HRIcon from '../../assets/Img/CRMPack/HR.svg';
import PayrollIcon from '../../assets/Img/CRMPack/Payroll.svg';


const DashboardNavBar = () => {
  const navigate = useNavigate();
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [user, setUser] = useState(null);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const profileRef = useRef(null);
  const chatRef = useRef(null);
  const calendarRef = useRef(null);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        setUser(null);
      }
    }
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowFeaturesDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setActiveButton(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFeatureClick = () => setShowFeaturesDropdown(false);
  const handleProfileClick = () => setShowProfileDropdown(!showProfileDropdown);
  const closeProfileDropdown = () => setShowProfileDropdown(false);

  const handleButtonClick = (button) => {
    setActiveButton((prev) => (prev === button ? null : button));
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken'); // Clear token if used
    closeProfileDropdown();
    navigate('/login');
  };

  const featureLinks = [
    { name: 'Recruitment', icon: RecruitmentIcon, path: '/company/recruitment' },
    { name: 'Compliance', icon: ComplianceIcon, path: '/company/compliance' },
    { name: 'Training', icon: TrainingIcon, path: '/company/training' },
    { name: 'Assets management', icon: AssetmanagementIcon, path: '/company/assets' },
    { name: 'Rostering', icon: RosteringIcon, path: '/company/rostering' },
    { name: 'HR', icon: HRIcon, path: '/company/hr' },
    { name: 'Payroll', icon: PayrollIcon, path: '/company/payroll' },
  ];

const getInitials = (user) => {
  if (!user || typeof user !== 'object') return 'N/A';
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  if (user.email) {
    return user.email.slice(0, 2).toUpperCase();
  }
  return 'N/A';
};

// Get full name from user data
const getFullName = (user) => {
  if (!user || typeof user !== 'object') return 'Unknown';
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.email || 'Unknown';
};

const getPosition = (user) => {
  if (!user || typeof user !== 'object') return 'Unknown';
  if (user.job_role) {
    return `${user.job_role}`;
  }
  return  'staff';
};


  return (
    <div className="DashboardNavBar">
      <nav className="Top-NaV">
        <div className="NaV-1">
          <button
            ref={buttonRef}
            className={`genn-Drop-Togler ${showFeaturesDropdown ? 'active-Gent-Trangl' : ''}`}
            title="Features Launcher"
            onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
          >
            <svg viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.61963 4.65527C10.8288 4.65527 12.6196 6.44613 12.6196 8.65527C12.6196 10.8644 10.8288 12.6553 8.61963 12.6553C6.41049 12.6553 4.61963 10.8644 4.61963 8.65527C4.61963 6.44613 6.41049 4.65527 8.61963 4.65527ZM24.6196 4.65527C26.8288 4.65527 28.6196 6.44613 28.6196 8.65527C28.6196 10.8644 26.8288 12.6553 24.6196 12.6553C22.4104 12.6553 20.6196 10.8644 20.6196 8.65527C20.6196 6.44613 22.4104 4.65527 24.6196 4.65527ZM44.6196 8.65527C44.6196 6.44613 42.8288 4.65527 40.6196 4.65527C38.4104 4.65527 36.6196 6.44613 36.6196 8.65527C36.6196 10.8644 38.4104 12.6553 40.6196 12.6553C42.8288 12.6553 44.6196 10.8644 44.6196 8.65527ZM8.61963 20.6553C10.8288 20.6553 12.6196 22.4461 12.6196 24.6553C12.6196 26.8645 10.8288 28.6553 8.61963 28.6553C6.41049 28.6553 4.61963 26.8645 4.61963 24.6553C4.61963 22.4461 6.41049 20.6553 8.61963 20.6553ZM28.6196 24.6553C28.6196 22.4461 26.8288 20.6553 24.6196 20.6553C22.4104 20.6553 20.6196 22.4461 20.6196 24.6553C20.6196 26.8645 22.4104 28.6553 24.6196 28.6553C26.8288 28.6553 28.6196 26.8645 28.6196 24.6553ZM40.6196 20.6553C42.8288 20.6553 44.6196 22.4461 44.6196 24.6553C44.6196 26.8645 42.8288 28.6553 40.6196 28.6553C38.4104 28.6553 36.6196 26.8645 36.6196 24.6553C36.6196 22.4461 38.4104 20.6553 40.6196 20.6553ZM12.6196 40.6553C12.6196 38.4461 10.8288 36.6553 8.61963 36.6553C6.41049 36.6553 4.61963 38.4461 4.61963 40.6553C4.61963 42.8645 6.41049 44.6553 8.61963 44.6553C10.8288 44.6553 12.6196 42.8645 12.6196 40.6553ZM24.6196 36.6553C26.8288 36.6553 28.6196 38.4461 28.6196 40.6553C28.6196 42.8645 26.8288 44.6553 24.6196 44.6553C22.4104 44.6553 20.6196 42.8645 20.6196 40.6553C20.6196 38.4461 22.4104 36.6553 24.6196 36.6553ZM44.6196 40.6553C44.6196 38.4461 42.8288 36.6553 40.6196 36.6553C38.4104 36.6553 36.6196 38.4461 36.6196 40.6553C36.6196 42.8645 38.4104 44.6553 40.6196 44.6553C42.8288 44.6553 44.6196 42.8645 44.6196 40.6553Z"
              />
            </svg>
          </button>

          <Link to="/" className="Nav-Brand">
            <img src={LOGO} alt="logo" />
            <span>crm</span>
          </Link>

          <AnimatePresence>
            {showFeaturesDropdown && (
              <motion.div
                ref={dropdownRef}
                className="genn-Drop-Sec Gen-Boxshadow"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="genn-Drop-Search">
                  <span>
                    <MagnifyingGlassIcon />
                  </span>
                  <input type="text" placeholder="Find CRM Features" />
                </div>
                <div className="feat-Main">
                  {featureLinks.map(({ name, icon, path }, idx) => (
                    <Link to={path} onClick={handleFeatureClick} key={idx}>
                      <img src={icon} alt={name} />
                      <p>{name}</p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="NaV-2">
          <div className="NaV-2-Icons">
            <Link to="/company" title="Home">
              <HomeIconOutline className="h-6 w-6" />
            </Link>

            <span
              ref={chatRef}
              title="Chat"
              className={`cursor-pointer ${activeButton === 'chat' ? 'active' : ''}`}
              onClick={() => handleButtonClick('chat')}
            >
              <ChatIconOutline className="h-6 w-6" />
            </span>

            <span
              ref={calendarRef}
              title="Calendar"
              className={`cursor-pointer ${activeButton === 'calendar' ? 'active' : ''}`}
              onClick={() => handleButtonClick('calendar')}
            >
              <CalendarIconOutline className="h-6 w-6" />
            </span>

            <Link to="/notifications" title="Notifications">
              <BellIconOutline className="h-6 w-6" />
            </Link>

            <Link to="/settings" title="Settings">
              <SettingsIconOutline className="h-6 w-6" />
            </Link>
          </div>

          <div
            className={`NaV-2-Prof ${showProfileDropdown ? 'active-NavProfa' : ''}`}
            onClick={handleProfileClick}
            ref={profileRef}
          >
            <div className="NaV-2-Prof-1">
              <span>{getInitials(user)}</span>
            </div>
            <div className="NaV-2-Prof-2">
              <div>
                <h4>{getFullName(user)}</h4>
                <p>{getPosition(user)}</p>
              </div>
            </div>
            <div className="NaV-2-Prof-3">
              <ChevronDownIcon />
            </div>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  className="All_Drop_Down lkma-oop Gen-Boxshadow"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="All-TTo-Nagbs-main ouj-pia">
                    <div className="All-TTo-Nagbs-1">
                      <span>{getInitials(user)}</span>
                    </div>
                    <div className="All-TTo-Nagbs-2 oujah-osi">
                       <p>{getFullName(user)}</p>
                      <span>{getPosition(user)}</span>
                    </div>
                    <div className="All-TTo-Nagbs-3 ouajjs-sua">
                      <CheckIcon />
                    </div>
                  </div>
                  <Link to="/profile" onClick={closeProfileDropdown}>
                    <UserIcon /> Profile
                  </Link>
                  <Link to="/add-staff" onClick={closeProfileDropdown}>
                    <PlusIcon /> Add a User
                  </Link>
                   <Link to="/create-a-branch" onClick={closeProfileDropdown}>
                    <PencilIcon/> Create a Branch
                  </Link>
                  <button className="logout-btn btn-primary-bg" onClick={handleLogout}>
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardNavBar;