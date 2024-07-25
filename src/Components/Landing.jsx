// src/LandingPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createFirebaseUser, saveAccessToken } from '../firebase';
import { getResellers } from '../ApiConfig';

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [resellers, setResellers] = useState([]);
  const [selectedReseller, setSelectedReseller] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (showModal && step === 1) {
      fetchResellers();
    }
  }, [showModal, step]);


  useEffect(() => {
    console.log(resellers);
  }, [resellers])

  const fetchResellers = async () => {
    try {
      const resellerList = await getResellers();
      setResellers(resellerList.data);
    } catch (error) {
      console.error('Error fetching resellers:', error);
      setMessage('Error fetching resellers. Please try again.');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage('Creating user...');
    try {
      const result = await createFirebaseUser(email, password);
      if (result.success) {
        await saveAccessToken(result.user.uid, selectedReseller, accessToken);
        setMessage('User created and access token saved successfully');
        resetForm();
        setTimeout(() => {
          setShowModal(false);
          setMessage('');
          setStep(1);
        }, 2000);
      } else {
        setMessage('Error: ' + result.error);
      }
    } catch (error) {
      setMessage('Error creating user: ' + error.message);
    }
  };

  const resetForm = () => {
    setSelectedReseller('');
    setEmail('');
    setPassword('');
    setAccessToken('');
  };

  const renderModalContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Reseller</h2>
            <select
              value={selectedReseller}
              onChange={(e) => setSelectedReseller(e.target.value)}
              className="w-full p-2 mb-4 border rounded text-black"
              required
            >
              <option value="">Select a reseller</option>
              {resellers.map((reseller) => (
                <option key={reseller.id} value={reseller.id}>
                  {reseller.reseller}
                </option>
              ))}
            </select>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedReseller}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Next
            </button>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Authenticate Reseller</h2>
            <form onSubmit={handleCreateUser}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black"
                required
              />
              <input
                type="text"
                placeholder="Access Token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black"
                required
              />
              <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
                Create User
              </button>
              <button type="button" onClick={() => setStep(1)} className="ml-2 text-gray-600 hover:text-gray-800">
                Back
              </button>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <img src="https://www.netsapiens.com/wp-content/uploads/2017/03/final-logo-white-background.png" alt="NetSapiens Logo" className="w-48 mx-auto mb-8" />
          <h1 className="text-5xl font-bold mb-6">Welcome to NetSapiens</h1>
          <p className="text-xl mb-10">Delivering seamless customer experiences across Unified Communications, Collaboration & Contact Center Solutions.</p>
          <div className="space-x-4">
            <Link to="/resellers" className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition duration-300 text-lg">
              Explore Resellers
            </Link>
            <Link to="/user-statistics" className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition duration-300 text-lg">
              User Statistics
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition duration-300 text-lg"
            >
              Authenticate Reseller
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-white bg-opacity-10">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Our Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Unified Communications</h3>
              <p>Streamline your business communications with our advanced UC platform.</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Contact Center</h3>
              <p>Enhance customer experiences with our powerful contact center solutions.</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Collaboration Tools</h3>
              <p>Boost productivity with our suite of collaboration and team management tools.</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            {renderModalContent()}
            {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
            {step === 2 && (
              <button onClick={() => setShowModal(false)} className="mt-4 text-gray-600 hover:text-gray-800">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
