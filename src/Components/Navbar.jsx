import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-blue-600 text-2xl font-bold flex items-center">
          <img src="https://www.netsapiens.com/wp-content/uploads/2017/03/final-logo-white-background.png" alt="NetSapiens Logo" className="h-8 mr-2" />
          NetSapiens
        </Link>
        {showBackButton && (
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;