// Standar Skema BNSP No. 038/PAR/2026 - 30 Unit Kompetensi Tour Leader
export const BNSP_CLUSTERS = [
  {
    id: "cluster-1",
    name: "Klaster I: Informasi & Persiapan Tur",
    description: "Kompetensi perencanaan, informasi wisata, dan persiapan awal tur",
    units: [
      { code: "PAR.TL01.001.01", number: 1, title: "Memberikan Informasi Wisata Terkait Perjalanan", moduleRef: "Modul 1 (Manifest & Destinasi)" },
      { code: "PAR.TL01.002.01", number: 2, title: "Memahami dan Menjelaskan Rencana Perjalanan (Itinerary)", moduleRef: "Modul 2 (Logistik & Working Itinerary)" },
      { code: "PAR.TL01.003.01", number: 3, title: "Mengembangkan Hubungan Kemitraan dengan Vendor", moduleRef: "Modul 2 (Konfirmasi Vendor Transport/Hotel)" },
      { code: "PAR.TL01.004.01", number: 4, title: "Melakukan Persiapan Awal Pelaksanaan Tur", moduleRef: "Modul 1 (Surat Tugas & Verifikasi Dokumen)" },
      { code: "PAR.TL01.007.01", number: 7, title: "Mengoordinasikan Jadwal dan Jadwal Perjalanan", moduleRef: "Modul 2 (Flight PNR & Hotel Rooming)" },
    ]
  },
  {
    id: "cluster-2",
    name: "Klaster II: Keberangkatan & Transit",
    description: "Pengaturan titik kumpul, handling bandara, boarding, dan transit internasional",
    units: [
      { code: "PAR.TL02.006.01", number: 6, title: "Mengatur Keberangkatan Rombongan Wisatawan", moduleRef: "Modul 4 (Headcount & Presensi e-Pass)" },
      { code: "PAR.TL02.008.01", number: 8, title: "Memberikan Briefing Keberangkatan dan Keselamatan", moduleRef: "Modul 4 (Safety Talk Briefing & Assembly Point)" },
      { code: "PAR.TL02.009.01", number: 9, title: "Mengelola Proses Transit di Bandara / Terminal Antara", moduleRef: "Modul 4 (Daily Log Transit & Handling)" },
      { code: "PAR.TL02.010.01", number: 10, title: "Mengatur Kedatangan Rombongan di Destinasi", moduleRef: "Modul 4 (Baggage Claim & Arrival Handling)" },
      { code: "PAR.TL02.012.01", number: 12, title: "Mengatur Proses Check-in Hotel / Akomodasi", moduleRef: "Modul 2 & 4 (Rooming Key Distribution)" },
    ]
  },
  {
    id: "cluster-3",
    name: "Klaster III: Pelaksanaan & Operasional Tur",
    description: "Pemanduan harian, manajemen atraksi, optional tour, dan kepulangan",
    units: [
      { code: "PAR.TL03.011.01", number: 11, title: "Memberikan Penjelasan Destinasi & Budaya Lokal", moduleRef: "Modul 4 (Digital Journal & Tourist Guidance)" },
      { code: "PAR.TL03.013.01", number: 13, title: "Memimpin Kunjungan ke Obyek Wisata & Atraksi", moduleRef: "Modul 4 (Daily Activity Log & Timetable)" },
      { code: "PAR.TL03.014.01", number: 14, title: "Mengelola dan Menawarkan Wisata Tambahan (Optional Tour)", moduleRef: "Modul 4 & 5 (Optional Tour Log & Billing)" },
      { code: "PAR.TL03.015.01", number: 15, title: "Mengatur Proses Check-out Hotel dan Pengumpulan Kunci", moduleRef: "Modul 4 (Hotel Check-out Inspection)" },
      { code: "PAR.TL03.016.01", number: 16, title: "Mengatur Proses Penerbangan Pulang (Return Flight)", moduleRef: "Modul 4 (Airport Return Boarding Management)" },
    ]
  },
  {
    id: "cluster-4",
    name: "Klaster IV: K3 & Tanggap Darurat Lapangan",
    description: "Keselamatan armada, audit medis P3K, insiden darurat, dan penanganan kehilangan",
    units: [
      { code: "PAR.TL04.005.01", number: 5, title: "Memastikan Perjalanan Berlangsung Aman dan Nyaman (K3)", moduleRef: "Modul 3 (Ramp Check Bus FM-K3-01)" },
      { code: "PAR.TL04.018.01", number: 18, title: "Menangani Kehilangan Barang / Bagasi Wisatawan", moduleRef: "Modul 6 (Incident Log FM-K3-04: Lost Item)" },
      { code: "PAR.TL04.019.01", number: 19, title: "Menangani Kasus Pencurian / Dokumen Hilang (Paspor/KTP)", moduleRef: "Modul 6 (Emergency Incident & Police Report)" },
      { code: "PAR.TL04.025.01", number: 25, title: "Melakukan Pertolongan Pertama Pada Kecelakaan (P3K)", moduleRef: "Modul 3 (Audit Kotak P3K 15 Item FM-K3-03)" },
      { code: "PAR.TL04.026.01", number: 26, title: "Menangani Wisatawan Sakit / Keadaan Darurat Medis", moduleRef: "Modul 6 (Medical Incident & Clinic Referral)" },
      { code: "PAR.TL04.027.01", number: 27, title: "Menghadapi Kondisi Force Majeure / Keterlambatan Cuaca", moduleRef: "Modul 6 (Contingency Plan Execution)" },
      { code: "PAR.TL04.028.01", number: 28, title: "Menerapkan Prosedur K3 Lingkungan Kerja Wisata", moduleRef: "Modul 3 & 4 (Safety Briefing & Bus Inspection)" },
    ]
  },
  {
    id: "cluster-5",
    name: "Klaster V: Komunikasi, Keuangan & Pelaporan",
    description: "Komunikasi profesional, penanganan keluhan, settlement kas, dan pelaporan BNSP",
    units: [
      { code: "PAR.TL05.017.01", number: 17, title: "Berkomunikasi dalam Bahasa Inggris untuk Pelayanan Wisata", moduleRef: "Modul 2 & 4 (International Handling & Vendor Chat)" },
      { code: "PAR.TL05.020.01", number: 20, title: "Menangani Keluhan (Handling Complaints) Wisatawan", moduleRef: "Modul 6 (Complaint Resolution Log)" },
      { code: "PAR.TL05.021.01", number: 21, title: "Mengevaluasi Kepuasan Wisatawan (CSAT Feedback)", moduleRef: "Modul 6 (Rekapitulasi Kuesioner CSAT)" },
      { code: "PAR.TL05.022.01", number: 22, title: "Menyusun Laporan Pelaksanaan Tur (TL Report)", moduleRef: "Modul 5 & 6 (Tour Leader Report PDF Output)" },
      { code: "PAR.TL05.023.01", number: 23, title: "Melakukan Rekonsiliasi & Settlement Keuangan Tur", moduleRef: "Modul 5 (Settlement Sheet & Nota Realisasi)" },
      { code: "PAR.TL05.024.01", number: 24, title: "Menjaga dan Mengembangkan Kerja Sama Tim (Teamwork)", moduleRef: "Modul 1 & 4 (Koordinasi TL & Co-TL/Driver)" },
      { code: "PAR.TL05.029.01", number: 29, title: "Memanfaatkan Teknologi Digital dalam Operasional Tur", moduleRef: "Modul 1-6 (Platform Digital K-TORS & e-Sign)" },
      { code: "PAR.TL05.030.01", number: 30, title: "Menyiapkan Dokumen Portofolio Asesmen Kompetensi", moduleRef: "Modul 9 (Kompilasi Bundel Portofolio BNSP)" },
    ]
  }
];

export const TOTAL_BNSP_UNITS = 30;
