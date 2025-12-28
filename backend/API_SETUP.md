# Setup API Express dengan Sequelize

## Langkah-langkah Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database Configuration

Edit file `backend/config/config.json` sesuai dengan konfigurasi PostgreSQL Anda:

```json
{
  "development": {
    "username": "postgres",
    "password": "your_password",
    "database": "your_database_name",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

### 3. Jalankan Migration

```bash
# Jalankan migration untuk membuat tabel Cars
npx sequelize-cli db:migrate

# Jalankan migration untuk menambahkan field tambahan
npx sequelize-cli db:migrate
```

**Catatan:** Migration `20251224170000-add-fields-to-cars.js` akan menambahkan field-field yang diperlukan ke tabel `Cars`.

### 4. Jalankan Seeder (Opsional)

```bash
# Jalankan seeder untuk data awal
npx sequelize-cli db:seed:all
```

### 5. Jalankan Server

```bash
npm start
# atau dengan nodemon untuk auto-reload
npx nodemon server.js
```

Server akan berjalan di `http://localhost:5000`

---

## API Endpoints

### Mobil (Cars)

#### GET `/api/mobil`
Mendapatkan semua data mobil dengan filter opsional.

**Query Parameters:**
- `search` - Pencarian berdasarkan model atau deskripsi
- `jenis` - Filter berdasarkan jenis mobil
- `tahun` - Filter berdasarkan tahun
- `hargaMin` - Filter harga minimum
- `hargaMax` - Filter harga maksimum
- `kondisi` - Filter kondisi (default: 'Baru')
- `transmisi` - Filter transmisi (Manual/Automatic)
- `warna` - Filter warna

**Contoh:**
```bash
GET /api/mobil?jenis=SUV&tahun=2024
GET /api/mobil?search=Avanza&hargaMin=200000000&hargaMax=400000000
```

#### GET `/api/mobil/:id`
Mendapatkan detail mobil berdasarkan ID.

**Contoh:**
```bash
GET /api/mobil/1
```

#### POST `/api/mobil`
Menambah mobil baru.

**Request Body:**
```json
{
  "merk": "Toyota",
  "model": "All New Avanza",
  "tahun": 2024,
  "kilometer": 0,
  "warna": ["Putih", "Hitam", "Silver"],
  "transmisiHarga": [
    { "type": "Manual", "harga": 250000000 },
    { "type": "Automatic", "harga": 280000000 }
  ],
  "bahanBakar": "Bensin",
  "kondisi": "Baru",
  "jenis": "MPV",
  "deskripsi": "Mobil keluarga irit dan nyaman",
  "gambar": ["/uploads/image1.jpg"],
  "stok": 15
}
```

#### PUT `/api/mobil/:id`
Update data mobil.

**Request Body:** Sama seperti POST, semua field opsional.

#### DELETE `/api/mobil/:id`
Menghapus mobil.

#### POST `/api/mobil/upload`
Upload gambar mobil (max 10 file, max 5MB per file, hanya JPEG/JPG).

**Request:** Form-data dengan field `images` (multiple files)

**Response:**
```json
{
  "success": true,
  "images": ["/uploads/mobil-1234567890-123456789.jpeg"],
  "message": "1 gambar berhasil diupload"
}
```

### Lainnya

#### GET `/api/jenis`
Mendapatkan daftar jenis mobil unik.

#### GET `/api/warna`
Mendapatkan daftar warna unik.

#### POST `/api/admin/login`
Login admin.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Promo (TODO)
Endpoint promo masih placeholder dan perlu diimplementasikan dengan model Promo.

---

## Struktur Data Mobil

```typescript
{
  id: number;
  merk: string;              // Default: "Toyota"
  model: string;             // Nama model mobil
  tahun: number;             // Tahun produksi
  kilometer: number;         // Kilometer (default: 0)
  warna: string[];           // Array warna tersedia
  transmisiHarga: Array<{    // Array harga per transmisi
    type: string;            // "Manual" atau "Automatic"
    harga: number;
  }>;
  bahanBakar: string;        // "Bensin", "Diesel", dll
  kondisi: string;          // "Baru" atau "Bekas"
  jenis: string;            // "MPV", "SUV", "Sedan", dll
  deskripsi: string;        // Deskripsi mobil
  gambar: string[];         // Array URL gambar
  stok: number;             // Jumlah stok
}
```

---

## Catatan Penting

1. **Database Connection:** Pastikan PostgreSQL sudah berjalan dan database sudah dibuat.

2. **Migration:** Jalankan migration sebelum menjalankan server untuk pertama kali.

3. **Upload Directory:** Folder `uploads/` akan dibuat otomatis untuk menyimpan gambar.

4. **Static Files:** Gambar yang diupload dapat diakses via `/uploads/filename.jpg`

5. **Backward Compatibility:** Model Car masih memiliki field `name`, `price_min`, `price_max`, `description` untuk kompatibilitas dengan seeder yang sudah ada.

---

## Troubleshooting

### Error: "relation does not exist"
**Solusi:** Jalankan migration terlebih dahulu:
```bash
npx sequelize-cli db:migrate
```

### Error: "column does not exist"
**Solusi:** Pastikan migration `20251224170000-add-fields-to-cars.js` sudah dijalankan.

### Error: "Cannot find module"
**Solusi:** Install dependencies:
```bash
npm install
```

### Error: "Database connection failed"
**Solusi:** 
- Periksa konfigurasi di `config/config.json`
- Pastikan PostgreSQL service berjalan
- Pastikan database sudah dibuat
- Periksa username dan password

