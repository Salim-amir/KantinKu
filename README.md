# KantinKu 🍔🥤

KantinKu adalah aplikasi web modern yang dirancang untuk mendigitalisasi sistem pemesanan makanan dan minuman di lingkungan kampus atau perkantoran yang memiliki beberapa lantai/kantin. Aplikasi ini memungkinkan pengguna (mahasiswa/karyawan) untuk memesan dari lantai tertentu, membayar via QRIS, dan mengambil pesanan tanpa antri panjang.

## 🚀 Fitur Utama

### Mahasiswa / Pengguna (Customer)
- **Cari & Filter per Lantai:** Jelajahi menu makanan berdasarkan lantai kantin (misal: Lantai 2, Lantai 8).
- **Keranjang Belanja (Cart):** Tambahkan produk dari berbagai lantai ke keranjang belanja.
- **Checkout & Pembayaran Dinamis:** Bayar menggunakan QRIS yang spesifik untuk tiap lantai.
- **Upload Bukti Pembayaran:** Upload bukti transfer agar pesanan dapat diproses oleh Admin.
- **Pantau Status Pesanan:** Lacak status pesanan secara *real-time* (Menunggu Pembayaran -> Disiapkan -> Siap Diambil -> Selesai).
- **Manajemen Profil:** Ubah nama, email, dan kata sandi dengan aman.

### Admin Kantin
- **Dashboard Analitik:** Ringkasan statistik pendapatan harian/bulanan.
- **Kelola Lantai & QRIS:** Tambahkan, edit, atau nonaktifkan lantai. Upload QRIS unik untuk masing-masing lantai.
- **Kelola Produk:** CRUD (Create, Read, Update, Delete) produk kantin beserta gambarnya.
- **Kelola Stok:** Atur persediaan stok secara dinamis berdasarkan lantai.
- **Kelola Pesanan:** Pantau pesanan masuk, verifikasi bukti pembayaran, dan perbarui status pesanan (*Order Workflow*).

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dipisahkan menjadi dua bagian utama (*Frontend* & *Backend*):

**Backend (REST API)**
- [Laravel 11](https://laravel.com/) (PHP)
- MySQL / MariaDB (Database)
- Laravel Sanctum (Autentikasi Token)

**Frontend (Single Page Application)**
- [React.js](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- React Router DOM (Routing)
- Axios (HTTP Client)

## 📦 Panduan Instalasi Lokal (Local Development)

### Persyaratan Sistem
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL / MariaDB

### 1. Setup Backend (Laravel)

1. Masuk ke direktori root (atau direktori backend jika dipisah):
   ```bash
   cd kantinku-api
   ```
2. Instal dependensi PHP:
   ```bash
   composer install
   ```
3. Salin konfigurasi environment:
   ```bash
   cp .env.example .env
   ```
4. Buka file `.env` dan konfigurasikan koneksi database Anda (misal menggunakan Laragon/XAMPP):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=kantinku_db # Sesuaikan dengan nama DB Anda
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Generate Application Key:
   ```bash
   php artisan key:generate
   ```
6. Jalankan Migrasi Database dan Seeder (jika ada):
   ```bash
   php artisan migrate
   ```
7. Buat symbolic link untuk storage gambar (Wajib agar gambar produk/QRIS bisa diakses):
   ```bash
   php artisan storage:link
   ```
8. Jalankan server lokal Laravel:
   ```bash
   php artisan serve
   ```
   *Backend sekarang berjalan di `http://127.0.0.1:8000`*

### 2. Setup Frontend (React / Vite)

1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd kantinku-frontend
   ```
2. Instal dependensi Node.js:
   ```bash
   npm install
   ```
3. *(Opsional)* Jika backend Anda berjalan di port yang berbeda dari `8000` (atau menggunakan domain khusus Laragon seperti `kantinku.test`), pastikan Anda mengubah `baseURL` API Anda di `src/services/api.js`:
   ```javascript
   baseURL: "http://127.0.0.1:8000/api",
   ```
4. Jalankan server development Vite:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:5173` di browser Anda.

## 👥 Kontributor
- Dirancang & Dikembangkan secara *Pair-Programming* bersama AI Agent (Google DeepMind).

---
*Dibuat dengan ❤️ untuk sistem manajemen kantin yang lebih efisien.*
