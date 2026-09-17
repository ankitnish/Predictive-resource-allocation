import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div className="p-10 text-white bg-[#0b111c] min-h-screen">Dashboard coming next</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;