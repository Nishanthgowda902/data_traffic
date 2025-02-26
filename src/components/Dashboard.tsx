import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';
import BSF from "./images/BSF.png"; 
import Eagle from "./images/Eagle.png";

const formatValue = (value) => `${(value / 1000).toFixed(1)}K`;

const renderCustomLabel = (props) => {
  const { x, y, width, value } = props;
  return (
    <text x={x + width / 2} y={y - 10} fill="#374151" textAnchor="middle" fontSize="12" fontWeight="600">
      {formatValue(value)}
    </text>
  );
};

export function Dashboard() {
  const navigate = useNavigate();
  const { data, selectedYear, exportToExcel, Charts } = useData();
  const yearData = data.filter(item => item.year === selectedYear);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-6 h-[150px]">
        <div className="max-w-[1920px] mx-auto px-8 flex justify-between items-center">
          <img src={BSF} alt="BSF Logo" className="h-[100px] w-auto" />
          <div className="text-center flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-900">CEDCO BSF BENGALURU</h1>
            <h1 className="text-3xl font-bold text-gray-900">(AN IS/ISO 9001:2015 NSCSTI CERTIFIED INSTITUTION)</h1>
            <h1 className="text-3xl font-bold text-gray-900">SIGNAL CENTRE TRAFFIC CHART</h1>
          </div>
          <img src={Eagle} alt="Eagle Logo" className="h-[100px] w-auto" />
        </div>
      </header>

      <main className="flex-1 max-w-[2200px] mx-auto px-6 py-8 w-screen">
        <h1 className="text-xl font-semibold mb-4">PRECEDENCY :</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mb-8 w-full">
          {['FLASH', 'EMERGENCY', 'OPIMMEDIATE', 'PRIORITY', 'ROUTINE'].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center h-[100px] w-[330px]">
              <p className="text-base font-medium text-gray-600">{item.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-4xl font-semibold text-gray-900">{Charts?.[item] || 0}</p>
            </div>
          ))}
        </div>

        <h1 className="text-xl font-semibold mb-4">SECURITY CLASSIFICATION :</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mb-8 w-full">
          {['TOPSECRET', 'SECRET', 'CONFIDENTIAL', 'RESTRICTED', 'UNCLASSIFICATION'].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center h-[100px] w-[330px]">
              <p className="text-base font-medium text-gray-600">{item.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-4xl font-semibold text-gray-900">{Charts?.[item] || 0}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mt-[-10px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Monthly Traffic Data</h2>
            <p className="text-base text-gray-500">Values in thousands (K)</p>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} bytes`, '']} contentStyle={{ fontSize: '14px' }} />
                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Bar dataKey="inbound" name="Inbound Traffic" fill="#4F46E5">
                  <LabelList dataKey="inbound" content={renderCustomLabel} position="top" />
                </Bar>
                <Bar dataKey="outbound" name="Outbound Traffic" fill="#10B981">
                  <LabelList dataKey="outbound" content={renderCustomLabel} position="top" />
                </Bar>
                <Bar dataKey="total" name="Total Traffic" fill="#EF4444">
                  <LabelList dataKey="total" content={renderCustomLabel} position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            onClick={() => navigate('/input')}
          >
            Add New Data
          </button>
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
        </div>
      </main>
    </div>
  );
}
