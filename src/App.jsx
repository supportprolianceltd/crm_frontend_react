import { Routes, Route } from 'react-router-dom';
import CRMLandingpage from './Pages/CRMLandingPages/CRMLandingpage';
import './App.css';
import CompanyDashboard from './Pages/CompanyDashboard/Dashboard';
import SocialCallback from './Pages/CRMLandingPages/SocialCallback';
import ScrollToTop from './assets/ScrollToTop';
import JobApplication from './Pages/CRMLandingPages/JobApplication';

function App() {
  return (
    <div className='App'>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<CRMLandingpage />} />
        <Route path="/company/*" element={<CompanyDashboard />} />
        <Route path="/api/social/callback/" element={<SocialCallback />} />
        <Route path="/jobs/:unique_link" element={<JobApplication />} />
      </Routes>
    </div>
  );
}

export default App;