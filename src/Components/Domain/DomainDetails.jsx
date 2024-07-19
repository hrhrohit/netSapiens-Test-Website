import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAutoAttendents, getCallqueues, getDeviceCount, getUser } from '../../ApiConfig';

const DomainDetails = () => {
  const location = useLocation();
  const domainName = location.state?.domainName;

  useEffect(() => {
    const fetchData = async () => {
      let total = 0
      const fetchUserData = await getUser(domainName)
      // console.log(`${fetchUserData.data.length} is the number of users in ${domainName}`);
      const fetchAutoAttendentData = await getAutoAttendents(domainName)
      // console.log(`${fetchAutoAttendentData.data.length} is the number of autoattendents in ${domainName}`);
      fetchUserData.data.map(async (user) => {
        const fetchAutoAttendentData  = await getDeviceCount(domainName, user.user)
        total += fetchAutoAttendentData.data.total
        // console.log(`the total number of devices in ${domainName} is ${total}`);
      })
      const fetchCallqueues =await getCallqueues(domainName)
      // console.log(`the total number of Callqueues in ${domainName} is ${fetchCallqueues.data.length}`);
    }
    fetchData()
  },[])

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#00B4FC] p-4">
          <h2 className="text-xl font-bold text-white plus-jakarta-sans-bold">Domain Details</h2>
        </div>
        <div className="p-4">
          <p className="text-lg font-medium">Domain Name: {domainName}</p>
          {/* Add more details here as needed */}
        </div>
      </div>
    </div>
  );
};

export default DomainDetails;