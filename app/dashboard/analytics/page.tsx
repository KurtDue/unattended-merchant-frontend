'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/providers/AuthProvider';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface VisitorData {
  date: string;
  visitors: number;
  entries: number;
  dwellTime: number;
}

interface HourlyData {
  hour: string;
  visitors: number;
  sales: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export default function Analytics() {
  const { user, selectedStore } = useAuth();
  const [loading, setLoading] = useState(true);
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    // Generate mock analytics data
    const generateVisitorData = () => {
      const data: VisitorData[] = [];
      const days = selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          visitors: Math.floor(Math.random() * 100) + 20,
          entries: Math.floor(Math.random() * 80) + 15,
          dwellTime: Math.floor(Math.random() * 15) + 5
        });
      }
      return data;
    };

    const generateHourlyData = () => {
      const data: HourlyData[] = [];
      const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      
      hours.forEach(hour => {
        data.push({
          hour,
          visitors: Math.floor(Math.random() * 50) + 10,
          sales: Math.floor(Math.random() * 500) + 100
        });
      });
      return data;
    };

    const generateCategoryData = () => {
      return [
        { name: 'First-time visitors', value: 45, color: '#3B82F6' },
        { name: 'Returning customers', value: 30, color: '#10B981' },
        { name: 'Regular customers', value: 25, color: '#F59E0B' }
      ];
    };

    setVisitorData(generateVisitorData());
    setHourlyData(generateHourlyData());
    setCategoryData(generateCategoryData());
    setLoading(false);
  }, [selectedTimeRange]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const totalVisitors = visitorData.reduce((sum, day) => sum + day.visitors, 0);
  const totalEntries = visitorData.reduce((sum, day) => sum + day.entries, 0);
  const avgDwellTime = visitorData.reduce((sum, day) => sum + day.dwellTime, 0) / visitorData.length;
  const conversionRate = totalEntries > 0 ? (totalEntries / totalVisitors * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Store performance and visitor insights for {selectedStore?.name}
            </p>
          </div>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Visitors</h3>
            <p className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">+12% from last period</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Store Entries</h3>
            <p className="text-2xl font-bold text-gray-900">{totalEntries.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">+8% from last period</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Avg. Dwell Time</h3>
            <p className="text-2xl font-bold text-gray-900">{avgDwellTime.toFixed(1)} min</p>
            <p className="text-sm text-blue-600 mt-1">+3% from last period</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Conversion Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
            <p className="text-sm text-red-600 mt-1">-2% from last period</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => [value, name === 'visitors' ? 'Visitors' : 'Entries']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Visitors"
                />
                <Area 
                  type="monotone" 
                  dataKey="entries" 
                  stackId="1" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Entries"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Hourly Patterns */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Patterns</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visitors" fill="#3B82F6" name="Visitors" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dwell Time Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dwell Time Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value} min`, 'Avg. Dwell Time']}
                />
                <Line 
                  type="monotone" 
                  dataKey="dwellTime" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Visitor Categories */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Analytics Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Daily Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Dwell Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitorData.slice().reverse().map((day, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.visitors}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.entries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((day.entries / day.visitors) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.dwellTime} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
