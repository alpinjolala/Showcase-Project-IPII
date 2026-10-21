# 🎓 Sistem Informasi Showcase Karya Mahasiswa IPII

Sistem Informasi Showcase Karya Mahasiswa (IPII Showcase) adalah aplikasi berbasis web yang dirancang khusus untuk mempublikasikan, mengelola, dan mendokumentasikan karya, makalah, serta kegiatan mahasiswa.

Sistem ini dirancang tanpa memerlukan _hosting_ berbayar dengan memanfaatkan **Blogger** sebagai _Frontend_ (Overlay Full Page) dan **Google Apps Script (GAS)** yang terhubung ke **Google Sheets** sebagai _Backend_ & _Database_.

🌐 **Live Demo Website:** [IPII Project Showcase](https://ipii-antasari.blogspot.com/p/ipii-project-showcase.html)

---

## 📸 Tampilan Antarmuka (Preview)

### 1. Banner Utama & Video Profil

![Banner Utama dan Video Profil](https://github.com/alpinjolala/v5-aktif/blob/main/Home.png)

> _Menampilkan sambutan, deskripsi singkat prodi, dan pemutar video/playlist YouTube profil prodi._

---

### 2. Highlight Karya Terbaru (Slider Auto-Scroll)

![Highlight Karya Terbaru](https://github.com/alpinjolala/v5-aktif/blob/main/Highlight%20Karya%20Terbaru.png)

> _Kumpulan karya-karya terbaru mahasiswa yang bergerak secara otomatis dari kiri ke kanan (infinite loop)._

---

### 3. Eksplorasi Karya (Galeri Publik)

![Eksplorasi Karya Mahasiswa](https://github.com/alpinjolala/v5-aktif/blob/main/Eksplorasi%20Karya.png)

> _Galeri karya responsif yang dilengkapi dengan filter kategori dinamis, informasi pembuat, tanggal publikasi, serta link akses langsung._

---

## 📌 Fitur Utama

- **Public Gallery**:
  - Banner Video/Playlist YouTube interaktif Prodi IPII.
  - Highlight Karya Terbaru dengan animasi _infinite slider_ (kiri ke kanan).
  - Filter karya berdasarkan kategori secara dinamis.
  - Kartu galeri responsif dengan tautan ke berkas/repositori eksternal.

- **Panel Backoffice (Dashboard)**:
  - **Multi-role User**: Akses terpisah untuk **Admin** dan **Mahasiswa**.
  - **Sistem Akun**: Autentikasi aman berbasis sesi browser.
  - **Manajemen Karya**: _Create, Read, Update, Delete_ (CRUD) karya oleh mahasiswa dan admin.
  - **Sistem Modul Validasi Karya**: Setiap karya yang diunggah mahasiswa berstatus `Pending` hingga disetujui (`Approved`) oleh Admin.
  - **Manajemen Pengguna**: Admin dapat menambah dan menghapus akun akses mahasiswa.
  - **Pengaturan Sistem**:
    - Pengubahan ID Video/Playlist YouTube secara langsung dari dashboard.
    - Pengelolaan kategori karya secara dinamis (tambah/hapus kategori).

---

## 🛠️ Persiapan & Instalasi

Proses instalasi dibagi menjadi dua bagian: **Konfigurasi Backend (Google Apps Script)** dan **Konfigurasi Frontend (Blogger)**.

### Langkah 1: Setup Backend & Database (Google Sheets & GAS)

1. **Buat Google Sheet Baru**:
   - Buka [Google Sheets](https://sheets.google.com/) dan buat spreadsheet kosong baru.
   - Beri nama spreadsheet, contoh: `Database Showcase IPII`.

2. **Buka Apps Script Editor**:
   - Di spreadsheet tersebut, klik menu **Ekstensi** > **Apps Script**.
   - Hapus semua kode bawaan yang ada di berkas `Code.gs`.
   - Salin dan tempelkan (_paste_) seluruh kode **Backend GAS** ke dalam editor `Code.gs`.

3. **Inisialisasi Database**:
   - Pada dropdown fungsi di bagian atas editor Apps Script, pilih fungsi `setupDatabase`.
   - Klik tombol **Jalankan (Run)**.
   - Berikan izin otorisasi (_Grant Permissions_) yang diminta oleh Google.
   - Tunggu hingga proses selesai. Lembar kerja (_sheet_) `Users`, `Karya`, dan `Settings` akan terbentuk otomatis di Google Sheets Anda.

4. **Deploy Web App**:
   - Klik tombol **Terapkan (Deploy)** di pojok kanan atas > **Penerapan baru (New deployment)**.
   - Pilih jenis penerapannya: **Aplikasi Web (Web App)**.
   - Isikan konfigurasi berikut:
     - **Deskripsi**: `Versi 1.0`
     - **Jalankan sebagai (Execute as)**: `Saya (Me / email anda)`
     - **Siapa yang memiliki akses (Who has access)**: **`Siapa saja (Anyone)`** _(Sangat penting agar API dapat dipanggil dari Blogger)_.
   - Klik **Terapkan (Deploy)**.
   - Salin **URL Aplikasi Web (Web App URL)** yang dihasilkan (misal: `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Langkah 2: Setup Frontend (Blogger)

1. **Buat Postingan / Halaman Baru di Blogger**:
   - Masuk ke dashboard [Blogger](https://www.blogger.com/).
   - Buat **Halaman Baru (Page)** atau **Postingan Baru (Post)**.

2. **Sesuaikan Kode HTML Frontend**:
   - Buka berkas `index.html` pada komputer Anda.
   - Cari blok bagian **KONFIGURASI APLIKASI Wajib** pada kode JavaScript (sekitar baris 480-490):

     ```javascript
     // SAKLAR DEPLOYMENT: Ubah ke false JIKA dipasang di Blogger & terhubung ke GAS
     const IS_PREVIEW = false; // <-- UBAH MENJADI false

     // URL Web App GAS (Ganti dengan URL dari hasil deploy Google Apps Script Anda)
     const GAS_URL = "PASANG_URL_WEB_APP_GAS_ANDA_DI_SINI";
     ```

   - Ubah `const IS_PREVIEW = true;` menjadi `const IS_PREVIEW = false;`.
   - Ganti teks `"Masukkan GAS_URL Kalian di sini"` dengan URL Web App GAS yang Anda salin pada **Langkah 1**.

3. **Tempelkan Kode ke Blogger**:
   - Pindahkan mode editor di Blogger ke **Tampilan HTML (HTML View)** (bukan _Compose View_).
   - Tempel seluruh isi kode `index.html` yang sudah disesuaikan ke dalam editor Blogger.
   - Klik **Publikasikan (Publish)**.

---

## 🔑 Kredensial Login Bawaan (Default)

Secara default, saat Anda menjalankan fungsi `setupDatabase`, sistem membuatkan akun administrator awal berikut:

| Peran (Role) | Username | Password    |
| ------------ | -------- | ----------- |
| **Admin**    | `admin`  | `admin2026` |

> ⚠️ **Catatan Keamanan**: Disarankan untuk langsung mengubah password atau memperbarui data admin melalui lembar `Users` di Google Spreadsheet Anda setelah pertama kali setup.

---

## 📖 Panduan Penggunaan Sistem

### 1. Mode Publik (Pengunjung)

- Pengunjung dapat melihat **Video Profil**, **Slider Highlight Karya**, dan seluruh daftar karya yang disetujui (`Approved`).
- Pengunjung dapat memfilter karya berdasarkan kategori menggunakan tombol dropdown di area "Eksplorasi Karya".
- Klik tombol **Login Sistem** pada navbar kanan atas untuk menuju ke halaman masuk backoffice.

### 2. Dashboard Mahasiswa

1. **Login**: Gunakan `Username` & `Password` yang telah dibuatkan oleh Admin.
2. **Tambah Karya Baru**:
   - Masuk ke menu **Karya Saya** > klik **Tambah Karya Baru**.
   - Isi form (Judul, Kategori, Deskripsi, URL Gambar Thumbnail, URL Link Eksternal, dan Tanggal).
   - Karya yang baru dibuat otomatis berstatus `Pending`.
3. **Status Karya**: Karya berstatus `Pending` tidak akan langsung tampil di galeri publik sampai disetujui oleh Admin.
4. **Edit / Hapus**: Mahasiswa hanya dapat mengedit dan menghapus karya miliknya sendiri.

### 3. Dashboard Admin

1. **Statistik**: Menampilkan jumlah Karya Publik, Karya Menunggu Validasi (Pending), dan Total Mahasiswa Terdaftar.
2. **Kelola Karya & Validasi**:
   - Admin dapat melihat seluruh karya dari semua mahasiswa.
   - Klik icon **Edit (Pensil)** pada karya berstatus `Pending` lalu ubah **Validasi Status** menjadi `Approved (Tampilkan ke Publik)` agar karya tampil di halaman depan.
3. **Kelola Pengguna (Mahasiswa)**:
   - Admin dapat menambahkan akun mahasiswa baru (Nama, NIM, Username, Password).
   - Admin dapat menghapus akun mahasiswa yang tidak aktif.
4. **Pengaturan Sistem**:
   - **Video YouTube**: Memasukkan ID Video (misal: `dQw4w9WgXcQ`) atau ID Playlist (misal diawali `PL...`) untuk ditampilkan di banner utama publik.
   - **Kategori Karya**: Menambah atau menghapus kategori karya secara dinamis.

---

## ❓ Pertanyaan Sering Diajukan (FAQ) & Troubleshooting

#### 1. Data dari Google Sheets tidak muncul di Blogger / Terjadi Error CORS?

- Pastikan saat **Deploy Web App** di Apps Script, opsi **Who has access** diset ke **`Anyone`** (Siapa saja).
- Pastikan variabel `IS_PREVIEW` pada berkas `index.html` sudah diubah ke `false`.
- Pastikan URL `GAS_URL` sudah sesuai dan tepat.

#### 2. Bagaimana cara mencari ID Video atau ID Playlist YouTube?

- **ID Video**: Ambil teks unik di akhir URL YouTube setelah `v=`.
  - Contoh: `https://www.youtube.com/watch?v=e6oA76XkQzY` -> ID: **`e6oA76XkQzY`**.
- **ID Playlist**: Ambil teks unik setelah `list=`.
  - Contoh: `https://www.youtube.com/playlist?list=PLxyz123abc` -> ID: **`PLxyz123abc`**.

#### 3. Apakah gambar karya disimpan di Google Sheets?

- Tidak. Untuk efisiensi penyimpanan, sistem menyimpan **URL Link Gambar** (Direct Image Link). Anda dapat mengunggah gambar terlebih dahulu ke platform seperti Imgur, Postimages, Google Drive (Link Publik), atau CDN gambar lainnya lalu menempelkan URL gambarnya pada form karya.

---

## 📄 Lisensi & Hak Cipta

Hak Cipta © 2026 Program Studi Ilmu Perpustakaan dan Informasi Islam (IPII) UIN Antasari.
