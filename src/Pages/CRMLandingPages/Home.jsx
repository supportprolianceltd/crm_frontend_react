import usePageTitle from '../../hooks/usecrmPageTitle';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import RecruitmentIcon from '../../assets/Img/CRMPack/Recruitment.svg';
import ComplianceIcon from '../../assets/Img/CRMPack/Compliance.svg';
import TrainingIcon from '../../assets/Img/CRMPack/Training.svg';
import AssetmanagementIcon from '../../assets/Img/CRMPack/Assetmanagement.svg';
import RosteringIcon from '../../assets/Img/CRMPack/Rostering.svg';
import HRIcon from '../../assets/Img/CRMPack/HR.svg';
import PayrollIcon from '../../assets/Img/CRMPack/Payroll.svg';

import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { LightBulbIcon } from '@heroicons/react/24/outline';

import GlobalBanner from '../../assets/Img/global-banner.png';
import HHAbtBanner from '../../assets/Img/HhAbt-img.png';


import FAQSlider from './FAQSlider';



const features = [
  { name: 'Recruitment', icon: RecruitmentIcon },
  { name: 'Compliance', icon: ComplianceIcon },
  { name: 'Training', icon: TrainingIcon },
  { name: 'Assets management', icon: AssetmanagementIcon },
  { name: 'Rostering', icon: RosteringIcon },
  { name: 'HR', icon: HRIcon },
  { name: 'Payroll', icon: PayrollIcon },
];

// Flip card component
const FeatureCard = ({ icon, name, to }) => {
  return (
    <div className='feature-card Gen-Boxshadow'>
      <Link to={to}>
        <motion.div
          className='card-inner'
          whileHover={{ rotateY: 180 }}
          transition={{ duration: 0.1 }}
        >
          <div className='card-face card-front'>
            <img src={icon} alt={name} />
          </div>
          <div className='card-face card-back'>
            <p>{name}</p>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};

function Home() {
  usePageTitle();
  const [selected, setSelected] = useState([]);

  const toggleSelection = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const removeSelection = (name) => {
    setSelected((prev) => prev.filter((n) => n !== name));
  };

  return (
    <div className='crmhome-page'>
      <header className='crm-header'>
        <div className='large-container'>
          <div className='crm-hero-sec'>
            <div className='crm-hero-Txtx'>
              <h1 className='big-text'>Work smarter, grow faster, stay ahead.</h1>
              <p>Streamline operations, empower teams, and grow — from anywhere.</p>
            </div>
          </div>

          <div className='product-Dsspl'>
            <h3>
              Select the features you need for smarter management{' '}
              <span>
                <LightBulbIcon />
              </span>
            </h3>
            <div className='product-Dsspl-Grid'>
              {features.map((feature) => {
                const isSelected = selected.includes(feature.name);
                return (
                  <div
                    key={feature.name}
                    className={`prosu-Card Gen-Boxshadow ${isSelected ? 'selected selected-card' : ''}`}
                    onClick={() => toggleSelection(feature.name)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <span className='check-icon-span'>
                      {isSelected && <CheckIcon />}
                    </span>
                    <img src={feature.icon} alt={feature.name} />
                    <p>{feature.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='regg-abhns'>
            <p>
              Request for ✦{' '}
              {selected.length === 0 ? (
                <span>All</span>
              ) : (
                selected.map((name) => (
                  <span key={name}>
                    {name}
                    <XMarkIcon
                      onClick={() => removeSelection(name)}
                      style={{
                        width: '13px',
                        height: '13px',
                        marginLeft: '4px',
                        cursor: 'pointer',
                      }}
                    />
                  </span>
                ))
              )}
            </p>

            <Link to='/request-for-demo' className='btn-primary-bg'>
              Request for demo
            </Link>
          </div>
        </div>
      </header>

      <section className='global-secs'>
        <img src={GlobalBanner} />
      </section>

      <div className='site-container'>
        <div className='FFg-Secs'>
          <div className='FFg-Secs-Banner'>
            <img src={HHAbtBanner} />
          </div>
          <div className='FFg-Secs-Dlt'>
            <div>
              <h2 className='mid-text'>A Modern CRM Platform Engineered for Growth and Innovation</h2>
              <p>
                A Scalable CRM Platform Designed to Transform Recruitment, Compliance, Training, Asset
                Management, Rostering, HR, and Payroll.
              </p>
              <Link to='/about' className='btn-primary-bg'>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

    <section className='cloka-sec'>
      <div className='large-container'>
        <div className='ghka-Topa-sec'>
          <div className='ghka-Topa'>
            <h6>CRM Features</h6>
            <h2 className='big-text'>Modern. Modular. Ready.</h2>
            <p>A flexible, cloud-native CRM built to scale, adapt, and grow with your organization.</p>
            <div className='huj-seca'>
              {features.map((feature) => (
                <FeatureCard key={feature.name} icon={feature.icon} name={feature.name} />
              ))}
            </div>
          </div>
        </div>
        <FAQSlider />
      </div>
      </section>
    </div>
  );
}

export default Home;
