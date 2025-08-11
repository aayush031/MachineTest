import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';

export default function EmployeeList() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await apiFetch(`/employees${q}`, { method: 'GET' });
      setList(data || []);
    } catch (err) {
      alert(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await apiFetch(`/employees/${id}`, { method: "DELETE" });
      load(); // reload list after delete
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Employee List</h2>
      <input
        placeholder="Search"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button onClick={load}>Search</button>
      <Link to="/create" style={{ marginLeft: '10px' }}>+ Create</Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Id</th><th>Name</th><th>Email</th><th>Mobile</th><th>Action</th></tr>
          </thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan="5">No employees</td></tr>}
            {list.map(emp => (
              <tr key={emp.f_Id}>
                <td>{emp.f_Id}</td>
                <td>{emp.f_Name}</td>
                <td>{emp.f_Email}</td>
                <td>{emp.f_Mobile}</td>
                <td>
                  <Link to={`/edit/${emp.f_Id}`}>Edit</Link>{" | "}
                  <button
                    onClick={() => remove(emp.f_Id)}
                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
