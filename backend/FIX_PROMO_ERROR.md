# Perbaikan Error Upload Promo

## Masalah
Error "Gagal menyimpan promo" saat mencoba menyimpan promo baru.

## Penyebab Umum

### 1. Tabel Promos Belum Dibuat (Paling Sering)
Tabel `Promos` belum ada di database karena migration belum dijalankan.

**Solusi:**
```bash
cd backend
npx sequelize-cli db:migrate
```

### 2. Model Promo Tidak Terdaftar
Model Promo tidak terdeteksi oleh Sequelize.

**Solusi:**
- Pastikan file `backend/models/promo.js` ada
- Restart server backend setelah membuat model

### 3. Database Connection Error
Koneksi ke database gagal.

**Solusi:**
- Cek file `backend/config/config.json`
- Pastikan database sudah dibuat
- Cek kredensial database (username, password, host, port)

## Langkah-langkah Perbaikan

### Step 1: Jalankan Migration
```bash
cd backend
npx sequelize-cli db:migrate
```

Ini akan membuat tabel `Promos` dengan struktur:
- `id` (Primary Key, Auto Increment)
- `judul` (String, NOT NULL)
- `deskripsi` (Text, NULL)
- `gambar` (String, NULL)
- `tanggal_awal` (Date, NULL)
- `tanggal_akhir` (Date, NULL)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Step 2: Verifikasi Tabel
Cek apakah tabel sudah dibuat:
```bash
# Jika menggunakan psql
psql -U your_username -d your_database
\dt Promos

# Atau cek di terminal backend saat server start
# Akan muncul: "Database connection has been established successfully."
```

### Step 3: Restart Server
```bash
# Stop server (Ctrl+C)
# Start ulang
npm start
# atau
npx nodemon server.js
```

### Step 4: Test Upload Promo
1. Buka `http://localhost:3000/admin/promo`
2. Klik "Tambah Promo Baru"
3. Isi form:
   - Judul: "Test Promo"
   - Upload gambar JPEG
   - Klik "Upload Gambar"
   - Setelah gambar muncul, klik "Tambah Promo"

## Error Messages yang Diperbaiki

### Sebelum:
- "Gagal menyimpan promo" (tidak informatif)

### Sesudah:
- "Tabel Promos belum dibuat. Jalankan migration: npx sequelize-cli db:migrate"
- "Judul promo harus diisi"
- "Gambar promo harus diupload terlebih dahulu"
- Detail error yang lebih spesifik di console backend

## Troubleshooting

### Error: "relation 'Promos' does not exist"
**Solusi:** Jalankan migration:
```bash
cd backend
npx sequelize-cli db:migrate
```

### Error: "Model Promo tidak ditemukan"
**Solusi:** 
1. Pastikan file `backend/models/promo.js` ada
2. Restart server backend
3. Cek apakah model terdaftar di `backend/models/index.js` (otomatis)

### Error: "Cannot read property 'create' of undefined"
**Solusi:** 
1. Pastikan migration sudah dijalankan
2. Restart server backend
3. Cek console backend untuk error detail

### Gambar berhasil diupload tapi promo tidak tersimpan
**Solusi:**
1. Cek console backend untuk error detail
2. Pastikan semua field required sudah diisi (judul dan gambar)
3. Cek apakah tabel Promos sudah dibuat

## Verifikasi Setup

### Checklist:
- [ ] Migration sudah dijalankan (`npx sequelize-cli db:migrate`)
- [ ] Tabel `Promos` ada di database
- [ ] File `backend/models/promo.js` ada
- [ ] Server backend sudah restart
- [ ] Database connection berhasil (cek console)
- [ ] Folder `backend/uploads/` ada dan bisa diakses

## Test Manual

### Test 1: Cek Model
```javascript
// Di backend/server.js, tambahkan sementara:
console.log('Available models:', Object.keys(db));
console.log('Promo model:', db.Promo);
```

### Test 2: Cek Tabel
```sql
-- Di psql atau database client:
SELECT * FROM "Promos";
```

### Test 3: Test API Langsung
```bash
# Test GET
curl http://localhost:5000/api/promo

# Test POST (setelah upload gambar)
curl -X POST http://localhost:5000/api/promo \
  -H "Content-Type: application/json" \
  -d '{
    "judul": "Test Promo",
    "deskripsi": "Test",
    "gambar": "/uploads/promo-test.jpg",
    "tanggalAwal": "2024-01-01",
    "tanggalAkhir": "2024-12-31"
  }'
```

## Catatan Penting

1. **Migration harus dijalankan sekali** setelah membuat file migration
2. **Restart server** setelah migration untuk memastikan model ter-load
3. **Cek console backend** untuk melihat error detail yang lebih spesifik
4. **Gambar harus diupload dulu** sebelum menyimpan promo (klik "Upload Gambar" terlebih dahulu)

---

Jika masih error setelah mengikuti langkah-langkah di atas, cek console backend untuk error detail yang lebih spesifik.

