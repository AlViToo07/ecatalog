# Panduan Akses Admin

## Cara Mengakses Halaman Admin

Halaman admin **tidak muncul di navbar** untuk fokus pada pengalaman user. Admin dapat mengakses halaman admin melalui URL langsung.

### URL Akses Admin

1. **Halaman Login Admin:**
   ```
   http://localhost:3000/admin/login
   ```

2. **Dashboard Admin (setelah login):**
   ```
   http://localhost:3000/admin
   ```

3. **Kelola Mobil:**
   ```
   http://localhost:3000/admin/mobil
   ```

4. **Tambah Mobil Baru:**
   ```
   http://localhost:3000/admin/mobil/tambah
   ```

5. **Edit Mobil:**
   ```
   http://localhost:3000/admin/mobil/edit/:id
   ```

6. **Kelola Promo:**
   ```
   http://localhost:3000/admin/promo
   ```

### Default Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

### Fitur Admin

#### 1. Kelola Mobil
- ✅ Tambah mobil baru dengan informasi lengkap
- ✅ Upload multiple gambar (maksimal 10 gambar JPEG)
- ✅ Edit data mobil yang sudah ada
- ✅ Hapus mobil
- ✅ Kelola warna mobil (multiple)
- ✅ Kelola harga per transmisi (Manual/Automatic)

#### 2. Kelola Promo
- ✅ Upload gambar brosur promo
- ✅ Atur judul dan deskripsi promo
- ✅ Atur tanggal berlaku promo
- ✅ Edit promo yang sudah ada
- ✅ Hapus promo

### Catatan Penting

1. **Keamanan:** Untuk produksi, sebaiknya:
   - Ganti username dan password default
   - Tambahkan autentikasi yang lebih kuat
   - Gunakan HTTPS
   - Tambahkan rate limiting

2. **Akses:** Admin dapat mengakses halaman admin kapan saja dengan membuka URL `/admin/login` di browser.

3. **Navigasi:** Di setiap halaman admin, terdapat tombol "Kembali ke Website" untuk kembali ke halaman user.

### Troubleshooting

**Jika tidak bisa login:**
1. Pastikan backend server berjalan
2. Pastikan file `backend/data/admin.json` ada dan berisi data admin
3. Cek console browser untuk error

**Jika data tidak tersimpan:**
1. Pastikan folder `backend/data/` memiliki permission write
2. Cek console browser dan server untuk error
3. Pastikan format data sesuai dengan yang diharapkan



