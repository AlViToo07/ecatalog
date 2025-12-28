import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Promo.css';

const Promo = () => {
  const [promo, setPromo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromo();

    // Listen untuk event promoUpdated
    const handlePromoUpdate = () => {
      fetchPromo();
    };
    window.addEventListener('promoUpdated', handlePromoUpdate);

    // Refresh setiap 5 detik
    const interval = setInterval(() => {
      fetchPromo();
    }, 5000);

    return () => {
      window.removeEventListener('promoUpdated', handlePromoUpdate);
      clearInterval(interval);
    };
  }, []);

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

  if (loading) {
    return (
      <div className="promo">
        <div className="container">
          <div className="loading">Memuat promo...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="promo">
      <div className="container">
        <h1 className="page-title">Promo Spesial Toyota</h1>
        
        {promo.length === 0 ? (
          <div className="no-promo">
            <p>Tidak ada promo saat ini. Cek kembali nanti!</p>
          </div>
        ) : (
          <div className="promo-grid">
            {promo.map(p => (
              <div key={p.id} className="promo-card card">
                {p.gambar && (
                  <div className="promo-image">
                    <img src={p.gambar} alt={p.judul || 'Promo'} />
                  </div>
                )}
                <div className="promo-content">
                  {p.judul && <h3>{p.judul}</h3>}
                  {p.deskripsi && <p>{p.deskripsi}</p>}
                  {p.tanggalAwal && p.tanggalAkhir && (
                    <p className="promo-date">
                      Berlaku: {new Date(p.tanggalAwal).toLocaleDateString('id-ID')} - {new Date(p.tanggalAkhir).toLocaleDateString('id-ID')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promo;

