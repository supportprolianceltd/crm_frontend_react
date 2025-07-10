import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LOGO from '../../assets/Img/logo-lite.png';

import {
  HomeIcon as HomeOutline,
  ClipboardDocumentIcon as ClipboardOutline,
  UserGroupIcon as UserGroupOutline,
  CalendarDaysIcon as CalendarOutline,
  UsersIcon as UsersOutline,
  ClockIcon as ClockOutline,
  BellIcon as BellOutline,
  Cog6ToothIcon as SettingsOutline,
  InboxIcon,
  UserCircleIcon,
  ArrowPathIcon,
  ArrowLongRightIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

import {
  HomeIcon as HomeSolid,
  ClipboardDocumentIcon as ClipboardSolid,
  UserGroupIcon as UserGroupSolid,
  CalendarDaysIcon as CalendarSolid,
  UsersIcon as UsersSolid,
  ClockIcon as ClockSolid,
  BellIcon as BellSolid,
  Cog6ToothIcon as SettingsSolid,
  InboxIcon as InboxSolid,
  UserCircleIcon as UserCircleSolid,
} from '@heroicons/react/24/solid';

const iconClass = 'w-5 h-5';
const basePath = '/staff';

const SideNavBar = ({ setShrinkNav }) => {
  const location = useLocation();

  // Hardcoded notification count (replace with real data)
  const notificationCount = 0;

  let relativePath = location.pathname.startsWith(basePath)
    ? location.pathname.slice(basePath.length)
    : location.pathname;
  if (relativePath.startsWith('/')) relativePath = relativePath.slice(1);

  const initialActive = relativePath === '' ? 'dashboard' : relativePath.split('/')[0];
  const [active, setActive] = useState(initialActive);
  const [menuToggled, setMenuToggled] = useState(false);
  const [showOtherMenu, setShowOtherMenu] = useState(false);
  const [rosterRefreshing, setRosterRefreshing] = useState(false);

  const rosterTimerRef = useRef(null);

  useEffect(() => {
    let relPath = location.pathname.startsWith(basePath)
      ? location.pathname.slice(basePath.length)
      : location.pathname;
    if (relPath.startsWith('/')) relPath = relPath.slice(1);
    const current = relPath === '' ? 'dashboard' : relPath.split('/')[0];
    if (current !== 'clock-in') setActive(current);
  }, [location]);

  // Clear timer on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (rosterTimerRef.current) clearTimeout(rosterTimerRef.current);
    };
  }, []);

  const renderIcon = (name, OutlineIcon, SolidIcon) =>
    active === name ? (
      <SolidIcon className={iconClass} />
    ) : (
      <OutlineIcon className={iconClass} />
    );

  const MenuItem = ({ name, label, OutlineIcon, SolidIcon, to, onClick, badge }) => {
    const isClockIn = name === 'clock-in';
    const isRoster = name === 'roster';
    const specialClass = isClockIn ? 'special-clock-in' : '';
    const isActive = !isClockIn && active === name;

    return (
      <li className={`${isActive ? 'active' : ''} ${specialClass}`} >
        <Link
          to={to}
          className="flex items-center justify-between"
          title={menuToggled ? label : undefined}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick();
            }
            if (isRoster) {
              if (rosterTimerRef.current) clearTimeout(rosterTimerRef.current);
              setRosterRefreshing(true);
              rosterTimerRef.current = setTimeout(() => {
                setRosterRefreshing(false);
                rosterTimerRef.current = null;
              }, 1000);
              setActive(name);
            } else {
              if (rosterTimerRef.current) {
                clearTimeout(rosterTimerRef.current);
                rosterTimerRef.current = null;
              }
              setRosterRefreshing(false);
              if (!isClockIn) setActive(name);
            }
          }}
        >
          <span className="LefB-Icon">
            {isClockIn ? (
              <ClockSolid className={iconClass} />
            ) : (
              renderIcon(name, OutlineIcon, SolidIcon)
            )}
          </span>

          <span className="LefB-label flex-1 flex items-center justify-between">
            <span>
              {label}
              {isClockIn && (
                <p className="clock-time">0:00 AM</p>
              )}
            </span>

            {isRoster && (
              <ArrowPathIcon
                className={`sppen-sppart ${
                  rosterRefreshing ? 'animate-spin-fast' : ''
                }`}
              />
            )}

            {/* Notification badge */}
            {badge !== undefined && badge > 0 && (
              <span className="notification-badge ml-2">
                {badge}
              </span>
            )}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <motion.div
      className="SideNavBar Gen-Boxshadow"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="SideNavBar-Main custom-scroll-bar">
        <div className='Side-Logogos'>
          <Link to="/" className="Nav-Brand">
            <img src={LOGO} alt="logo" />
            <span>crm</span>
          </Link>
        </div>

        <p className="LeftnavBr-Title">
          <span className="Leffft-SOpan">Menu</span>
          <span
            onClick={() => {
              setMenuToggled(!menuToggled);
              setShrinkNav(!menuToggled);
            }}
            className="shrinkToggle"
            title={menuToggled ? 'Expand Menu' : 'Collapse Menu'}
          >
            {menuToggled ? (
              <ArrowLongRightIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <Squares2X2Icon className="w-6 h-6 text-gray-700" />
            )}
          </span>
        </p>

        <ul className="LeftnavBr-Icons">
          <MenuItem
            name="clock-in"
            label="Clock-In"
            OutlineIcon={ClockOutline}
            SolidIcon={ClockSolid}
            to={`${basePath}/clock-in`}
          />
          <MenuItem
            name="dashboard"
            label="Dashboard"
            OutlineIcon={HomeOutline}
            SolidIcon={HomeSolid}
            to={`${basePath}/`}
          />
          <MenuItem
            name="my-tasks"
            label="My Tasks"
            OutlineIcon={ClipboardOutline}
            SolidIcon={ClipboardSolid}
            to={`${basePath}/my-tasks`}
          />
          <MenuItem
            name="roster"
            label="Roster"
            OutlineIcon={UserGroupOutline}
            SolidIcon={UserGroupSolid}
            to={`${basePath}/roster`}
          />
          <MenuItem
            name="messages"
            label="Messages"
            OutlineIcon={InboxIcon}
            SolidIcon={InboxSolid}
            to={`${basePath}/messages`}
          />
          <MenuItem
            name="calendar"
            label="Calendar"
            OutlineIcon={CalendarOutline}
            SolidIcon={CalendarSolid}
            to={`${basePath}/calendar`}
          />
          <MenuItem
            name="notifications"
            label="Notifications"
            OutlineIcon={BellOutline}
            SolidIcon={BellSolid}
            to={`${basePath}/notifications`}
            badge={notificationCount}
          />
          <MenuItem
            name="team"
            label="Team"
            OutlineIcon={UsersOutline}
            SolidIcon={UsersSolid}
            to={`${basePath}/team`}
          />
          <MenuItem
            name="profile"
            label="Profile"
            OutlineIcon={UserCircleIcon}
            SolidIcon={UserCircleSolid}
            to={`${basePath}/profile`}
          />
          <MenuItem
            name="settings"
            label="Settings"
            OutlineIcon={SettingsOutline}
            SolidIcon={SettingsSolid}
            to={`${basePath}/settings`}
          />
        </ul>
      </div>
    </motion.div>
  );
};

export default SideNavBar;
