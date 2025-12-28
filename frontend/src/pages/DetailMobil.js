import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './DetailMobil.css';

const DetailMobil = () => {
  const { id } = useParams();
  const [mobil, setMobil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    fetchMobil();
  }, [id]);

  // Auto carousel effect
  useEffect(() => {
    if (!mobil || !isAutoPlay) return;
    
    const gambar = Array.isArray(mobil.gambar) ? mobil.gambar : (mobil.gambar ? [mobil.gambar] : []);
    if (gambar.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImageIndex(prev => (prev + 1) % gambar.length);
    }, 3000); // Ganti gambar setiap 3 detik

    return () => clearInterval(interval);
  }, [mobil, isAutoPlay]);

  const fetchMobil = async () => {
    try {
      const response = await axios.get(`/api/mobil/${id}`);
      const mobilData = response.data;
      setMobil(mobilData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mobil:', error);
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

  const getColorHex = (warnaName) => {
    const warnaMap = {
      'merah': '#D8251D',
      'red': '#D8251D',
      'hitam': '#000000',
      'black': '#000000',
      'putih': '#FFFFFF',
      'white': '#FFFFFF',
      'abu-abu': '#808080',
      'gray': '#808080',
      'grey': '#808080',
      'silver': '#C0C0C0',
      'perak': '#C0C0C0',
      'biru': '#0066CC',
      'blue': '#0066CC',
      'hijau': '#00AA44',
      'green': '#00AA44',
      'kuning': '#FFD700',
      'yellow': '#FFD700',
      'emas': '#FFD700',
      'gold': '#FFD700',
      'coklat': '#8B4513',
      'brown': '#8B4513',
      'orange': '#FF6600',
      'jingga': '#FF6600'
    };
    
    const normalized = warnaName.toLowerCase().trim();
    return warnaMap[normalized] || '#D8251D'; // Default to red if not found
  };

  const nextImage = () => {
    setIsAutoPlay(false);
    const gambar = Array.isArray(mobil.gambar) ? mobil.gambar : (mobil.gambar ? [mobil.gambar] : []);
    setSelectedImageIndex((prev) => (prev + 1) % gambar.length);
    // Resume auto play setelah 5 detik
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  const prevImage = () => {
    setIsAutoPlay(false);
    const gambar = Array.isArray(mobil.gambar) ? mobil.gambar : (mobil.gambar ? [mobil.gambar] : []);
    setSelectedImageIndex((prev) => (prev - 1 + gambar.length) % gambar.length);
    // Resume auto play setelah 5 detik
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  if (loading) {
    return (
      <div className="detail-mobil">
        <div className="container">
          <div className="loading">Memuat data...</div>
        </div>
      </div>
    );
  }

  if (!mobil) {
    return (
      <div className="detail-mobil">
        <div className="container">
          <div className="error">Mobil tidak ditemukan</div>
        </div>
      </div>
    );
  }

  // Handle gambar - bisa array atau string
  const gambar = Array.isArray(mobil.gambar) ? mobil.gambar : (mobil.gambar ? [mobil.gambar] : []);
  const currentImage = gambar[selectedImageIndex] || gambar[0] || '';

  // Handle transmisiHarga
  let transmisiHarga = mobil.transmisiHarga || [];
  if (!Array.isArray(transmisiHarga) || transmisiHarga.length === 0) {
    if (Array.isArray(mobil.transmisi)) {
      transmisiHarga = mobil.transmisi.map(t => ({
        type: t,
        harga: mobil.harga || 0
      }));
    } else if (mobil.transmisi) {
      transmisiHarga = [{ type: mobil.transmisi, harga: mobil.harga || 0 }];
    }
  }


  return (
    <div className="detail-mobil-page">
      <div className="container">
        <Link to="/catalog" className="back-link">← Kembali ke Katalog</Link>

        {/* Hero Section - 2 Column Layout */}
        <div className="hero-section">
          {/* Left Column - Main Image */}
          <div className="hero-image-column">
            {gambar.length > 0 && (
              <div className="main-gallery-wrapper">
                <div className="main-gallery">
                  {gambar.length > 1 && (
                    <button className="gallery-nav prev" onClick={prevImage}>‹</button>
                  )}
                  <div 
                    className="main-gallery-image"
                    onMouseEnter={() => setIsAutoPlay(false)}
                    onMouseLeave={() => setIsAutoPlay(true)}
                  >
                    <img src={currentImage} alt={`${mobil.model}`} />
                  </div>
                  {gambar.length > 1 && (
                    <button className="gallery-nav next" onClick={nextImage}>›</button>
                  )}
                </div>
                {gambar.length > 1 && (
                  <div className="gallery-thumbnails">
                    {gambar.map((img, index) => (
                      <div
                        key={index}
                        className={`gallery-thumb ${selectedImageIndex === index ? 'active' : ''}`}
                        onClick={() => {
                          setIsAutoPlay(false);
                          setSelectedImageIndex(index);
                          setTimeout(() => setIsAutoPlay(true), 5000);
                        }}
                      >
                        <img src={img} alt={`${mobil.model} ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Info & CTA */}
          <div className="hero-info-column">
            <div className="hero-header">
              <h1 className="detail-title">{mobil.model}</h1>
              <p className="detail-subtitle">Tahun {mobil.tahun} • {mobil.jenis}</p>
            </div>

            <div className="warna-info-box">
              <h2 className="warna-heading">Deskripsi</h2>
              <p className="warna-description">
                {mobil.deskripsi || `${mobil.model} adalah mobil Toyota terbaru dengan desain modern dan fitur lengkap. Tersedia dalam berbagai varian warna yang dapat disesuaikan dengan preferensi Anda. Untuk melihat detail lebih lanjut, silahkan slide pada gambar produk atau klik tanda panah pada gambar.`}
              </p>
              
              <div className="warna-tags-container">
                <p className="warna-label"><strong>Warna Tersedia:</strong></p>
                <div className="warna-tags">
                  {Array.isArray(mobil.warna) ? mobil.warna.map((w, idx) => {
                    const colorHex = getColorHex(w);
                    const isLightColor = colorHex === '#FFFFFF' || colorHex === '#C0C0C0' || colorHex === '#FFD700';
                    return (
                      <div key={idx} className="warna-icon-wrapper" title={w}>
                        <div 
                          className="warna-icon" 
                          style={{ 
                            backgroundColor: colorHex,
                            borderColor: isLightColor ? '#cbd5e1' : '#e5e7eb',
                            borderWidth: '3px',
                            borderStyle: 'solid'
                          }}
                        ></div>
                      </div>
                    );
                  }) : (() => {
                    const colorHex = getColorHex(mobil.warna);
                    const isLightColor = colorHex === '#FFFFFF' || colorHex === '#C0C0C0' || colorHex === '#FFD700';
                    return (
                      <div className="warna-icon-wrapper" title={mobil.warna}>
                        <div 
                          className="warna-icon" 
                          style={{ 
                            backgroundColor: colorHex,
                            borderColor: isLightColor ? '#cbd5e1' : '#e5e7eb',
                            borderWidth: '3px',
                            borderStyle: 'solid'
                          }}
                        ></div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <button 
                className="btn-cek-harga"
                onClick={() => {
                  const priceSection = document.getElementById('price-list');
                  if (priceSection) {
                    const offset = 80; // Offset untuk navbar
                    const elementPosition = priceSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                Cek Harga
              </button>
            </div>
          </div>
        </div>

        {/* Detail Images Grid */}
        {gambar.length > 0 && (
          <div className="detail-images-grid">
            {gambar.slice(0, 8).map((img, index) => (
              <div key={index} className="detail-image-item">
                <img src={img} alt={`${mobil.model} detail ${index + 1}`} />
              </div>
            ))}
          </div>
        )}

        {/* Price List Section */}
        <section id="price-list" className="price-list-section">
          <h2 className="section-heading">Price List</h2>
          
          <div className="price-table-container">
            <table className="price-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Harga</th>
                </tr>
              </thead>
              <tbody>
                {transmisiHarga.map((item, index) => (
                  <tr key={index}>
                    <td>{mobil.model} {item.type}</td>
                    <td className="price-cell">{formatRupiah(item.harga)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DetailMobil;
