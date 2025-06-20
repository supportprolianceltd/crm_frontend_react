import { useState, useRef, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import LOGO from '../../assets/Img/logo-lite.png';

const Dashboard = () => {
  const [isScrolling, setIsScrolling] = useState(false);

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


  return (
    <div className='Applicant-Dashboard'>
            <nav className={`Fritop-Nav OKuj-NNAb ${isScrolling ? 'scrolling-nav' : ''}`}>
                  <div className='large-container'>
                 <div className='Fritop-Nav-content'>
                          <Link to='/' className='Nav-Brand'>
                            <img src={LOGO} alt="logo" />
                          </Link>

                          <div className='ooown-AOpls'>
                            <h3>Prince Godson</h3>
                            <p>princegodson24@gmail.com</p>
                          </div>

                           <ul className='Frs-Url'>
                             <li><Link to='/'>Sign in</Link></li>
                           </ul>
                 </div>
                 </div>
            </nav>
       <header className='GHT-Header'></header>
    </div>

      );
};

export default Dashboard;