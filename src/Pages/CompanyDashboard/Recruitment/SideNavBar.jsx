import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ClipboardDocumentIcon as ClipboardOutline,
  UsersIcon as UsersOutline,
  CalendarDaysIcon as CalendarOutline,
  BriefcaseIcon as BriefcaseOutline,
  ChartBarIcon as ChartBarOutline,
  Cog6ToothIcon as Cog6ToothOutline,
} from '@heroicons/react/24/outline';

import {
  ClipboardDocumentIcon as ClipboardSolid,
  UsersIcon as UsersSolid,
  CalendarDaysIcon as CalendarSolid,
  BriefcaseIcon as BriefcaseSolid,
  ChartBarIcon as ChartBarSolid,
  Cog6ToothIcon as Cog6ToothSolid,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/solid';

const iconClass = 'w-5 h-5';
const basePath = '/company/recruitment';

const SideNavBar = () => {
  const location = useLocation();
  let relativePath = location.pathname.startsWith(basePath)
    ? location.pathname.slice(basePath.length)
    : location.pathname;
  if (relativePath.startsWith('/')) relativePath = relativePath.slice(1);

  const initialActive = relativePath.startsWith('settings/')
    ? relativePath
    : relativePath === '' ? 'job-requisition' : relativePath.split('/')[0];

  const [active, setActive] = useState(initialActive);
  const [settingsOpen, setSettingsOpen] = useState(initialActive.startsWith('settings/'));

  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks on submenu items
      if (event.target.closest('.SubMenu-Settings')) {
        return;
      }
      
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let relPath = location.pathname.startsWith(basePath)
      ? location.pathname.slice(basePath.length)
      : location.pathname;
    if (relPath.startsWith('/')) relPath = relPath.slice(1);

    if (relPath.startsWith('settings/')) {
      setActive(relPath);
      setSettingsOpen(true);
    } else if (relPath === '') {
      setActive('job-requisition');
      setSettingsOpen(false);
    } else {
      setActive(relPath.split('/')[0]);
      setSettingsOpen(false);
    }
  }, [location]);

  const renderIcon = (name, OutlineIcon, SolidIcon) => {
    if (name === 'settings') {
      return active.startsWith('settings/') ? (
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
        active === name || (name === 'settings' && active.startsWith('settings/'))
          ? 'active'
          : ''
      }
      ref={name === 'settings' ? settingsRef : null}
    >
      {to ? (
        <Link
          to={to}
          className="flex items-center justify-between"
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick();
            } else {
              setActive(name);
            }
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
    <li className={active === `settings/${name}` ? 'active' : ''}>
      <Link
        to={to}
        className="submenu"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from bubbling up
          setActive(`settings/${name}`);
        }}
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
          <MenuItem
            name="job-adverts"
            label="Job Adverts"
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

          <MenuItem
            name="settings"
            label="Settings"
            OutlineIcon={Cog6ToothOutline}
            SolidIcon={Cog6ToothSolid}
            extraIcon={settingsOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            onClick={() => setSettingsOpen(!settingsOpen)}
          />

          <AnimatePresence>
            {settingsOpen && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="SubMenu-Settings"
              >
                <SubMenuItem
                  name="api-settings"
                  label="API Settings"
                  to={`${basePath}/api-settings`}
                />
                <SubMenuItem
                  name="email-configuration"
                  label="Email Configuration"
                  to={`${basePath}/email-settings`}
                />
                
              </motion.ul>
            )}
          </AnimatePresence>

        </ul>
      </div>
    </motion.div>
  );
};

export default SideNavBar;