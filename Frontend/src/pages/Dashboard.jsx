import React from 'react';

export default function Dashboard() {
  const username = localStorage.getItem('username') || 'Admin';
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  }
  return (
    <div>
      <h1>Welcome to MachineTest</h1>
      <p>Signed in as <strong>{username}</strong></p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}