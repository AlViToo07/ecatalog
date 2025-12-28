import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Catalog.css';

const Catalog = () => {
  const [mobil, setMobil] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    jenis: '',
    tahun: '',
    hargaMin: '',
    hargaMax: '',
    transmisi: '',
    warna: ''
  });
  const [jenisList, setJenisList] = useState([]);
  const [warnaList, setWarnaList] = useState([]);

  useEffect(() => {
    fetchMobil();
    fetchJenis();
    fetchWarna();
  }, []);

  const fetchMobil = async () => {
    try {
      const response = await axios.get('/api/mobil');
      setMobil(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mobil:', error);
      setLoading(false);
    }
  };

  const fetchJenis = async () => {
    try {
      const response = await axios.get('/api/jenis');
      setJenisList(response.data);
    } catch (error) {
      console.error('Error fetching jenis:', error);
    }
  };

  const fetchWarna = async () => {
    try {
      const response = await axios.get('/api/warna');
      setWarnaList(response.data);
    } catch (error) {
      console.error('Error fetching warna:', error);
    }
  };

  // Filter client-side dengan useMemo untuk menghindari re-render
  const filteredMobil = useMemo(() => {
    let filtered = [...mobil];

    // Filter berdasarkan search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(m =>
        m.model.toLowerCase().includes(searchLower) ||
        m.deskripsi.toLowerCase().includes(searchLower)
      );
    }

    // Filter berdasarkan jenis
    if (filters.jenis) {
      filtered = filtered.filter(m => m.jenis === filters.jenis);
    }

    // Filter berdasarkan tahun
    if (filters.tahun) {
      filtered = filtered.filter(m => m.tahun === parseInt(filters.tahun));
    }

    // Filter berdasarkan harga
    if (filters.hargaMin) {
      filtered = filtered.filter(m => {
        const transmisiHarga = m.transmisiHarga || [];
        if (transmisiHarga.length > 0) {
          const minHarga = Math.min(...transmisiHarga.map(t => t.harga));
          return minHarga >= parseInt(filters.hargaMin);
        }
        return (m.harga || 0) >= parseInt(filters.hargaMin);
      });
    }
    if (filters.hargaMax) {
      filtered = filtered.filter(m => {
        const transmisiHarga = m.transmisiHarga || [];
        if (transmisiHarga.length > 0) {
          const maxHarga = Math.max(...transmisiHarga.map(t => t.harga));
          return maxHarga <= parseInt(filters.hargaMax);
        }
        return (m.hargaMax || m.harga || 0) <= parseInt(filters.hargaMax);
      });
    }

    // Filter berdasarkan transmisi
    if (filters.transmisi) {
      filtered = filtered.filter(m => {
        const transmisiHarga = m.transmisiHarga || [];
        if (transmisiHarga.length > 0) {
          return transmisiHarga.some(t => t.type === filters.transmisi);
        }
        if (Array.isArray(m.transmisi)) {
          return m.transmisi.includes(filters.transmisi);
        }
        return m.transmisi === filters.transmisi;
      });
    }

    // Filter berdasarkan warna
    if (filters.warna) {
      filtered = filtered.filter(m => {
        if (Array.isArray(m.warna)) {
          return m.warna.includes(filters.warna);
        }
        return m.warna === filters.warna;
      });
    }

    return filtered;
  }, [mobil, search, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setSearch('');
    setFilters({
      jenis: '',
      tahun: '',
      hargaMin: '',
      hargaMax: '',
      transmisi: '',
      warna: ''
    });
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
      <div className="catalog">
        <div className="container">
          <div className="loading">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog">
      <div className="container">
        <h1 className="page-title">Katalog Mobil Toyota Baru</h1>

        <div className="catalog-content">
          <div className="filters-sidebar">
            <h3>Filter Pencarian</h3>
            
            <div className="filter-group">
              <label>Pencarian</label>
              <input
                type="text"
                placeholder="Cari model mobil..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Jenis Mobil</label>
              <select
                name="jenis"
                value={filters.jenis}
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">Semua Jenis</option>
                {jenisList.map(jenis => (
                  <option key={jenis} value={jenis}>{jenis}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Tahun</label>
              <input
                type="number"
                name="tahun"
                placeholder="Tahun"
                value={filters.tahun}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Harga Minimum (Rp)</label>
              <input
                type="number"
                name="hargaMin"
                placeholder="Min"
                value={filters.hargaMin}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Harga Maksimum (Rp)</label>
              <input
                type="number"
                name="hargaMax"
                placeholder="Max"
                value={filters.hargaMax}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Transmisi</label>
              <select
                name="transmisi"
                value={filters.transmisi}
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">Semua Transmisi</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Warna</label>
              <select
                name="warna"
                value={filters.warna}
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">Semua Warna</option>
                {warnaList.map(warna => (
                  <option key={warna} value={warna}>{warna}</option>
                ))}
              </select>
            </div>

            <button onClick={resetFilters} className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>
              Reset Filter
            </button>
          </div>

          <div className="catalog-main">
            <div className="results-info">
              <p>Menampilkan {filteredMobil.length} mobil Toyota baru</p>
            </div>

            {filteredMobil.length === 0 ? (
              <div className="no-results">
                <p>Tidak ada mobil yang ditemukan</p>
              </div>
            ) : (
              <div className="mobil-grid">
                {filteredMobil.map(m => (
                  <div key={m.id} className="mobil-card card">
                    <div className="mobil-image">
                      {(() => {
                        const gambar = Array.isArray(m.gambar) ? m.gambar : (m.gambar ? [m.gambar] : []);
                        return <img src={gambar[0] || 'https://via.placeholder.com/400x300'} alt={`${m.merk} ${m.model}`} />;
                      })()}
                      <span className="badge badge-new">Baru</span>
                      {m.jenis && <span className="badge badge-jenis">{m.jenis}</span>}
                    </div>
                    <div className="mobil-info">
                      <h3>{m.model}</h3>
                      <p className="mobil-year">Tahun {m.tahun}</p>
                      <div className="mobil-specs">
                        <span>⛽ {m.bahanBakar}</span>
                      </div>
                      <div className="mobil-warna">
                        <strong>Warna:</strong> {Array.isArray(m.warna) ? m.warna.join(', ') : m.warna}
                      </div>
                      <div className="mobil-transmisi-harga">
                        {(() => {
                          let transmisiHarga = m.transmisiHarga || [];
                          if (!Array.isArray(transmisiHarga) || transmisiHarga.length === 0) {
                            if (Array.isArray(m.transmisi)) {
                              transmisiHarga = m.transmisi.map(t => ({ type: t, harga: m.harga || 0 }));
                            } else if (m.transmisi) {
                              transmisiHarga = [{ type: m.transmisi, harga: m.harga || 0 }];
                            }
                          }
                          return transmisiHarga.map((item, idx) => (
                            <div key={idx} className="transmisi-price-item">
                              <span className="transmisi-type-small">{item.type}:</span>
                              <span className="transmisi-price-small">{formatRupiah(item.harga)}</span>
                            </div>
                          ));
                        })()}
                      </div>
                      <p className="mobil-stock">Stok: {m.stok} unit</p>
                      <Link to={`/mobil/${m.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }}>
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
