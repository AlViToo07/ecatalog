const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecatalog_toyota',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create mobil table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mobil (
        id SERIAL PRIMARY KEY,
        merk VARCHAR(50) DEFAULT 'Toyota',
        model VARCHAR(255) NOT NULL,
        tahun INTEGER NOT NULL,
        kilometer INTEGER DEFAULT 0,
        warna TEXT[],
        transmisi_harga JSONB,
        bahan_bakar VARCHAR(50) DEFAULT 'Bensin',
        kondisi VARCHAR(50) DEFAULT 'Baru',
        jenis VARCHAR(50),
        deskripsi TEXT,
        gambar TEXT[],
        stok INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create promo table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promo (
        id SERIAL PRIMARY KEY,
        judul VARCHAR(255) NOT NULL,
        deskripsi TEXT,
        gambar VARCHAR(500),
        tanggal_awal DATE,
        tanggal_akhir DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin if not exists
    const adminCheck = await pool.query('SELECT * FROM admin WHERE username = $1', ['admin']);
    if (adminCheck.rows.length === 0) {
      await pool.query(
        'INSERT INTO admin (username, password) VALUES ($1, $2)',
        ['admin', 'admin123']
      );
      console.log('Default admin created: admin / admin123');
    }

    // Create index for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mobil_merk ON mobil(merk)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_mobil_kondisi ON mobil(kondisi)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_promo_dates ON promo(tanggal_awal, tanggal_akhir)');

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase
};



