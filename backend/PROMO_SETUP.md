# Setup Promo dengan File Upload

## Langkah-langkah Setup

### 1. Jalankan Migration

Jalankan migration untuk membuat tabel `Promos`:

```bash
cd backend
npx sequelize-cli db:migrate
```

Ini akan membuat tabel `Promos` dengan field:
- `id` (Primary Key)
- `judul` (String, required)
- `deskripsi` (Text, optional)
- `gambar` (String, path ke file)
- `tanggal_awal` (Date, optional)
- `tanggal_akhir` (Date, optional)
- `createdAt`, `updatedAt` (Timestamps)

### 2. Restart Server

Setelah migration, restart server backend:

```bash
npm start
# atau
npx nodemon server.js
```

### 3. Fitur yang Tersedia

#### Frontend (Admin Promo)
- ✅ Upload gambar JPEG/JPG (maksimal 5MB)
- ✅ Preview gambar sebelum upload
- ✅ Validasi format file (hanya JPEG/JPG)
- ✅ Validasi ukuran file (maksimal 5MB)
- ✅ Hapus gambar yang sudah diupload
- ✅ Form untuk judul, deskripsi, tanggal awal, tanggal akhir

#### Backend API
- ✅ `POST /api/promo/upload` - Upload gambar promo
- ✅ `GET /api/promo` - Dapatkan semua promo
- ✅ `GET /api/promo/:id` - Dapatkan promo by ID
- ✅ `POST /api/promo` - Tambah promo baru
- ✅ `PUT /api/promo/:id` - Update promo
- ✅ `DELETE /api/promo/:id` - Hapus promo (dan file gambar)

### 4. Cara Menggunakan

1. Login sebagai admin di `http://localhost:3000/admin/login`
2. Akses halaman "Kelola Promo"
3. Klik "Tambah Promo Baru"
4. Isi form:
   - **Judul Promo**: Wajib diisi
   - **Deskripsi**: Opsional
   - **Upload Gambar Brosur**: 
     - Klik "Choose File" atau "Browse"
     - Pilih file JPEG/JPG (maksimal 5MB)
     - Klik "Upload Gambar" untuk upload
     - Gambar akan muncul setelah upload berhasil
   - **Tanggal Awal** dan **Tanggal Akhir**: Opsional
5. Klik "Tambah Promo" untuk menyimpan

### 5. File Storage

- File gambar promo disimpan di folder `backend/uploads/`
- Format nama file: `promo-{timestamp}-{random}.jpeg`
- File dapat diakses via: `http://localhost:5000/uploads/{filename}`

### 6. Catatan Penting

- ✅ Hanya file JPEG/JPG yang diterima
- ✅ Ukuran maksimal per file: 5MB
- ✅ Satu promo = satu gambar
- ✅ Saat menghapus promo, file gambar juga akan dihapus
- ✅ Folder `uploads/` akan dibuat otomatis jika belum ada

---

## Troubleshooting

### Error: "relation does not exist"
**Solusi:** Jalankan migration:
```bash
npx sequelize-cli db:migrate
```

### Error: "Cannot find module 'Promo'"
**Solusi:** Pastikan model `promo.js` ada di folder `backend/models/` dan restart server.

### Error: "File too large"
**Solusi:** Pastikan file gambar tidak lebih dari 5MB.

### Error: "Invalid file type"
**Solusi:** Pastikan file adalah JPEG/JPG (bukan PNG, GIF, dll).

### Gambar tidak muncul setelah upload
**Solusi:** 
- Pastikan server backend berjalan
- Cek apakah file ada di folder `backend/uploads/`
- Pastikan endpoint `/uploads` dapat diakses


