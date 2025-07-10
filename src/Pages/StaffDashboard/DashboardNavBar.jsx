import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  CheckIcon,
  UserIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import {
  Cog6ToothIcon as SettingsIconOutline,
} from '@heroicons/react/24/outline';

const DashboardNavBar = () => {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const profileRef = useRef(null);

  // Static dummy user data
  const user = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    job_role: 'Staff',
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => setShowProfileDropdown(!showProfileDropdown);
  const closeProfileDropdown = () => setShowProfileDropdown(false);

  // Handle logout (just navigates to /login)
  const handleLogout = () => {
    closeProfileDropdown();
    navigate('/login');
  };

  const getInitials = (user) => {
    if (!user) return 'N/A';
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  };

  const getFullName = (user) => {
    if (!user) return 'Unknown';
    return `${user.first_name} ${user.last_name}`;
  };

  const getPosition = (user) => {
    if (!user) return 'staff';
    return user.job_role || 'staff';
  };

  return (
    <div className="DashboardNavBar">
      <nav className="Top-NaV">
        <div className="NaV-2">
          <div
            className={`NaV-2-Prof ${showProfileDropdown ? 'active-NavProfa' : ''}`}
            onClick={handleProfileClick}
            ref={profileRef}
          >
         <div className="NaV-2-Prof-2 oikaj-PPl">
              <div>
                <h4>{getFullName(user)}</h4>
                <p>{getPosition(user)}</p>
              </div>
            </div>
            <div className="NaV-2-Prof-1">
              <span>{getInitials(user)}</span>
            </div>
            

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  className="All_Drop_Down kjuj-ddrop Gen-Boxshadow"
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
                  <Link to="/staff/profile" onClick={closeProfileDropdown}>
                    <UserIcon /> Profile
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
