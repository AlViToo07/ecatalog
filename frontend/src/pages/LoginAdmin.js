import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginAdmin.css';

const LoginAdmin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/admin/login', formData);
      if (response.data.success) {
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/admin');
      }
    } catch (error) {
      setError('Username atau password salah');
      setLoading(false);
    }
  };

  return (
    <div className="login-admin">
      <div className="login-container">
        <div className="login-card">
          <h1>Admin Login</h1>
          <p className="login-subtitle">Masuk ke dashboard admin</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Masukkan username"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Masukkan password"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <div className="login-info">
            <p><strong>Default Login:</strong></p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;




