import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdminMobil.css';

const AdminMobil = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobil, setMobil] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMobil = useCallback(async () => {
    try {
      setLoading(true);
      // Tambahkan timestamp untuk cache busting
      const response = await axios.get('/api/mobil', {
        params: {
          _t: Date.now()
        }
      });
      console.log('Fetched mobil data:', response.data?.length || 0, 'items');
      setMobil(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mobil:', error);
      setMobil([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    // Listen untuk event mobilUpdated
    const handleMobilUpdate = () => {
      console.log('Event mobilUpdated received, refreshing...');
      fetchMobil();
    };
    window.addEventListener('mobilUpdated', handleMobilUpdate);

    return () => {
      window.removeEventListener('mobilUpdated', handleMobilUpdate);
    };
  }, [navigate, fetchMobil]);

  // Fetch data saat component mount dan ketika pathname berubah
  useEffect(() => {
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isAdmin || location.pathname !== '/admin/mobil') {
      return;
    }

    // Check flag refresh
    const needsRefresh = sessionStorage.getItem('mobilNeedsRefresh') === 'true';
    if (needsRefresh) {
      sessionStorage.removeItem('mobilNeedsRefresh');
      // Delay untuk memastikan data sudah tersimpan di backend
      const timer = setTimeout(() => {
        console.log('Refreshing data after add/edit...');
        fetchMobil();
      }, 800);
      return () => clearTimeout(timer);
    } else {
      // Fetch data normal saat pertama kali load
      fetchMobil();
    }
  }, [location.pathname, fetchMobil]);


  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mobil ini?')) {
      try {
        await axios.delete(`/api/mobil/${id}`);
        fetchMobil();
      } catch (error) {
        console.error('Error deleting mobil:', error);
        alert('Gagal menghapus mobil');
      }
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  if (loading) {
    return (
      <div className="admin-mobil">
        <div className="container">
          <div className="loading">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-mobil">
      <div className="container">
        <div className="admin-header">
          <div>
            <Link to="/admin" className="back-link" style={{ display: 'inline-block', marginBottom: '10px', color: '#D8251D', textDecoration: 'none' }}>
              ← Kembali ke Dashboard
            </Link>
            <h1 className="page-title">Kelola Mobil</h1>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Kembali ke Website
            </Link>
            <Link to="/admin/mobil/tambah" className="btn btn-primary">
              + Tambah Mobil Baru
            </Link>
          </div>
        </div>

        <div className="mobil-table-container">
          <table className="mobil-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Jenis</th>
                <th>Tahun</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mobil.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">Tidak ada data mobil</td>
                </tr>
              ) : (
                mobil.map(m => (
                  <tr key={m.id}>
                    <td>{m.model}</td>
                    <td>{m.jenis || '-'}</td>
                    <td>{m.tahun}</td>
                    <td>
                      {(() => {
                        let transmisiHarga = m.transmisiHarga || [];
                        if (!Array.isArray(transmisiHarga) || transmisiHarga.length === 0) {
                          // Fallback untuk data lama
                          if (m.harga) {
                            return formatRupiah(m.harga);
                          }
                          return '-';
                        }
                        const minHarga = Math.min(...transmisiHarga.map(t => t.harga));
                        const maxHarga = Math.max(...transmisiHarga.map(t => t.harga));
                        if (minHarga === maxHarga) {
                          return formatRupiah(minHarga);
                        }
                        return `${formatRupiah(minHarga)} - ${formatRupiah(maxHarga)}`;
                      })()}
                    </td>
                    <td>{m.stok}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/mobil/edit/${m.id}`} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMobil;

