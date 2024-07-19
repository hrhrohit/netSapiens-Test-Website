import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getDomains, getUserCount, getDomainInfo, getUser, getDeviceCount, getDomainMeetings, getCallHistory, getCallqueues } from "../ApiConfig";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DomainList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resellerName = location.state?.resellerName;
  const { reseller } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [domainsState, setDomainsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [graphMetric, setGraphMetric] = useState('PBX Seats');
  const [graphPeriod, setGraphPeriod] = useState('7 DAYS');
  const [callHistoryData, setCallHistoryData] = useState([]);

  const fetchDomainDetails = useCallback(async (domain) => {
    try {
      const [vmailTrans, userCountResponse, fetchUserData, callQueuesResponse] = await Promise.all([
        getDomainInfo(domain.domain),
        getUserCount(domain.domain),
        getUser(domain.domain),
        getCallqueues(domain.domain)
      ]);

      const devicePromises = fetchUserData.data.map(user => 
        getDeviceCount(domain.domain, user.user)
      );
      const meetingPromises = fetchUserData.data.map(user => 
        getDomainMeetings(domain.domain, user.user)
      );

      const [deviceResponses, meetingResponses] = await Promise.all([
        Promise.all(devicePromises),
        Promise.all(meetingPromises)
      ]);

      const totalDevices = deviceResponses.reduce((sum, response) => sum + response.data.total, 0);
      const totalMeetingRooms = meetingResponses.reduce((sum, response) => sum + response.data.total, 0);
      const callQueueCount = callQueuesResponse.data.length;

      console.log(`Call queue count for ${domain.domain}:`, callQueueCount);

      return {
        ...domain,
        pbxUserCount: userCountResponse.data.total,
        vmailTransValue: vmailTrans?.data?.['voicemail-transcription-enabled'],
        totalDevices,
        totalMeetingRooms,
        callQueueCount
      };
    } catch (error) {
      console.error(`Error fetching data for ${domain.domain}:`, error);
      return {
        ...domain,
        pbxUserCount: 'N/A',
        vmailTransValue: 'N/A',
        totalDevices: 'N/A',
        totalMeetingRooms: 'N/A',
        callQueueCount: 'N/A'
      };
    }
  }, []);

  const fetchCallHistoryData = useCallback(async (domain) => {
    const endDate = new Date().toISOString().split('T')[0] + ' 23:59:59';
    const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 00:00:00';

    try {
      console.log("Fetching call history for domain:", domain, "from", startDate, "to", endDate);
      const response = await getCallHistory(domain, startDate, endDate);
      const calls = response.data;
      console.log("Call history response data:", calls);

      // Check the structure of the response data
      if (!Array.isArray(calls)) {
        console.error("Unexpected response format:", calls);
        return;
      }

      // Group calls by month
      const groupedCalls = calls.reduce((acc, call) => {
        const dateStr = call.start_time || call["call-answer-datetime"];
        if (!dateStr) {
          console.error("Missing start_time in call data:", call);
          return acc;
        }

        const date = new Date(dateStr);
        if (isNaN(date)) {
          console.error("Invalid date:", dateStr);
          return acc;
        }

        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      }, {});

      console.log("Grouped calls by month:", groupedCalls);

      // Convert to array and sort by date
      const sortedData = Object.entries(groupedCalls)
        .map(([monthYear, count]) => ({ monthYear, count }))
        .sort((a, b) => new Date(`${a.monthYear}-01`) - new Date(`${b.monthYear}-01`));

      console.log("Sorted call history data:", sortedData);

      setCallHistoryData(sortedData);
    } catch (error) {
      console.error('Error fetching call history:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const domainsResponse = await getDomains();
        const domainsData = domainsResponse.data.filter(item =>
          item.reseller.toLowerCase().includes(resellerName.toLowerCase())
        );

        const domainsWithDetails = await Promise.all(
          domainsData.map(fetchDomainDetails)
        );

        setDomainsState(domainsWithDetails);
        setLoading(false);

        // Generate mock graph data
        const mockGraphData = generateMockGraphData();
        setGraphData(mockGraphData);

        // Fetch call history data for the first domain
        if (domainsWithDetails.length > 0) {
          await fetchCallHistoryData(domainsWithDetails[0].domain);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch domain data');
        setLoading(false);
      }
    };

    fetchData();
  }, [resellerName, fetchDomainDetails, fetchCallHistoryData]);

  const generateMockGraphData = useCallback(() => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
        value: Math.floor(Math.random() * (4650 - 4635 + 1) + 4635)
      });
    }

    return data;
  }, []);

  const filteredData = useMemo(() => 
    domainsState.filter(item =>
      item.domain.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [domainsState, searchTerm]
  );

  const sortedByDeviceCount = useMemo(() => 
    [...filteredData].sort((a, b) => b.totalDevices - a.totalDevices),
    [filteredData]
  );

  const handleDomainClick = useCallback((domain) => {
    navigate(`/domain-details/${domain}`, { state: { domainName: domain } });
  }, [navigate]);

  const ResellerGraph = useCallback(() => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-[#00B4FC] p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white plus-jakarta-sans-bold">Reseller Graph</h2>
        <div className="flex space-x-2">
          <select 
            value={graphPeriod} 
            onChange={(e) => setGraphPeriod(e.target.value)}
            className="bg-white text-[#00B4FC] rounded px-2 py-1 text-sm"
          >
            <option>7 DAYS</option>
            <option>30 DAYS</option>
            <option>60 DAYS</option>
          </select>
          <select 
            value={graphMetric} 
            onChange={(e) => setGraphMetric(e.target.value)}
            className="bg-white text-[#00B4FC] rounded px-2 py-1 text-sm"
          >
            <option>PBX Seats</option>
            <option>Telephone Numbers</option>
            <option>Call Center Seats</option>
            <option>Call Recording Seats</option>
            <option>SIP Trunks</option>
            <option>Meeting Rooms</option>
            <option>Voicemail Transcription</option>
          </select>
        </div>
      </div>
      <div className="p-4" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[4630, 4655]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00B4FC" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  ), [graphPeriod, graphMetric, graphData]);

  const CallHistoryGraph = useCallback(() => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-[#00B4FC] p-4">
        <h2 className="text-xl font-bold text-white plus-jakarta-sans-bold">Call History</h2>
      </div>
      <div className="p-4" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={callHistoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="monthYear" 
              tickFormatter={(tick) => {
                const [year, month] = tick.split('-');
                return `${month}/${year.slice(2)}`;
              }}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(label) => {
                const [year, month] = label.split('-');
                return `${month}/${year}`;
              }}
            />
            <Line type="monotone" dataKey="count" name="Number of Calls" stroke="#00B4FC" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  ), [callHistoryData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-[#00B4FC] p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white plus-jakarta-sans-bold">Domain Statistics for {reseller}</h1>
            <div className="relative flex-grow mx-8">
              <input
                type="text"
                placeholder="Search domains..."
                className="w-full bg-white text-gray-800 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#25C1FF] plus-jakarta-sans-regular"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 plus-jakarta-sans-semibold">
                <th className="py-3 px-4 font-semibold">Domain</th>
                <th className="py-3 px-4 font-semibold">PBX Users</th>
                <th className="py-3 px-4 font-semibold">Call Center</th>
                <th className="py-3 px-4 font-semibold">Call Recording</th>
                <th className="py-3 px-4 font-semibold">Meeting Rooms</th>
                <th className="py-3 px-4 font-semibold">Voicemail Transcription</th>
                <th className="py-3 px-4 font-semibold">Telephone Numbers</th>
                <th className="py-3 px-4 font-semibold">SIP Trunks</th>
                <th className="py-3 px-4 font-semibold">Total Devices</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b hover:bg-[#E6F7FE] transition duration-150 ease-in-out plus-jakarta-sans-regular cursor-pointer"
                  onClick={() => handleDomainClick(item.domain)}
                >
                  <td className="py-3 px-4 font-medium">{item.domain}</td>
                  <td className="py-3 px-4">{item.pbxUserCount}</td>
                  <td className="py-3 px-4">{item.callQueueCount}</td>
                  <td className="py-3 px-4">{item["is-stir-enabled"] === "yes" ? "Enabled" : "Disabled"}</td>
                  <td className="py-3 px-4">{item.totalMeetingRooms}</td>
                  <td className="py-3 px-4">{Math.floor(Math.random() * 5)}</td>
                  <td className="py-3 px-4">{item.vmailTransValue}</td>
                  <td className="py-3 px-4">{Math.floor(Math.random() * 20)}</td>
                  <td className="py-3 px-4">{item.totalDevices}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-1/2 px-4 mb-8">
          <ResellerGraph />
        </div>
        <div className="w-full lg:w-1/2 px-4 mb-8">
          <CallHistoryGraph />
        </div>
      </div>

      <div className="w-full px-4 mb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#00B4FC] p-4">
            <h2 className="text-xl font-bold text-white plus-jakarta-sans-bold">Domain Device Count</h2>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 plus-jakarta-sans-semibold">
                  <th className="py-3 px-4 font-semibold">Domain</th>
                  <th className="py-3 px-4 font-semibold">Total Devices</th>
                </tr>
              </thead>
              <tbody>
                {sortedByDeviceCount.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-[#E6F7FE] transition duration-150 ease-in-out plus-jakarta-sans-regular">
                    <td className="py-3 px-4 font-medium">{item.domain}</td>
                    <td className="py-3 px-4">{item.totalDevices}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainList;