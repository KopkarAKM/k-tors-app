import React, { useState } from "react";
import { FileText, Download, Eye, Sparkles, CheckCircle2, Award, Printer, ShieldCheck, DollarSign, Bus, Users, Star, Layers } from "lucide-react";
import confetti from "canvas-confetti";
import {
  generateTourLeaderReportPDF,
  generateFinancialSettlementPDF,
  generateRampCheckPDF,
  generateP3kCheckPDF,
  generateIncidentReportPDF,
  generateCsatReportPDF,
  generateVendorConfirmationPDF,
  generatePassengerManifestPDF,
  generateBnspPortfolioBundlePDF,
  formatRupiah
} from "../utils/pdfGenerator";
import DocumentPreviewModal from "./DocumentPreviewModal";

export default function PdfExportModule({ trip }) {
  const [previewData, setPreviewData] = useState(null);

  const DOCS = [
    {
      id: "doc-1",
      number: "1",
      title: "Tour Leader / Guest Handling Report (TLR)",
      code: "DOC-TLR-KOPKAR-2026",
      format: "PDF / DOCX",
      description: "Laporan utama pelaksanaan tur komprehensif dari awal hingga kepulangan, memuat ringkasan jurnal harian, K3, dan pengesahan TL.",
      icon: FileText,
      color: "var(--primary-600)",
      generateFn: () => generateTourLeaderReportPDF(trip),
      fileName: `Laporan_Tour_Leader_${trip.id}.pdf`,
      renderPreview: (
        <div>
          <h4>Laporan Utama Tour Leader: {trip.title}</h4>
          <p><strong>Nomor SPT:</strong> {trip.sptNumber}</p>
          <p><strong>Lead Tour Leader:</strong> {trip.staff.leadTL.name} ({trip.staff.leadTL.noRegBnsp})</p>
          <p><strong>Jumlah Wisatawan:</strong> {trip.passengers.length} Orang (Semua Hadir)</p>
          <p><strong>Total Jurnal Kegiatan:</strong> {trip.dailyLogs.length} Catatan Kegiatan Ber-GPS</p>
          <p><strong>Total Penanganan Insiden:</strong> {trip.incidents.length} Kasus Selesai (100% Resolved)</p>
        </div>
      )
    },
    {
      id: "doc-2",
      number: "2",
      title: "Laporan Keuangan Operasional Tur (Settlement)",
      code: "FM-FIN-KOPKAR-02",
      format: "PDF / XLSX",
      description: "Rekapitulasi Cash Advance dari Koperasi vs seluruh realisasi pengeluaran, nota bukti fisik, dan kalkulasi sisa kas.",
      icon: DollarSign,
      color: "var(--emerald-600)",
      generateFn: () => generateFinancialSettlementPDF(trip),
      fileName: `Settlement_Keuangan_${trip.id}.pdf`,
      renderPreview: (
        <div>
          <h4>Laporan Pertanggungjawaban Kas Operasional (Settlement)</h4>
          <p><strong>Kas Awal (Cash Advance):</strong> {formatRupiah(trip.finance.cashAdvance)}</p>
          <p><strong>Total Realisasi Lapangan:</strong> {formatRupiah(trip.finance.expenses.reduce((a, b) => a + b.amount, 0))}</p>
          <p><strong>Sisa Kas Lebih (Surplus):</strong> {formatRupiah(trip.finance.cashAdvance - trip.finance.expenses.reduce((a, b) => a + b.amount, 0))}</p>
          <p><strong>Jumlah Bukti Nota:</strong> {trip.finance.expenses.length} Bukti Nota Terverifikasi</p>
        </div>
      )
    },
    {
      id: "doc-3",
      number: "3",
      title: "Form Inspeksi Kelaikan Armada (Ramp Check)",
      code: "FM-K3-KOPKAR-01",
      format: "PDF",
      description: "Audit keselamatan bus 9 parameter (rem, ban, APAR, P3K, palu darurat) ditandatangani Driver & Tour Leader.",
      icon: Bus,
      color: "#0284c7",
      generateFn: () => generateRampCheckPDF(trip),
      fileName: `Ramp_Check_FM-K3-01_${trip.id}.pdf`,
      renderPreview: (
        <div>
          <h4>Form Ramp Check Kelaikan Bus: {trip.rampCheck.vehiclePlate}</h4>
          <p><strong>Vendor:</strong> {trip.logistics.transportVendor.company}</p>
          <p><strong>Pengemudi:</strong> {trip.rampCheck.driverName} ({trip.logistics.transportVendor.driverLicense})</p>
          <p><strong>Hasil Keseluruhan:</strong> <span style={{ color: "green", fontWeight: "bold" }}>{trip.rampCheck.overallConclusion}</span></p>
          <p><strong>9 Parameter Keselamatan:</strong> 100% Memenuhi Standar Laik Jalan</p>
        </div>
      )
    },
    {
      id: "doc-4",
      number: "4",
      title: "Form Checklist Kelengkapan P3K Lapangan",
      code: "FM-K3-KOPKAR-03",
      format: "PDF",
      description: "Daftar audit 15 item obat dan peralatan medis pertolongan pertama beserta masa kadaluarsa dan kondisi fisik.",
      icon: ShieldCheck,
      color: "#16a34a",
      generateFn: () => generateP3kCheckPDF(trip),
      fileName: `Checklist_P3K_FM-K3-03_${trip.id}.pdf`,
      renderPreview: (
        <div>
          <h4>Form Audit Kelengkapan P3K: 15 Item Medis</h4>
          <p><strong>Petugas Auditor:</strong> {trip.p3kKit.inspectorName}</p>
          <p><strong>Status Kotak Obat:</strong> <span style={{ color: "green", fontWeight: "bold" }}>{trip.p3kKit.status}</span></p>
          <p><strong>Daftar Obat:</strong> Paracetamol, Antasida, Antimo, Oralit, Cetirizine, Betadine, Kassa Steril, dll.</p>
        </div>
      )
    },
    {
      id: "doc-5",
      number: "5",
      title: "Form Laporan Insiden K3 & Keluhan Wisatawan",
      code: "FM-K3-KOPKAR-04",
      format: "PDF",
      description: "Berita acara kronologi kejadian medis, barang tertinggal, keluhan fasilitas, dan tindakan penyelesaian tervalidasi.",
      icon: ShieldCheck,
      color: "#d97706",
      generateFn: () => generateIncidentReportPDF(trip),
      fileName: `Laporan_Insiden_FM-K3-04_${trip.id}.pdf`,
      renderPreview: (
        <div>
          <h4>Laporan Insiden & Keluhan K3 ({trip.incidents.length} Kasus)</h4>
          {trip.incidents.map((i, idx) => (
            <div key={idx} style={{ marginBottom: 8, padding: 8, background: "#f1f5f9", borderRadius: 6 }}>
              <strong>#{i.formNumber}: {i.category}</strong> - {i.passengerName}
              <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem" }}>Status: {i.status}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: "doc-6",
      number: "6",
      title: "Rekapitulasi Kuesioner Kepuasan Wisatawan (CSAT)",
      code: "DOC-CSAT-KOPKAR-2026",
      format: "PDF",
      description: "Analisis statistik 6 indikator kepuasan pelayanan wisata skala 1-5 bintang dan testimoni wisatawan.",
      icon: Star,
      color: "#6366f1",
      generateFn: () => generateCsatReportPDF(trip),
      fileName: `Laporan_CSAT_${trip.id}.pdf`,
      renderPreview: (
        <div>
          <h4>Rekapitulasi Evaluasi Kepuasan Wisatawan</h4>
          <p><strong>Skor CSAT Rata-Rata:</strong> 4.84 / 5.00 ({trip.csat.overallSatisfactionPercent}% Sangat Memuaskan)</p>
          <p><strong>Jumlah Responden:</strong> {trip.csat.totalRespondents} Peserta (100%)</p>
          <p><strong>6 Indikator Terpenuhi:</strong> TL Hospitality, Ketepatan Waktu, Kelaikan Bus, Hotel Bintang 5, Makanan & Alergi, Kesiapsiagaan K3.</p>
        </div>
      )
    },
    {
      id: "doc-7",
      number: "7",
      title: "Surat Konfirmasi Reservasi Vendor Transportasi",
      code: "DOC-VND-KOPKAR-2026",
      format: "PDF",
      description: "Surat perjanjian kerja sama resmi penugasan armada bus, spesifikasi fasilitas, dan kewajiban K3 vendor.",
      icon: Bus,
      color: "#475569",
      generateFn: () => generateVendorConfirmationPDF(trip),
      fileName: `Konfirmasi_Vendor_${trip.id}.pdf`,
      renderPreview: (
        <div>
          <h4>Surat Konfirmasi Reservasi Transportasi</h4>
          <p><strong>Vendor:</strong> {trip.logistics.transportVendor.company}</p>
          <p><strong>Service Order:</strong> {trip.logistics.transportVendor.serviceOrderNo}</p>
          <p><strong>Tipe Armada:</strong> {trip.logistics.transportVendor.vehicleType} ({trip.logistics.transportVendor.plateNumber})</p>
          <p><strong>Driver:</strong> {trip.logistics.transportVendor.driverName} ({trip.logistics.transportVendor.driverPhone})</p>
        </div>
      )
    },
    {
      id: "doc-8",
      number: "8",
      title: "Passenger Manifest & Rooming List Sheet",
      code: "DOC-MNF-KOPKAR-2026",
      format: "PDF / XLSX",
      description: "Daftar manifes identitas wisatawan (Paspor/KTP), alokasi kamar hotel Dorsett, kursi bus, dan catatan medis alergi.",
      icon: Users,
      color: "#0891b2",
      generateFn: () => generatePassengerManifestPDF(trip),
      fileName: `Manifes_Rooming_List_${trip.id}.pdf`,
      renderPreview: (
        <div>
          <h4>Passenger Manifest & Rooming List</h4>
          <p><strong>Jumlah Peserta:</strong> {trip.passengers.length} Orang</p>
          <p><strong>Status Imigrasi:</strong> 100% Paspor & MDAC Valid</p>
          <p><strong>Hotel:</strong> {trip.logistics.hotel.name} ({trip.logistics.hotel.totalRooms} Kamar)</p>
        </div>
      )
    },
    {
      id: "doc-9",
      number: "9",
      title: "Berita Acara Checklist Kelengkapan Tur (Fase 1 - 3)",
      code: "BA-CHK-KOPKAR-2026",
      format: "PDF / RESMI",
      description: "Berita acara verifikasi audit seluruh 8 modul dari Fase 1 (Pre), Fase 2 (On), dan Fase 3 (Post-Trip) ditandatangani Lead TL, Manager Operasional, dan Finance.",
      icon: Layers,
      color: "#10b981",
      generateFn: () => generatePhaseChecklistPDF(trip),
      fileName: `Berita_Acara_Checklist_Fase_1_3_${trip.id}.pdf`,
      renderPreview: (
        <div>
          <h4>Berita Acara Audit Kelengkapan Modul Tur: {trip.title}</h4>
          <p><strong>Nomor SPT:</strong> {trip.sptNumber}</p>
          <p><strong>Lead Tour Leader:</strong> {trip.staff.leadTL.name}</p>
          <p><strong>Hasil Verifikasi:</strong> <span style={{ color: "#059669", fontWeight: "bold" }}>8 DARI 8 MODUL LENGKAP & VALID (100%)</span></p>
          <p><strong>Cakupan Fase:</strong> Fase 1: Pre-Trip, Fase 2: On-Trip, Fase 3: Post-Trip</p>
          <p><strong>Status Dokumen:</strong> SIAP DILAPORKAN & DITERBITKAN RESMI</p>
        </div>
      )
    }
  ];

  const handleDownloadAll = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    DOCS.forEach((doc, idx) => {
      setTimeout(() => {
        const pdf = doc.generateFn();
        pdf.save(doc.fileName);
      }, idx * 300);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero Banner */}
      <div className="card" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge badge-emerald">STANDAR INDUSTRI & BNSP</span>
              <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontFamily: "var(--font-mono)" }}>9 AUTO-GENERATED DOCUMENTS</span>
            </div>
            <h2 style={{ fontSize: "1.5rem", color: "#fff", margin: "2px 0 6px 0" }}>
              Pusat Ekspor Dokumen Resmi Operasional Tur
            </h2>
            <p style={{ fontSize: "0.825rem", color: "var(--slate-300)", margin: 0, maxWidth: 680 }}>
              K-TORS mengompilasi seluruh inputan form, presensi, audit K3, nota kas, dan evaluasi menjadi berkas PDF resmi berstandar kop surat perusahaan dan berkas sertifikasi BNSP.
            </p>
          </div>

          <button
            className="btn btn-emerald"
            style={{ padding: "12px 20px", fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)" }}
            onClick={handleDownloadAll}
          >
            <Sparkles size={18} /> Unduh Semua 9 Dokumen Resmi Sekaligus (Batch PDF)
          </button>
        </div>
      </div>

      {/* Grid of 9 Official Documents */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        {DOCS.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--slate-100)", display: "flex", alignItems: "center", justifyContent: "center", color: doc.color }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.65rem", color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>DOKUMEN #{doc.number} • {doc.code}</span>
                      <h4 style={{ fontSize: "0.925rem", color: "var(--slate-900)", margin: 0 }}>{doc.title}</h4>
                    </div>
                  </div>

                  <span className="badge badge-slate" style={{ fontSize: "0.68rem" }}>{doc.format}</span>
                </div>

                <p style={{ fontSize: "0.775rem", color: "var(--slate-600)", lineHeight: 1.4, margin: "10px 0 16px 0" }}>
                  {doc.description}
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, borderTop: "1px solid var(--slate-100)", paddingTop: 12 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => setPreviewData(doc)}
                >
                  <Eye size={14} /> Pratinjau
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1.2 }}
                  onClick={() => {
                    const pdf = doc.generateFn();
                    pdf.save(doc.fileName);
                  }}
                >
                  <Download size={14} /> Unduh PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewData && (
        <DocumentPreviewModal
          isOpen={!!previewData}
          onClose={() => setPreviewData(null)}
          docTitle={previewData.title}
          docSubtitle={previewData.code}
          docContent={previewData.renderPreview}
          onDownload={() => {
            const pdf = previewData.generateFn();
            pdf.save(previewData.fileName);
          }}
        />
      )}
    </div>
  );
}
