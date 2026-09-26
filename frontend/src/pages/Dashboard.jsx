import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getDashboardSummary } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ label, value, accent }) => (
  <div className="rounded-lg border border-[#2a3c52] bg-[#111c2b] p-5">
    <p className="text-[10px] uppercase tracking-wider text-[#8194a9] mb-2">{label}</p>
    <p className={`text-3xl font-extrabold ${accent || 'text-[#dce6ef]'}`}>{value}</p>
  </div>
);

const severityColor = {
  critical: 'text-[#ef5962] bg-[#3a1418]',
  high: 'text-[#f0a63a] bg-[#3a2c14]',
  medium: 'text-[#e8d24a] bg-[#3a3614]',
  low: 'text-[#38d8ec] bg-[#14313a]',
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) {
    return <Layout><p className="text-[#ef5962]">{error}</p></Layout>;
  }

  if (!summary) {
    return <Layout><p className="text-[#8194a9]">Loading dashboard...</p></Layout>;
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold">Response Dashboard</h1>
        <p className="text-sm text-[#8194a9]">Welcome, {user?.fullName} ({user?.role})</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Incidents" value={summary.activeIncidents} accent="text-[#ef5962]" />
        <StatCard label="Available Resources" value={summary.availableResources} accent="text-[#38d8ec]" />
        <StatCard label="Deployed Resources" value={summary.deployedResources} accent="text-[#f0a63a]" />
        <StatCard label="Avg Response Time" value={`${summary.avgResponseTimeMinutes} min`} />
      </div>

      <div className="rounded-lg border border-[#2a3c52] bg-[#111c2b] p-5">
        <h2 className="text-sm font-bold text-[#8194a9] uppercase tracking-wider mb-4">Recent Incidents</h2>
        <div className="space-y-2">
          {summary.recentIncidents.map((incident) => (
            <div key={incident._id} className="flex items-center justify-between border-b border-[#1c2938] py-3 last:border-0">
              <div>
                <p className="text-sm font-medium capitalize">{incident.type.replace('_', ' ')}</p>
                <p className="text-xs text-[#8194a9]">{incident.area?.name || 'Unknown area'}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold capitalize ${severityColor[incident.severity]}`}>
                {incident.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-[#546479] italic">{summary.note}</p>
    </Layout>
  );
}