import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  Cog6ToothIcon as Cog6ToothOutline,  // FIXED import name
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
  Cog6ToothIcon as Cog6ToothSolid,
  LifebuoyIcon as HelpSolid,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/solid';

const iconClass = 'w-5 h-5';

// Updated basePath here:
const basePath = '/company/recruitment';

const SideNavBar = () => {
  const location = useLocation();

  // Remove the basePath from location pathname to get relative path
  let relativePath = location.pathname.startsWith(basePath)
    ? location.pathname.slice(basePath.length)
    : location.pathname;

  // Normalize relativePath - remove leading slash if any
  if (relativePath.startsWith('/')) relativePath = relativePath.slice(1);

  // Default active is 'job-requisition' when relative path is empty
  const initialActive = relativePath.startsWith('project/')
    ? relativePath
    : relativePath === '' ? 'job-requisition' : relativePath.split('/')[0];

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
      setActive('job-requisition');  // default active when no route after base
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

  // SubMenuItem (for project submenu) - you can add this if you have project submenu links
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
    <motion.div
      className="SideNavBar Gen-Boxshadow"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="SideNavBar-Main custom-scroll-bar">
        <p className="LeftnavBr-Title">Recruitment</p>
        <ul className="LeftnavBr-Icons">
          <MenuItem
            name="job-requisition"
            label="Job Requisition"
            OutlineIcon={BriefcaseOutline}
            SolidIcon={BriefcaseSolid}
            to={`${basePath}/`}
          />
          {/* <MenuItem
            name="approval"
            label="Approval Workflow"
            OutlineIcon={ClipboardOutline}
            SolidIcon={ClipboardSolid}
            to={`${basePath}/approval`}
          /> */}
          <MenuItem
            name="job-adverts"
            label="	Job Adverts"
            OutlineIcon={ChartBarOutline}
            SolidIcon={ChartBarSolid}
            to={`${basePath}/job-adverts`}
          />
          <MenuItem
            name="applications"
            label="Applications"
            OutlineIcon={UsersOutline}
            SolidIcon={UsersSolid}
            to={`${basePath}/applications`}
          />
          <MenuItem
            name="vetting"
            label="Vetting"
            OutlineIcon={Cog6ToothOutline}  // fixed outline icon
            SolidIcon={Cog6ToothSolid}
            to={`${basePath}/vetting`}
          />
          <MenuItem
            name="schedule"
            label="Interview Schedule"
            OutlineIcon={CalendarOutline}
            SolidIcon={CalendarSolid}
            to={`${basePath}/schedule`}
          />
          <MenuItem
            name="compliance"
            label="Compliance Reports"
            OutlineIcon={ClipboardOutline}
            SolidIcon={ClipboardSolid}
            to={`${basePath}/compliance`}
          />
        </ul>
      </div>
    </motion.div>
  );
};

export default SideNavBar;
