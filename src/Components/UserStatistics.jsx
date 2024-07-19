import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDomains, getUser } from '../ApiConfig';

const UserStatistics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('7');
  const [chartMetric, setChartMetric] = useState('Telephone Numbers');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const domainData = await getDomains();
        if (domainData?.data && Array.isArray(domainData.data)) {
          const userDataPromises = domainData.data.map(async (item) => {
            try {
              const userData = await getUser(item.domain);
              console.log('Fetched user data:', userData);
              
              // Check if userData.data exists and has a user property
              if (userData?.data?.user) {
                console.log('User:', userData.data.user);
                return userData.data.user;
              } else {
                console.log('User data not found in the expected format');
                return null;
              }
            } catch (error) {
              console.error(`Error fetching user data for domain ${item.domain}:`, error);
              return null;
            }
          });
  
          const users = await Promise.all(userDataPromises);
          console.log('All users:', users.filter(Boolean)); // Log all non-null users
        } else {
          console.log('No domain data available or invalid format');
        }
      } catch (error) {
        console.error('Error fetching domain data:', error);
      }
    };
  
    fetchData();
  }, []);

  const domainData = [
    { domain: '123voicedialing.23977.service', registeredDevices: 0, totalDevices: 0 },
    { domain: '1800packratofnorthfalls.23977.service', registeredDevices: 0, totalDevices: 0 },
    { domain: '360voicedialing.23977.service', registeredDevices: 8, totalDevices: 8 },
    { domain: '800voicedialing.23977.service', registeredDevices: 3, totalDevices: 7 },
    { domain: 'aaaexteriorfinance.23977.service', registeredDevices: 0, totalDevices: 1 },
    { domain: 'abcautobodyshop.23977.service', registeredDevices: 4, totalDevices: 5 },
    { domain: 'abchomebuildersinc.23977.service', registeredDevices: 1, totalDevices: 1 },
    { domain: 'abcshoppinginc.23977.service', registeredDevices: 4, totalDevices: 5 },
    { domain: 'abcstores.23977.service', registeredDevices: 0, totalDevices: 0 },
    { domain: 'abetterconditionalrefinancing.23977.service', registeredDevices: 4, totalDevices: 4 },
  ];

  useEffect(() => {
    const filtered = domainData.filter(item =>
      item.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    // Simulated chart data - replace with actual API call
    const simulatedChartData = [
      { date: '01/01', pbxPhoneNumber: 4615 },
      { date: '01/03', pbxPhoneNumber: 4625 },
      { date: '01/05', pbxPhoneNumber: 4626 },
      { date: '01/07', pbxPhoneNumber: 4627 },
      { date: '01/09', pbxPhoneNumber: 4628 },
      { date: '01/11', pbxPhoneNumber: 4629 },
      { date: '01/13', pbxPhoneNumber: 4630 },
      { date: '01/15', pbxPhoneNumber: 4631 },
      { date: '01/17', pbxPhoneNumber: 4632 },
      { date: '01/19', pbxPhoneNumber: 4635 },
    ];
    setChartData(simulatedChartData);
  }, [chartPeriod, chartMetric]);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = () => {
    // Implement search functionality if needed
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  const handleShowTotals = () => {
    // Implement show totals functionality
    console.log('Showing totals...');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Registration Statistics */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Registration Statistics</h2>
              <div className="flex space-x-2">
                <button onClick={handleShowTotals} className="bg-blue-500 text-white px-3 py-1 rounded">SHOW TOTALS</button>
                <button onClick={handleExport} className="bg-blue-500 text-white px-3 py-1 rounded">EXPORT</button>
              </div>
            </div>
            <div className="mb-4 flex">
              <input
                type="text"
                placeholder="Search by Domain"
                className="w-full p-2 border rounded-l"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-r">SEARCH</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">DOMAIN</th>
                  <th className="text-right p-2">REGISTERED DEVICES</th>
                  <th className="text-right p-2">TOTAL DEVICES</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.domain}</td>
                    <td className="text-right p-2">{item.registeredDevices}</td>
                    <td className="text-right p-2">{item.totalDevices}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-between items-center">
              <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} results</span>
              <div className="flex space-x-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reseller Graph */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reseller Graph</h2>
              <div className="flex space-x-2">
                <button onClick={() => setChartPeriod('7')} className={`px-3 py-1 rounded ${chartPeriod === '7' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>7 DAYS</button>
                <button onClick={() => setChartPeriod('30')} className={`px-3 py-1 rounded ${chartPeriod === '30' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>30 DAYS</button>
                <button onClick={() => setChartPeriod('60')} className={`px-3 py-1 rounded ${chartPeriod === '60' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>60 DAYS</button>
                <select
                  className="bg-gray-200 px-3 py-1 rounded"
                  value={chartMetric}
                  onChange={(e) => setChartMetric(e.target.value)}
                >
                  <option>Telephone Numbers</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[4610, 4640]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pbxPhoneNumber" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;