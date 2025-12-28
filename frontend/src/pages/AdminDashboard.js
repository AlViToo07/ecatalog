import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <div className="admin-actions">
            <Link to="/" className="btn btn-secondary">
              Kembali ke Website
            </Link>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
        
        <div className="admin-menu">
          <Link to="/admin/mobil" className="admin-card">
            <div className="admin-icon">🚗</div>
            <h3>Kelola Mobil</h3>
            <p>Tambah, edit, atau hapus data mobil Toyota</p>
          </Link>

          <Link to="/admin/promo" className="admin-card">
            <div className="admin-icon">🎁</div>
            <h3>Kelola Promo</h3>
            <p>Upload dan kelola informasi promo serta brosur</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

