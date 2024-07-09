import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './Components/Login';
import LandingPage from './Components/Landing';
import ResellerList from './Components/Reseller';
import DomainList from './Components/DomainList';
import Navbar from './Components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/" element={
          isAuthenticated ? <LandingPage /> : <Navigate to="/login" />
        } />
        <Route path="/resellers" element={
          isAuthenticated ? <ResellerList /> : <Navigate to="/login" />
        } />
        <Route path="/domains/:reseller" element={
          isAuthenticated ? <DomainList /> : <Navigate to="/login" />
        } />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;