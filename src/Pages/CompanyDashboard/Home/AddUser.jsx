import React, { useState, useRef } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import DefaulUser from '../../../assets/Img/memberIcon.png';
import { motion, useInView } from 'framer-motion';

const steps = [
  { key: 'Details', title: 'Details' },
  { key: 'Role Assignment', title: 'Role Assignment' },
  { key: 'Permissions', title: 'Permissions' },
  { key: 'Set Login Credentials', title: 'Set Login Credentials' },
];

// Framer Motion variants for staggered animation
const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4, // smooth duration
      ease: 'easeOut', // natural easing
    },
  },
};

// Animated ul that animates every time it enters viewport
const SectionList = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-100px 0px -100px 0px' });

  return (
    <motion.ul
      ref={ref}
      variants={listVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { variants: itemVariants })
      )}
    </motion.ul>
  );
};

const AddUser = () => {
  const [activeKey, setActiveKey] = useState('Details');

  // Refs for each section container
  const sectionRefs = {
    Details: useRef(null),
    'Role Assignment': useRef(null),
    Permissions: useRef(null),
    'Set Login Credentials': useRef(null),
  };

  // Ref for scroll container
  const mainContentRef = useRef(null);

  // Drag-to-scroll state refs
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  // Mouse event handlers for drag scroll
  const onMouseDown = (e) => {
    isDragging.current = true;
    startY.current = e.pageY - mainContentRef.current.offsetTop;
    scrollTop.current = mainContentRef.current.scrollTop;
    mainContentRef.current.style.cursor = 'grabbing';
    mainContentRef.current.style.userSelect = 'none';
  };

  const onMouseLeave = () => {
    isDragging.current = false;
    if (mainContentRef.current) {
      mainContentRef.current.style.cursor = 'grab';
      mainContentRef.current.style.userSelect = 'auto';
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (mainContentRef.current) {
      mainContentRef.current.style.cursor = 'grab';
      mainContentRef.current.style.userSelect = 'auto';
    }
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const y = e.pageY - mainContentRef.current.offsetTop;
    const walk = startY.current - y;
    mainContentRef.current.scrollTop = scrollTop.current + walk;
  };

  // Handle clicking step to scroll to section
  const handleStepClick = (key) => {
    setActiveKey(key);
    const el = sectionRefs[key]?.current;
    if (el && mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: el.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Content per step
  const renderStepContent = (key) => {
    switch (key) {
      case 'Details':
        return (
          <SectionList>
            <motion.li><span>First Name</span><p>Emily</p></motion.li>
            <motion.li><span>Last Name</span><p>Watson</p></motion.li>
            <motion.li><span>Email</span><p>emily.watson@example.co.uk</p></motion.li>
            <motion.li><span>Phone</span><p>+44 7700 900123</p></motion.li>
            <motion.li><span>Gender</span><p>Female</p></motion.li>
            <motion.li><span>Date of Birth</span><p>Jan 22, 1990</p></motion.li>
            <motion.li><span>Street</span><p>221B Baker Street</p></motion.li>
            <motion.li><span>City</span><p>London</p></motion.li>
            <motion.li><span>State</span><p>Greater London</p></motion.li>
            <motion.li><span>Zip Code</span><p>NW1 6XE</p></motion.li>
          </SectionList>
        );
      case 'Role Assignment':
        return (
          <SectionList>
            <motion.li><span>Assigned Role</span><p>Project Manager</p></motion.li>
            <motion.li><span>Department</span><p>Operations</p></motion.li>
            <motion.li><span>Access Level</span><p>Full Access</p></motion.li>
          </SectionList>
        );
      case 'Permissions':
        return (
          <SectionList>
            <motion.li><span>View Reports</span><p>Granted</p></motion.li>
            <motion.li><span>Edit Users</span><p>Granted</p></motion.li>
            <motion.li><span>Manage Settings</span><p>Restricted</p></motion.li>
            <motion.li><span>Approve Transactions</span><p>Granted</p></motion.li>
          </SectionList>
        );
      case 'Set Login Credentials':
        return (
          <SectionList>
            <motion.li><span>Username</span><p>emily.watson</p></motion.li>
            <motion.li><span>Temporary Password</span><p>••••••••</p></motion.li>
            <motion.li><span>Status</span><p>Active</p></motion.li>
            <motion.li><span>Two-Factor Auth</span><p>Enabled</p></motion.li>
          </SectionList>
        );
      default:
        return null;
    }
  };

  return (
    <div className="Gllols-AddUser">
      <div className="Top-Gllols-AddUser Simp-Boxshadow">
        <h3>Add a User</h3>
        <ul>
          {steps.map((step) => (
            <li
              key={step.key}
              className={activeKey === step.key ? 'Active-CChgba' : ''}
              onClick={() => handleStepClick(step.key)}
              style={{ cursor: 'pointer' }}
            >
              {step.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="Gllols-AddUser-MMMmains Simp-Boxshadow">
        <div className="Gllols-AddUser-MMMmainsTop">
          <h4>{activeKey}</h4>
          <ul>
            <li><ArrowLeftIcon className="w-4 h-4 inline-block mr-1" /> Go Back</li>
            <li className="continue-BTn">Continue</li>
          </ul>
        </div>

        <div className="oikujuj-stha">
          <div className="oikujuj-stha-1">
            <div className="oikujuj-stha-1-Top">
              <div className="oikujuj-stha-1-Top-1">
                <div className="ool-Prols">
                  <img src={DefaulUser} alt="Default User" />
                </div>
              </div>
              <div className="oikujuj-stha-1-Top-2">
                <h5>Prince Godson</h5>
                <p>Role: User</p>
              </div>
            </div>

            <div
              className="oikujuj-stha-1-Main"
              ref={mainContentRef}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
            >
              {steps.map((step) => (
                <div
                  key={step.key}
                  ref={sectionRefs[step.key]}
                  className={`Rogg-Parts ${activeKey === step.key ? 'Active-Rogg' : ''}`}
                >
                  <h5>{step.title}</h5>
                  {renderStepContent(step.key)}
                </div>
              ))}
            </div>
          </div>

          <div className="oikujuj-stha-2"></div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
