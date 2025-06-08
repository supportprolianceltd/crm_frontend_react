import { Routes, Route } from 'react-router-dom';
import CRMLandingpage from './Pages/CRMLandingPages/CRMLandingpage';
import './App.css';
// import Company from './Pages/Company/Company';
// import Recruitment from './Pages/Recruitment/Recruitment';


function App() {
  return (
    <div className='App'>
    <Routes>
      <Route path="/*" element={<CRMLandingpage />} />
      {/* <Route path="/Company/*" element={<Company />} />
      <Route path="/recruitment/*" element={<Recruitment />} /> */}
    </Routes>
    </div>
  );
}

export default App;