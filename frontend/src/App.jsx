import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RiskMap from './pages/RiskMap';
import Incidents from './pages/Incidents';
import Resources from './pages/Resources';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<RiskMap />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;