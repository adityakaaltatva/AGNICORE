import { useState } from 'react';
import { SimulationInput } from '../types';

interface SimulationFormProps {
  onSimulate: (input: SimulationInput) => void;
}

export default function SimulationForm({ onSimulate }: SimulationFormProps) {
  const [device, setDevice] = useState('Linux');
  const [location, setLocation] = useState('Trusted');
  const [requestFrequency, setRequestFrequency] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate({ device, location, requestFrequency });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Simulate Access Request</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
        <select
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option>Linux</option>
          <option>Windows</option>
          <option>Mobile</option>
          <option>Unknown</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option>Trusted</option>
          <option>External</option>
          <option>Unknown</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Request Frequency: {requestFrequency}
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={requestFrequency}
          onChange={(e) => setRequestFrequency(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
      >
        Run Simulation
      </button>
    </form>
  );
}
