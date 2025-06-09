import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LOGO from '../../assets/Img/logo-lite.png';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import {
  HomeIcon as HomeIconOutline,
  ChatBubbleLeftRightIcon as ChatIconOutline,
  CalendarDaysIcon as CalendarIconOutline,
  BellIcon as BellIconOutline,
  Cog6ToothIcon as SettingsIconOutline,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ChatBubbleLeftRightIcon as ChatIconSolid,
  CalendarDaysIcon as CalendarIconSolid,
  BellIcon as BellIconSolid,
  Cog6ToothIcon as SettingsIconSolid,
} from '@heroicons/react/24/solid';

import RecruitmentIcon from '../../assets/Img/CRMPack/Recruitment.svg';
import ComplianceIcon from '../../assets/Img/CRMPack/Compliance.svg';
import TrainingIcon from '../../assets/Img/CRMPack/Training.svg';
import AssetmanagementIcon from '../../assets/Img/CRMPack/Assetmanagement.svg';
import RosteringIcon from '../../assets/Img/CRMPack/Rostering.svg';
import HRIcon from '../../assets/Img/CRMPack/HR.svg';
import PayrollIcon from '../../assets/Img/CRMPack/Payroll.svg';

const DashboardNavBar = () => {
  const [activeIcon, setActiveIcon] = useState('home');
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const profileRef = useRef(null);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setShowFeaturesDropdown(false);
      }

      if (
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
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

  const navItems = [
    {
      id: 'home',
      name: 'Home',
      outline: <HomeIconOutline className="h-6 w-6" />,
      solid: <HomeIconSolid className="h-6 w-6" />,
    },
    {
      id: 'chat',
      name: 'Chat',
      outline: <ChatIconOutline className="h-6 w-6" />,
      solid: <ChatIconSolid className="h-6 w-6" />,
    },
    {
      id: 'calendar',
      name: 'Calendar',
      outline: <CalendarIconOutline className="h-6 w-6" />,
      solid: <CalendarIconSolid className="h-6 w-6" />,
    },
    {
      id: 'bell',
      name: 'Notifications',
      outline: <BellIconOutline className="h-6 w-6" />,
      solid: <BellIconSolid className="h-6 w-6" />,
    },
    {
      id: 'settings',
      name: 'Settings',
      outline: <SettingsIconOutline className="h-6 w-6" />,
      solid: <SettingsIconSolid className="h-6 w-6" />,
    },
  ];

  return (
    <div className='DashboardNavBar'>
      <nav className='Top-NaV'>
        <div className='NaV-1'>
          <button 
          ref={buttonRef}
          className={`genn-Drop-Togler ${showFeaturesDropdown ? 'active-Gent-Trangl' : ''}`}
          title='Features Launcher'
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

          <Link to='/' className='Nav-Brand'>
            <img src={LOGO} alt="logo" />
            <span>crm</span>
          </Link>

          <AnimatePresence>
            {showFeaturesDropdown && (
              <motion.div
                ref={dropdownRef}
                className='genn-Drop-Sec Gen-Boxshadow'
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className='genn-Drop-Search'>
                  <span><MagnifyingGlassIcon /></span>
                  <input type='text' placeholder='Find CRM Features' />
                </div>
                <div className='feat-Main'>
                  {[RecruitmentIcon, ComplianceIcon, TrainingIcon, AssetmanagementIcon, RosteringIcon, HRIcon, PayrollIcon].map((icon, idx) => (
                    <a href='#' onClick={handleFeatureClick} key={idx}>
                      <img src={icon} alt="feature" />
                      <p>{['Recruitment','Compliance','Training','Assets management','Rostering','HR','Payroll'][idx]}</p>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className='NaV-2'>
          <div className='NaV-2-Icons'>
            {navItems.map((item) => {
              const isActive = activeIcon === item.id && !showProfileDropdown;
              return (
                <span
                  key={item.id}
                  onClick={() => {
                    setActiveIcon(item.id);
                    setShowProfileDropdown(false);
                  }}
                  className={`icon-wrapper ${isActive ? 'active' : ''}`}
                  title={item.name}
                >
                  {isActive ? item.solid : item.outline}
                </span>
              );
            })}
          </div>

          <div
            className={`NaV-2-Prof ${showProfileDropdown ? 'active-NavProfa' : ''}`}
            onClick={handleProfileClick}
            ref={profileRef}
          >
            <div className='NaV-2-Prof-1'>
              <span>PG</span>
            </div>
            <div className='NaV-2-Prof-2'>
              <div>
                <h4>Prince Godson</h4>
                <p>Admin</p>
              </div>
            </div>
            <div className='NaV-2-Prof-3'>
              <ChevronDownIcon />
            </div>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  className='All_Drop_Down lkma-oop Gen-Boxshadow'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className='All-TTo-Nagbs-main ouj-pia'>
                    <div className='All-TTo-Nagbs-1'><span>Pg</span></div>
                    <div className='All-TTo-Nagbs-2 oujah-osi'><p>Prince Godson</p><span>Admin</span></div>
                    <div className='All-TTo-Nagbs-3 ouajjs-sua'><CheckIcon /></div>
                  </div>
                  <Link to="" onClick={closeProfileDropdown}><UserIcon />Profile</Link>
                  <Link to="" onClick={closeProfileDropdown}><PlusIcon />Add a Staff</Link>
                  <button className='logout-btn btn-primary-bg' onClick={closeProfileDropdown}>Logout</button>
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
