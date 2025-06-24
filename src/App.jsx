import { Routes, Route } from 'react-router-dom';
import CRMLandingpage from './Pages/CRMLandingPages/CRMLandingpage';
import './App.css';
import CompanyDashboard from './Pages/CompanyDashboard/Dashboard';
import SocialCallback from './Pages/CRMLandingPages/SocialCallback';
import ScrollToTop from './assets/ScrollToTop';
import JobApplication from './Pages/CRMLandingPages/JobApplication';
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component

function App() {
  return (
    <div className='App'>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<CRMLandingpage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/company/*" element={<CompanyDashboard />} />
          {/* Add other protected routes here if needed */}
        </Route>
        <Route path="/api/social/callback/" element={<SocialCallback />} />
        <Route path="/jobs/:unique_link" element={<JobApplication />} />
      </Routes>
    </div>
  );
}

export default App;