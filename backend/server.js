require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup folder untuk upload gambar
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Tentukan prefix berdasarkan route
    const prefix = req.path.includes('/promo') ? 'promo' : 'mobil';
    cb(null, prefix + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Hanya terima file JPEG/JPG
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file JPEG/JPG yang diperbolehkan'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max per file
  },
  fileFilter: fileFilter
});

// Serve static files dari folder uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// Helper function untuk transform data dari Sequelize ke format API
function transformCarData(car) {
  if (!car) return null;
  
  const carData = car.toJSON ? car.toJSON() : car;
  
  return {
    id: carData.id,
    merk: carData.merk || 'Toyota',
    model: carData.model || carData.name || '',
    tahun: carData.tahun,
    kilometer: carData.kilometer || 0,
    warna: carData.warna || [],
    transmisiHarga: carData.transmisi_harga || [],
    bahanBakar: carData.bahan_bakar || 'Bensin',
    kondisi: carData.kondisi || 'Baru',
    jenis: carData.jenis || '',
    deskripsi: carData.description || carData.deskripsi || '',
    gambar: carData.gambar || [],
    stok: carData.stok || 0
  };
}

// ========== API ROUTES ==========

// GET root - Info API
app.get('/', (req, res) => {
  res.json({
    message: 'E-Catalog Mobil API Server',
    version: '1.0.0',
    database: 'Sequelize + PostgreSQL',
    endpoints: {
      getAllMobil: 'GET /api/mobil',
      getMobilById: 'GET /api/mobil/:id',
      createMobil: 'POST /api/mobil',
      updateMobil: 'PUT /api/mobil/:id',
      deleteMobil: 'DELETE /api/mobil/:id',
      getJenis: 'GET /api/jenis',
      getWarna: 'GET /api/warna',
      uploadImages: 'POST /api/mobil/upload',
      getAllPromo: 'GET /api/promo',
      createPromo: 'POST /api/promo',
      updatePromo: 'PUT /api/promo/:id',
      deletePromo: 'DELETE /api/promo/:id',
      adminLogin: 'POST /api/admin/login'
    },
    frontend: 'Akses frontend di http://localhost:3000'
  });
});

// GET semua mobil
app.get('/api/mobil', async (req, res) => {
  try {
    const { search, jenis, tahun, hargaMin, hargaMax, kondisi, transmisi, warna } = req.query;
    
    // Build where clause
    const where = {
      kondisi: kondisi || 'Baru',
      merk: 'Toyota'
    };
    
    if (jenis) {
      where.jenis = jenis;
    }
    
    if (tahun) {
      where.tahun = parseInt(tahun);
    }
    
    // Build search condition
    const searchCondition = search ? {
      [db.Sequelize.Op.or]: [
        { model: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { description: { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ]
    } : {};
    
    // Combine where conditions
    const finalWhere = { ...where, ...searchCondition };
    
    // Build warna filter
    if (warna) {
      finalWhere.warna = {
        [db.Sequelize.Op.contains]: [warna]
      };
    }
    
    // Get all cars
    let cars = await db.Car.findAll({
      where: finalWhere,
      order: [['id', 'DESC']]
    });
    
    // Transform data
    let data = cars.map(transformCarData);
    
    // Filter berdasarkan harga (client-side karena kompleks dengan JSONB)
    if (hargaMin || hargaMax) {
      data = data.filter(mobil => {
        if (!mobil.transmisiHarga || !Array.isArray(mobil.transmisiHarga) || mobil.transmisiHarga.length === 0) {
          return false;
        }
        const minHarga = Math.min(...mobil.transmisiHarga.map(t => t.harga || 0));
        const maxHarga = Math.max(...mobil.transmisiHarga.map(t => t.harga || 0));
        
        if (hargaMin && maxHarga < parseInt(hargaMin)) return false;
        if (hargaMax && minHarga > parseInt(hargaMax)) return false;
        return true;
      });
    }

    // Filter berdasarkan transmisi
    if (transmisi) {
      data = data.filter(mobil => {
        if (mobil.transmisiHarga && Array.isArray(mobil.transmisiHarga)) {
          return mobil.transmisiHarga.some(t => t.type === transmisi);
        }
        return false;
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Error getting mobil:', error);
    res.status(500).json({ message: 'Gagal mengambil data mobil', error: error.message });
  }
});

// GET mobil by ID
app.get('/api/mobil/:id', async (req, res) => {
  try {
    const car = await db.Car.findByPk(parseInt(req.params.id));
    
    if (!car) {
      return res.status(404).json({ message: 'Mobil tidak ditemukan' });
    }
    
    res.json(transformCarData(car));
  } catch (error) {
    console.error('Error getting mobil by ID:', error);
    res.status(500).json({ message: 'Gagal mengambil data mobil', error: error.message });
  }
});

// POST upload gambar mobil (multiple, max 10)
app.post('/api/mobil/upload', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Tidak ada file yang diupload' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ 
      success: true, 
      images: imageUrls,
      message: `${req.files.length} gambar berhasil diupload`
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal upload gambar: ' + error.message });
  }
});

// POST tambah mobil baru
app.post('/api/mobil', async (req, res) => {
  try {
    // Pastikan gambar adalah array
    let gambar = req.body.gambar || [];
    if (typeof gambar === 'string') {
      gambar = [gambar];
    }
    
    // Pastikan transmisiHarga adalah array of objects
    let transmisiHarga = req.body.transmisiHarga || [];
    if (!Array.isArray(transmisiHarga)) {
      // Jika masih format lama, convert
      if (Array.isArray(req.body.transmisi)) {
        transmisiHarga = req.body.transmisi.map(t => ({
          type: t,
          harga: req.body.harga || 0
        }));
      } else {
        transmisiHarga = [{ type: req.body.transmisi || 'Manual', harga: req.body.harga || 0 }];
      }
    }
    
    // Prepare data untuk Sequelize
    const carData = {
      merk: req.body.merk || 'Toyota',
      model: req.body.model || req.body.name || '',
      tahun: req.body.tahun ? parseInt(req.body.tahun) : null,
      kilometer: req.body.kilometer ? parseInt(req.body.kilometer) : 0,
      warna: Array.isArray(req.body.warna) ? req.body.warna : (req.body.warna ? [req.body.warna] : []),
      transmisi_harga: transmisiHarga,
      bahan_bakar: req.body.bahanBakar || req.body.bahan_bakar || 'Bensin',
      kondisi: req.body.kondisi || 'Baru',
      jenis: req.body.jenis || '',
      description: req.body.deskripsi || req.body.description || '',
      gambar: gambar,
      stok: req.body.stok ? parseInt(req.body.stok) : 0,
      // Keep old fields for backward compatibility
      name: req.body.model || req.body.name || '',
      price_min: transmisiHarga.length > 0 ? Math.min(...transmisiHarga.map(t => t.harga || 0)) : null,
      price_max: transmisiHarga.length > 0 ? Math.max(...transmisiHarga.map(t => t.harga || 0)) : null
    };
    
    const newCar = await db.Car.create(carData);
    
    res.status(201).json(transformCarData(newCar));
  } catch (error) {
    console.error('Error creating mobil:', error);
    res.status(500).json({ message: 'Gagal menambah mobil', error: error.message });
  }
});

// PUT update mobil
app.put('/api/mobil/:id', async (req, res) => {
  try {
    const car = await db.Car.findByPk(parseInt(req.params.id));
    
    if (!car) {
      return res.status(404).json({ message: 'Mobil tidak ditemukan' });
    }
    
    // Pastikan gambar adalah array
    let gambar = req.body.gambar;
    if (gambar === undefined) {
      gambar = car.gambar || [];
    } else if (typeof gambar === 'string') {
      gambar = [gambar];
    }
    
    // Pastikan transmisiHarga adalah array of objects
    let transmisiHarga = req.body.transmisiHarga;
    if (transmisiHarga === undefined) {
      transmisiHarga = car.transmisi_harga || [];
    } else if (!Array.isArray(transmisiHarga) || transmisiHarga.length === 0) {
      // Jika masih format lama, convert
      if (Array.isArray(req.body.transmisi)) {
        transmisiHarga = req.body.transmisi.map(t => ({
          type: t,
          harga: req.body.harga || 0
        }));
      } else if (req.body.transmisi) {
        transmisiHarga = [{ 
          type: req.body.transmisi, 
          harga: req.body.harga || 0 
        }];
      } else {
        transmisiHarga = car.transmisi_harga || [];
      }
    }
    
    // Prepare update data
    const updateData = {};
    
    if (req.body.merk !== undefined) updateData.merk = req.body.merk;
    if (req.body.model !== undefined) {
      updateData.model = req.body.model;
      updateData.name = req.body.model; // Keep name for backward compatibility
    }
    if (req.body.tahun !== undefined) updateData.tahun = parseInt(req.body.tahun);
    if (req.body.kilometer !== undefined) updateData.kilometer = parseInt(req.body.kilometer);
    if (req.body.warna !== undefined) {
      updateData.warna = Array.isArray(req.body.warna) ? req.body.warna : [req.body.warna];
    }
    if (transmisiHarga !== undefined) {
      updateData.transmisi_harga = transmisiHarga;
      // Update price_min and price_max
      if (transmisiHarga.length > 0) {
        updateData.price_min = Math.min(...transmisiHarga.map(t => t.harga || 0));
        updateData.price_max = Math.max(...transmisiHarga.map(t => t.harga || 0));
      }
    }
    if (req.body.bahanBakar !== undefined) updateData.bahan_bakar = req.body.bahanBakar;
    if (req.body.kondisi !== undefined) updateData.kondisi = req.body.kondisi;
    if (req.body.jenis !== undefined) updateData.jenis = req.body.jenis;
    if (req.body.deskripsi !== undefined || req.body.description !== undefined) {
      updateData.description = req.body.deskripsi || req.body.description;
    }
    if (gambar !== undefined) updateData.gambar = gambar;
    if (req.body.stok !== undefined) updateData.stok = parseInt(req.body.stok);
    
    await car.update(updateData);
    
    res.json(transformCarData(car));
  } catch (error) {
    console.error('Error updating mobil:', error);
    res.status(500).json({ message: 'Gagal mengupdate mobil', error: error.message });
  }
});

// DELETE hapus mobil
app.delete('/api/mobil/:id', async (req, res) => {
  try {
    const car = await db.Car.findByPk(parseInt(req.params.id));
    
    if (!car) {
      return res.status(404).json({ message: 'Mobil tidak ditemukan' });
    }
    
    await car.destroy();
    
    res.json({ message: 'Mobil berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting mobil:', error);
    res.status(500).json({ message: 'Gagal menghapus mobil', error: error.message });
  }
});

// GET daftar jenis mobil
app.get('/api/jenis', async (req, res) => {
  try {
    const cars = await db.Car.findAll({
      attributes: ['jenis'],
      where: {
        kondisi: 'Baru',
        merk: 'Toyota'
      }
    });
    
    const jenis = [...new Set(cars.map(c => c.jenis).filter(j => j))];
    res.json(jenis);
  } catch (error) {
    console.error('Error getting jenis:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar jenis', error: error.message });
  }
});

// GET daftar warna unik
app.get('/api/warna', async (req, res) => {
  try {
    const cars = await db.Car.findAll({
      attributes: ['warna'],
      where: {
        kondisi: 'Baru',
        merk: 'Toyota'
      }
    });
    
    const allWarna = [];
    cars.forEach(c => {
      if (Array.isArray(c.warna)) {
        allWarna.push(...c.warna);
      } else if (c.warna) {
        allWarna.push(c.warna);
      }
    });
    
    const uniqueWarna = [...new Set(allWarna)];
    res.json(uniqueWarna);
  } catch (error) {
    console.error('Error getting warna:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar warna', error: error.message });
  }
});

// ========== ADMIN AUTH ==========
// Login admin (sederhana, tanpa JWT untuk saat ini)
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple check - bisa diganti dengan model Admin jika diperlukan
    if (username === 'admin' && password === 'admin123') {
      res.json({ success: true, message: 'Login berhasil' });
    } else {
      res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ success: false, message: 'Gagal melakukan login', error: error.message });
  }
});

// ========== PROMO API ==========

// POST upload gambar promo (single file, JPEG only)
app.post('/api/promo/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diupload' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      image: imageUrl,
      message: 'Gambar berhasil diupload'
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal upload gambar: ' + error.message });
  }
});

// GET semua promo
app.get('/api/promo', async (req, res) => {
  try {
    // Cek apakah model Promo tersedia
    if (!db.Promo) {
      console.error('Model Promo tidak ditemukan. Pastikan migration sudah dijalankan.');
      return res.json([]); // Return empty array instead of error
    }
    
    const promos = await db.Promo.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    const transformedPromos = promos.map(promo => {
      const promoData = promo.toJSON ? promo.toJSON() : promo;
      return {
        id: promoData.id,
        judul: promoData.judul,
        deskripsi: promoData.deskripsi,
        gambar: promoData.gambar,
        tanggalAwal: promoData.tanggal_awal,
        tanggalAkhir: promoData.tanggal_akhir
      };
    });
    
    res.json(transformedPromos);
  } catch (error) {
    console.error('Error getting promo:', error);
    
    // Handle specific Sequelize errors
    if (error.name === 'SequelizeDatabaseError') {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.warn('Tabel Promos belum dibuat. Jalankan migration: npx sequelize-cli db:migrate');
        return res.json([]); // Return empty array instead of error
      }
    }
    
    res.status(500).json({ message: 'Gagal mengambil data promo', error: error.message });
  }
});

// GET promo by ID
app.get('/api/promo/:id', async (req, res) => {
  try {
    const promo = await db.Promo.findByPk(parseInt(req.params.id));
    
    if (!promo) {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }
    
    const promoData = promo.toJSON ? promo.toJSON() : promo;
    res.json({
      id: promoData.id,
      judul: promoData.judul,
      deskripsi: promoData.deskripsi,
      gambar: promoData.gambar,
      tanggalAwal: promoData.tanggal_awal,
      tanggalAkhir: promoData.tanggal_akhir
    });
  } catch (error) {
    console.error('Error getting promo by ID:', error);
    res.status(500).json({ message: 'Gagal mengambil data promo', error: error.message });
  }
});

// POST tambah promo
app.post('/api/promo', async (req, res) => {
  try {
    const { judul, deskripsi, gambar, tanggalAwal, tanggalAkhir } = req.body;
    
    console.log('POST /api/promo - Request body:', { judul, deskripsi, gambar, tanggalAwal, tanggalAkhir });
    
    if (!judul || judul.trim() === '') {
      return res.status(400).json({ message: 'Judul promo harus diisi' });
    }
    
    if (!gambar || gambar.trim() === '') {
      return res.status(400).json({ message: 'Gambar promo harus diupload' });
    }
    
    // Cek apakah model Promo tersedia
    if (!db.Promo) {
      console.error('Model Promo tidak ditemukan. Pastikan migration sudah dijalankan.');
      return res.status(500).json({ 
        message: 'Model Promo tidak ditemukan. Pastikan migration sudah dijalankan: npx sequelize-cli db:migrate' 
      });
    }
    
    const newPromo = await db.Promo.create({
      judul: judul.trim(),
      deskripsi: deskripsi ? deskripsi.trim() : null,
      gambar: gambar.trim(),
      tanggal_awal: tanggalAwal || null,
      tanggal_akhir: tanggalAkhir || null
    });
    
    const promoData = newPromo.toJSON ? newPromo.toJSON() : newPromo;
    console.log('Promo berhasil dibuat:', promoData);
    
    res.status(201).json({
      id: promoData.id,
      judul: promoData.judul,
      deskripsi: promoData.deskripsi,
      gambar: promoData.gambar,
      tanggalAwal: promoData.tanggal_awal,
      tanggalAkhir: promoData.tanggal_akhir
    });
  } catch (error) {
    console.error('Error creating promo:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Handle specific Sequelize errors
    if (error.name === 'SequelizeDatabaseError') {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return res.status(500).json({ 
          message: 'Tabel Promos belum dibuat. Jalankan migration: npx sequelize-cli db:migrate',
          error: error.message 
        });
      }
    }
    
    res.status(500).json({ 
      message: 'Gagal menambah promo', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT update promo
app.put('/api/promo/:id', async (req, res) => {
  try {
    const promo = await db.Promo.findByPk(parseInt(req.params.id));
    
    if (!promo) {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }
    
    const { judul, deskripsi, gambar, tanggalAwal, tanggalAkhir } = req.body;
    
    const updateData = {};
    if (judul !== undefined) updateData.judul = judul;
    if (deskripsi !== undefined) updateData.deskripsi = deskripsi;
    if (gambar !== undefined) updateData.gambar = gambar;
    if (tanggalAwal !== undefined) updateData.tanggal_awal = tanggalAwal || null;
    if (tanggalAkhir !== undefined) updateData.tanggal_akhir = tanggalAkhir || null;
    
    await promo.update(updateData);
    
    const promoData = promo.toJSON ? promo.toJSON() : promo;
    res.json({
      id: promoData.id,
      judul: promoData.judul,
      deskripsi: promoData.deskripsi,
      gambar: promoData.gambar,
      tanggalAwal: promoData.tanggal_awal,
      tanggalAkhir: promoData.tanggal_akhir
    });
  } catch (error) {
    console.error('Error updating promo:', error);
    res.status(500).json({ message: 'Gagal mengupdate promo', error: error.message });
  }
});

// DELETE hapus promo
app.delete('/api/promo/:id', async (req, res) => {
  try {
    const promo = await db.Promo.findByPk(parseInt(req.params.id));
    
    if (!promo) {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }
    
    // Hapus file gambar jika ada
    if (promo.gambar) {
      const imagePath = path.join(__dirname, promo.gambar.replace('/uploads/', 'uploads/'));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await promo.destroy();
    
    res.json({ message: 'Promo berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting promo:', error);
    res.status(500).json({ message: 'Gagal menghapus promo', error: error.message });
  }
});

// Initialize database connection and start server
async function startServer() {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database (jangan gunakan force: true di production!)
    // await db.sequelize.sync({ alter: true }); // Uncomment jika perlu sync schema
    
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
      console.log(`Database: ${db.sequelize.config.database}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
