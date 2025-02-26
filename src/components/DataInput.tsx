import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';
import { Server } from 'lucide-react';

const months = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

export function DataInput() {
  const navigate = useNavigate();
  const { addData, selectedYear, setYear, Charts, setCharts } = useData();

  const [formData, setFormData] = useState({
    month: '',
    inbound: '',
    outbound: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof typeof Charts, value: string) => {
    setCharts(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Reset error
    setError('');

    // Validate form data
    if (!formData.month || !formData.inbound || !formData.outbound) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await addData({
        month: formData.month,
        inbound: Number(formData.inbound),
        outbound: Number(formData.outbound),
        year: selectedYear,
      });
      setFormData({ month: '', inbound: '', outbound: '' });
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error adding data. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChartsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-center">
              <Server className="h-12 w-12 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900 ml-4">Traffic Data Input</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              min="2000"
              max="2100"
            />
          </div>

          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select a month</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Inbound Traffic (bytes)</label>
              <input
                type="number"
                value={formData.inbound}
                onChange={(e) => setFormData(prev => ({ ...prev, inbound: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Outbound Traffic (bytes)</label>
              <input
                type="number"
                value={formData.outbound}
                onChange={(e) => setFormData(prev => ({ ...prev, outbound: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                min="0"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSubmitting ? 'Adding...' : 'Add Data'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                View Dashboard
              </button>
            </div>
          </form>
        </div>
      </main>

      <form onSubmit={handleChartsSubmit}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            {Object.keys(Charts).map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="number"
                  value={Charts[key as keyof typeof Charts]}
                  onChange={(e) => handleChange(key as keyof typeof Charts, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}
            <div className="flex justify-between">
              <button
                type="submit"
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}