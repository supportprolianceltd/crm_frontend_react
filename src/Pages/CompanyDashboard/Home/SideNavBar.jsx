import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  HomeIcon as HomeOutline,
  ClipboardDocumentIcon as ClipboardOutline,
  UserGroupIcon as UserGroupOutline,
  CalendarDaysIcon as CalendarOutline,
  UsersIcon as UsersOutline,
  ClockIcon as ClockOutline,
  BriefcaseIcon as BriefcaseOutline,
  BanknotesIcon as BanknotesOutline,
  ChartBarIcon as ChartBarOutline,
  Cog6ToothIcon as SettingsOutline,
  LifebuoyIcon as HelpOutline,
} from '@heroicons/react/24/outline';

import {
  HomeIcon as HomeSolid,
  ClipboardDocumentIcon as ClipboardSolid,
  UserGroupIcon as UserGroupSolid,
  CalendarDaysIcon as CalendarSolid,
  UsersIcon as UsersSolid,
  ClockIcon as ClockSolid,
  BriefcaseIcon as BriefcaseSolid,
  BanknotesIcon as BanknotesSolid,
  ChartBarIcon as ChartBarSolid,
  Cog6ToothIcon as SettingsSolid,
  LifebuoyIcon as HelpSolid,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/solid';

const iconClass = 'w-5 h-5';

const basePath = '/company'; // prefix for all routes

const SideNavBar = () => {
  const location = useLocation();

  // Remove the basePath from location pathname to get "relative" path
  let relativePath = location.pathname.startsWith(basePath)
    ? location.pathname.slice(basePath.length)
    : location.pathname;

  // Normalize relativePath - remove leading slash if any
  if (relativePath.startsWith('/')) relativePath = relativePath.slice(1);

  // Determine active menu key based on path
  // Dashboard is '' (empty string means root path after /company/)
  const initialActive = relativePath.startsWith('project/')
    ? relativePath
    : relativePath === '' ? 'dashboard' : relativePath.split('/')[0];

  const [active, setActive] = useState(initialActive);
  const [projectOpen, setProjectOpen] = useState(initialActive.startsWith('project'));
  const projectRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectRef.current && !projectRef.current.contains(event.target)) {
        setProjectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update active and dropdown when location changes
  useEffect(() => {
    let relPath = location.pathname.startsWith(basePath)
      ? location.pathname.slice(basePath.length)
      : location.pathname;
    if (relPath.startsWith('/')) relPath = relPath.slice(1);

    if (relPath.startsWith('project/')) {
      setActive(relPath);
      setProjectOpen(true);
    } else if (relPath === '') {
      setActive('dashboard');
      setProjectOpen(false);
    } else {
      setActive(relPath.split('/')[0]);
      setProjectOpen(false);
    }
  }, [location]);

  const renderIcon = (name, OutlineIcon, SolidIcon) => {
    if (name === 'project') {
      return active.startsWith('project') ? (
        <SolidIcon className={iconClass} />
      ) : (
        <OutlineIcon className={iconClass} />
      );
    }
    return active === name ? (
      <SolidIcon className={iconClass} />
    ) : (
      <OutlineIcon className={iconClass} />
    );
  };

  const MenuItem = ({ name, label, OutlineIcon, SolidIcon, extraIcon, onClick, to }) => (
    <li
      className={
        active === name || (name === 'project' && active.startsWith('project'))
          ? 'active'
          : ''
      }
      ref={name === 'project' ? projectRef : null}
    >
      {to ? (
        <Link
          to={to}
          className="flex items-center justify-between"
          onClick={() => {
            if (onClick) onClick();
            else setActive(name);
          }}
        >
          <span className="LefB-Icon">{renderIcon(name, OutlineIcon, SolidIcon)}</span>
          <span className="LefB-label flex justify-between items-center w-full">
            {label}
            {extraIcon && <span className="ml-1">{extraIcon}</span>}
          </span>
        </Link>
      ) : (
        <a
          href="#"
          className="flex items-center justify-between"
          onClick={(e) => {
            e.preventDefault();
            if (onClick) onClick();
            else setActive(name);
          }}
        >
          <span className="LefB-Icon">{renderIcon(name, OutlineIcon, SolidIcon)}</span>
          <span className="LefB-label flex justify-between items-center w-full">
            {label}
            {extraIcon && <span className="ml-1">{extraIcon}</span>}
          </span>
        </a>
      )}
    </li>
  );

  const SubMenuItem = ({ name, label, to }) => (
    <li className={active === `project/${name}` ? 'active' : ''}>
      <Link
        to={to}
        className="submenu"
        onClick={() => setActive(`project/${name}`)}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <motion.div className="SideNavBar Gen-Boxshadow"
    initial={{ opacity: 0, x: -100 }} 
    animate={{ opacity: 1, x: 0 }}    
    transition={{ duration: 0.2 }}
    >
      <div className="SideNavBar-Main custom-scroll-bar">
        <p className="LeftnavBr-Title">Menu</p>
        <ul className="LeftnavBr-Icons">
          <MenuItem
            name="dashboard"
            label="Dashboard"
            OutlineIcon={HomeOutline}
            SolidIcon={HomeSolid}
            to={`${basePath}/`} // root of company/
          />
          <MenuItem
            name="task"
            label="Task"
            OutlineIcon={ClipboardOutline}
            SolidIcon={ClipboardSolid}
            to={`${basePath}/task`}
          />
          <MenuItem
            name="hiring"
            label="Hiring"
            OutlineIcon={UserGroupOutline}
            SolidIcon={UserGroupSolid}
            to={`${basePath}/hiring`}
          />
          <MenuItem
            name="calendar"
            label="Calendar"
            OutlineIcon={CalendarOutline}
            SolidIcon={CalendarSolid}
            to={`${basePath}/calendar`}
          />
        </ul>

        <p className="LeftnavBr-Title">Management</p>
        <ul className="LeftnavBr-Icons">
          <MenuItem
            name="employee"
            label="Employee"
            OutlineIcon={UsersOutline}
            SolidIcon={UsersSolid}
            to={`${basePath}/employee`}
          />
          <MenuItem
            name="attendance"
            label="Attendance"
            OutlineIcon={ClockOutline}
            SolidIcon={ClockSolid}
            to={`${basePath}/attendance`}
          />

          <MenuItem
            name="project"
            label="Project"
            OutlineIcon={BriefcaseOutline}
            SolidIcon={BriefcaseSolid}
            onClick={() => setProjectOpen(!projectOpen)}
            extraIcon={
              projectOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )
            }
          />

          <AnimatePresence>
            {projectOpen && (
              <motion.ul
                className="submenu-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <SubMenuItem
                  name="ongoing"
                  label="Ongoing Projects"
                  to={`${basePath}/project/ongoing`}
                />
                <SubMenuItem
                  name="completed"
                  label="Completed Projects"
                  to={`${basePath}/project/completed`}
                />
                <SubMenuItem
                  name="report"
                  label="Project Report"
                  to={`${basePath}/project/report`}
                />
              </motion.ul>
            )}
          </AnimatePresence>

          <MenuItem
            name="payroll"
            label="Payroll"
            OutlineIcon={BanknotesOutline}
            SolidIcon={BanknotesSolid}
            to={`${basePath}/payroll`}
          />
          <MenuItem
            name="report"
            label="Report"
            OutlineIcon={ChartBarOutline}
            SolidIcon={ChartBarSolid}
            to={`${basePath}/report`}
          />
        </ul>

        <p className="LeftnavBr-Title">Other Menu</p>
        <ul className="LeftnavBr-Icons">
          <MenuItem
            name="settings"
            label="Settings"
            OutlineIcon={SettingsOutline}
            SolidIcon={SettingsSolid}
            to={`${basePath}/settings`}
          />
          <MenuItem
            name="help"
            label="Help & Support"
            OutlineIcon={HelpOutline}
            SolidIcon={HelpSolid}
            to={`${basePath}/help`}
          />
        </ul>
      </div>
    </motion.div>
  );
};

export default SideNavBar;
