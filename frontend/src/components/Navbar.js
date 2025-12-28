import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [promoCount, setPromoCount] = useState(0);
  const location = useLocation();

  const fetchPromoCount = async () => {
    try {
      const response = await axios.get('/api/promo');
      setPromoCount(response.data.length);
    } catch (error) {
      console.error('Error fetching promo:', error);
      setPromoCount(0);
    }
  };

  useEffect(() => {
    // Fetch promo count
    fetchPromoCount();

    // Refresh promo count setiap 5 detik
    const interval = setInterval(() => {
      fetchPromoCount();
    }, 5000);

    // Listen untuk event promoUpdated
    const handlePromoUpdate = () => {
      fetchPromoCount();
    };
    window.addEventListener('promoUpdated', handlePromoUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('promoUpdated', handlePromoUpdate);
    };
  }, []);

  // Refresh promo count ketika route berubah (misalnya setelah admin menambah promo)
  useEffect(() => {
    fetchPromoCount();
  }, [location.pathname]);


  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🚗</span>
            <span className="brand-text">TOYOTA E-CATALOG</span>
          </Link>
          <div className="navbar-links">
            <Link to="/" className="nav-link">Beranda</Link>
            <Link to="/catalog" className="nav-link">Katalog</Link>
            {promoCount > 0 && (
              <Link to="/promo" className="nav-link promo-link">
                Promo <span className="badge">{promoCount}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
