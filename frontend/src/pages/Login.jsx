import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await login(email, password);
      loginUser(token, user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b111c] text-[#dce6ef] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-[#31d4ec] text-[#07131d] font-bold">R</div>
          <div>
            <div className="font-extrabold tracking-wide">RESPONSE CENTER</div>
            <div className="text-[9px] uppercase tracking-[.2em] text-[#6f849a]">Emergency coordination</div>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold mb-1">Welcome back, coordinator.</h2>
        <p className="text-sm text-[#8194a9] mb-8">Sign in to resume your operational picture.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-[#8194a9]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-[#2a3c52] bg-[#111c2b] px-3 py-3 text-sm outline-none focus:border-[#38d8ec]"
            />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-[#8194a9]">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-[#2a3c52] bg-[#111c2b] px-3 py-3 text-sm outline-none focus:border-[#38d8ec]"
            />
          </label>

          {error && <p className="text-sm text-[#ef5962]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#31d4ec] py-3 text-xs font-extrabold text-[#07131d] disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Enter command center'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#8194a9]">
          No account? <a href="/register" className="text-[#38d8ec]">Register</a>
        </p>
      </div>
    </div>
  );
}