const { pool } = require('./database');

// Helper functions untuk mobil
const mobilHelpers = {
  // Get all mobil
  async getAll(filters = {}) {
    try {
      let query = 'SELECT * FROM mobil WHERE merk = $1 AND kondisi = $2';
      const params = ['Toyota', 'Baru'];
      let paramIndex = 3;

      if (filters.search) {
        query += ` AND (model ILIKE $${paramIndex} OR deskripsi ILIKE $${paramIndex})`;
        params.push(`%${filters.search}%`);
        paramIndex++;
      }

      if (filters.jenis) {
        query += ` AND jenis = $${paramIndex}`;
        params.push(filters.jenis);
        paramIndex++;
      }

      if (filters.tahun) {
        query += ` AND tahun = $${paramIndex}`;
        params.push(parseInt(filters.tahun));
        paramIndex++;
      }

      if (filters.warna) {
        query += ` AND $${paramIndex} = ANY(warna)`;
        params.push(filters.warna);
        paramIndex++;
      }

      query += ' ORDER BY id DESC';

      const result = await pool.query(query, params);
      return result.rows.map(row => ({
        id: row.id,
        merk: row.merk,
        model: row.model,
        tahun: row.tahun,
        kilometer: row.kilometer,
        warna: row.warna || [],
        transmisiHarga: row.transmisi_harga || [],
        bahanBakar: row.bahan_bakar,
        kondisi: row.kondisi,
        jenis: row.jenis,
        deskripsi: row.deskripsi,
        gambar: row.gambar || [],
        stok: row.stok
      }));
    } catch (error) {
      console.error('Error getting all mobil:', error);
      throw error;
    }
  },

  // Get mobil by ID
  async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM mobil WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return {
        id: row.id,
        merk: row.merk,
        model: row.model,
        tahun: row.tahun,
        kilometer: row.kilometer,
        warna: row.warna || [],
        transmisiHarga: row.transmisi_harga || [],
        bahanBakar: row.bahan_bakar,
        kondisi: row.kondisi,
        jenis: row.jenis,
        deskripsi: row.deskripsi,
        gambar: row.gambar || [],
        stok: row.stok
      };
    } catch (error) {
      console.error('Error getting mobil by ID:', error);
      throw error;
    }
  },

  // Create mobil
  async create(mobilData) {
    try {
      const {
        model, tahun, kilometer, warna, transmisiHarga, bahanBakar, kondisi, jenis, deskripsi, gambar, stok
      } = mobilData;

      const result = await pool.query(
        `INSERT INTO mobil (merk, model, tahun, kilometer, warna, transmisi_harga, bahan_bakar, kondisi, jenis, deskripsi, gambar, stok)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          'Toyota',
          model,
          tahun,
          kilometer || 0,
          Array.isArray(warna) ? warna : [warna],
          JSON.stringify(transmisiHarga || []),
          bahanBakar || 'Bensin',
          kondisi || 'Baru',
          jenis,
          deskripsi,
          Array.isArray(gambar) ? gambar : (gambar ? [gambar] : []),
          stok || 0
        ]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        merk: row.merk,
        model: row.model,
        tahun: row.tahun,
        kilometer: row.kilometer,
        warna: row.warna || [],
        transmisiHarga: row.transmisi_harga || [],
        bahanBakar: row.bahan_bakar,
        kondisi: row.kondisi,
        jenis: row.jenis,
        deskripsi: row.deskripsi,
        gambar: row.gambar || [],
        stok: row.stok
      };
    } catch (error) {
      console.error('Error creating mobil:', error);
      throw error;
    }
  },

  // Update mobil
  async update(id, mobilData) {
    try {
      const {
        model, tahun, kilometer, warna, transmisiHarga, bahanBakar, kondisi, jenis, deskripsi, gambar, stok
      } = mobilData;

      const result = await pool.query(
        `UPDATE mobil 
         SET model = $1, tahun = $2, kilometer = $3, warna = $4, transmisi_harga = $5, 
             bahan_bakar = $6, kondisi = $7, jenis = $8, deskripsi = $9, gambar = $10, 
             stok = $11, updated_at = CURRENT_TIMESTAMP
         WHERE id = $12
         RETURNING *`,
        [
          model,
          tahun,
          kilometer || 0,
          Array.isArray(warna) ? warna : [warna],
          JSON.stringify(transmisiHarga || []),
          bahanBakar || 'Bensin',
          kondisi || 'Baru',
          jenis,
          deskripsi,
          Array.isArray(gambar) ? gambar : (gambar ? [gambar] : []),
          stok || 0,
          id
        ]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        merk: row.merk,
        model: row.model,
        tahun: row.tahun,
        kilometer: row.kilometer,
        warna: row.warna || [],
        transmisiHarga: row.transmisi_harga || [],
        bahanBakar: row.bahan_bakar,
        kondisi: row.kondisi,
        jenis: row.jenis,
        deskripsi: row.deskripsi,
        gambar: row.gambar || [],
        stok: row.stok
      };
    } catch (error) {
      console.error('Error updating mobil:', error);
      throw error;
    }
  },

  // Delete mobil
  async delete(id) {
    try {
      const result = await pool.query('DELETE FROM mobil WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting mobil:', error);
      throw error;
    }
  }
};

// Helper functions untuk promo
const promoHelpers = {
  async getAll() {
    try {
      const result = await pool.query('SELECT * FROM promo ORDER BY created_at DESC');
      return result.rows.map(row => ({
        id: row.id,
        judul: row.judul,
        deskripsi: row.deskripsi,
        gambar: row.gambar,
        tanggalAwal: row.tanggal_awal,
        tanggalAkhir: row.tanggal_akhir,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Error getting all promo:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM promo WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return {
        id: row.id,
        judul: row.judul,
        deskripsi: row.deskripsi,
        gambar: row.gambar,
        tanggalAwal: row.tanggal_awal,
        tanggalAkhir: row.tanggal_akhir,
        createdAt: row.created_at
      };
    } catch (error) {
      console.error('Error getting promo by ID:', error);
      throw error;
    }
  },

  async create(promoData) {
    try {
      const { judul, deskripsi, gambar, tanggalAwal, tanggalAkhir } = promoData;
      const result = await pool.query(
        `INSERT INTO promo (judul, deskripsi, gambar, tanggal_awal, tanggal_akhir)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [judul, deskripsi, gambar, tanggalAwal, tanggalAkhir]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        judul: row.judul,
        deskripsi: row.deskripsi,
        gambar: row.gambar,
        tanggalAwal: row.tanggal_awal,
        tanggalAkhir: row.tanggal_akhir,
        createdAt: row.created_at
      };
    } catch (error) {
      console.error('Error creating promo:', error);
      throw error;
    }
  },

  async update(id, promoData) {
    try {
      const { judul, deskripsi, gambar, tanggalAwal, tanggalAkhir } = promoData;
      const result = await pool.query(
        `UPDATE promo 
         SET judul = $1, deskripsi = $2, gambar = $3, tanggal_awal = $4, 
             tanggal_akhir = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [judul, deskripsi, gambar, tanggalAwal, tanggalAkhir, id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        judul: row.judul,
        deskripsi: row.deskripsi,
        gambar: row.gambar,
        tanggalAwal: row.tanggal_awal,
        tanggalAkhir: row.tanggal_akhir,
        createdAt: row.created_at
      };
    } catch (error) {
      console.error('Error updating promo:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const result = await pool.query('DELETE FROM promo WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting promo:', error);
      throw error;
    }
  }
};

// Helper functions untuk admin
const adminHelpers = {
  async getByUsername(username) {
    try {
      const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error getting admin by username:', error);
      throw error;
    }
  }
};

module.exports = {
  mobilHelpers,
  promoHelpers,
  adminHelpers
};




