import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getIncidents, updateIncident, deleteIncident } from '../services/incidentService';
import { useAuth } from '../context/AuthContext';

const severityColor = {
  critical: 'text-[#ef5962] bg-[#3a1418]',
  high: 'text-[#f0a63a] bg-[#3a2c14]',
  medium: 'text-[#e8d24a] bg-[#3a3614]',
  low: 'text-[#38d8ec] bg-[#14313a]',
};

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'coordinator';

  const loadIncidents = () => {
    setLoading(true);
    getIncidents()
      .then(setIncidents)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load incidents'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateIncident(id, { status });
      loadIncidents();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this incident?')) return;
    try {
      await deleteIncident(id);
      loadIncidents();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">Incident Management</h1>
          <p className="text-sm text-[#8194a9]">{incidents.length} total incidents</p>
        </div>
      </div>

      {error && <p className="text-[#ef5962] mb-4">{error}</p>}
      {loading ? (
        <p className="text-[#8194a9]">Loading...</p>
      ) : (
        <div className="rounded-lg border border-[#2a3c52] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#111c2b] text-[#8194a9] text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Area</th>
                <th className="text-left px-4 py-3">Severity</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Occurred</th>
                {canManage && <th className="text-left px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {incidents.slice(0, 50).map((incident) => (
                <tr key={incident._id} className="border-t border-[#1c2938]">
                  <td className="px-4 py-3 capitalize">{incident.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-[#8194a9]">{incident.area?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${severityColor[incident.severity]}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {canManage ? (
                      <select
                        value={incident.status}
                        onChange={(e) => handleStatusChange(incident._id, e.target.value)}
                        className="bg-[#111c2b] border border-[#2a3c52] rounded px-2 py-1 text-xs"
                      >
                        <option value="reported">Reported</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    ) : (
                      <span className="capitalize text-[#8194a9]">{incident.status.replace('_', ' ')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#8194a9]">{new Date(incident.occurredAt).toLocaleDateString()}</td>
                  {canManage && (
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(incident._id)} className="text-[#ef5962] text-xs font-bold">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 py-3 text-xs text-[#546479]">Showing 50 of {incidents.length} incidents</p>
        </div>
      )}
    </Layout>
  );
}