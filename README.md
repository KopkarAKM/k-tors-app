# 🧭 K-TORS (Kopkarindo Digital Tour Operations & Reporting System)

> **Sistem Laporan Operasional Tour & Travel Terpadu 3 Fase (Pre, On, & Post-Trip)** dengan Dukungan Database Google Sheets, Google Drive Cloud Storage, Ekspor 9 Dokumen PDF Resmi, Autentikasi 2 Peran (Tour Leader & Manager), serta Tampilan Khusus Ponsel (Mobile Web App).

---

## 🌟 Fitur Utama Sistem

### 1. ⚙️ Pengaturan Awal & Rute Perjalanan (Master Trip)
* Konfigurasi Nomor SPT Resmi, Nama Acara/Tur, Destinasi, dan Tanggal.
* **Itinerary Route Summary**: Pencatatan rute perjalanan detail (*contoh: Jakarta -> KLIA -> Genting -> Singapore -> Changi*).
* **Penunjukan Petugas Lapangan**: Penetapan nama Lead Tour Leader (TL), Tour Guide (TG), Manager Operasional, dan Petugas Keuangan.
* **Informasi Penting & Catatan Tur**: Ketentuan bagasi, dress code, briefing paspor, dan protokol perjalanan.

---

### 2. 🛫 Fase 1: Pre-Trip (Persiapan & K3)
* **Modul 1 (Manifes Data Wisatawan & Medis)**:
  * Kolom Lengkap: No. WhatsApp Pribadi, Nama & No. WA Kontak Darurat Keluarga, Riwayat Penyakit, Alergi & Diet Khusus, Pantangan Makanan, Obat-obatan Pribadi.
  * Kartu **QR e-Pass Digital** per wisatawan.
  * Full CRUD (Tambah, Edit, Hapus).
* **Modul 2 (Logistik & Konfirmasi Vendor)**:
  * Tiket Penerbangan (PNR, Maskapai, Jam Keberangkatan/Kepulangan).
  * Alokasi Kamar Hotel (*Rooming List*).
  * Kontrak Reservasi Vendor Bus & Kontak Pengemudi.
* **Modul 3 (Inspeksi Ramp Check K3 Bus & Kotak P3K)**:
  * 9 Parameter Kelaikan Bus (Rem, Ban, APAR, Palu Darurat, Sabuk Pengaman).
  * 15 Item Medis & Obat-obatan Kotak P3K Lapangan.

---

### 3. 📍 Fase 2: On-Trip (Pelaksanaan & Lapangan)
* **Modul 4 (Jurnal Harian & Briefing Keselamatan)**:
  * Pencatatan log harian berkoordinat GPS dan topik *Safety Talk* (bersih tanpa thumbnail foto).
* **Modul 5 (Presensi Digital QR e-Pass & Headcount)**:
  * Pelacakan kehadiran real-time pada Checkpoint (Bandara, Bus, Hotel, Obyek Wisata).
  * Simulator Scanner Kamera QR Code.
* **Modul 6 (Laporan Insiden K3 & Near Miss)**:
  * Berita acara penanganan kejadian darurat medis, barang hilang, keluhan fasilitas, dan tindakan penyelesaian.

---

### 4. 💰 Fase 3: Post-Trip (Keuangan & Evaluasi)
* **Modul 7 (Settlement Kas Bon & Nota Pengeluaran)**:
  * Lampiran scan/foto bukti pencairan voucher Kas Bon awal Koperasi (*Cash Advance*).
  * Full CRUD nota pengeluaran dengan kalkulasi otomatis saldo kas (**Surplus / Defisit**).
* **Modul 8 (Evaluasi & CSAT Google Form)**:
  * Integrasi survei kepuasan wisatawan via Google Form.
  * Tombol 1-klik bagikan link kuesioner ke WhatsApp wisatawan.
  * Rekapitulasi bintang rating dan ulasan testimoni.

---

### 5. ✅ Checklist Kelengkapan Tur (Fase 1 - 3)
* Pemantau kepatuhan real-time (0 - 100%) untuk memastikan ke-8 modul terisi lengkap.
* Tanda tangan digital (*E-Sign*) Lead Tour Leader dan persetujuan Manager Operasional.
* Penerbitan dokumen PDF *Berita Acara Checklist Kelengkapan Tur*.

---

### 6. 📄 Pusat Ekspor 9 Dokumen PDF Resmi
Kompilasi otomatis 9 dokumen PDF berstandar kop surat resmi Kopkarindo dan 2 tanda tangan (*Lead TL & Manager*):
1. **Laporan Utama Tour Leader (TL Report - TLR)**
2. **Laporan Keuangan Kas Bon & Settlement (FM-FIN-02)**
3. **Form Inspeksi Kelaikan Bus Ramp Check (FM-K3-01)**
4. **Form Checklist Kelengkapan P3K Lapangan (FM-K3-03)**
5. **Form Laporan Insiden K3 & Keluhan (FM-K3-04)**
6. **Rekapitulasi Kuesioner Kepuasan CSAT**
7. **Surat Konfirmasi Reservasi Vendor Transportasi**
8. **Passenger Manifest & Rooming List Sheet** (Lengkap No. WA, Darurat & Medis)
9. **Berita Acara Checklist Kelengkapan Tur (Fase 1 - 3)**

---

### 7. 🔐 Model 2 Peran Terproteksi Password (PIN)
* 🧭 **Tour Leader / TG (`TL2026`)**: Fokus pada pengisian lapangan (Manifes, Ramp Check, Presensi, Jurnal, Nota).
* 👔 **Manager Operasional (`MGR2026`)**: Fokus pada back-office & approval (SPT, Rute, Kas Bon, Audit Checklist & Tanda Tangan Persetujuan).

---

### 8. 📱 Tampilan Khusus Ponsel (Mobile Web App)
* Mode UI/UX responsif yang super ringkas, cepat, dan disesuaikan perannya saat dibuka di browser smartphone.

---

## 🏗️ Struktur Direktori Proyek

```
k-tors-app/
├── backend/
│   ├── Code.gs                  # Google Apps Script API (Sheets DB & Drive Storage)
│   └── DEPLOYMENT_GUIDE.md      # Panduan Deployment Google Apps Script
├── public/
├── src/
│   ├── components/
│   │   ├── mobile/              # Komponen Khusus Tampilan Ponsel
│   │   │   ├── MobileApp.jsx
│   │   │   ├── MobileTourLeaderView.jsx
│   │   │   └── MobileManagerView.jsx
│   │   ├── Navbar.jsx           # Navigasi & Role Switcher
│   │   ├── OverviewDashboard.jsx # Dashboard Utama
│   │   ├── PreTripModule.jsx    # Fase 1: Manifes, Vendor, Ramp Check
│   │   ├── OnTripModule.jsx     # Fase 2: Jurnal, Presensi, Insiden
│   │   ├── PostTripModule.jsx   # Fase 3: Settlement, CSAT Google Form
│   │   ├── PhaseChecklistModule.jsx # Checklist Kelengkapan 8 Modul
│   │   ├── PdfExportModule.jsx  # Pusat Unduh 9 Dokumen PDF
│   │   ├── TripMasterModal.jsx  # Modal Pengaturan SPT & Rute
│   │   ├── RoleAuthModal.jsx    # Modal Keamanan PIN Peran
│   │   ├── QRPassModal.jsx      # Modal QR e-Pass Wisatawan
│   │   ├── QRScannerModal.jsx   # Modal Scanner Kamera QR
│   │   └── SignatureModal.jsx   # Modal Tanda Tangan Digital (Canvas)
│   ├── data/
│   │   ├── initialData.js       # Template Data Awal Simulasi
│   │   └── bnspUnits.js
│   ├── services/
│   │   └── googleSheetService.js # Konektor REST API Google Sheets
│   ├── utils/
│   │   └── pdfGenerator.js      # Mesin Pembuat 9 PDF (jsPDF + autoTable)
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Panduan Instalasi & Menjalankan Frontend

### 1. Prasyarat
* Node.js v18+ atau v20+
* NPM atau Yarn

### 2. Jalankan di Komputer Lokal
```bash
# 1. Clone repositori ini
git clone https://github.com/USERNAME/k-tors-app.git

# 2. Masuk ke direktori proyek
cd k-tors-app

# 3. Install seluruh dependencies
npm install

# 4. Jalankan server pengembangan lokal (Dev Server)
npm run dev
```
Buka browser di: **`http://localhost:5173`**

### 3. Build untuk Produksi
```bash
npm run build
```
File siap di-deploy akan berada di folder `dist/`.

---

## ☁️ Panduan Integrasi Backend Google Sheets & Google Drive

1. Buat Google Spreadsheet baru di [https://sheets.new](https://sheets.new).
2. Buka menu **Extensions (Ekstensi)** -> **Apps Script**.
3. Salin seluruh isi file [`backend/Code.gs`](backend/Code.gs) ke editor Apps Script.
4. Klik tombol **Deploy** -> **New deployment**:
   * Type: **Web app**
   * Execute as: **Me**
   * Who has access: **Anyone**
5. Salin **Web App URL** yang didapat, lalu masukkan ke dalam popup **Google Sheet & Drive** di aplikasi K-TORS.

---

## 📤 Panduan Upload ke GitHub

Jalankan perintah berikut di terminal:

```bash
# Inisialisasi Git (jika belum)
git init

# Tambahkan semua file ke staging
git add .

# Buat commit pertama
git commit -m "feat: inisialisasi K-TORS tour reporting system lengkap 3 fase & mobile app"

# Ubah branch ke main
git branch -M main

# Hubungkan ke repositori remote GitHub Anda
git remote add origin https://github.com/USERNAME/NAMA-REPO-ANDA.git

# Push ke GitHub
git push -u origin main
```

---

## 📜 Lisensi & Pengembang
Dikembangkan untuk **Divisi Tour & Travel Kopkarindo** • Memenuhi SOP Keselamatan Kerja K3 dan Standar Pelaporan Operasional Tur 2024-2026.
