import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResellerList from './Components/Reseller';
import DomainList from './Components/DomainList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResellerList />} />
        <Route path="/domains/:reseller" element={<DomainList />} />
      </Routes>
    </Router>
  );
}

export default App;