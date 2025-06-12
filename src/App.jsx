import { Routes, Route } from 'react-router-dom';
import CRMLandingpage from './Pages/CRMLandingPages/CRMLandingpage';
import './App.css';
import CompanyDashboard from './Pages/CompanyDashboard/Dashboard';
// import Recruitment from './Pages/Recruitment/Recruitment';
import SocialCallback from './Pages/CRMLandingPages/SocialCallback';
import ScrollToTop from './assets/ScrollToTop';



function App() {
  return (
    <div className='App'>
      <ScrollToTop />
    <Routes>
      <Route path="/*" element={<CRMLandingpage />} />
      <Route path="/company/*" element={<CompanyDashboard />} />
      <Route path="/api/social/callback/" element={<SocialCallback />} />
      {/* <Route path="/recruitment/*" element={<Recruitment />} /> */}
    </Routes>
    </div>
  );
}

export default App;