import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';

export default function EmployeeForm({ edit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    f_Name: '', f_Email: '', f_Mobile: '', f_Designation: 'HR', f_gender: 'Male', f_Course: []
  });
  const [err, setErr] = useState('');

  useEffect(() => { if (id) load(); }, [id]);

  async function load() {
    try { setForm(await apiFetch(`/employees/${id}`, { method: 'GET' })); } catch (e) {}
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(s => ({ ...s, f_Image: reader.result }));
    reader.readAsDataURL(file);
  }

  function toggleCourse(value) {
    setForm(s => {
      const arr = s.f_Course || [];
      return arr.includes(value) ? { ...s, f_Course: arr.filter(x => x !== value) } : { ...s, f_Course: [...arr, value] };
    });
  }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      if (!form.f_Name || !form.f_Email) throw new Error('Name and Email required');
      const method = id ? 'PUT' : 'POST';
      await apiFetch(id ? `/employees/${id}` : '/employees', { method, body: form });
      navigate('/employees');
    } catch (error) { setErr(error.message || 'Error'); }
  }

  return (
    <div>
      <h2>{id ? 'Edit Employee' : 'Create Employee'}</h2>
      <form onSubmit={submit}>
        <label>Name<input value={form.f_Name} onChange={e => setForm({ ...form, f_Name: e.target.value })} /></label>
        <label>Email<input value={form.f_Email} onChange={e => setForm({ ...form, f_Email: e.target.value })} /></label>
        <label>Mobile<input value={form.f_Mobile} onChange={e => setForm({ ...form, f_Mobile: e.target.value })} /></label>
        <label>Designation
          <select value={form.f_Designation} onChange={e => setForm({ ...form, f_Designation: e.target.value })}>
            <option>HR</option><option>Manager</option><option>Sales</option>
          </select>
        </label>
        <div>Gender:
          <label><input type="radio" checked={form.f_gender==='Male'} onChange={()=>setForm({ ...form, f_gender:'Male' })} /> Male</label>
          <label><input type="radio" checked={form.f_gender==='Female'} onChange={()=>setForm({ ...form, f_gender:'Female' })} /> Female</label>
        </div>
        <div>Course:
          <label><input type="checkbox" checked={form.f_Course.includes('MCA')} onChange={()=>toggleCourse('MCA')} /> MCA</label>
          <label><input type="checkbox" checked={form.f_Course.includes('BCA')} onChange={()=>toggleCourse('BCA')} /> BCA</label>
          <label><input type="checkbox" checked={form.f_Course.includes('BSC')} onChange={()=>toggleCourse('BSC')} /> BSC</label>
        </div>
        <label>Image<input type="file" accept="image/*" onChange={handleFile} /></label>
        {form.f_Image && <img src={form.f_Image} alt="preview" style={{ width: 100 }} />}
        <button type="submit">{id ? 'Update' : 'Create'}</button>
        {err && <p className="err">{err}</p>}
      </form>
    </div>
  );
}