import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/map', label: 'Risk Map' },
  { to: '/incidents', label: 'Incidents' },
  { to: '/resources', label: 'Resources' },
];

export default function Layout({ children }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0b111c] text-[#dce6ef]">
      <nav className="border-b border-[#1c2938] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-extrabold">RESPONSE CENTER</span>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-[#1c2938] text-[#38d8ec]' : 'text-[#8194a9] hover:text-[#dce6ef]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#8194a9]">{user?.fullName} ({user?.role})</span>
          <button
            onClick={handleLogout}
            className="rounded-md border border-[#2a3c52] px-3 py-1.5 text-xs font-bold text-[#8194a9] hover:text-[#dce6ef]"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="p-8">{children}</main>
    </div>
  );
}