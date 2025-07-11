import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckIcon,
  UserIcon,
  BellIcon,
  UsersIcon,
  Cog6ToothIcon as SettingsIconOutline,
} from '@heroicons/react/24/outline';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';
import { useClock } from '../../context/ClockContext';

const DashboardNavBar = () => {
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const modalRef = useRef(null);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notificationsCount] = useState(3);
  const [isSwitching, setIsSwitching] = useState(false);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingClockState, setPendingClockState] = useState(null); // true or false

  const { isClockedIn, clockIn, clockOut, clockInTime, clockOutTime } = useClock();

  const [taskCount, setTaskCount] = useState(1); // You can dynamically update this from an API or prop

  // Team initials and shuffle state
  const initialTeam = ['PN', 'Gn', 'Li', 'IF', 'CA'];
  const [team, setTeam] = useState(initialTeam);

  /* helpers */
  const formatTime = (date) =>
    date
      ? date.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : '--:--:--';

  // Shuffle helper function
  const shuffleArray = (arr) => {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Shuffle team members every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTeam((prev) => shuffleArray(prev));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const requestClockToggle = (state) => {
    setPendingClockState(state);
    setConfirmModalOpen(true);
  };

  const handleConfirmedToggle = async () => {
    setConfirmModalOpen(false);
    setIsSwitching(true);
    await new Promise((r) => setTimeout(r, 800));
    pendingClockState ? clockIn() : clockOut();
    setIsSwitching(false);
  };

  /* click‑away handling */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
      if (confirmModalOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        setConfirmModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [confirmModalOpen]);

  /* Clock Toggle sub‑component */
  const ClockToggle = () => (
    <div className="clock-toggle">
      {/* Clock‑Out */}
      <motion.button
        onClick={() => !isSwitching && requestClockToggle(false)}
        className={`clock-btn ${!isClockedIn ? 'active' : ''}`}
        initial={false}
        animate={
          isSwitching
            ? { opacity: 0.7 }
            : isClockedIn
            ? { scale: 1 }
            : { scale: [1, 1.05, 1], transition: { duration: 0.8, repeat: Infinity, repeatType: 'reverse' } }
        }
        whileHover={!isSwitching ? { scale: 1.03 } : {}}
        whileTap={!isSwitching ? { scale: 0.98 } : {}}
      >
        {isSwitching && !isClockedIn ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="spinner"
          />
        ) : (
          <>
            <span>Clock Out</span>
            <small>{formatTime(clockOutTime)}</small>
          </>
        )}
      </motion.button>

      {/* Clock‑In */}
      <motion.button
        onClick={() => !isSwitching && requestClockToggle(true)}
        className={`clock-btn ${isClockedIn ? 'active' : ''}`}
        initial={false}
        animate={
          isSwitching
            ? { opacity: 0.7 }
            : isClockedIn
            ? { scale: [1, 1.05, 1], transition: { duration: 0.8, repeat: Infinity, repeatType: 'reverse' } }
            : { scale: 1 }
        }
        whileHover={!isSwitching ? { scale: 1.03 } : {}}
        whileTap={!isSwitching ? { scale: 0.98 } : {}}
      >
        {isSwitching && isClockedIn ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="spinner"
          />
        ) : (
          <>
            <span>Clock In</span>
            <small>{formatTime(clockInTime)}</small>
          </>
        )}
      </motion.button>

      {/* sliding knob */}
      <motion.span
        layout
        className={`sliding-knob ${isClockedIn ? 'in' : 'out'}`}
        initial={false}
        animate={{
          left: isClockedIn ? '50%' : '0%',
          scale: isSwitching ? [1, 0.95, 1] : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
          scale: { duration: 0.3, repeat: isSwitching ? Infinity : 0, repeatType: 'reverse' },
        }}
      />
    </div>
  );

  const user = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    job_role: 'Staff',
  };

  return (
    <div className="DashboardNavBar">
      <nav className="Top-NaV">
        <div className="NaV-1 All-STtr-NavBA">
          <ClockToggle />
          <h4>{isClockedIn ? 'Welcome back, John!' : 'Good Bye John!'}</h4>
        </div>

        <div className="NaV-2">
          <div className="NaV-2-Icons">
            <Link to="/staff/notifications">
              {notificationsCount > 0 && <i className="nottti-Inddi" />}
              <BellIcon />
            </Link>
          </div>

          <div className="NaV-2-Icons">
            <Link to="/staff/settings">
              <SettingsIconOutline />
            </Link>
          </div>

          {/* profile */}
          <div
            className={`NaV-2-Prof ${showProfileDropdown ? 'active-NavProfa' : ''}`}
            onClick={() => setShowProfileDropdown((s) => !s)}
            ref={profileRef}
          >
            <div className="NaV-2-Prof-2 oikaj-PPl">
              <div>
                <h4>
                  {user.first_name} {user.last_name}
                </h4>
                <p>{user.job_role}</p>
              </div>
            </div>
            <div className="NaV-2-Prof-1">
              <span>
                {user.first_name[0]}
                {user.last_name[0]}
              </span>
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
                      <span>
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </span>
                    </div>
                    <div className="All-TTo-Nagbs-2 oujah-osi">
                      <p>
                        {user.first_name} {user.last_name}
                      </p>
                      <span>{user.job_role}</span>
                    </div>
                    <div className="All-TTo-Nagbs-3 ouajjs-sua">
                      <CheckIcon />
                    </div>
                  </div>
                  <Link to="/staff/profile">
                    <UserIcon /> Profile
                  </Link>
                  <button className="logout-btn btn-primary-bg" onClick={() => navigate('/login')}>
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModalOpen && (
          <motion.div
            className="clock-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="clock-modal-content"
              initial={{ scale: 0.8, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              ref={modalRef}
            >
              <h3>Confirm Action</h3>
              <p>
                Are you sure you want to <strong>{pendingClockState ? 'Clock In' : 'Clock Out'}</strong>?
              </p>
              <div className="clock-modal-buttons">
                <button className="btn-secondary" onClick={() => setConfirmModalOpen(false)}>
                  Cancel
                </button>
                <button
                  className={`btn-primary ${pendingClockState ? 'btn-primary-bg' : 'btn-primary-bg'}`}
                  onClick={handleConfirmedToggle}
                >
                  Yes, Proceed
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="Team-MMen-Sec">
        <div className="Team-MMen-Sec-Container">
          <div className="Team-MMen-PPart-1">
            <h3>
              Today's Task
              <span>
                <ArrowPathRoundedSquareIcon />
                {taskCount > 0 && <b>{taskCount}</b>}
              </span>
            </h3>
            {taskCount > 0 && <Link to="">See Task</Link>}
          </div>
          <div className="Team-MMen-PPart-2">
            <div className="SlomTTeam-Cont" title="My Team">
              <h4>Team</h4>
              <ul
              >
                <AnimatePresence>
                  {team.map((member) => (
                    <motion.li
                      key={member}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 1.2 }}
                    >
                      <span>{member}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <p>
                <UsersIcon />
                <span>{team.length > 5 ? '5+' : team.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavBar;
