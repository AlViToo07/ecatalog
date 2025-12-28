import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import DetailMobil from './pages/DetailMobil';
import Promo from './pages/Promo';
import LoginAdmin from './pages/LoginAdmin';
import AdminDashboard from './pages/AdminDashboard';
import AdminMobil from './pages/AdminMobil';
import AdminTambahMobil from './pages/AdminTambahMobil';
import AdminEditMobil from './pages/AdminEditMobil';
import AdminPromo from './pages/AdminPromo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/mobil/:id" element={<DetailMobil />} />
          <Route path="/promo" element={<Promo />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/mobil" element={<AdminMobil />} />
          <Route path="/admin/mobil/tambah" element={<AdminTambahMobil />} />
          <Route path="/admin/mobil/edit/:id" element={<AdminEditMobil />} />
          <Route path="/admin/promo" element={<AdminPromo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

