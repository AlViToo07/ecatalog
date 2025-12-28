# Langkah-langkah Menjalankan Program E-Catalog

## 📋 Prasyarat

Pastikan sudah terinstall:
- ✅ Node.js (v14 atau lebih baru)
- ✅ npm atau yarn
- ✅ PostgreSQL (v12 atau lebih baru)
- ✅ PostgreSQL service berjalan

---

## 🚀 Langkah 1: Install Dependencies

### 1.1. Install Dependencies Backend

```bash
cd backend
npm install
```

Ini akan menginstall:
- express, cors, body-parser, multer
- sequelize, pg, pg-hstore
- dotenv

### 1.2. Install Dependencies Frontend (jika belum)

```bash
cd ../frontend
npm install
cd ..
```

---

## 🗄️ Langkah 2: Setup Database PostgreSQL

### 2.1. Buat Database

Buka **pgAdmin** atau **psql** dan jalankan:

```sql
CREATE DATABASE database_development;
```

**Atau via Command Line:**
```bash
psql -U postgres
CREATE DATABASE database_development;
\q
```

### 2.2. Konfigurasi Database

Edit file `backend/config/config.json` dan sesuaikan dengan konfigurasi PostgreSQL Anda:

```json
{
  "development": {
    "username": "postgres",        // Ganti dengan username PostgreSQL Anda
    "password": "123",              // Ganti dengan password PostgreSQL Anda
    "database": "database_development",  // Nama database yang sudah dibuat
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

**PENTING:** 
- Ganti `username` jika bukan "postgres"
- Ganti `password` dengan password PostgreSQL Anda
- Pastikan `database` sesuai dengan nama database yang sudah dibuat

---

## 🔄 Langkah 3: Jalankan Migration

Migration akan membuat tabel `Cars` dengan semua field yang diperlukan.

```bash
cd backend
npx sequelize-cli db:migrate
```

**Output yang diharapkan:**
```
Sequelize CLI [Node: x.x.x]

Loaded configuration file "config/config.json".
Using environment "development".
== 20251224164558-create-car: migrating =======
== 20251224164558-create-car: migrated (0.xxx s)
== 20251224170000-add-fields-to-cars: migrating =======
== 20251224170000-add-fields-to-cars: migrated (0.xxx s)
```

**Verifikasi:**
Buka pgAdmin atau psql dan cek apakah tabel `Cars` sudah dibuat:
```sql
\c database_development
\dt
-- Anda akan melihat tabel "Cars"
```

---

## 🌱 Langkah 4: Jalankan Seeder (Opsional)

Seeder akan menambahkan data sample ke database.

```bash
npx sequelize-cli db:seed:all
```

**Atau jalankan seeder tertentu:**
```bash
npx sequelize-cli db:seed --seed 20251224164701-seed-cars.js
```

**Verifikasi:**
```sql
SELECT * FROM "Cars";
-- Anda akan melihat data yang sudah di-seed
```

---

## 🖥️ Langkah 5: Jalankan Server

### Opsi 1: Jalankan Backend dan Frontend Bersamaan (Recommended)

Dari **root folder** project:

```bash
npm run dev
```

Ini akan menjalankan:
- Backend di `http://localhost:5000`
- Frontend di `http://localhost:3000`

### Opsi 2: Jalankan Terpisah

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# atau dengan auto-reload
npx nodemon server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## ✅ Langkah 6: Verifikasi Program Berjalan

### 6.1. Cek Backend API

Buka browser dan akses:
```
http://localhost:5000
```

Anda akan melihat JSON response:
```json
{
  "message": "E-Catalog Mobil API Server",
  "version": "1.0.0",
  "database": "Sequelize + PostgreSQL",
  "endpoints": { ... }
}
```

### 6.2. Test API Endpoint

**Test GET semua mobil:**
```
http://localhost:5000/api/mobil
```

**Test GET mobil by ID:**
```
http://localhost:5000/api/mobil/1
```

### 6.3. Cek Frontend

Buka browser dan akses:
```
http://localhost:3000
```

Anda akan melihat halaman utama E-Catalog Toyota.

### 6.4. Cek Database

Buka pgAdmin atau psql:
```sql
\c database_development
SELECT id, model, tahun, jenis FROM "Cars";
```

---

## 🔧 Troubleshooting

### ❌ Error: "relation does not exist" atau "table does not exist"

**Penyebab:** Migration belum dijalankan atau gagal.

**Solusi:**
```bash
cd backend
npx sequelize-cli db:migrate
```

### ❌ Error: "column does not exist"

**Penyebab:** Migration untuk menambahkan field belum dijalankan.

**Solusi:**
```bash
cd backend
npx sequelize-cli db:migrate
```

### ❌ Error: "password authentication failed"

**Penyebab:** Username atau password salah di `config.json`.

**Solusi:**
1. Periksa `backend/config/config.json`
2. Pastikan username dan password sesuai dengan PostgreSQL Anda
3. Test koneksi: `psql -U postgres -d database_development`

### ❌ Error: "database does not exist"

**Penyebab:** Database belum dibuat.

**Solusi:**
```sql
CREATE DATABASE database_development;
```

### ❌ Error: "Cannot find module 'sequelize-cli'"

**Penyebab:** Sequelize CLI belum terinstall.

**Solusi:**
```bash
cd backend
npm install -g sequelize-cli
# atau
npx sequelize-cli db:migrate
```

### ❌ Error: "Port 5000 already in use"

**Penyebab:** Port sudah digunakan aplikasi lain.

**Solusi:**
1. Ganti PORT di `backend/server.js` atau
2. Stop aplikasi yang menggunakan port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill
   ```

### ❌ Error: "SequelizeConnectionError"

**Penyebab:** Koneksi database gagal.

**Solusi:**
1. Pastikan PostgreSQL service berjalan
2. Periksa konfigurasi di `backend/config/config.json`
3. Test koneksi:
   ```bash
   psql -U postgres -h 127.0.0.1 -d database_development
   ```

---

## 📝 Checklist Sebelum Menjalankan

- [ ] Node.js dan npm sudah terinstall
- [ ] PostgreSQL sudah terinstall dan service berjalan
- [ ] Database `database_development` sudah dibuat
- [ ] File `backend/config/config.json` sudah dikonfigurasi dengan benar
- [ ] Dependencies sudah diinstall (`npm install` di folder backend)
- [ ] Migration sudah dijalankan (`npx sequelize-cli db:migrate`)
- [ ] Port 5000 dan 3000 tidak digunakan aplikasi lain

---

## 🎯 Quick Start (Ringkas)

```bash
# 1. Install dependencies
cd backend
npm install
cd ../frontend
npm install
cd ..

# 2. Buat database (via pgAdmin atau psql)
CREATE DATABASE database_development;

# 3. Edit config.json
# Sesuaikan username, password, dan database di backend/config/config.json

# 4. Jalankan migration
cd backend
npx sequelize-cli db:migrate

# 5. (Opsional) Jalankan seeder
npx sequelize-cli db:seed:all

# 6. Jalankan aplikasi
cd ..
npm run dev
```

---

## 📚 File Penting

- `backend/config/config.json` - Konfigurasi database
- `backend/models/car.js` - Model Sequelize untuk Car
- `backend/migrations/` - File migration
- `backend/seeders/` - File seeder
- `backend/server.js` - API Express server
- `backend/API_SETUP.md` - Dokumentasi API

---

## 🆘 Butuh Bantuan?

Jika masih ada masalah:
1. Periksa console log di terminal
2. Periksa browser console (F12)
3. Periksa file `backend/API_SETUP.md` untuk detail API
4. Pastikan semua prasyarat sudah terpenuhi

---

## ✨ Setelah Berhasil

Setelah program berjalan:
- ✅ Backend API: `http://localhost:5000`
- ✅ Frontend: `http://localhost:3000`
- ✅ Admin Login: `http://localhost:3000/admin/login`
  - Username: `admin`
  - Password: `admin123`

Selamat! Program E-Catalog sudah siap digunakan! 🎉


