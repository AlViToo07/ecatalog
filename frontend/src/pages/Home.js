import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [bestSellerMobil, setBestSellerMobil] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSeller();
  }, []);

  const fetchBestSeller = async () => {
    try {
      const response = await axios.get('/api/mobil');
      // Ambil 3 mobil pertama sebagai best seller (atau bisa diubah logikanya)
      const bestSellers = response.data.slice(0, 3);
      setBestSellerMobil(bestSellers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching best seller:', error);
      setLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Mobil Terbaik Keluarga Indonesia</h1>
            <p className="hero-subtitle">Selamat datang di Toyota E-Catalog</p>
          </div>
        </div>
      </div>

      {/* Best Seller Section */}
      <div className="best-seller-section">
        <div className="container">
          {loading ? (
            <div className="loading">Memuat data...</div>
          ) : (
            <>
              <div className="best-seller-grid">
                {bestSellerMobil.map((mobil) => {
                  const gambar = Array.isArray(mobil.gambar) ? mobil.gambar : (mobil.gambar ? [mobil.gambar] : []);
                  return (
                  <div key={mobil.id} className="best-seller-card">
                    <div className="best-seller-image">
                      <img src={gambar[0] || 'https://via.placeholder.com/400x300'} alt={mobil.model} />
                      <div className="best-seller-badge">NEW</div>
                    </div>
                    <div className="best-seller-content">
                      <h3 className="best-seller-model">{mobil.model}</h3>
                      <p className="best-seller-description">
                        {mobil.deskripsi.length > 100 
                          ? mobil.deskripsi.substring(0, 100) + '...' 
                          : mobil.deskripsi}
                      </p>
                      <div className="best-seller-price">
                        {(() => {
                          let transmisiHarga = mobil.transmisiHarga || [];
                          if (!Array.isArray(transmisiHarga) || transmisiHarga.length === 0) {
                            if (Array.isArray(mobil.transmisi)) {
                              transmisiHarga = mobil.transmisi.map(t => ({ type: t, harga: mobil.harga || 0 }));
                            } else if (mobil.transmisi) {
                              transmisiHarga = [{ type: mobil.transmisi, harga: mobil.harga || 0 }];
                            }
                          }
                          const minHarga = transmisiHarga.length > 0 ? Math.min(...transmisiHarga.map(t => t.harga)) : mobil.harga || 0;
                          const maxHarga = transmisiHarga.length > 0 ? Math.max(...transmisiHarga.map(t => t.harga)) : mobil.hargaMax || mobil.harga || 0;
                          return (
                            <>
                              {formatRupiah(minHarga)}
                              {maxHarga > minHarga && <span> - {formatRupiah(maxHarga)}</span>}
                            </>
                          );
                        })()}
                      </div>
                      <div className="best-seller-specs">
                        <span className="spec-tag">{mobil.jenis}</span>
                        {(() => {
                          let transmisiHarga = mobil.transmisiHarga || [];
                          if (!Array.isArray(transmisiHarga) || transmisiHarga.length === 0) {
                            if (Array.isArray(mobil.transmisi)) {
                              transmisiHarga = mobil.transmisi.map(t => ({ type: t }));
                            } else if (mobil.transmisi) {
                              transmisiHarga = [{ type: mobil.transmisi }];
                            }
                          }
                          return transmisiHarga.map((t, idx) => (
                            <span key={idx} className="spec-tag">{t.type}</span>
                          ));
                        })()}
                      </div>
                      <Link 
                        to={`/mobil/${mobil.id}`} 
                        className="btn btn-primary best-seller-btn"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                  );
                })}
              </div>
              <div className="see-all-container">
                <Link to="/catalog" className="btn btn-outline see-all-btn">
                  See All Product
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="container">
          <h2 className="features-title">Mengapa Pilih Kami?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Pencarian Mudah</h3>
              <p>Cari mobil berdasarkan jenis, model, atau spesifikasi yang Anda inginkan</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Harga Terjangkau</h3>
              <p>Dapatkan mobil Toyota berkualitas dengan harga yang kompetitif</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Terpercaya</h3>
              <p>Semua mobil terverifikasi dan dalam kondisi baru</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
