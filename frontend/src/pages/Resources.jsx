import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getResources, updateResource, deleteResource } from '../services/resourceService';
import { useAuth } from '../context/AuthContext';

const statusColor = {
  available: 'text-[#38d8ec] bg-[#14313a]',
  deployed: 'text-[#f0a63a] bg-[#3a2c14]',
  maintenance: 'text-[#8194a9] bg-[#1c2938]',
};

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'coordinator';
  const canDelete = user?.role === 'admin';

  const loadResources = () => {
    setLoading(true);
    getResources()
      .then(setResources)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load resources'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateResource(id, { status });
      loadResources();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resource?')) return;
    try {
      await deleteResource(id);
      loadResources();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Resource Management</h1>
        <p className="text-sm text-[#8194a9]">{resources.length} total resources</p>
      </div>

      {error && <p className="text-[#ef5962] mb-4">{error}</p>}
      {loading ? (
        <p className="text-[#8194a9]">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => (
            <div key={r._id} className="rounded-lg border border-[#2a3c52] bg-[#111c2b] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold capitalize">{r.type.replace('_', ' ')}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${statusColor[r.status]}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-sm text-[#8194a9] mb-1">Quantity: {r.quantity}</p>
              <p className="text-sm text-[#8194a9] mb-3">Area: {r.assignedArea?.name || 'Unassigned'}</p>
              {canManage && (
                <div className="flex items-center gap-2">
                  <select
                    value={r.status}
                    onChange={(e) => handleStatusChange(r._id, e.target.value)}
                    className="bg-[#0b111c] border border-[#2a3c52] rounded px-2 py-1 text-xs flex-1"
                  >
                    <option value="available">Available</option>
                    <option value="deployed">Deployed</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  {canDelete && (
                    <button onClick={() => handleDelete(r._id)} className="text-[#ef5962] text-xs font-bold">
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}