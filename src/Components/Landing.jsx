import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <img src="https://www.netsapiens.com/wp-content/uploads/2017/03/final-logo-white-background.png" alt="NetSapiens Logo" className="w-48 mx-auto mb-8" />
          <h1 className="text-5xl font-bold mb-6">Welcome to NetSapiens</h1>
          <p className="text-xl mb-10">Delivering seamless customer experiences across Unified Communications, Collaboration & Contact Center Solutions.</p>
          <Link to="/resellers" className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition duration-300 text-lg">
            Explore Resellers
          </Link>
          <Link to="/user-statistics" className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition duration-300 text-lg">
            User Statistics
          </Link>
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
    </div>
  );
};

export default LandingPage;