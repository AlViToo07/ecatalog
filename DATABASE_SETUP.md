# Setup Database PostgreSQL

## Persyaratan
- PostgreSQL sudah terinstall di sistem Anda
- Node.js dan npm sudah terinstall

## Langkah-langkah Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database PostgreSQL

#### a. Buat Database
```sql
CREATE DATABASE ecatalog_toyota;
```

#### b. Buat User (opsional)
```sql
CREATE USER ecatalog_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ecatalog_toyota TO ecatalog_user;
```

### 3. Konfigurasi Environment Variables

Buat file `.env` di folder `backend/` dengan cara:

**Opsi 1: Copy dari template**
- Copy file `backend/env.example` atau `backend/ENV_TEMPLATE.txt`
- Rename menjadi `.env` (dengan titik di depan)
- Edit file `.env` dan sesuaikan konfigurasi

**Opsi 2: Buat manual**
Buat file `.env` di folder `backend/` dengan isi:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecatalog_toyota
DB_USER=postgres
DB_PASSWORD=postgres

# Server Configuration
PORT=5000

# Environment
NODE_ENV=development
```

**PENTING:** Sesuaikan nilai `DB_USER` dan `DB_PASSWORD` dengan konfigurasi PostgreSQL Anda.

### 4. Jalankan Server

Server akan otomatis membuat tabel-tabel yang diperlukan saat pertama kali dijalankan:

```bash
npm run server
```

Atau untuk menjalankan server dan client bersamaan:

```bash
npm run dev
```

## Struktur Database

### Tabel `mobil`
- `id` (SERIAL PRIMARY KEY)
- `merk` (VARCHAR) - Default: 'Toyota'
- `model` (VARCHAR)
- `tahun` (INTEGER)
- `kilometer` (INTEGER)
- `warna` (TEXT[]) - Array of colors
- `transmisi_harga` (JSONB) - Array of objects: `[{type: "Manual", harga: 250000000}, ...]`
- `bahan_bakar` (VARCHAR)
- `kondisi` (VARCHAR) - Default: 'Baru'
- `jenis` (VARCHAR)
- `deskripsi` (TEXT)
- `gambar` (TEXT[]) - Array of image URLs
- `stok` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabel `promo`
- `id` (SERIAL PRIMARY KEY)
- `judul` (VARCHAR)
- `deskripsi` (TEXT)
- `gambar` (VARCHAR)
- `tanggal_awal` (DATE)
- `tanggal_akhir` (DATE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabel `admin`
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR UNIQUE)
- `password` (VARCHAR)
- `created_at` (TIMESTAMP)

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`

**PENTING:** Ganti password default di production!

## Troubleshooting

### Error: "Connection refused"
- Pastikan PostgreSQL service berjalan
- Periksa `DB_HOST` dan `DB_PORT` di file `.env`

### Error: "password authentication failed"
- Periksa `DB_USER` dan `DB_PASSWORD` di file `.env`
- Pastikan user memiliki akses ke database

### Error: "database does not exist"
- Buat database terlebih dahulu: `CREATE DATABASE ecatalog_toyota;`

### Error: "relation does not exist"
- Server akan otomatis membuat tabel saat pertama kali dijalankan
- Pastikan koneksi database berhasil

## Migrasi Data dari JSON

Jika Anda memiliki data di file JSON sebelumnya, Anda bisa:
1. Import data secara manual melalui admin panel
2. Atau uncomment fungsi `initializeSampleData()` di `server.js` untuk membuat data sample

