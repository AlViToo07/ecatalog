import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AdminPromo.css';

const AdminPromo = () => {
  const navigate = useNavigate();
  const [promo, setPromo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    gambar: '',
    tanggalAwal: '',
    tanggalAkhir: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchPromo();
  }, [navigate]);

  const fetchPromo = async () => {
    try {
      const response = await axios.get('/api/promo');
      setPromo(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching promo:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi hanya JPEG
    const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';
    if (!isJpeg) {
      alert('Hanya file JPEG/JPG yang diperbolehkan');
      e.target.value = '';
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      e.target.value = '';
      return;
    }

    setSelectedImage(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setFormData({
      ...formData,
      gambar: ''
    });
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', selectedImage);

      const response = await axios.post('/api/promo/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({
        ...prev,
        gambar: response.data.image
      }));
      setSelectedImage(null);
      setUploading(false);
      alert('Gambar berhasil diupload');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal upload gambar: ' + (error.response?.data?.message || error.message));
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.judul || formData.judul.trim() === '') {
      alert('Judul promo harus diisi');
      return;
    }
    
    if (!formData.gambar || formData.gambar.trim() === '') {
      alert('Gambar promo harus diupload terlebih dahulu');
      return;
    }
    
    try {
      const response = editingPromo 
        ? await axios.put(`/api/promo/${editingPromo.id}`, formData)
        : await axios.post('/api/promo', formData);
      
      if (response.status === 201 || response.status === 200) {
        setShowForm(false);
        setEditingPromo(null);
        setFormData({
          judul: '',
          deskripsi: '',
          gambar: '',
          tanggalAwal: '',
          tanggalAkhir: ''
        });
        setSelectedImage(null);
        fetchPromo();
        // Trigger event untuk refresh navbar
        window.dispatchEvent(new Event('promoUpdated'));
        alert('Promo berhasil disimpan');
      }
    } catch (error) {
      console.error('Error saving promo:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Gagal menyimpan promo';
      const errorDetails = error.response?.data?.error;
      alert(`${errorMessage}${errorDetails ? '\n\nDetail: ' + errorDetails : ''}`);
    }
  };

  const handleEdit = (p) => {
    setEditingPromo(p);
    setFormData({
      judul: p.judul || '',
      deskripsi: p.deskripsi || '',
      gambar: p.gambar || '',
      tanggalAwal: p.tanggalAwal ? p.tanggalAwal.split('T')[0] : '',
      tanggalAkhir: p.tanggalAkhir ? p.tanggalAkhir.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus promo ini?')) {
      try {
        await axios.delete(`/api/promo/${id}`);
        fetchPromo();
        // Trigger event untuk refresh navbar
        window.dispatchEvent(new Event('promoUpdated'));
      } catch (error) {
        console.error('Error deleting promo:', error);
        alert('Gagal menghapus promo');
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingPromo(null);
    setFormData({
      judul: '',
      deskripsi: '',
      gambar: '',
      tanggalAwal: '',
      tanggalAkhir: ''
    });
  };

  if (loading) {
    return (
      <div className="admin-promo">
        <div className="container">
          <div className="loading">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-promo">
      <div className="container">
        <div className="admin-header">
          <div>
            <Link to="/admin" className="back-link" style={{ display: 'inline-block', marginBottom: '10px', color: '#D8251D', textDecoration: 'none' }}>
              ← Kembali ke Dashboard
            </Link>
            <h1 className="page-title">Kelola Promo</h1>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Kembali ke Website
            </Link>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              + Tambah Promo Baru
            </button>
          </div>
        </div>

        {showForm && (
          <div className="promo-form-container">
            <div className="promo-form">
              <h2>{editingPromo ? 'Edit Promo' : 'Tambah Promo Baru'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Judul Promo</label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    placeholder="Contoh: Promo Tahun Baru"
                  />
                </div>

                <div className="input-group">
                  <label>Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    placeholder="Deskripsi promo..."
                    rows="4"
                  />
                </div>

                <div className="input-group">
                  <label>Upload Gambar Brosur (JPEG) *</label>
                  <div className="upload-section">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg"
                      onChange={handleImageSelect}
                      className="file-input"
                      disabled={!!formData.gambar}
                    />
                    <p className="upload-info" style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                      Format: JPEG/JPG, Maksimal 5MB
                    </p>
                    
                    {selectedImage && !formData.gambar && (
                      <div className="selected-images-preview" style={{ marginTop: '15px' }}>
                        <p style={{ marginBottom: '10px', fontWeight: '600' }}>Preview Gambar:</p>
                        <div className="image-preview-list" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <div className="image-preview-item" style={{ position: 'relative', width: '200px' }}>
                            <img 
                              src={URL.createObjectURL(selectedImage)} 
                              alt="Preview" 
                              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                            <button
                              type="button"
                              onClick={handleImageRemove}
                              className="remove-image-btn"
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: '#D8251D',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                                fontSize: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          className="btn btn-primary"
                          disabled={uploading}
                          style={{ marginTop: '10px' }}
                        >
                          {uploading ? 'Uploading...' : 'Upload Gambar'}
                        </button>
                      </div>
                    )}

                    {formData.gambar && (
                      <div style={{ marginTop: '15px' }}>
                        <p style={{ marginBottom: '10px', fontWeight: '600' }}>Gambar Terupload:</p>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <img 
                            src={formData.gambar} 
                            alt="Promo" 
                            style={{ 
                              maxWidth: '300px', 
                              maxHeight: '200px', 
                              borderRadius: '8px',
                              border: '2px solid #ddd'
                            }} 
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, gambar: '' });
                              setSelectedImage(null);
                            }}
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              background: '#D8251D',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              cursor: 'pointer',
                              fontSize: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>Tanggal Awal</label>
                    <input
                      type="date"
                      name="tanggalAwal"
                      value={formData.tanggalAwal}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Tanggal Akhir</label>
                    <input
                      type="date"
                      name="tanggalAkhir"
                      value={formData.tanggalAkhir}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!formData.gambar || uploading}
                  >
                    {editingPromo ? 'Update Promo' : 'Tambah Promo'}
                  </button>
                  <button type="button" onClick={cancelForm} className="btn btn-secondary">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="promo-list">
          {promo.length === 0 ? (
            <div className="no-promo">Tidak ada promo</div>
          ) : (
            promo.map(p => (
              <div key={p.id} className="promo-item card">
                {p.gambar && (
                  <div className="promo-item-image">
                    <img src={p.gambar} alt={p.judul || 'Promo'} />
                  </div>
                )}
                <div className="promo-item-content">
                  {p.judul && <h3>{p.judul}</h3>}
                  {p.deskripsi && <p>{p.deskripsi}</p>}
                  {p.tanggalAwal && p.tanggalAkhir && (
                    <p className="promo-date">
                      {new Date(p.tanggalAwal).toLocaleDateString('id-ID')} - {new Date(p.tanggalAkhir).toLocaleDateString('id-ID')}
                    </p>
                  )}
                  <div className="promo-actions">
                    <button onClick={() => handleEdit(p)} className="btn btn-secondary btn-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPromo;

