import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllDomains, fetchResellers, filterDomains } from "../Redux/slice";

const ResellerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { resellers, loading, error } = useSelector((state) => state.domains);

  useEffect(() => {
    dispatch(fetchResellers());
  }, [dispatch]);

  const refreshData = () => {
    dispatch(fetchResellers());
    dispatch(fetchAllDomains());
  };
  
  const handleResellerClick = (reseller) => {
    dispatch(filterDomains(reseller));
    navigate(`/domains/${reseller}`, { state: { resellerName: reseller } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#00B4FC] p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white plus-jakarta-sans-bold">Reseller</h1>
            <button
              onClick={refreshData}
              className="text-white hover:bg-[#25C1FF] rounded-full p-2 transition duration-300 ease-in-out"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 plus-jakarta-sans-semibold">
                <th className="py-3 px-4 font-semibold">Reseller</th>
                <th className="py-3 px-4 font-semibold">Description</th>
                <th className="py-3 px-4 font-semibold">Total Domains</th>
              </tr>
            </thead>
            <tbody>
              {resellers && resellers.map((item, index) => (
                <tr key={index}
                  className="border-b hover:bg-[#E6F7FE] transition duration-150 ease-in-out plus-jakarta-sans-regular"
                  onClick={() => handleResellerClick(item.reseller)}
                >

                  <td className="py-3 px-4 font-medium  hover:cursor-pointer hover:text-blue-400">{item.reseller}</td>
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="py-3 px-4">{item["domains-total"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResellerList;