# Langkah-langkah Menjalankan Aplikasi E-Catalog Toyota

## Prasyarat
- ✅ Node.js dan npm sudah terinstall
- ✅ PostgreSQL sudah terinstall dan berjalan
- ✅ Git sudah terinstall (opsional)

---

## Langkah 1: Install Dependencies

Buka terminal/command prompt di folder project dan jalankan:

```bash
npm install
```

Ini akan menginstall semua dependencies termasuk:
- express, cors, body-parser, multer
- **pg** (PostgreSQL client)
- **dotenv** (untuk environment variables)
- nodemon, concurrently (untuk development)

---

## Langkah 2: Setup PostgreSQL Database

### 2.1. Pastikan PostgreSQL Service Berjalan

**Windows:**
- Buka Services (Win + R → services.msc)
- Cari "postgresql" dan pastikan statusnya "Running"
- Atau buka pgAdmin dan pastikan bisa connect

**Linux/Mac:**
```bash
sudo systemctl status postgresql
# atau
brew services list
```

### 2.2. Buat Database

**PENTING:** Hanya perlu membuat DATABASE, tabel akan dibuat otomatis saat server pertama kali dijalankan!

Buka **pgAdmin** atau **psql** dan jalankan:

```sql
CREATE DATABASE ecatalog_toyota;
```

**Atau via Command Line (psql):**
```bash
psql -U postgres
CREATE DATABASE ecatalog_toyota;
\q
```

### 2.3. Verifikasi Database

```sql
\l
-- Pastikan database ecatalog_toyota muncul di list
```

**⚠️ CATATAN PENTING:**
- **TIDAK PERLU** menjalankan `sequelize-cli` atau migration tools
- Aplikasi ini menggunakan `pg` (PostgreSQL client) langsung, BUKAN Sequelize ORM
- Tabel (`mobil`, `promo`, `admin`) akan **otomatis dibuat** saat server pertama kali dijalankan
- Fungsi `initializeDatabase()` di `database.js` akan membuat semua tabel secara otomatis

---

## Langkah 3: Konfigurasi Environment Variables

### 3.1. Buat File .env

**Opsi A: Copy dari Template (Recommended)**
```bash
# Windows PowerShell
cd backend
Copy-Item env.example .env

# Windows Command Prompt
cd backend
copy env.example .env

# Linux/Mac
cd backend
cp env.example .env
```

**Opsi B: Buat Manual**
1. Buat file baru bernama `.env` di folder `backend/`
2. Copy isi dari `backend/env.example`
3. Paste ke file `.env`

### 3.2. Edit File .env

Buka file `backend/.env` dan sesuaikan dengan konfigurasi PostgreSQL Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecatalog_toyota
DB_USER=postgres          # Sesuaikan dengan username PostgreSQL Anda
DB_PASSWORD=postgres      # Sesuaikan dengan password PostgreSQL Anda

# Server Configuration
PORT=5000

# Environment
NODE_ENV=development
```

**PENTING:** 
- Ganti `DB_USER` jika username PostgreSQL Anda bukan "postgres"
- Ganti `DB_PASSWORD` dengan password PostgreSQL Anda
- Jika PostgreSQL berjalan di port lain, sesuaikan `DB_PORT`

---

## Langkah 4: Install Dependencies Frontend (Jika Belum)

```bash
cd frontend
npm install
cd ..
```

---

## Langkah 5: Jalankan Aplikasi

### Opsi 1: Jalankan Server dan Client Bersamaan (Recommended)

```bash
npm run dev
```

Ini akan menjalankan:
- Backend server di `http://localhost:5000`
- Frontend React di `http://localhost:3000`

### Opsi 2: Jalankan Terpisah

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

---

## Langkah 6: Verifikasi Aplikasi Berjalan

### 6.1. Cek Backend API

Buka browser dan akses:
```
http://localhost:5000
```

Anda akan melihat JSON response dengan informasi API endpoints.

### 6.2. Cek Frontend

Buka browser dan akses:
```
http://localhost:3000
```

Anda akan melihat halaman utama E-Catalog Toyota.

### 6.3. Cek Database Tables

Server akan **otomatis membuat tabel** saat pertama kali dijalankan. Untuk memverifikasi:

```sql
-- Buka psql atau pgAdmin
\c ecatalog_toyota
\dt

-- Anda akan melihat tabel:
-- - mobil
-- - promo
-- - admin
```

---

## Langkah 7: Login Admin (Opsional)

1. Buka `http://localhost:3000/admin/login`
2. Login dengan:
   - **Username:** `admin`
   - **Password:** `admin123`

**PENTING:** Ganti password default di production!

---

## Troubleshooting

### ❌ Error: "Connection refused" atau "ECONNREFUSED"

**Penyebab:** PostgreSQL tidak berjalan atau konfigurasi salah

**Solusi:**
1. Pastikan PostgreSQL service berjalan
2. Periksa `DB_HOST` dan `DB_PORT` di file `.env`
3. Test koneksi: `psql -U postgres -h localhost -p 5432`

### ❌ Error: "password authentication failed"

**Penyebab:** Username atau password salah

**Solusi:**
1. Periksa `DB_USER` dan `DB_PASSWORD` di file `.env`
2. Pastikan user memiliki akses ke database
3. Test login: `psql -U postgres -d ecatalog_toyota`

### ❌ Error: "database does not exist"

**Penyebab:** Database belum dibuat

**Solusi:**
```sql
CREATE DATABASE ecatalog_toyota;
```

### ❌ Error: "relation does not exist"

**Penyebab:** Tabel belum dibuat

**Solusi:**
- Server akan otomatis membuat tabel saat pertama kali dijalankan
- Pastikan koneksi database berhasil
- Periksa console log untuk error saat inisialisasi

### ❌ Error: "Cannot find module 'pg'"

**Penyebab:** Dependencies belum diinstall

**Solusi:**
```bash
npm install
```

### ❌ Error: "Port 5000 already in use"

**Penyebab:** Port sudah digunakan aplikasi lain

**Solusi:**
1. Ganti `PORT` di file `.env` (misalnya: `PORT=5001`)
2. Atau stop aplikasi yang menggunakan port 5000

### ❌ Frontend tidak bisa connect ke backend

**Penyebab:** CORS atau backend tidak berjalan

**Solusi:**
1. Pastikan backend berjalan di port yang benar
2. Periksa file `frontend/package.json` untuk proxy configuration
3. Pastikan CORS sudah di-enable di backend

---

## Struktur File .env

Pastikan file `.env` berada di folder `backend/` dengan struktur:

```
Ecatalog/
├── backend/
│   ├── .env          ← File ini harus ada di sini
│   ├── env.example   ← Template
│   ├── server.js
│   └── ...
├── frontend/
└── package.json
```

---

## Checklist Sebelum Menjalankan

- [ ] PostgreSQL sudah terinstall dan berjalan
- [ ] Database `ecatalog_toyota` sudah dibuat
- [ ] File `.env` sudah dibuat di folder `backend/`
- [ ] Konfigurasi di `.env` sudah sesuai
- [ ] Dependencies sudah diinstall (`npm install`)
- [ ] Port 5000 dan 3000 tidak digunakan aplikasi lain

---

## Quick Start (Ringkas)

```bash
# 1. Install dependencies
npm install

# 2. Buat database (via pgAdmin atau psql)
CREATE DATABASE ecatalog_toyota;

# 3. Setup .env
cd backend
copy env.example .env
# Edit .env dan sesuaikan DB_USER dan DB_PASSWORD
cd ..

# 4. Jalankan aplikasi
npm run dev
```

---

## Catatan Penting

1. **Database akan otomatis dibuat tabel** saat server pertama kali dijalankan
2. **Default admin:** username `admin`, password `admin123`
3. **File upload** akan disimpan di folder `backend/uploads/`
4. **Data lama di JSON** tidak otomatis di-migrate, harus import manual via admin panel

---

## Support

Jika masih ada masalah, periksa:
- Console log di terminal
- Browser console (F12)
- File `DATABASE_SETUP.md` untuk detail setup database
- Pastikan semua prasyarat sudah terpenuhi



