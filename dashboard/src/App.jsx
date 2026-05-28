import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

import Docs from './pages/Docs';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('dev_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/docs" element={<PrivateRoute><Docs /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
