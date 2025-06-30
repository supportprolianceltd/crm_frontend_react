import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
} from '@heroicons/react/24/outline';

const About = () => {
  return (
  <div className='DocComplianceCheck'>
    <p>Dashboard About</p>
        <div className='DocComplianceCheck-Bodddy'></div>
        <button className='DocComplianceCheck-btn'>
            <XMarkIcon />
        </button>
          <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className='DocComplianceCheck-Main'
      >
        <div className='DocComplianceCheck-Part'>
            <div className='DocComplianceCheck-Part-Top'>
                <h3>Compliance Check</h3>
            </div>
               <div className='ssen-regs'>
            <div className='ssen-regs-1'>
              <span>EM</span>
            </div>
            <div className='ssen-regs-2'>
              <div>
                <h4>Emma Johnson</h4>
                <p>Applied: 06-30-2025</p>
              </div>
            </div>
          </div>
            <div className='PPPOl-Seacs'>
                <ul>
                    <li>Emma Johnson</li>
                    <li><span>emmajohnson@gmail.com</span></li>
                    <li><span>Applied: 06-30-2025</span></li>
                </ul>
            </div>
        </div>
        <div className='DocComplianceCheck-Part'>
             <div className='DocComplianceCheck-Part-Top'>
                <h3>Hello</h3>
            </div>
        </div>
      </motion.div>
</div>
  );
};


export default About;
