import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/employees">Employees</Link>
          <Link to="/create">Create</Link>
          <Link to="/login" style={{ float: 'right' }}>Login</Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><EmployeeForm /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><EmployeeForm edit /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}