export const INITIAL_TRIP_DATA = {
  id: "TRIP-2026-MY-088",
  sptNumber: "SPT/KOPKAR-TRV/X/2026/088",
  title: "4D3N Amazing Malaysia & Singapore Educational Tour",
  destination: "Kuala Lumpur - Genting - Singapore",
  routeSummary: "Jakarta (CGK) -> Kuala Lumpur (KLIA/KLCC/Putrajaya) -> Genting Highlands -> Johor Bahru -> Singapore (Merlion/Gardens by the Bay/Changi) -> Jakarta",
  type: "Internasional", // Internasional | Domestik | Umrah
  startDate: "2026-10-15",
  endDate: "2026-10-18",
  status: "ON-TRIP", // PRE-TRIP | ON-TRIP | POST-TRIP | COMPLETED
  importantNotes: "Wajib membawa paspor minimal berlaku 6 bulan. MDAC Malaysia wajib diisi H-3. Peserta lansia dan diet khusus telah dikoordinasikan dengan restoran halal.",
  
  // Organisasi & Petugas
  organization: {
    name: "KOPKARINDO TRAVEL INDONESIA",
    division: "Divisi Operasional Tur & Pelaporan Digital",
    address: "Kopkarindo Tower Lt. 4, Jl. Medan Merdeka Barat No. 21, Jakarta Pusat",
    phone: "+62 21 386 9000",
    email: "operations@kopkarindo-travel.co.id",
    website: "https://kopkarindo-travel.co.id"
  },
  
  staff: {
    leadTL: {
      name: "Ahmad Rasyid, S.Tr.Par, C.TL",
      noRegBnsp: "REG.PAR.038.001928-2024",
      phone: "+62 812-8901-2345",
      email: "ahmad.rasyid@kopkarindo-travel.co.id"
    },
    tourGuide: {
      name: "Ahmad Dahlan, S.S., C.TG",
      noRegBnsp: "REG.PAR.012.008412-2024",
      phone: "+62 813-9901-7788",
      email: "tourguide@kopkarindo-travel.co.id"
    },
    coTL: {
      name: "Siti Nurhaliza, A.Md.Par",
      phone: "+62 813-7712-4490",
      email: "siti.nurhaliza@kopkarindo-travel.co.id"
    },
    opsManager: {
      name: "Bambang Sudibyo, M.M.",
      nip: "KPK-OPS-042"
    },
    financeOfficer: {
      name: "Dewi Lestari, S.E., Ak.",
      nip: "KPK-FIN-019"
    }
  },

  // Logistik & Vendor
  logistics: {
    flights: [
      {
        id: "FLIGHT-01",
        flightNo: "GA-820",
        airline: "Garuda Indonesia",
        pnr: "PNR-GA820XQ",
        route: "CGK (Jakarta) -> KUL (Kuala Lumpur)",
        departureTime: "2026-10-15 08:30 WIB",
        arrivalTime: "2026-10-15 11:35 MYT",
        terminal: "Terminal 3 Bandara Soekarno Hatta",
        baggageAllowance: "30 Kg Check-in + 7 Kg Cabin"
      },
      {
        id: "FLIGHT-02",
        flightNo: "SQ-112",
        airline: "Singapore Airlines",
        pnr: "PNR-SQ112SIN",
        route: "SIN (Singapore Changi) -> CGK (Jakarta)",
        departureTime: "2026-10-18 19:20 SGT",
        arrivalTime: "2026-10-18 20:15 WIB",
        terminal: "Terminal 4 Changi Airport",
        baggageAllowance: "30 Kg Check-in + 7 Kg Cabin"
      }
    ],
    hotel: {
      name: "Dorsett Kuala Lumpur 5-Star & Grand Mercure Singapore",
      bookingId: "HTL-MY-99214",
      address: "172 Jalan Imbi, 55100 Kuala Lumpur, Malaysia",
      phone: "+60 3 2716 1000",
      checkInDate: "2026-10-15",
      checkOutDate: "2026-10-18",
      totalRooms: 12,
      roomType: "Deluxe Twin / King Sharing"
    },
    transportVendor: {
      company: "Mega Panorama Coach Malaysia Sdn. Bhd.",
      serviceOrderNo: "SO-MY-2026-109",
      pic: "Mr. Rajendran Pillai",
      contact: "+60 12-345 6789",
      vehicleType: "Executive VIP Tourist Coach (44-Seater)",
      plateNumber: "WXY 8892 B",
      driverName: "Pakcik Azman bin Mansor",
      driverPhone: "+60 17-889 2211",
      driverLicense: "GDL & PSV No. 840912-10-5541 (Valid s/d 2028)"
    }
  },

  // Checkpoints Presensi
  checkpoints: [
    { id: "departureCGK", label: "Keberangkatan Bandara CGK T3" },
    { id: "arrivalKUL", label: "Kedatangan Bandara KLIA-1 Sepang" },
    { id: "hotelCheckin", label: "Check-in Hotel Dorsett KL" },
    { id: "busTour", label: "Boarding Bus Wisata Genting" },
    { id: "returnCGK", label: "Kepulangan Bandara Changi T4" }
  ],

  // Manifes Wisatawan Lengkap
  passengers: [
    {
      id: "PAX-001",
      name: "Dr. Hendra Wijaya",
      gender: "L",
      docType: "Paspor",
      docNo: "X1298402",
      expiryDate: "2031-05-12",
      nationality: "Indonesia",
      dob: "1978-04-12",
      phone: "+62 811-2233-441",
      waPhone: "+62 811-2233-441",
      emergencyContactName: "Ibu Maya (Istri)",
      emergencyContactWa: "+62 811-2233-440",
      medicalHistory: "Hipertensi Terkontrol",
      allergy: "Udang & Kepiting (Seafood)",
      foodRestrictions: "Tidak makan seafood & kerang",
      requiredMedicines: "Amlodipine 5mg (Dibawa sendiri)",
      specialNotes: "Perlu kursi lorong depan",
      mdacStatus: "APPROVED",
      roomNo: "Room 1402 (Twin)",
      seatNo: "1A",
      attendance: { departureCGK: true, arrivalKUL: true, hotelCheckin: true, busTour: true, returnCGK: false }
    },
    {
      id: "PAX-002",
      name: "Ir. Anugrah Pratama",
      gender: "L",
      docType: "Paspor",
      docNo: "X1982734",
      expiryDate: "2029-11-20",
      nationality: "Indonesia",
      dob: "1982-08-19",
      phone: "+62 812-9876-543",
      waPhone: "+62 812-9876-543",
      emergencyContactName: "Rina (Adik)",
      emergencyContactWa: "+62 812-9876-000",
      medicalHistory: "Asma Ringan bila cuaca dingin",
      allergy: "Debu Tebal",
      foodRestrictions: "Tidak Ada",
      requiredMedicines: "Ventolin Inhaler",
      specialNotes: "Kamar bebas asap rokok",
      mdacStatus: "APPROVED",
      roomNo: "Room 1402 (Twin)",
      seatNo: "1B",
      attendance: { departureCGK: true, arrivalKUL: true, hotelCheckin: true, busTour: true, returnCGK: false }
    },
    {
      id: "PAX-003",
      name: "Prof. Hj. Ratna Kusuma",
      gender: "P",
      docType: "Paspor",
      docNo: "X8839201",
      expiryDate: "2032-02-14",
      nationality: "Indonesia",
      dob: "1969-01-30",
      phone: "+62 813-1122-334",
      waPhone: "+62 813-1122-334",
      emergencyContactName: "Farhan (Anak)",
      emergencyContactWa: "+62 813-1122-999",
      medicalHistory: "Mudah pusing / vertigo jika terlalu terik",
      allergy: "Kacang Tanah (Peanut Allergy)",
      foodRestrictions: "Bebas kacang tanah (Nut-Free)",
      requiredMedicines: "Betahistine 6mg",
      specialNotes: "Perlu pendampingan saat menaiki tangga",
      mdacStatus: "APPROVED",
      roomNo: "Room 1404 (Twin)",
      seatNo: "2A",
      attendance: { departureCGK: true, arrivalKUL: true, hotelCheckin: true, busTour: true, returnCGK: false }
    },
    {
      id: "PAX-004",
      name: "Dra. Siti Aminah",
      gender: "P",
      docType: "Paspor",
      docNo: "X5544332",
      expiryDate: "2030-07-09",
      nationality: "Indonesia",
      dob: "1973-10-15",
      phone: "+62 815-4433-221",
      waPhone: "+62 815-4433-221",
      emergencyContactName: "Pak Budi (Suami)",
      emergencyContactWa: "+62 815-4433-000",
      medicalHistory: "Maag / Asam Lambung (GERD)",
      allergy: "Gluten & Makanan Pedas",
      foodRestrictions: "Gluten Free & Tidak Pedas",
      requiredMedicines: "Omeprazole 20mg",
      specialNotes: "Jadwal makan tepat waktu",
      mdacStatus: "APPROVED",
      roomNo: "Room 1404 (Twin)",
      seatNo: "2B",
      attendance: { departureCGK: true, arrivalKUL: true, hotelCheckin: true, busTour: true, returnCGK: false }
    },
    {
      id: "PAX-005",
      name: "Kevin Sanjaya, S.Kom",
      gender: "L",
      docType: "Paspor",
      docNo: "X9081234",
      expiryDate: "2028-09-01",
      nationality: "Indonesia",
      dob: "1994-06-22",
      phone: "+62 817-8899-001",
      waPhone: "+62 817-8899-001",
      emergencyContactName: "Lina (Ibu)",
      emergencyContactWa: "+62 817-8899-999",
      medicalHistory: "Tidak Ada",
      allergy: "Tidak Ada",
      foodRestrictions: "Halal Food Only",
      requiredMedicines: "Vitamin C",
      specialNotes: "Single Room",
      mdacStatus: "APPROVED",
      roomNo: "Room 1406 (Single)",
      seatNo: "3A",
      attendance: { departureCGK: true, arrivalKUL: true, hotelCheckin: true, busTour: true, returnCGK: false }
    },
    {
      id: "PAX-006",
      name: "Stephanie Aurelia, B.A.",
      gender: "P",
      docType: "Paspor",
      docNo: "X3322119",
      expiryDate: "2031-12-05",
      nationality: "Indonesia",
      dob: "1996-03-14",
      phone: "+62 818-7766-554",
      waPhone: "+62 818-7766-554",
      emergencyContactName: "David (Kakak)",
      emergencyContactWa: "+62 818-7766-000",
      medicalHistory: "Lactose Intolerant",
      allergy: "Susu Sapi Murni & Keju Berlebih",
      foodRestrictions: "Non-Dairy / Soy Milk",
      requiredMedicines: "Antasida",
      specialNotes: "Kamar dekat lift",
      mdacStatus: "APPROVED",
      roomNo: "Room 1408 (Twin)",
      seatNo: "3B",
      attendance: { departureCGK: true, arrivalKUL: true, hotelCheckin: true, busTour: true, returnCGK: false }
    }
  ],

  // Form K3: Ramp Check Bus (FM-K3-KOPKAR-01)
  rampCheck: {
    formNumber: "FM-K3-KOPKAR-01/2026/088",
    inspectionDate: "2026-10-15 12:30 MYT",
    location: "Kuala Lumpur International Airport (KLIA-1) Tourist Coach Bay",
    vehiclePlate: "WXY 8892 B",
    driverName: "Pakcik Azman bin Mansor",
    odometerKm: "78,420 Km",
    items: [
      { id: "rc-1", name: "Sistem Pengereman (Service & Parking Brake)", status: "LAIK", notes: "Responsif, tekanan angin normal 8.5 bar" },
      { id: "rc-2", name: "Kondisi Ban (Kedalaman Alur > 2.5mm & Tekanan)", status: "LAIK", notes: "Semua 6 ban prima, ban serep terpasang rapi" },
      { id: "rc-3", name: "Sabuk Keselamatan (Seat Belt) Setiap Kursi", status: "LAIK", notes: "44 unit sabuk 3-titik berfungsi normal" },
      { id: "rc-4", name: "Alat Pemadam Api Ringan (APAR Dry Powder 3kg)", status: "LAIK", notes: "Tekanan di zona hijau, segel utuh, exp 2027" },
      { id: "rc-5", name: "Kotak P3K Standar Pariwisata", status: "LAIK", notes: "Tersegel dan berada di dekat pintu masuk depan" },
      { id: "rc-6", name: "Pintu & Jendela Darurat + Palu Pemecah Kaca", status: "LAIK", notes: "4 unit palu lengkap di samping pilar kaca" },
      { id: "rc-7", name: "Lampu Penerangan, Sein, Hazard, & Klakson", status: "LAIK", notes: "Semua indikator kelistrikan berfungsi baik" },
      { id: "rc-8", name: "Kelayakan Dokumen Kendaraan (STNK/KPS/Asuransi)", status: "LAIK", notes: "Izin operasi JPJ Malaysia & Asuransi PUSPAKOM aktif" },
      { id: "rc-9", name: "Kondisi Fisik & Kesehatan Pengemudi (Fit to Drive)", status: "LAIK", notes: "Tekanan darah 120/80, istirahat cukup, bebas alkohol" }
    ],
    overallConclusion: "ARMADA DINYATAKAN SANGAT LAIK OPERASI (GRADE A+)",
    driverSigned: true,
    tlSigned: true
  },

  // Form K3: Checklist P3K Lapangan (FM-K3-KOPKAR-03)
  p3kKit: {
    formNumber: "FM-K3-KOPKAR-03/2026/088",
    auditDate: "2026-10-15 07:00 WIB",
    inspectorName: "Ahmad Rasyid (Lead TL)",
    items: [
      { id: "p-1", name: "Paracetamol 500mg (Pereda Nyeri & Demam)", qty: "4 Strip (40 Kaplet)", expiry: "2027-12", condition: "Baik" },
      { id: "p-2", name: "Antasida Doen (Obat Sakit Maag/Lambung)", qty: "3 Strip (30 Tablet)", expiry: "2028-03", condition: "Baik" },
      { id: "p-3", name: "Dimenhydrinate (Antimo - Mabuk Perjalanan)", qty: "5 Strip (50 Tablet)", expiry: "2027-09", condition: "Baik" },
      { id: "p-4", name: "Oralit Sachet (Rehidrasi Diare/Dehidrasi)", qty: "10 Sachet", expiry: "2028-05", condition: "Baik" },
      { id: "p-5", name: "Loperamide 2mg (Anti Diare Akut)", qty: "2 Strip (20 Tablet)", expiry: "2027-11", condition: "Baik" },
      { id: "p-6", name: "Cetirizine 10mg (Anti Histamin / Alergi)", qty: "3 Strip (30 Tablet)", expiry: "2028-01", condition: "Baik" },
      { id: "p-7", name: "Povidone Iodine 10% (Betadine Cair 30ml)", qty: "2 Botol", expiry: "2028-08", condition: "Baik" },
      { id: "p-8", name: "Kassa Steril 16x16cm", qty: "10 Lembar", expiry: "2029-06", condition: "Steril" },
      { id: "p-9", name: "Plester Cepat (Hansaplast)", qty: "1 Kotak (25 Pcs)", expiry: "2028-10", condition: "Baik" },
      { id: "p-10", name: "Perban Gulung Elastis (Elastic Bandage 3\")", qty: "3 Roll", expiry: "2029-12", condition: "Baik" },
      { id: "p-11", name: "Minyak Kayu Putih / Tolak Angin Roll-on", qty: "4 Botol", expiry: "2028-04", condition: "Baik" },
      { id: "p-12", name: "Gunting Medis Stainless Steel", qty: "1 Pcs", expiry: "Permanent", condition: "Tajam/Bersih" },
      { id: "p-13", name: "Pinset Stainless & Termometer Digital", qty: "1 Set", expiry: "Permanent", condition: "Baterai Normal" },
      { id: "p-14", name: "Alkohol Swab 70%", qty: "20 Pcs", expiry: "2027-08", condition: "Lembab" },
      { id: "p-15", name: "Sarung Tangan Medis Lateks Steril", qty: "4 Pasang", expiry: "2028-06", condition: "Utuh" }
    ],
    status: "LENGKAP DAN SIAP TANGGAP DARURAT 100%"
  },

  // Modul On-Trip: Daily Journal & Safety Briefing
  dailyLogs: [
    {
      id: "LOG-01",
      day: "Hari 1 (15 Okt 2026)",
      time: "06:30 WIB",
      location: "Terminal 3 Bandara Soekarno Hatta - Jakarta",
      gps: "-6.1256, 106.6559",
      activity: "Penyambutan tamu di Meeting Point Gate 3. Pembagian luggage tag, boarding pass, dan pengisian MDAC digital pass.",
      safetyBriefing: {
        conducted: true,
        topic: "Aturan keamanan bandara, penanganan bagasi, cairan >100ml, dan nomor darurat TL.",
        assemblyPoint: "Pilar 18 Keberangkatan Internasional T3",
        headcountTotal: 6,
        headcountPresent: 6
      },
      notes: "Seluruh 6 peserta hadir tepat waktu. Boarding lancar pukul 08:00 WIB."
    },
    {
      id: "LOG-02",
      day: "Hari 1 (15 Okt 2026)",
      time: "12:15 MYT",
      location: "KLIA-1 Arrival Hall & Tourist Coach Bay - Sepang",
      gps: "2.7456, 101.7072",
      activity: "Penyambutan di KLIA-1, proses imigrasi cepat jalur autogate/MDAC, pengambilan bagasi, dan Ramp Check bus wisata bersama driver.",
      safetyBriefing: {
        conducted: true,
        topic: "Briefing keselamatan bus: sabuk pengaman wajib dipasang, lokasi APAR dan palu darurat bus.",
        assemblyPoint: "Coach Bay Platform B-4",
        headcountTotal: 6,
        headcountPresent: 6
      },
      notes: "Bus bersih dan AC dingin. Driver Pakcik Azman sangat ramah dan kooperatif."
    },
    {
      id: "LOG-03",
      day: "Hari 1 (15 Okt 2026)",
      time: "15:45 MYT",
      location: "Petronas Twin Towers & Suria KLCC - Kuala Lumpur",
      gps: "3.1579, 101.7116",
      activity: "Kunjungan edukasi arsitektur dan photo stop di KLCC Park. Penjelasan sejarah pembangunan Menara Kembar oleh Tour Guide.",
      safetyBriefing: {
        conducted: true,
        topic: "Zona kumpul di KLCC Fountain, waspada barang bawaan pribadi, meeting time 17:30.",
        assemblyPoint: "Air Mancur Simfoni Depan Suria KLCC",
        headcountTotal: 6,
        headcountPresent: 6
      },
      notes: "Cuaca cerah. Semua peserta sangat antusias berdiskusi sejarah Menara Kembar."
    }
  ],

  // Form K3: Laporan Insiden & Keluhan (FM-K3-KOPKAR-04)
  incidents: [
    {
      id: "INC-001",
      formNumber: "FM-K3-KOPKAR-04/2026/001",
      date: "2026-10-15",
      time: "16:20 MYT",
      location: "Suria KLCC Concourse Level",
      category: "Kesehatan Ringan (Medical)",
      passengerName: "Prof. Hj. Ratna Kusuma (PAX-003)",
      description: "Peserta mengeluh pusing dan kelelahan setelah perjalanan penerbangan pagi dan adaptasi cuaca terik di KLCC Park.",
      actionTaken: "1. TL mengantar peserta duduk di area sejuk ber-AC.\n2. Pemeriksaan tensi (130/85 mmHg).\n3. Pemberian air teh hangat manis dan paracetamol 500mg dari kotak P3K resmi.\n4. Istirahat 25 menit hingga pulih total.",
      status: "RESOLVED (SELESAI)",
      severity: "LOW",
      officerSign: true
    }
  ],

  // Modul Post-Trip: Keuangan & Settlement Kas (Finance)
  finance: {
    cashAdvance: 18500000, // Rp 18.500.000 (Diberikan Koperasi)
    currency: "IDR",
    disbursementVoucherNo: "KV/KOPKAR-FIN/X/2026/410",
    disbursementDate: "2026-10-14",
    cashAdvanceProofDoc: "Voucher Kasbon Resmi No. KV-410 (Disetujui Ka. Koperasi)",
    cashAdvanceProofUrl: "https://drive.google.com/file/d/sample_kasbon_voucher.pdf",
    expenses: [
      { id: "EXP-01", date: "2026-10-15", category: "Airport Handling & Porter", description: "Tip Porter & Handling Bandara CGK T3", amount: 450000, receiptProof: "Nota Resmi No. T3-0918" },
      { id: "EXP-02", date: "2026-10-15", category: "Tol & Parkir", description: "Tol Express KLIA - Putrajaya - KLCC & Parkir Bus", amount: 620000, receiptProof: "Touch 'n Go Statement MYR 180" },
      { id: "EXP-03", date: "2026-10-15", category: "Meals / F&B Tambahan", description: "Makan Malam Selamat Datang Restoran Nelayan KL", amount: 3850000, receiptProof: "Bill Resmi Nelayan #8821" },
      { id: "EXP-04", date: "2026-10-16", category: "Tiket Atraksi / Objek", description: "Tiket Awana SkyWay Glass Floor Gondola Genting", amount: 2450000, receiptProof: "E-Ticket Resorts World QR-902" },
      { id: "EXP-05", date: "2026-10-16", category: "Air Mineral & Logistik K3", description: "Air Mineral Botol 600ml 4 Dus untuk Armada Bus", amount: 480000, receiptProof: "Struk 99 Speedmart #MY-9182" },
      { id: "EXP-06", date: "2026-10-17", category: "Driver & Local Guide Tip", description: "Tip Resmi Pengemudi Bus (Pakcik Azman) 4 Hari", amount: 1800000, receiptProof: "Tanda Terima Kuitansi Bermaterai" }
    ],
    verifiedByFinance: true,
    financeNotes: "Seluruh bukti nota dan kuitansi fisik/digital telah diverifikasi sesuai pagu anggaran SOP Kopkarindo."
  },

  // Modul Post-Trip: Evaluasi CSAT Feedback Wisatawan
  csat: {
    totalRespondents: 6,
    googleFormUrl: "https://forms.gle/sampleKopkarindoFeedbackTour2026",
    indicators: [
      { id: "cs-1", title: "Kesiapan & Keramahan Tour Leader & Tour Guide", score: 4.92, maxScore: 5 },
      { id: "cs-2", title: "Ketepatan Waktu & Manajemen Jadwal (Punctuality)", score: 4.80, maxScore: 5 },
      { id: "cs-3", title: "Kelaikan & Kenyamanan Armada Bus Wisata", score: 4.88, maxScore: 5 },
      { id: "cs-4", title: "Kualitas Hotel & Akomodasi Bintang 5", score: 4.85, maxScore: 5 },
      { id: "cs-5", title: "Kualitas Restoran & Penjagaan Alergi / Pantangan Makanan", score: 4.90, maxScore: 5 },
      { id: "cs-6", title: "Kesiapsiagaan K3, Pertolongan P3K & Rasa Aman", score: 5.00, maxScore: 5 }
    ],
    overallSatisfactionPercent: 97.8,
    guestComments: [
      { id: "cm-1", name: "Dr. Hendra Wijaya", rating: 5, comment: "Luar biasa! Alergi udang saya benar-benar diperhatikan di setiap restoran. Tour Leader & Guide sangat sigap." },
      { id: "cm-2", name: "Prof. Hj. Ratna Kusuma", rating: 5, comment: "Saat saya pusing di KLCC, penanganan medis cepat sekali. Kotak obatnya sangat lengkap." },
      { id: "cm-3", name: "Kevin Sanjaya", rating: 5, comment: "Perjalanan edukatif yang sangat rapi dan tertib. Sangat direkomendasikan!" }
    ]
  },

  // Tanda Tangan Digital Tersimpan
  signatures: {
    leadTL: "DATA_SIGN_TL_VALID_2026",
    driver: "DATA_SIGN_DRIVER_AZMAN",
    tourGuide: "DATA_SIGN_TG_DAHLAN",
    opsManager: "DATA_SIGN_OPS_BAMBANG",
    financeOfficer: "DATA_SIGN_FIN_DEWI"
  }
};
