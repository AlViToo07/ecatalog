import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FormMobil.css';

const EditMobil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    merk: '',
    model: '',
    tahun: '',
    harga: '',
    kilometer: '',
    warna: '',
    transmisi: 'Manual',
    bahanBakar: 'Bensin',
    kondisi: 'Baru',
    deskripsi: '',
    gambar: '',
    stok: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchMobil();
  }, [id]);

  const fetchMobil = async () => {
    try {
      const response = await axios.get(`/api/mobil/${id}`);
      const mobil = response.data;
      setFormData({
        merk: mobil.merk,
        model: mobil.model,
        tahun: mobil.tahun.toString(),
        harga: mobil.harga.toString(),
        kilometer: mobil.kilometer.toString(),
        warna: mobil.warna,
        transmisi: mobil.transmisi,
        bahanBakar: mobil.bahanBakar,
        kondisi: mobil.kondisi,
        deskripsi: mobil.deskripsi,
        gambar: mobil.gambar,
        stok: mobil.stok.toString()
      });
      setFetching(false);
    } catch (error) {
      console.error('Error fetching mobil:', error);
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        tahun: parseInt(formData.tahun),
        harga: parseInt(formData.harga),
        kilometer: parseInt(formData.kilometer),
        stok: parseInt(formData.stok)
      };

      await axios.put(`/api/mobil/${id}`, dataToSend);
      navigate(`/mobil/${id}`);
    } catch (error) {
      console.error('Error updating mobil:', error);
      alert('Gagal mengupdate mobil');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="form-mobil">
        <div className="container">
          <div className="loading">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-mobil">
      <div className="container">
        <h1 className="page-title">Edit Mobil</h1>

        <form onSubmit={handleSubmit} className="mobil-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Merk *</label>
              <input
                type="text"
                name="merk"
                value={formData.merk}
                onChange={handleChange}
                required
                placeholder="Contoh: Toyota"
              />
            </div>

            <div className="input-group">
              <label>Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="Contoh: Avanza"
              />
            </div>

            <div className="input-group">
              <label>Tahun *</label>
              <input
                type="number"
                name="tahun"
                value={formData.tahun}
                onChange={handleChange}
                required
                min="1900"
                max="2024"
                placeholder="2023"
              />
            </div>

            <div className="input-group">
              <label>Harga (Rp) *</label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                required
                min="0"
                placeholder="250000000"
              />
            </div>

            <div className="input-group">
              <label>Kilometer *</label>
              <input
                type="number"
                name="kilometer"
                value={formData.kilometer}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>

            <div className="input-group">
              <label>Warna *</label>
              <input
                type="text"
                name="warna"
                value={formData.warna}
                onChange={handleChange}
                required
                placeholder="Putih"
              />
            </div>

            <div className="input-group">
              <label>Transmisi *</label>
              <select
                name="transmisi"
                value={formData.transmisi}
                onChange={handleChange}
                required
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="input-group">
              <label>Bahan Bakar *</label>
              <select
                name="bahanBakar"
                value={formData.bahanBakar}
                onChange={handleChange}
                required
              >
                <option value="Bensin">Bensin</option>
                <option value="Diesel">Diesel</option>
                <option value="Listrik">Listrik</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="input-group">
              <label>Kondisi *</label>
              <select
                name="kondisi"
                value={formData.kondisi}
                onChange={handleChange}
                required
              >
                <option value="Baru">Baru</option>
                <option value="Bekas">Bekas</option>
              </select>
            </div>

            <div className="input-group">
              <label>Stok *</label>
              <input
                type="number"
                name="stok"
                value={formData.stok}
                onChange={handleChange}
                required
                min="0"
                placeholder="5"
              />
            </div>
          </div>

          <div className="input-group">
            <label>URL Gambar</label>
            <input
              type="url"
              name="gambar"
              value={formData.gambar}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="input-group">
            <label>Deskripsi *</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              placeholder="Deskripsi lengkap tentang mobil..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Update Mobil'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/mobil/${id}`)}
              className="btn btn-secondary"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMobil;




