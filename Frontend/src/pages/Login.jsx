import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { API_URL } from "../config";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        body: { username, password }
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/');
    } catch (error) {
      setErr(error.message || 'Login failed');
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Username
          <input value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
        {err && <p className="err">{err}</p>}
      </form>
    </div>
  );
}