import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, QuestionMarkCircleIcon,Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

import LOGO from '../../assets/Img/logo.png';
import RecruitmentIcon from '../../assets/Img/CRMPack/Recruitment.svg';
import ComplianceIcon from '../../assets/Img/CRMPack/Compliance.svg';
import TrainingIcon from '../../assets/Img/CRMPack/Training.svg';
import AssetmanagementIcon from '../../assets/Img/CRMPack/Assetmanagement.svg';
import RosteringIcon from '../../assets/Img/CRMPack/Rostering.svg';
import HRIcon from '../../assets/Img/CRMPack/HR.svg';
import PayrollIcon from '../../assets/Img/CRMPack/Payroll.svg';

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll for nav styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const toggleProfileDropdown = () => setShowProfileDropdown(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('tenantSchema');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className={`Fritop-Nav ${isScrolling ? 'scrolling-nav' : ''}`}>
      <div className="large-container">
        <div className="Fritop-Nav-content">
          <Link to="/" className="Nav-Brand">
            <img src={LOGO} alt="logo" />
            <span>crm</span>
          </Link>

          <ul className="Frs-Url">
            <li ref={dropdownRef}>
              <span onClick={toggleDropdown} className="cursor-pointer flex items-center gap-1">
                Features <ChevronDownIcon className={`chevron-icon ${showDropdown ? 'rotate' : ''}`} />
              </span>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="All-NAv-DropDown Gen-Boxshadow"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to="/recruitment" onClick={() => setShowDropdown(false)}>
                      <img src={RecruitmentIcon} alt="Recruitment" /> Recruitment
                    </Link>
                    <Link to="/compliance" onClick={() => setShowDropdown(false)}>
                      <img src={ComplianceIcon} alt="Compliance" /> Compliance
                    </Link>
                    <Link to="/training" onClick={() => setShowDropdown(false)}>
                      <img src={TrainingIcon} alt="Training" /> Training
                    </Link>
                    <Link to="/assets-management" onClick={() => setShowDropdown(false)}>
                      <img src={AssetmanagementIcon} alt="Asset Management" /> Assets management
                    </Link>
                    <Link to="/rostering" onClick={() => setShowDropdown(false)}>
                      <img src={RosteringIcon} alt="Rostering" /> Rostering
                    </Link>
                    <Link to="/hr" onClick={() => setShowDropdown(false)}>
                      <img src={HRIcon} alt="HR" /> HR
                    </Link>
                    <Link to="/payroll" onClick={() => setShowDropdown(false)}>
                      <img src={PayrollIcon} alt="Payroll" /> Payroll
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li>
              <Link to="/contact-sales">Contact sales</Link>
            </li>
            <li>
              <Link to="/register" className="btn-primary-bg">
                Create account
              </Link>
            </li>
            <li>
              {isAuthenticated ? (
                <Link to="/company">
                  Account
                </Link>
              ) : (
                <Link to="/login">Sign in</Link>
              )}
            </li>
          </ul>

          <div
            className='AAPpl-NAvsb'
            onClick={toggleProfileDropdown}
            ref={profileDropdownRef}
          >
            <div className='AAPpl-NAvsb-Main'>
              <div className='AAPpl-NAvsb-1'>
                <span>PG</span>
              </div>
              <div className='AAPpl-NAvsb-2'>
                <h3>Prince Godson</h3>
                <p>princegodson24@gmail.com</p>
              </div>
              <div className='AAPpl-NAvsb-3'>
                <ChevronDownIcon className={`${showProfileDropdown ? 'rotate' : ''}`} />
              </div>
            </div>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  className="All_Drop_Down ooaujs-Po Gen-Boxshadow"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/" onClick={() => setShowProfileDropdown(false)}>
                    <QuestionMarkCircleIcon /> Help & Support
                  </Link>
                  <Link to="/" onClick={() => setShowProfileDropdown(false)}>
                    <Cog6ToothIcon /> Settimgs
                  </Link>
                  <button
                    className="logout-btn btn-primary-bg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
