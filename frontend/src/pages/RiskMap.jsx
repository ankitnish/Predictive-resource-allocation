import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getAreas } from '../services/areaService';

const riskColor = (incidentCount) => {
  if (incidentCount >= 60) return '#ef5962'; // critical
  if (incidentCount >= 40) return '#f0a63a'; // high
  if (incidentCount >= 20) return '#e8d24a'; // medium
  return '#38d8ec'; // low
};

const riskLabel = (incidentCount) => {
  if (incidentCount >= 60) return 'Critical';
  if (incidentCount >= 40) return 'High';
  if (incidentCount >= 20) return 'Medium';
  return 'Low';
};

export default function RiskMap() {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAreas()
      .then(setAreas)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load areas'));
  }, []);

  if (error) {
    return <div className="min-h-screen bg-[#0b111c] text-[#ef5962] p-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b111c] text-[#dce6ef] p-8">
      <h1 className="text-2xl font-extrabold mb-1">Risk Map</h1>
      <p className="text-sm text-[#8194a9] mb-6">
        Color-coded by incident volume (a stand-in for risk score until the ML model is integrated in a later module)
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg overflow-hidden border border-[#2a3c52]" style={{ height: '520px' }}>
          <MapContainer center={[23.25, 77.4]} zoom={9} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {areas.map((area) => (
              <CircleMarker
                key={area._id}
                center={[area.location.coordinates[1], area.location.coordinates[0]]}
                radius={12}
                pathOptions={{ color: riskColor(area.incidentCount), fillColor: riskColor(area.incidentCount), fillOpacity: 0.7 }}
                eventHandlers={{ click: () => setSelectedArea(area) }}
              >
                <Popup>
                  <strong>{area.name}</strong><br />
                  Risk: {riskLabel(area.incidentCount)}<br />
                  Incidents: {area.incidentCount}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="rounded-lg border border-[#2a3c52] bg-[#111c2b] p-5">
          <h2 className="text-sm font-bold text-[#8194a9] uppercase tracking-wider mb-4">
            {selectedArea ? selectedArea.name : 'Click an area on the map'}
          </h2>
          {selectedArea && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#8194a9]">Population</span><span>{selectedArea.population.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#8194a9]">Historical incidents</span><span>{selectedArea.incidentCount}</span></div>
              <div className="flex justify-between"><span className="text-[#8194a9]">Available resources</span><span>{selectedArea.availableResources}</span></div>
              <div className="flex justify-between"><span className="text-[#8194a9]">Infrastructure condition</span><span>{selectedArea.infrastructureCondition}/5</span></div>
              <div className="flex justify-between"><span className="text-[#8194a9]">Distance to hospital</span><span>{selectedArea.distanceToHospitalKm} km</span></div>
              <div className="flex justify-between">
                <span className="text-[#8194a9]">Risk level</span>
                <span style={{ color: riskColor(selectedArea.incidentCount) }} className="font-bold">{riskLabel(selectedArea.incidentCount)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}