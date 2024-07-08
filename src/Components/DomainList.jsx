import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getDomains, getUserCount } from "../ApiConfig";

const DomainList = () => {
  const location = useLocation();
  const resellerName = location.state?.resellerName;
  const [searchTerm, setSearchTerm] = useState('');
  const { reseller } = useParams();
  const [filteredDomainsState, setFilteredDomainsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const domainsResponse = await getDomains();
        const domainsData = domainsResponse.data.filter(item =>
          item.reseller.toLowerCase().includes(resellerName.toLowerCase())
        );

        const domainsWithUserCounts = await Promise.all(
          domainsData.map(async (domain) => {
            try {
              const userCountResponse = await getUserCount(domain.domain);
              return {
                ...domain,
                pbxUserCount: userCountResponse.data.total
              };
            } catch (error) {
              console.error(`Error fetching user count for ${domain.domain}:`, error);
              return {
                ...domain,
                pbxUserCount: 'N/A'
              };
            }
          })
        );

        setFilteredDomainsState(domainsWithUserCounts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch domain data');
        setLoading(false);
      }
    };

    fetchData();
  }, [resellerName]);

  const filteredData = filteredDomainsState.filter(item =>
    item.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
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
                <th className="py-3 px-4 font-semibold">SIP Trunks</th>
                <th className="py-3 px-4 font-semibold">Meeting Rooms</th>
                <th className="py-3 px-4 font-semibold">Voicemail Transcription</th>
                <th className="py-3 px-4 font-semibold">Telephone MS Numbers</th>
                <th className="py-3 px-4 font-semibold">Team Connectors</th>
                <th className="py-3 px-4 font-semibold">Video Connectors</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-[#E6F7FE] transition duration-150 ease-in-out plus-jakarta-sans-regular">
                  <td className="py-3 px-4 font-medium">{item.domain}</td>
                  <td className="py-3 px-4">{item.pbxUserCount}</td>
                  <td className="py-3 px-4">{item["domain-type"] === "Standard" ? "Yes" : "No"}</td>
                  <td className="py-3 px-4">{item["is-stir-enabled"] === "yes" ? "Enabled" : "Disabled"}</td>
                  <td className="py-3 px-4">{Math.floor(Math.random() * 10)}</td>
                  <td className="py-3 px-4">{Math.floor(Math.random() * 5)}</td>
                  <td className="py-3 px-4">{item["music-on-hold-enabled"] === "yes" ? "Yes" : "No"}</td>
                  <td className="py-3 px-4">{Math.floor(Math.random() * 20)}</td>
                  <td className="py-3 px-4">{Math.floor(Math.random() * 3)}</td>
                  <td className="py-3 px-4">{Math.floor(Math.random() * 3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DomainList;