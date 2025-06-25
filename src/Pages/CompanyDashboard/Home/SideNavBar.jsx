import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  HomeIcon as HomeOutline,
  ClipboardDocumentIcon as ClipboardOutline,
  UserGroupIcon as UserGroupOutline,
  CalendarDaysIcon as CalendarOutline,
  UsersIcon as UsersOutline,
  ClockIcon as ClockOutline,
  DocumentTextIcon as DocumentTextOutline,
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
  DocumentTextIcon as DocumentTextSolid,
  ChartBarIcon as ChartBarSolid,
  Cog6ToothIcon as SettingsSolid,
  LifebuoyIcon as HelpSolid,
} from '@heroicons/react/24/solid';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/solid';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';

const iconClass = 'w-5 h-5';
const basePath = '/company';

const SideNavBar = ({ setShrinkNav }) => {
  const location = useLocation();
  let relativePath = location.pathname.startsWith(basePath)
    ? location.pathname.slice(basePath.length)
    : location.pathname;
  if (relativePath.startsWith('/')) relativePath = relativePath.slice(1);

  const initialActive = relativePath === '' ? 'dashboard' : relativePath.split('/')[0];
  const [active, setActive] = useState(initialActive);
  const [menuToggled, setMenuToggled] = useState(false);

  useEffect(() => {
    let relPath = location.pathname.startsWith(basePath)
      ? location.pathname.slice(basePath.length)
      : location.pathname;
    if (relPath.startsWith('/')) relPath = relPath.slice(1);
    setActive(relPath === '' ? 'dashboard' : relPath.split('/')[0]);
  }, [location]);

  const renderIcon = (name, OutlineIcon, SolidIcon) => {
    return active === name ? (
      <SolidIcon className={iconClass} />
    ) : (
      <OutlineIcon className={iconClass} />
    );
  };

  const MenuItem = ({ name, label, OutlineIcon, SolidIcon, to, onClick }) => (
    <li className={active === name ? 'active' : ''}>
      <Link
        to={to}
        className="flex items-center justify-between"
        title={menuToggled ? label : undefined}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
          setActive(name);
        }}
      >
        <span className="LefB-Icon">{renderIcon(name, OutlineIcon, SolidIcon)}</span>
        <span className="LefB-label flex justify-between items-center w-full">
          {label}
        </span>
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
              <Bars3BottomLeftIcon className="w-6 h-6 text-gray-700" />
            )}
          </span>
        </p>
        <ul className="LeftnavBr-Icons">
          <MenuItem
            name="dashboard"
            label="Dashboard"
            OutlineIcon={HomeOutline}
            SolidIcon={HomeSolid}
            to={`${basePath}/`}
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

        {!menuToggled && <p className="LeftnavBr-Title">Management</p>}
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
            name="request"
            label="Requests"
            OutlineIcon={DocumentTextOutline}
            SolidIcon={DocumentTextSolid}
            to={`${basePath}/request`}
          />
          <MenuItem
            name="report"
            label="Report"
            OutlineIcon={ChartBarOutline}
            SolidIcon={ChartBarSolid}
            to={`${basePath}/report`}
          />
        </ul>

        {!menuToggled && <p className="LeftnavBr-Title">Other Menu</p>}
        <ul className="LeftnavBr-Icons">
          <MenuItem
            name="settings"
            label="Settings"
            OutlineIcon={SettingsOutline}
            SolidIcon={SettingsSolid}
            to={`${basePath}/settings`}
            onClick={() => {
              setMenuToggled(false);
              setShrinkNav(false);
            }}
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