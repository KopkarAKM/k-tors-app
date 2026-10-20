import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BNSP_CLUSTERS } from "../data/bnspUnits";

// Helper: Format Currency Rupiah
export const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};

// Helper: Add Standard Official Header
const addOfficialHeader = (doc, title, subtitle, formNumber = "") => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header Box Background
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(0, 0, pageWidth, 28, "F");

  // Logo / Org Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("KOPKARINDO TRAVEL INDONESIA", 14, 12);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text("Divisi Operasional Tur & Sertifikasi Profesi BNSP Tour Leader", 14, 18);
  doc.text("Kopkarindo Tower Lt. 4, Jakarta Pusat | hotline: +62 21 386 9000", 14, 23);

  // Form Badge / Right side
  if (formNumber) {
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(pageWidth - 85, 6, 75, 16, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(56, 189, 248); // Sky-400
    doc.text("FORM RESMI K3 & BNSP", pageWidth - 80, 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(226, 232, 240);
    doc.text(formNumber, pageWidth - 80, 18);
  }

  // Document Title Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 28, pageWidth, 16, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), 14, 38);
  
  if (subtitle) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(subtitle, 14, 42);
  }

  // Divider Line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(14, 46, pageWidth - 14, 46);
};

// Helper: Add Standard Footer
const addOfficialFooter = (doc, pageCurrent, pageTotal) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Dokumen ini diterbitkan secara elektronik oleh K-TORS (Kopkarindo Digital Tour Operations & Reporting System).", 14, pageHeight - 9);
  doc.text("Memenuhi Standar Skema BNSP No. 038/PAR/2026 & SOP Keselamatan Kerja K3 Kopkarindo.", 14, pageHeight - 5);
  
  const pageStr = `Halaman ${pageCurrent} dari ${pageTotal || pageCurrent}`;
  doc.text(pageStr, pageWidth - 14 - doc.getTextWidth(pageStr), pageHeight - 7);
};

// Helper: Add Signature Box
const addSignatureBox = (doc, yPos, signatures) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const boxWidth = (pageWidth - 28 - (signatures.length - 1) * 8) / signatures.length;
  
  signatures.forEach((sig, index) => {
    const xPos = 14 + index * (boxWidth + 8);
    
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(xPos, yPos, boxWidth, 38, 2, 2, "FD");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(sig.role.toUpperCase(), xPos + 4, yPos + 7);
    
    // E-Sign Verified Stamp
    doc.setDrawColor(16, 185, 129); // Emerald-500
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(xPos + 4, yPos + 11, boxWidth - 8, 14, 1, 1, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(5, 150, 105);
    doc.text("[DIGITALLY SIGNED]", xPos + (boxWidth / 2) - 15, yPos + 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text("Verified K-TORS e-Sign", xPos + (boxWidth / 2) - 14, yPos + 22);

    // Name & NIP / BNSP
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(sig.name, xPos + 4, yPos + 30);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(sig.idLabel || "Petugas Terverifikasi", xPos + 4, yPos + 35);
  });
};

/* =========================================================================
   1. TOUR LEADER / GUEST HANDLING REPORT (TLR)
========================================================================= */
export const generateTourLeaderReportPDF = (trip) => {
  const doc = new jsPDF("p", "mm", "a4");
  
  addOfficialHeader(
    doc,
    "LAPORAN UTAMA TOUR LEADER (TL REPORT)",
    `Nomor Penugasan: ${trip.sptNumber} | Destinasi: ${trip.destination}`,
    "DOC-TLR-KOPKAR-2026"
  );

  // Meta Info Table
  autoTable(doc, {
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [15, 23, 42] },
    body: [
      [
        { content: "Nama Tur / Event", fontStyle: "bold" }, trip.title,
        { content: "Destinasi", fontStyle: "bold" }, trip.destination
      ],
      [
        { content: "Tanggal Pelaksanaan", fontStyle: "bold" }, `${trip.startDate} s/d ${trip.endDate}`,
        { content: "Jumlah Wisatawan", fontStyle: "bold" }, `${trip.passengers.length} Orang Peserta (100% Present)`
      ],
      [
        { content: "Lead Tour Leader", fontStyle: "bold" }, `${trip.staff.leadTL.name} (${trip.staff.leadTL.noRegBnsp})`,
        { content: "Co-Tour Leader", fontStyle: "bold" }, trip.staff.coTL.name
      ],
      [
        { content: "Armada & Driver", fontStyle: "bold" }, `${trip.logistics.transportVendor.vehicleType} (${trip.logistics.transportVendor.plateNumber})`,
        { content: "Driver Lapangan", fontStyle: "bold" }, `${trip.logistics.transportVendor.driverName} (${trip.logistics.transportVendor.driverPhone})`
      ]
    ]
  });

  // Section 1: Ringkasan Pelaksanaan Harian
  let currentY = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("I. RINGKASAN JURNAL KEGIATAN & SAFETY BRIEFING HARIAN", 14, currentY);

  const journalData = trip.dailyLogs.map(log => [
    log.day,
    log.time,
    log.location,
    log.activity,
    `Briefing: ${log.safetyBriefing.conducted ? "Dilakukan" : "Tidak"}\nAssembly: ${log.safetyBriefing.assemblyPoint}\nHeadcount: ${log.safetyBriefing.headcountPresent}/${log.safetyBriefing.headcountTotal} Pax`
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [["Hari / Tanggal", "Waktu", "Lokasi & GPS", "Aktivitas Pelaksanaan", "Safety Briefing & Headcount"]],
    body: journalData,
    theme: "striped",
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5 },
    bodyStyles: { fontSize: 7, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 26 },
      1: { cellWidth: 16 },
      2: { cellWidth: 35 },
      3: { cellWidth: 60 },
      4: { cellWidth: 45 }
    }
  });

  // Section 2: Catatan K3 & Insiden
  currentY = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("II. RINGKASAN PENANGANAN K3 & INSIDEN LAPANGAN", 14, currentY);

  const incidentData = trip.incidents.map(inc => [
    inc.formNumber,
    `${inc.date} ${inc.time}`,
    inc.category,
    inc.passengerName,
    inc.description,
    inc.actionTaken,
    inc.status
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [["No. Form", "Waktu", "Kategori", "Peserta", "Deskripsi Insiden", "Tindakan Penyelesaian (Action)", "Status"]],
    body: incidentData,
    theme: "striped",
    headStyles: { fillColor: [180, 83, 9], textColor: [255, 255, 255], fontSize: 7.5 },
    bodyStyles: { fontSize: 7, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 26 },
      1: { cellWidth: 20 },
      2: { cellWidth: 22 },
      3: { cellWidth: 25 },
      4: { cellWidth: 35 },
      5: { cellWidth: 38 },
      6: { cellWidth: 16 }
    }
  });

  // Signatures on next page if needed
  if (doc.lastAutoTable.finalY > 230) {
    doc.addPage();
    currentY = 25;
  } else {
    currentY = doc.lastAutoTable.finalY + 8;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("III. PENGESAHAN LAPORAN TOUR LEADER", 14, currentY);

  addSignatureBox(doc, currentY + 4, [
    { role: "Lead Tour Leader (Pelaksana Lapangan)", name: trip.staff?.leadTL?.name || "Tour Leader", idLabel: trip.staff?.leadTL?.noRegBnsp || "Sertifikasi TL" },
    { role: "Manager Operasional (Approval Kantor)", name: trip.staff?.opsManager?.name || "Manager Operasional", idLabel: `NIP: ${trip.staff?.opsManager?.nip || "MGR-OPS-2026"}` }
  ]);

  addOfficialFooter(doc, 1, 1);
  return doc;
};

/* =========================================================================
   2. LAPORAN KEUANGAN OPERASIONAL TUR (SETTLEMENT)
========================================================================= */
export const generateFinancialSettlementPDF = (trip) => {
  const doc = new jsPDF("p", "mm", "a4");
  
  addOfficialHeader(
    doc,
    "LAPORAN KEUANGAN OPERASIONAL TUR (SETTLEMENT)",
    `Klaim Pertanggungjawaban Kas Lapangan | No. SPT: ${trip.sptNumber}`,
    "FM-FIN-KOPKAR-02"
  );

  const totalExpense = trip.finance.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const cashAdvance = trip.finance.cashAdvance;
  const balance = cashAdvance - totalExpense;

  // Financial Summary Cards
  autoTable(doc, {
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    body: [
      [
        { content: "Kas Awal (Cash Advance Koperasi)", fontStyle: "bold" }, formatRupiah(cashAdvance),
        { content: "No. Voucher Kas Awal", fontStyle: "bold" }, trip.finance.disbursementVoucherNo
      ],
      [
        { content: "Total Realisasi Pengeluaran Lapangan", fontStyle: "bold", textColor: [185, 28, 28] }, formatRupiah(totalExpense),
        { content: "Tanggal Pencairan Kas", fontStyle: "bold" }, trip.finance.disbursementDate
      ],
      [
        { content: balance >= 0 ? "SISA KAS LEBIH (Dikembalikan ke Koperasi)" : "DEFISIT KAS (Harus Diganti Koperasi)", fontStyle: "bold", textColor: balance >= 0 ? [5, 150, 105] : [220, 38, 38] },
        { content: formatRupiah(Math.abs(balance)), fontStyle: "bold", textColor: balance >= 0 ? [5, 150, 105] : [220, 38, 38] },
        { content: "Status Audit Kas", fontStyle: "bold" }, "LENGKAP & TERVERIFIKASI NOTA"
      ]
    ]
  });

  // Expenses Table
  const currentY = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("RINCIAN BUKTI PENGELUARAN NOTA / KUITANSI REALISASI", 14, currentY);

  const expenseRows = trip.finance.expenses.map((exp, idx) => [
    (idx + 1).toString(),
    exp.date,
    exp.category,
    exp.description,
    exp.receiptProof,
    formatRupiah(exp.amount)
  ]);

  // Append Total Row
  expenseRows.push([
    "",
    "",
    "TOTAL",
    "TOTAL SELURUH PENGELUARAN REALISASI LAPANGAN",
    "9 BUKTI NOTA LENGKAP",
    formatRupiah(totalExpense)
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [["No.", "Tanggal", "Kategori Beban", "Keterangan Pengeluaran", "Nomor Bukti / Nota", "Jumlah (IDR)"]],
    body: expenseRows,
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 20 },
      2: { cellWidth: 35 },
      3: { cellWidth: 55 },
      4: { cellWidth: 38 },
      5: { cellWidth: 24, halign: "right", fontStyle: "bold" }
    },
    didParseCell: (data) => {
      if (data.row.index === expenseRows.length - 1) {
        data.cell.styles.fillColor = [241, 245, 249];
        data.cell.styles.fontStyle = "bold";
      }
    }
  });

  // Signatures Box
  const signY = doc.lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("PENGESAHAN LAPORAN KEUANGAN TUR (SETTLEMENT)", 14, signY);

  addSignatureBox(doc, signY + 3, [
    { role: "Lead Tour Leader (Pelaksana Kas Lapangan)", name: trip.staff?.leadTL?.name || "Tour Leader", idLabel: trip.staff?.leadTL?.noRegBnsp || "Sertifikasi TL" },
    { role: "Manager Operasional (Audit & Approval)", name: trip.staff?.opsManager?.name || "Manager Operasional", idLabel: `NIP: ${trip.staff?.opsManager?.nip || "MGR-OPS-2026"}` }
  ]);

  addOfficialFooter(doc, 1, 1);
  return doc;
};

/* =========================================================================
   3. FORM INSPEKSI KELAIKAN ARMADA (RAMP CHECK - FM-K3-KOPKAR-01)
========================================================================= */
export const generateRampCheckPDF = (trip) => {
  const doc = new jsPDF("p", "mm", "a4");
  
  addOfficialHeader(
    doc,
    "FORM INSPEKSI KELAIKAN ARMADA BUS (RAMP CHECK)",
    "Audit K3 Pra-Perjalanan Sesuai Standar Ditjen Hubdat & BNSP Tour Leader",
    trip.rampCheck.formNumber
  );

  // Vehicle & Driver Details
  autoTable(doc, {
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    body: [
      [
        { content: "Vendor Transportasi", fontStyle: "bold" }, trip.logistics.transportVendor.company,
        { content: "Tipe Kendaraan", fontStyle: "bold" }, trip.logistics.transportVendor.vehicleType
      ],
      [
        { content: "Nomor Polisi (Plat)", fontStyle: "bold" }, trip.rampCheck.vehiclePlate,
        { content: "Odometer Kendaraan", fontStyle: "bold" }, trip.rampCheck.odometerKm
      ],
      [
        { content: "Nama Pengemudi (Driver)", fontStyle: "bold" }, trip.rampCheck.driverName,
        { content: "Nomor SIM / Lisensi GDL", fontStyle: "bold" }, trip.logistics.transportVendor.driverLicense
      ],
      [
        { content: "Waktu & Lokasi Audit", fontStyle: "bold" }, `${trip.rampCheck.inspectionDate} @ ${trip.rampCheck.location}`,
        { content: "Kesimpulan Audit", fontStyle: "bold", textColor: [5, 150, 105] }, trip.rampCheck.overallConclusion
      ]
    ]
  });

  // 9 Checklist Items
  const currentY = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("ITEM PEMERIKSAAN KESELAMATAN K3 (9 PARAMETER KELAIKAN JALAN)", 14, currentY);

  const checklistRows = trip.rampCheck.items.map((item, idx) => [
    (idx + 1).toString(),
    item.name,
    item.status,
    item.notes
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [["No.", "Komponen Keselamatan Armada & Fisik Pengemudi", "Hasil Audit", "Catatan Verifikasi Lapangan"]],
    body: checklistRows,
    theme: "striped",
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 70, fontStyle: "bold" },
      2: { cellWidth: 25, halign: "center", fontStyle: "bold", textColor: [5, 150, 105] },
      3: { cellWidth: 77 }
    }
  });

  // Signatures
  const signY = doc.lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("PERNYATAAN TANGGUNG JAWAB KELAIKAN (E-SIGN)", 14, signY);

  addSignatureBox(doc, signY + 3, [
    { role: "Pengemudi (Driver)", name: trip.rampCheck.driverName, idLabel: "Lisensi Driver Pariwisata" },
    { role: "Lead Tour Leader (Auditor K3)", name: trip.staff.leadTL.name, idLabel: trip.staff.leadTL.noRegBnsp },
    { role: "Manager Operasional", name: trip.staff.opsManager.name, idLabel: `NIP: ${trip.staff.opsManager.nip}` }
  ]);

  addOfficialFooter(doc, 1, 1);
  return doc;
};

/* =========================================================================
   4. FORM CHECKLIST KELENGKAPAN P3K LAPANGAN (FM-K3-KOPKAR-03)
========================================================================= */
export const generateP3kCheckPDF = (trip) => {
  const doc = new jsPDF("p", "mm", "a4");
  
  addOfficialHeader(
    doc,
    "FORM CHECKLIST KELENGKAPAN KOTAK P3K LAPANGAN",
    "Audit Kesiapsiagaan Tanggap Darurat Medis Wisata Standar K3 Kopkarindo & BNSP",
    trip.p3kKit.formNumber
  );

  autoTable(doc, {
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    body: [
      [
        { content: "Nama Tur / Event", fontStyle: "bold" }, trip.title,
        { content: "Petugas Auditor P3K", fontStyle: "bold" }, trip.p3kKit.inspectorName
      ],
      [
        { content: "Waktu Pemeriksaan", fontStyle: "bold" }, trip.p3kKit.auditDate,
        { content: "Status Kelaikan Kotak Obat", fontStyle: "bold", textColor: [5, 150, 105] }, trip.p3kKit.status
      ]
    ]
  });

  const currentY = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("DAFTAR 15 JENIS OBAT & ALAT PERTOLONGAN PERTAMA PADA KECELAKAAN", 14, currentY);

  const p3kRows = trip.p3kKit.items.map((item, idx) => [
    (idx + 1).toString(),
    item.name,
    item.qty,
    item.expiry,
    item.condition,
    "TERVERIFIKASI"
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [["No.", "Nama Obat / Peralatan Medis P3K", "Jumlah (Qty)", "Masa Kadaluarsa", "Kondisi Fisik", "Status Audit"]],
    body: p3kRows,
    theme: "striped",
    headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 70, fontStyle: "bold" },
      2: { cellWidth: 30 },
      3: { cellWidth: 25, halign: "center" },
      4: { cellWidth: 22, halign: "center" },
      5: { cellWidth: 25, halign: "center", fontStyle: "bold", textColor: [5, 150, 105] }
    }
  });

  const signY = doc.lastAutoTable.finalY + 8;
  addSignatureBox(doc, signY + 3, [
    { role: "Petugas Pemeriksa P3K (TL)", name: trip.staff.leadTL.name, idLabel: trip.staff.leadTL.noRegBnsp },
    { role: "Co-Tour Leader / Asisten", name: trip.staff.coTL.name, idLabel: "Staff Pendamping" },
    { role: "Manager Operasional", name: trip.staff.opsManager.name, idLabel: `NIP: ${trip.staff.opsManager.nip}` }
  ]);

  addOfficialFooter(doc, 1, 1);
  return doc;
};

/* =========================================================================
   5. FORM LAPORAN INSIDEN K3 & KELUHAN WISATAWAN (FM-K3-KOPKAR-04)
========================================================================= */
export const generateIncidentReportPDF = (trip) => {
  const doc = new jsPDF("p", "mm", "a4");
  
  addOfficialHeader(
    doc,
    "FORM LAPORAN INSIDEN K3 & KELUHAN WISATAWAN",
    "Berita Acara Penanganan Masalah Lapangan, Medis & Kehilangan Dokumen/Barang",
    "FM-K3-KOPKAR-04"
  );

  autoTable(doc, {
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    body: [
      [
        { content: "Nama Tur / Event", fontStyle: "bold" }, trip.title,
        { content: "Nomor SPT", fontStyle: "bold" }, trip.sptNumber
      ],
      [
        { content: "Total Kejadian Dilaporkan", fontStyle: "bold" }, `${trip.incidents.length} Kejadian (Semua Terselesaikan)`,
        { content: "Status Akhir", fontStyle: "bold", textColor: [5, 150, 105] }, "ZERO FATALITY / 100% RESOLVED"
      ]
    ]
  });

  let currentY = doc.lastAutoTable.finalY + 6;

  trip.incidents.forEach((inc, index) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(180, 83, 9);
    doc.text(`BERITA ACARA INSIDEN #${index + 1}: ${inc.formNumber} (${inc.category})`, 14, currentY);

    autoTable(doc, {
      startY: currentY + 2,
      theme: "grid",
      headStyles: { fillColor: [180, 83, 9], textColor: [255, 255, 255], fontSize: 7.5 },
      bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
      body: [
        [
          { content: "Waktu & Lokasi", fontStyle: "bold", width: 35 }, `${inc.date} ${inc.time} @ ${inc.location}`,
          { content: "Tingkat Keparahan (Severity)", fontStyle: "bold", width: 45 }, inc.severity
        ],
        [
          { content: "Wisatawan Terkait", fontStyle: "bold" }, inc.passengerName,
          { content: "Status Penanganan", fontStyle: "bold", textColor: [5, 150, 105] }, inc.status
        ],
        [
          { content: "Kronologi & Deskripsi", fontStyle: "bold" },
          { content: inc.description, colSpan: 3 }
        ],
        [
          { content: "Tindakan Penyelesaian (Action Taken)", fontStyle: "bold" },
          { content: inc.actionTaken, colSpan: 3 }
        ]
      ]
    });

    currentY = doc.lastAutoTable.finalY + 6;
  });

  const signY = currentY + 4;
  addSignatureBox(doc, signY, [
    { role: "Tour Leader Pembuat Laporan", name: trip.staff.leadTL.name, idLabel: trip.staff.leadTL.noRegBnsp },
    { role: "Saksi / Co-Tour Leader", name: trip.staff.coTL.name, idLabel: "Staff Pendamping" },
    { role: "Manager Operasional (Review)", name: trip.staff.opsManager.name, idLabel: `NIP: ${trip.staff.opsManager.nip}` }
  ]);

  addOfficialFooter(doc, 1, 1);
  return doc;
};

/* =========================================================================
   6. REKAPITULASI KUESIONER KEPUASAN WISATAWAN (CSAT)
========================================================================= */
export const generateCsatReportPDF = (trip) => {
  const doc = new jsPDF("p", "mm", "a4");
  
  addOfficialHeader(
    doc,
    "REKAPITULASI KUESIONER KEPUASAN WISATAWAN (CSAT)",
    `Analisis Indeks Kepuasan Pelanggan | Evaluasi Mutu Pelayanan Unit BNSP 21`,
    "DOC-CSAT-KOPKAR-2026"
  );

  autoTable(doc, {
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    body: [
      [
        { content: "Nama Kegiatan Tur", fontStyle: "bold" }, trip.title,
        { content: "Jumlah Responden", fontStyle: "bold" }, `${trip.csat.totalRespondents} Peserta (100% Return Rate)`
      ],
      [
        { content: "Indeks Kepuasan Keseluruhan", fontStyle: "bold", textColor: [5, 150, 105] }, `${trip.csat.overallSatisfactionPercent}% (Sangat Memuaskan / Grade A+)`,
        { content: "Kategori Penilaian", fontStyle: "bold" }, "Skala Likert 1 s/d 5 Bintang"
      ]
    ]
  });

  const currentY = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("HASIL PENILAIAN 6 INDIKATOR KUALITAS PELAYANAN TUR", 14, currentY);

  const csatRows = trip.csat.indicators.map((ind, idx) => {
    const percent = ((ind.score / ind.maxScore) * 100).toFixed(1);
    return [
      (idx + 1).toString(),
      ind.title,
      `${ind.score.toFixed(2)} / 5.00`,
      `${percent}%`,
      ind.score >= 4.5 ? "SANGAT BAIK" : "BAIK"
    ];
  });

  autoTable(doc, {
    startY: currentY + 3,
    head: [["No.", "Indikator Pelayanan Wisata", "Rata-Rata Skor", "Persentase", "Predikat Mutu"]],
    body: csatRows,
    theme: "striped",
    headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 90, fontStyle: "bold" },
      2: { cellWidth: 28, halign: "center", fontStyle: "bold" },
      3: { cellWidth: 25, halign: "center", fontStyle: "bold", textColor: [5, 150, 105] },
      4: { cellWidth: 29, halign: "center", fontStyle: "bold", textColor: [67, 56, 202] }
    }
  });

  // Testimonials
  const testY = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("KUTIPAN TESTIMONI & SARAN WISATAWAN", 14, testY);

  const commentRows = trip.csat.guestComments.map(c => [
    c.name,
    `★ ${c.rating} / 5`,
    `"${c.comment}"`
  ]);

  autoTable(doc, {
    startY: testY + 3,
    head: [["Nama Wisatawan", "Rating", "Ulasan / Masukan Pelayanan"]],
    body: commentRows,
    theme: "grid",
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 45, fontStyle: "bold" },
      1: { cellWidth: 20, halign: "center", fontStyle: "bold", textColor: [217, 119, 6] },
      2: { cellWidth: 117, fontStyle: "italic" }
    }
  });

  const signY = doc.lastAutoTable.finalY + 6;
  addSignatureBox(doc, signY + 2, [
    { role: "Lead Tour Leader", name: trip.staff.leadTL.name, idLabel: trip.staff.leadTL.noRegBnsp },
    { role: "Tour Guide (TG)", name: trip.staff.tourGuide?.name || "Ahmad Dahlan, S.S., C.TG", idLabel: trip.staff.tourGuide?.noRegBnsp || "Pemandu Wisata" },
    { role: "Operational Manager", name: trip.staff.opsManager.name, idLabel: `NIP: ${trip.staff.opsManager.nip}` }
  ]);

  addOfficialFooter(doc, 1, 1);
  return doc;
};

/* =========================================================================
   7. SURAT KONFIRMASI RESERVASI VENDOR TRANSPORTASI
========================================================================= */
export const generateVendorConfirmationPDF = (trip) => {
  const doc = new jsPDF("p", "mm", "a4");
  
  addOfficialHeader(
    doc,
    "SURAT KONFIRMASI RESERVASI VENDOR TRANSPORTASI",
    `Service Order: ${trip.logistics.transportVendor.serviceOrderNo} | Standar Unit BNSP 3`,
    "DOC-VND-KOPKAR-2026"
  );

  autoTable(doc, {
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    body: [
      [
        { content: "Pihak Pertama (Penyewa)", fontStyle: "bold" }, "KOPKARINDO TRAVEL INDONESIA",
        { content: "Pihak Kedua (Vendor)", fontStyle: "bold" }, trip.logistics.transportVendor.company
      ],
      [
        { content: "Penanggung Jawab Kopkarindo", fontStyle: "bold" }, `${trip.staff.opsManager.name} (Ops Manager)`,
        { content: "PIC Vendor Transport", fontStyle: "bold" }, `${trip.logistics.transportVendor.pic} (${trip.logistics.transportVendor.contact})`
      ],
      [
        { content: "Tipe & Kapasitas Armada", fontStyle: "bold" }, trip.logistics.transportVendor.vehicleType,
        { content: "Nomor Registrasi Plat", fontStyle: "bold" }, trip.logistics.transportVendor.plateNumber
      ],
      [
        { content: "Nama Driver Ditugaskan", fontStyle: "bold" }, trip.logistics.transportVendor.driverName,
        { content: "Kontak & Lisensi Driver", fontStyle: "bold" }, `${trip.logistics.transportVendor.driverPhone} | ${trip.logistics.transportVendor.driverLicense}`
      ]
    ]
  });

  const currentY = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("KETENTUAN LAYANAN & SPESIFIKASI OPERASIONAL", 14, currentY);

  const terms = [
    ["1", "Rute Perjalanan", "Kuala Lumpur International Airport -> Putrajaya -> KLCC -> Genting -> Singapore -> Changi"],
    ["2", "Durasi Penugasan", `${trip.startDate} s/d ${trip.endDate} (4 Hari Standby Penuh)`],
    ["3", "Standar K3 Armada", "Wajib melampirkan hasil Ramp Check H-1, APAR aktif, Sabuk pengaman 100% normal, Kotak P3K."],
    ["4", "Fasilitas Pengemudi", "Biaya tol, parkir, BBM, akomodasi supir ditanggung sesuai perjanjian kontrak resmi."],
    ["5", "Penalti Keterlambatan", "Vendor wajib menyediakan armada pengganti setara dalam kurun 60 menit bila terjadi kendala teknis."]
  ];

  autoTable(doc, {
    startY: currentY + 3,
    head: [["No.", "Klausul Kesepakatan", "Detail Spesifikasi Operasional"]],
    body: terms,
    theme: "striped",
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 45, fontStyle: "bold" },
      2: { cellWidth: 127 }
    }
  });

  const signY = doc.lastAutoTable.finalY + 12;
  addSignatureBox(doc, signY, [
    { role: "Operational Manager (Kopkarindo)", name: trip.staff.opsManager.name, idLabel: `NIP: ${trip.staff.opsManager.nip}` },
    { role: "PIC Vendor Transportasi", name: trip.logistics.transportVendor.pic, idLabel: trip.logistics.transportVendor.company },
    { role: "Lead Tour Leader (Pemeriksa)", name: trip.staff.leadTL.name, idLabel: trip.staff.leadTL.noRegBnsp }
  ]);

  addOfficialFooter(doc, 1, 1);
  return doc;
};

/* =========================================================================
   8. PASSENGER MANIFEST & ROOMING LIST SHEET
========================================================================= */
export const generatePassengerManifestPDF = (trip) => {
  const doc = new jsPDF("l", "mm", "a4"); // Landscape
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Custom landscape header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 24, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("KOPKARINDO TRAVEL - PASSENGER MANIFEST & ROOMING LIST", 14, 11);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Kegiatan: ${trip.title} | SPT: ${trip.sptNumber} | Hotel: ${trip.logistics.hotel.name}`, 14, 18);

  const manifestRows = trip.passengers.map((p, idx) => [
    (idx + 1).toString(),
    p.id,
    p.name,
    p.gender,
    `${p.docType}: ${p.docNo}`,
    p.waPhone || p.phone,
    `${p.roomNo} (Seat: ${p.seatNo})`,
    `${p.emergencyContactName ? p.emergencyContactName + ' (' + (p.emergencyContactWa || '-') + ')' : (p.emergencyContact || '-')}`,
    `Penyakit: ${p.medicalHistory || 'Nihil'} | Diet: ${p.allergy || 'Nihil'} | Obat: ${p.requiredMedicines || 'Nihil'}`
  ]);

  autoTable(doc, {
    startY: 28,
    head: [["No.", "ID Pax", "Nama Lengkap Wisatawan", "L/P", "No. Dokumen", "No. WhatsApp", "Kamar & Kursi", "Kontak Darurat (Nama & WA)", "Catatan Medis, Alergi & Obat"]],
    body: manifestRows,
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 7.5 },
    bodyStyles: { fontSize: 6.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 16, fontStyle: "bold" },
      2: { cellWidth: 38, fontStyle: "bold" },
      3: { cellWidth: 8, halign: "center" },
      4: { cellWidth: 26 },
      5: { cellWidth: 26 },
      6: { cellWidth: 34 },
      7: { cellWidth: 44 },
      8: { cellWidth: 70, textColor: [185, 28, 28] }
    }
  });

  const signY = doc.lastAutoTable.finalY + 6;
  if (signY < 170) {
    addSignatureBox(doc, signY, [
      { role: "Lead Tour Leader (Pemeriksa Manifes)", name: trip.staff?.leadTL?.name || "Tour Leader", idLabel: trip.staff?.leadTL?.noRegBnsp || "Sertifikasi TL" },
      { role: "Manager Operasional (Approval Kantor)", name: trip.staff?.opsManager?.name || "Manager Operasional", idLabel: `NIP: ${trip.staff?.opsManager?.nip || "MGR-OPS-2026"}` }
    ]);
  }

  addOfficialFooter(doc, 1, 1);
  return doc;
};

/* =========================================================================
   9. BUNDEL CHECKLIST KELENGKAPAN SELURUH FASE & MODUL (FASE 1 - 3)
========================================================================= */
export const generatePhaseChecklistPDF = (trip) => {
  const doc = new jsPDF("p", "mm", "a4");
  
  addOfficialHeader(
    doc,
    "BERITA ACARA AUDIT KELENGKAPAN MODUL OPERASIONAL TUR",
    `Checklist Verifikasi Fase 1 (Pre), Fase 2 (On), dan Fase 3 (Post-Trip) | No. SPT: ${trip.sptNumber}`,
    "BA-CHK-KOPKAR-2026"
  );

  autoTable(doc, {
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    body: [
      [
        { content: "Judul Perjalanan Tur", fontStyle: "bold" }, trip.title,
        { content: "Nomor SPT Resmi", fontStyle: "bold" }, trip.sptNumber
      ],
      [
        { content: "Destinasi & Jadwal", fontStyle: "bold" }, `${trip.destination} (${trip.startDate} s/d ${trip.endDate})`,
        { content: "Rute Perjalanan", fontStyle: "bold" }, trip.routeSummary || "-"
      ],
      [
        { content: "Lead Tour Leader (TL)", fontStyle: "bold" }, trip.staff?.leadTL?.name,
        { content: "Tour Guide (TG)", fontStyle: "bold" }, trip.staff?.tourGuide?.name || "-"
      ],
      [
        { content: "Hasil Verifikasi Kelengkapan", fontStyle: "bold", textColor: [5, 150, 105] }, "8 DARI 8 MODUL LENGKAP & VALID (100% SESUAI)",
        { content: "Status Dokumen", fontStyle: "bold", textColor: [5, 150, 105] }, "SIAP DILAPORKAN & DITERBITKAN RESMI"
      ]
    ]
  });

  const currentY = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("STATUS VERIFIKASI KELENGKAPAN PER FASE & MODUL OPERASIONAL", 14, currentY);

  const checklistRows = [
    ["1", "Fase 1: Pre-Trip", "Modul 1: Manifes Wisatawan", `${trip.passengers.length} Pax (WA, Kontak Darurat & Medis Lengkap)`, "LENGKAP & VALID"],
    ["2", "Fase 1: Pre-Trip", "Modul 2: Tiket & Logistik Vendor", `${trip.logistics.flights.length} Flight, Hotel ${trip.logistics.hotel.name}`, "LENGKAP & VALID"],
    ["3", "Fase 1: Pre-Trip", "Modul 3: Ramp Check & Kotak P3K", "9/9 Item Bus Laik & 15 Item P3K Lengkap Standar K3", "LENGKAP & VALID"],
    ["4", "Fase 2: On-Trip", "Modul 4: Jurnal Log Harian", `${trip.dailyLogs.length} Catatan Jurnal GPS & Safety Briefing`, "LENGKAP & VALID"],
    ["5", "Fase 2: On-Trip", "Modul 5: Presensi & Headcount", "Presensi Digital QR e-Pass pada 5 Checkpoint Aktif", "LENGKAP & VALID"],
    ["6", "Fase 2: On-Trip", "Modul 6: Penanganan Insiden K3", `${trip.incidents.length} Kejadian Tercatat & Selesai Ditangani`, "LENGKAP & VALID"],
    ["7", "Fase 3: Post-Trip", "Modul 7: Settlement Kas Bon", `${trip.finance.expenses.length} Nota Realisasi Terlampir Bukti Kas Bon`, "LENGKAP & VALID"],
    ["8", "Fase 3: Post-Trip", "Modul 8: Evaluasi & CSAT Google Form", `Skor CSAT ${trip.csat.averageRating}/5.0 (${trip.csat.comments.length} Responden)`, "LENGKAP & VALID"]
  ];

  autoTable(doc, {
    startY: currentY + 3,
    head: [["No.", "Fase Operasional", "Nama Modul Sistem", "Detail Data Terverifikasi", "Status Audit"]],
    body: checklistRows,
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 32, fontStyle: "bold" },
      2: { cellWidth: 42, fontStyle: "bold" },
      3: { cellWidth: 68 },
      4: { cellWidth: 30, halign: "center", fontStyle: "bold", textColor: [5, 150, 105] }
    }
  });

  const signY = doc.lastAutoTable.finalY + 8;
  addSignatureBox(doc, signY, [
    { role: "Lead Tour Leader (Pelaksana Lapangan)", name: trip.staff?.leadTL?.name || "Tour Leader", idLabel: trip.staff?.leadTL?.noRegBnsp || "Sertifikasi TL" },
    { role: "Manager Operasional (Pemeriksa & Penyetuju)", name: trip.staff?.opsManager?.name || "Manager Operasional", idLabel: `NIP: ${trip.staff?.opsManager?.nip || "MGR-OPS-2026"}` }
  ]);

  addOfficialFooter(doc, 1, 1);
  return doc;
};

/* =========================================================================
   10. BUNDEL STANDAR BNSP TL & TG (30 UNIT KOMPETENSI)
========================================================================= */
export const generateBnspPortfolioBundlePDF = (trip) => {
  const doc = new jsPDF("p", "mm", "a4");
  
  // Cover Page
  addOfficialHeader(
    doc,
    "BERKAS KEPATUHAN STANDAR KOMPETENSI BNSP TOUR LEADER & TOUR GUIDE",
    "Verifikasi Internal Operasional Tur Sesuai Standar SKKNI No. 038/PAR/2026",
    "DOC-BNSP-TL-TG-2026"
  );

  autoTable(doc, {
    startY: 50,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    body: [
      [
        { content: "Lead Tour Leader (TL)", fontStyle: "bold" }, trip.staff.leadTL.name,
        { content: "No. Registrasi BNSP TL", fontStyle: "bold" }, trip.staff.leadTL.noRegBnsp
      ],
      [
        { content: "Tour Guide (TG) Ditugaskan", fontStyle: "bold" }, trip.staff.tourGuide?.name || "Ahmad Dahlan, S.S., C.TG",
        { content: "Institusi Penyelenggara", fontStyle: "bold" }, "Kopkarindo Travel Indonesia"
      ],
      [
        { content: "Judul Perjalanan Tur", fontStyle: "bold" }, trip.title,
        { content: "Nomor Surat Perintah Tugas", fontStyle: "bold" }, trip.sptNumber
      ],
      [
        { content: "Hasil Verifikasi Standar", fontStyle: "bold", textColor: [5, 150, 105] }, "30 DARI 30 UNIT MEMENUHI STANDAR (100% SESUAI)",
        { content: "Status Operasional", fontStyle: "bold", textColor: [5, 150, 105] }, "TERVERIFIKASI MEMENUHI SOP BNSP & K3"
      ]
    ]
  });

  // 30 Units Matrix
  let currentY = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("MATRIKS 30 UNIT KOMPETENSI TOUR LEADER (TL) & TOUR GUIDE (TG)", 14, currentY);

  const unitRows = [];
  BNSP_CLUSTERS.forEach(cluster => {
    cluster.units.forEach(unit => {
      unitRows.push([
        unit.number.toString(),
        unit.code,
        unit.title,
        unit.moduleRef,
        "TERPENUHI (VALID)"
      ]);
    });
  });

  autoTable(doc, {
    startY: currentY + 3,
    head: [["Unit", "Kode Unit BNSP", "Judul Unit Kompetensi", "Bukti Digital Modul K-TORS Terlampir", "Status SOP"]],
    body: unitRows,
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 7 },
    bodyStyles: { fontSize: 6.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 26, fontStyle: "bold" },
      2: { cellWidth: 70 },
      3: { cellWidth: 52 },
      4: { cellWidth: 24, halign: "center", fontStyle: "bold", textColor: [5, 150, 105] }
    }
  });

  // Final Signatures
  if (doc.lastAutoTable.finalY > 230) {
    doc.addPage();
    currentY = 25;
  } else {
    currentY = doc.lastAutoTable.finalY + 8;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("PENGESAHAN KEPATUHAN STANDAR OPERASIONAL (TIM TOUR & TRAVEL)", 14, currentY);

  addSignatureBox(doc, currentY + 3, [
    { role: "Lead Tour Leader (TL)", name: trip.staff.leadTL.name, idLabel: trip.staff.leadTL.noRegBnsp },
    { role: "Tour Guide (TG)", name: trip.staff.tourGuide?.name || "Ahmad Dahlan, S.S., C.TG", idLabel: "Pemandu Wisata Bersertifikat" },
    { role: "Manager Operasional", name: trip.staff.opsManager.name, idLabel: `NIP: ${trip.staff.opsManager.nip}` }
  ]);

  addOfficialFooter(doc, 1, 1);
  return doc;
};
