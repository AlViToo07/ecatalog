import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FormMobil.css';

const AdminEditMobil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    merk: 'Toyota',
    model: '',
    tahun: new Date().getFullYear(),
    kilometer: 0,
    warna: [],
    transmisiHarga: [],
    bahanBakar: 'Bensin',
    kondisi: 'Baru',
    jenis: '',
    deskripsi: '',
    gambar: [],
    stok: ''
  });
  const [warnaInput, setWarnaInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [manualHarga, setManualHarga] = useState('');
  const [maticHarga, setMaticHarga] = useState('');
  const [hasManual, setHasManual] = useState(false);
  const [hasMatic, setHasMatic] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchMobil();
  }, [id, navigate]);

  const fetchMobil = async () => {
    try {
      const response = await axios.get(`/api/mobil/${id}`);
      const mobil = response.data;
      
      // Handle transmisiHarga
      let transmisiHarga = mobil.transmisiHarga || [];
      if (!Array.isArray(transmisiHarga) || transmisiHarga.length === 0) {
        // Convert dari format lama
        if (Array.isArray(mobil.transmisi)) {
          transmisiHarga = mobil.transmisi.map(t => ({
            type: t,
            harga: mobil.harga || 0
          }));
        } else if (mobil.transmisi) {
          transmisiHarga = [{ type: mobil.transmisi, harga: mobil.harga || 0 }];
        }
      }

      // Set transmisi checkboxes dan harga
      const manual = transmisiHarga.find(t => t.type === 'Manual');
      const matic = transmisiHarga.find(t => t.type === 'Automatic');
      
      setHasManual(!!manual);
      setHasMatic(!!matic);
      setManualHarga(manual && (manual.harga !== undefined && manual.harga !== null) ? manual.harga.toString() : '');
      setMaticHarga(matic && (matic.harga !== undefined && matic.harga !== null) ? matic.harga.toString() : '');

      // Handle gambar
      let gambar = mobil.gambar || [];
      if (typeof gambar === 'string') {
        gambar = [gambar];
      }

      setFormData({
        merk: mobil.merk || 'Toyota',
        model: mobil.model,
        tahun: mobil.tahun.toString(),
        kilometer: mobil.kilometer.toString(),
        warna: Array.isArray(mobil.warna) ? mobil.warna : [mobil.warna],
        transmisiHarga: transmisiHarga,
        bahanBakar: mobil.bahanBakar,
        kondisi: mobil.kondisi,
        jenis: mobil.jenis || '',
        deskripsi: mobil.deskripsi,
        gambar: gambar,
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

  const handleWarnaAdd = () => {
    if (warnaInput.trim()) {
      setFormData({
        ...formData,
        warna: [...formData.warna, warnaInput.trim()]
      });
      setWarnaInput('');
    }
  };

  const handleWarnaRemove = (index) => {
    setFormData({
      ...formData,
      warna: formData.warna.filter((_, i) => i !== index)
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.gambar.length > 10) {
      alert('Maksimal 10 gambar');
      return;
    }

    const invalidFiles = files.filter(file => {
      const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';
      return !isJpeg;
    });

    if (invalidFiles.length > 0) {
      alert('Hanya file JPEG/JPG yang diperbolehkan');
      return;
    }

    setSelectedImages([...selectedImages, ...files]);
  };

  const handleImageRemove = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleImageUpload = async () => {
    if (selectedImages.length === 0) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      selectedImages.forEach((file) => {
        formDataUpload.append('images', file);
      });

      const response = await axios.post('/api/mobil/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({
        ...prev,
        gambar: [...prev.gambar, ...response.data.images]
      }));
      setSelectedImages([]);
      setUploading(false);
      alert('Gambar berhasil diupload');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Gagal upload gambar: ' + (error.response?.data?.message || error.message));
      setUploading(false);
    }
  };

  const handleGambarRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      gambar: prev.gambar.filter((_, i) => i !== index)
    }));
  };

  const updateTransmisiHarga = () => {
    const transmisiHarga = [];
    if (hasManual && manualHarga && manualHarga.trim() !== '') {
      const harga = parseInt(manualHarga);
      if (!isNaN(harga) && harga > 0) {
        transmisiHarga.push({ type: 'Manual', harga: harga });
      }
    }
    if (hasMatic && maticHarga && maticHarga.trim() !== '') {
      const harga = parseInt(maticHarga);
      if (!isNaN(harga) && harga > 0) {
        transmisiHarga.push({ type: 'Automatic', harga: harga });
      }
    }
    setFormData(prev => ({
      ...prev,
      transmisiHarga: transmisiHarga
    }));
  };

  useEffect(() => {
    updateTransmisiHarga();
  }, [hasManual, hasMatic, manualHarga, maticHarga]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.transmisiHarga.length === 0) {
      alert('Pilih minimal satu transmisi dengan harga');
      return;
    }

    if (formData.gambar.length === 0) {
      alert('Upload minimal satu gambar');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        tahun: parseInt(formData.tahun),
        kilometer: parseInt(formData.kilometer),
        stok: parseInt(formData.stok)
      };

      const response = await axios.put(`/api/mobil/${id}`, dataToSend);
      
      // Pastikan data berhasil diupdate
      if (response.status === 200) {
        // Set flag untuk refresh
        sessionStorage.setItem('mobilNeedsRefresh', 'true');
        // Trigger refresh di halaman admin mobil
        window.dispatchEvent(new Event('mobilUpdated'));
        // Navigate setelah data tersimpan dengan delay kecil
        setTimeout(() => {
          navigate('/admin/mobil');
        }, 100);
      }
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
        <h1 className="page-title">Edit Mobil Toyota</h1>

        <form onSubmit={handleSubmit} className="mobil-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="Contoh: All New Avanza"
              />
            </div>

            <div className="input-group">
              <label>Jenis Mobil *</label>
              <select
                name="jenis"
                value={formData.jenis}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jenis</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="MPV">MPV</option>
                <option value="Commercial">Commercial</option>
                <option value="Sport">Sport</option>
              </select>
            </div>

            <div className="input-group">
              <label>Tahun *</label>
              <input
                type="number"
                name="tahun"
                value={formData.tahun}
                onChange={handleChange}
                required
                min="2020"
                max="2025"
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
              />
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

          {/* Transmisi dengan Harga */}
          <div className="input-group transmisi-section">
            <label>Transmisi & Harga *</label>
            <div className="transmisi-options">
              <div className="transmisi-option">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={hasManual}
                    onChange={(e) => setHasManual(e.target.checked)}
                  />
                  <span>Manual</span>
                </label>
                {hasManual && (
                  <input
                    type="number"
                    value={manualHarga}
                    onChange={(e) => setManualHarga(e.target.value)}
                    placeholder="Harga Manual (Rp)"
                    required={hasManual}
                    min="0"
                    className="harga-input"
                  />
                )}
              </div>
              <div className="transmisi-option">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={hasMatic}
                    onChange={(e) => setHasMatic(e.target.checked)}
                  />
                  <span>Automatic (Matic)</span>
                </label>
                {hasMatic && (
                  <input
                    type="number"
                    value={maticHarga}
                    onChange={(e) => setMaticHarga(e.target.value)}
                    placeholder="Harga Matic (Rp)"
                    required={hasMatic}
                    min="0"
                    className="harga-input"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Upload Gambar */}
          <div className="input-group">
            <label>Upload Gambar (JPEG, Maks 10) *</label>
            <div className="upload-section">
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                multiple
                onChange={handleImageSelect}
                className="file-input"
                disabled={formData.gambar.length >= 10}
              />
              <p className="upload-info">
                {formData.gambar.length}/10 gambar terupload. 
                {selectedImages.length > 0 && ` ${selectedImages.length} gambar dipilih.`}
              </p>
              
              {selectedImages.length > 0 && (
                <div className="selected-images-preview">
                  <p>Gambar yang dipilih:</p>
                  <div className="image-preview-list">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="remove-image-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="btn btn-primary"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Gambar'}
                  </button>
                </div>
              )}

              {formData.gambar.length > 0 && (
                <div className="uploaded-images">
                  <p>Gambar yang sudah diupload:</p>
                  <div className="image-preview-list">
                    {formData.gambar.map((url, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={url} alt={`Uploaded ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => handleGambarRemove(index)}
                          className="remove-image-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Warna */}
          <div className="input-group">
            <label>Warna Tersedia *</label>
            <div className="warna-input-group">
              <input
                type="text"
                value={warnaInput}
                onChange={(e) => setWarnaInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleWarnaAdd())}
                placeholder="Masukkan warna, lalu tekan Enter"
                className="warna-input"
              />
              <button type="button" onClick={handleWarnaAdd} className="btn btn-secondary">
                Tambah
              </button>
            </div>
            <div className="warna-list">
              {formData.warna.map((w, index) => (
                <span key={index} className="warna-tag">
                  {w}
                  <button type="button" onClick={() => handleWarnaRemove(index)} className="warna-remove">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="input-group">
            <label>Deskripsi *</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              placeholder="Deskripsi lengkap tentang mobil..."
              rows="5"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
              {loading ? 'Menyimpan...' : 'Update Mobil'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/mobil')}
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

export default AdminEditMobil;
