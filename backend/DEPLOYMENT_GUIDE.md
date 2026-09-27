# Panduan Integrasi Backend Google Sheets & Google Drive untuk K-TORS

Dokumen ini menjelaskan cara menghubungkan aplikasi web **K-TORS** dengan **Google Sheets** (sebagai Database Relasional) dan **Google Drive** (sebagai Cloud Storage untuk Nota, Foto Jurnal, dan Dokumen PDF).

---

## 🚀 Langkah 1: Buat Google Spreadsheet Baru
1. Buka browser dan kunjungi: **[https://sheets.new](https://sheets.new)**
2. Beri nama spreadsheet Anda, contoh: `K-TORS Database Operasional Kopkarindo 2026`

---

## 💻 Langkah 2: Pasang Google Apps Script
1. Di halaman Google Spreadsheet Anda, klik menu bar atas: **Extensions (Ekstensi)** -> **Apps Script**.
2. Editor kode Apps Script akan terbuka. Hapus isi fungsi `myFunction()` bawaan.
3. Buka file [`backend/Code.gs`](file:///D:/Users/arasyid/.gemini/antigravity-ide/scratch/k-tors-app/backend/Code.gs), salin seluruh isi kodenya, dan tempelkan (*paste*) ke dalam editor Apps Script.
4. Klik tombol ikon **Save (Simpan / Ctrl+S)**.

---

## 🌐 Langkah 3: Deploy (Terapkan) sebagai Web App
1. Di pojok kanan atas Apps Script, klik tombol biru **Deploy** -> **New deployment**.
2. Klik ikon gear ⚙️ di sebelah kiri *Select type*, lalu pilih **Web app**.
3. Isi konfigurasi berikut:
   - **Description**: `K-TORS Backend API v1.0`
   - **Execute as**: `Me (email-anda@gmail.com)`
   - **Who has access**: `Anyone` *(PENTING: Pilih "Anyone" agar aplikasi web K-TORS dapat mengirim data tanpa kendala CORS).*
4. Klik tombol **Deploy**.
5. Klik **Authorize access** -> Pilih Akun Google Anda -> Klik **Advanced (Lanjutan)** -> Klik **Go to K-TORS (unsafe)** -> Klik **Allow (Izinkan)**.
6. Salin **Web App URL** yang muncul (Format URL: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 🔗 Langkah 4: Hubungkan ke Aplikasi K-TORS
1. Buka aplikasi K-TORS di browser: **[http://localhost:5173/](http://localhost:5173/)**
2. Klik tombol **"Google Sheet & Drive"** di Navbar atas.
3. Tempelkan (*paste*) Web App URL yang tadi Anda salin ke dalam kolom input URL.
4. Klik tombol **"Inisialisasi 7 Sheet & Folder Drive"**.
   - Google Apps Script akan secara otomatis membuat 7 tab tabel database di spreadsheet Anda:
     1. `1_TRIPS` (Data Master Tur, SPT, & Petugas)
     2. `2_PASSENGERS` (Manifes Wisatawan, Paspor, Alergi, Presensi)
     3. `3_RAMP_CHECK` (Form Kelaikan Bus FM-K3-01 & 9 Parameter K3)
     4. `4_DAILY_LOGS` (Jurnal Harian, GPS Geolocation, & Foto)
     5. `5_INCIDENTS` (Berita Acara Insiden K3 FM-K3-04)
     6. `6_EXPENSES` (Nota Realisasi & Klaim Kas Koperasi)
     7. `7_CSAT_EVALUATION` (Rekapitulasi Kepuasan Pelanggan)
   - Dan membuat folder cloud di Google Drive: `K-TORS_Cloud_Storage/`
5. Klik **"Sinkronkan Data Tur Ini Sekarang"** untuk mengirim seluruh data awal ke Google Sheet!

---

## 📊 Keunggulan Arsitektur Ini:
- **Gratis 100% & Tanpa Server Maintenance**: Menggunakan infrastruktur Google Cloud gratis.
- **Dapat Diakses Bersama secara Real-time**: Tim Finance, Manager, dan Tour Leader dapat melihat spreadsheet langsung.
- **Offline-First Resilience**: Jika di lapangan tidak ada sinyal, data tetap tersimpan di browser, dan dapat disinkronkan ke Google Sheet begitu mendapatkan koneksi internet.
