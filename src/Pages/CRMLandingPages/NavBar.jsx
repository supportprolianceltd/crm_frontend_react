import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

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
  const [isScrolling, setIsScrolling] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  return (
    <nav className={`Fritop-Nav ${isScrolling ? 'scrolling-nav' : ''}`}>
      <div className='large-container'>
        <div className='Fritop-Nav-content'>
          <Link to='/' className='Nav-Brand'>
            <img src={LOGO} alt="logo" />
            <span>crm</span>
          </Link>

          <ul className='Frs-Url'>
            <li ref={dropdownRef}>
              <span onClick={toggleDropdown} className='cursor-pointer flex items-center gap-1'>
                Features <ChevronDownIcon className={`chevron-icon ${showDropdown ? 'rotate' : ''}`} />
              </span>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className='All-NAv-DropDown Gen-Boxshadow'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to='/recruitment' onClick={() => setShowDropdown(false)}>
                      <img src={RecruitmentIcon} alt="Recruitment" /> Recruitment
                    </Link>
                    <Link to='/compliance' onClick={() => setShowDropdown(false)}>
                      <img src={ComplianceIcon} alt="Compliance" /> Compliance
                    </Link>
                    <Link to='/training' onClick={() => setShowDropdown(false)}>
                      <img src={TrainingIcon} alt="Training" /> Training
                    </Link>
                    <Link to='/assets-management' onClick={() => setShowDropdown(false)}>
                      <img src={AssetmanagementIcon} alt="Asset Management" /> Assets management
                    </Link>
                    <Link to='/rostering' onClick={() => setShowDropdown(false)}>
                      <img src={RosteringIcon} alt="Rostering" /> Rostering
                    </Link>
                    <Link to='/hr' onClick={() => setShowDropdown(false)}>
                      <img src={HRIcon} alt="HR" /> HR
                    </Link>
                    <Link to='/payroll' onClick={() => setShowDropdown(false)}>
                      <img src={PayrollIcon} alt="Payroll" /> Payroll
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li><Link to='/contact-sales'>Contact sales</Link></li>
            <li><Link to='/register' className='btn-primary-bg'>Create account</Link></li>
            <li><Link to='/login'>Sign in</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
