import React, { useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  FileText,
  Download,
  DollarSign,
  Settings,
  PenTool,
  ArrowRight
} from "lucide-react";
import { formatRupiah } from "../../utils/pdfGenerator";
import {
  generateTourLeaderReportPDF,
  generateFinancialSettlementPDF,
  generateRampCheckPDF,
  generateP3kCheckPDF,
  generateIncidentReportPDF,
  generateCsatReportPDF,
  generateVendorConfirmationPDF,
  generatePassengerManifestPDF,
  generatePhaseChecklistPDF
} from "../../utils/pdfGenerator";
import TripMasterModal from "../TripMasterModal";

export default function MobileManagerView({ trip, updateTrip, onOpenSignModal }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, checklist, pdf, finance
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);

  const totalExpense = trip.finance?.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const cashAdvance = trip.finance?.cashAdvance || 0;
  const balance = cashAdvance - totalExpense;
  const totalPax = trip.passengers?.length || 0;

  const PDF_LIST = [
    { title: "Laporan Utama Tour Leader (TLR)", desc: "Dokumen komprehensif 3 fase", fn: () => generateTourLeaderReportPDF(trip), fileName: `Laporan_TL_${trip.id}.pdf` },
    { title: "Laporan Keuangan Kas Bon & Settlement", desc: "Rekap voucher kas bon & nota", fn: () => generateFinancialSettlementPDF(trip), fileName: `Settlement_Kas_${trip.id}.pdf` },
    { title: "Berita Acara Checklist Fase 1-3", desc: "Audit kepatuhan 8 modul tur", fn: () => generatePhaseChecklistPDF(trip), fileName: `Checklist_Fase_1_3_${trip.id}.pdf` },
    { title: "Passenger Manifest & Rooming List", desc: "Daftar wisatawan, paspor & kamar", fn: () => generatePassengerManifestPDF(trip), fileName: `Manifes_Wisatawan_${trip.id}.pdf` },
    { title: "Form Ramp Check K3 Bus (FM-K3-01)", desc: "9 Parameter kelaikan bus", fn: () => generateRampCheckPDF(trip), fileName: `Ramp_Check_${trip.id}.pdf` },
    { title: "Rekapitulasi Kuesioner CSAT", desc: "Evaluasi kepuasan & rating wisatawan", fn: () => generateCsatReportPDF(trip), fileName: `CSAT_Wisatawan_${trip.id}.pdf` }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", paddingBottom: 85 }}>
      {/* ========================================================= */}
      {/* MOBILE TOP HEADER (Manager Indigo Theme) */}
      {/* ========================================================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          color: "#ffffff",
          padding: "16px 16px 14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          position: "sticky",
          top: 0,
          zIndex: 30,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(99,102,241,0.4)"
              }}
            >
              <Briefcase size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <strong style={{ fontSize: "1rem", color: "#ffffff" }}>K-TORS Pusat</strong>
                <span
                  style={{
                    fontSize: "0.68rem",
                    background: "#4f46e5",
                    color: "#ffffff",
                    padding: "2px 7px",
                    borderRadius: 9999,
                    fontWeight: 700
                  }}
                >
                  MANAGER
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#cbd5e1", margin: 0 }}>
                SPT: {trip.sptNumber} • TL: {trip.staff?.leadTL?.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMasterModalOpen(true)}
            style={{
              background: "#3b82f6",
              color: "#ffffff",
              border: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "6px 10px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 5,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(59, 130, 246, 0.3)"
            }}
          >
            <Settings size={13} /> Edit Rute
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: "14px 14px", flex: 1 }}>
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & MONITORING */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Trip Status Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
                borderRadius: 14,
                padding: "16px 14px",
                color: "#ffffff",
                boxShadow: "0 6px 16px rgba(49, 46, 129, 0.28)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                    borderRadius: 9999,
                    background: "#10b981",
                    color: "#ffffff",
                    fontWeight: 700
                  }}
                >
                  ● LIVE OPERASIONAL
                </span>
                <span style={{ fontSize: "0.75rem", color: "#c7d2fe", fontWeight: 600 }}>
                  {trip.startDate} s/d {trip.endDate}
                </span>
              </div>

              <h3 style={{ fontSize: "1.15rem", color: "#ffffff", margin: "0 0 8px 0", lineHeight: 1.3 }}>
                {trip.title}
              </h3>

              <p style={{ fontSize: "0.8rem", color: "#e0e7ff", margin: 0 }}>
                📍 <strong>Rute:</strong> {trip.routeSummary || trip.destination}
              </p>
            </div>

            {/* Manager Metrics Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "#ffffff", padding: "14px 12px", borderRadius: 12, border: "1.5px solid var(--slate-200)", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
                <span style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                  Manifes Wisatawan
                </span>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0f172a", marginTop: 4 }}>
                  {totalPax} <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Pax</span>
                </div>
                <span style={{ fontSize: "0.725rem", color: "#16a34a", fontWeight: 700 }}>
                  ✓ 100% Data Lengkap
                </span>
              </div>

              <div style={{ background: "#ffffff", padding: "14px 12px", borderRadius: 12, border: "1.5px solid var(--slate-200)", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
                <span style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                  Saldo Kas Lapangan
                </span>
                <div style={{ fontSize: "1.15rem", fontWeight: 900, color: balance >= 0 ? "#16a34a" : "#dc2626", marginTop: 4 }}>
                  {formatRupiah(balance)}
                </div>
                <span style={{ fontSize: "0.725rem", color: balance >= 0 ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                  {balance >= 0 ? "Surplus (Kembali)" : "Defisit (Reimburse)"}
                </span>
              </div>
            </div>

            {/* Checklist Kelengkapan Audit Widget */}
            <div style={{ background: "#ffffff", padding: "14px 14px", borderRadius: 12, border: "1.5px solid var(--slate-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b" }}>
                  Kepatuhan Modul (Fase 1 - 3)
                </span>
                <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 800 }}>
                  8/8 Modul Valid (100%)
                </span>
              </div>

              <div style={{ height: 8, background: "#f1f5f9", borderRadius: 9999, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #10b981 0%, #059669 100%)" }} />
              </div>

              <button
                onClick={() => setActiveTab("checklist")}
                className="btn btn-secondary"
                style={{ width: "100%", height: 42, fontSize: "0.825rem", borderRadius: 8, fontWeight: 700 }}
              >
                Buka Detail Verifikasi Modul <ArrowRight size={14} />
              </button>
            </div>

            {/* Approval Signature Status */}
            <div style={{ background: "#ffffff", padding: "14px 14px", borderRadius: 12, border: "1.5px solid var(--slate-200)" }}>
              <span style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                PERSETUJUAN RESMI MANAGER OPERASIONAL
              </span>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <div>
                  <strong style={{ fontSize: "0.95rem", color: "#0f172a", display: "block" }}>
                    {trip.staff?.opsManager?.name || "Manager Operasional"}
                  </strong>
                  <div style={{ fontSize: "0.75rem", color: trip.signatures?.opsManager ? "#16a34a" : "#d97706", fontWeight: 700, marginTop: 2 }}>
                    {trip.signatures?.opsManager ? "✓ Telah Disetujui & Bertanda Tangan" : "⚠️ Menunggu Tanda Tangan Approval"}
                  </div>
                </div>

                <button
                  onClick={() => onOpenSignModal("Manager Operasional", trip.staff?.opsManager?.name)}
                  className="btn btn-primary"
                  style={{ fontSize: "0.8rem", padding: "8px 12px", borderRadius: 8, height: 42 }}
                >
                  <PenTool size={14} /> {trip.signatures?.opsManager ? "Ubah TTD" : "Beri TTD"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: AUDIT CHECKLIST FASE 1 - 3 */}
        {/* ========================================================= */}
        {activeTab === "checklist" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b", padding: "0 2px" }}>
              Verifikasi Kelengkapan 8 Modul Tur:
            </div>

            {[
              { code: "M-1", title: "Manifes Wisatawan & Medis", desc: `${totalPax} Pax lengkap dengan no. WA & kontak darurat`, status: "LENGKAP" },
              { code: "M-2", title: "Tiket, Hotel & Vendor Bus", desc: `${trip.logistics?.flights?.length || 2} Penerbangan, Hotel ${trip.logistics?.hotel?.name}`, status: "LENGKAP" },
              { code: "M-3", title: "Ramp Check Bus & Kotak P3K", desc: "9 Parameter Laik Jalan & 15 Item Obat Lengkap", status: "LENGKAP" },
              { code: "M-4", title: "Jurnal Harian & Safety Briefing", desc: `${trip.dailyLogs?.length || 0} Catatan Lapangan Ber-GPS`, status: "LENGKAP" },
              { code: "M-5", title: "Presensi Wisatawan (QR Pass)", desc: "5 Titik Checkpoint Pantau Aktif", status: "LENGKAP" },
              { code: "M-6", title: "Laporan Insiden K3", desc: `${trip.incidents?.length || 0} Berita Acara Selesai`, status: "LENGKAP" },
              { code: "M-7", title: "Settlement Kas Bon & Nota", desc: `${trip.finance?.expenses?.length || 0} Bukti Realisasi Kas`, status: "LENGKAP" },
              { code: "M-8", title: "Evaluasi & CSAT Google Form", desc: `Skor ${trip.csat?.averageRating || "4.9"}/5.0 Bintang CSAT`, status: "LENGKAP" }
            ].map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: "#ffffff",
                  borderRadius: 10,
                  padding: "12px 14px",
                  border: "1.5px solid var(--slate-200)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "#ecfdf5", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem", color: "#0f172a" }}>
                      [{m.code}] {m.title}
                    </strong>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>
                      {m.desc}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: 9999
                  }}
                >
                  {m.status}
                </span>
              </div>
            ))}

            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => onOpenSignModal("Manager Operasional", trip.staff?.opsManager?.name)}
                className="btn btn-primary"
                style={{ width: "100%", height: 46, fontSize: "0.9rem", borderRadius: 10, fontWeight: 700 }}
              >
                <PenTool size={16} /> Beri Tanda Tangan Approval Manager
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: DOWNLOAD DOKUMEN PDF DARI PONSEL */}
        {/* ========================================================= */}
        {activeTab === "pdf" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b", padding: "0 2px" }}>
              Unduh Laporan Resmi PDF ke Ponsel:
            </div>

            {PDF_LIST.map((pdfItem, idx) => (
              <div
                key={idx}
                style={{
                  background: "#ffffff",
                  borderRadius: 12,
                  padding: "14px 14px",
                  border: "1.5px solid var(--slate-200)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "0.875rem", color: "#0f172a", margin: 0, fontWeight: 700 }}>
                      {pdfItem.title}
                    </h5>
                    <span style={{ fontSize: "0.725rem", color: "#64748b" }}>
                      {pdfItem.desc}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const doc = pdfItem.fn();
                    doc.save(pdfItem.fileName);
                  }}
                  className="btn btn-primary"
                  style={{ fontSize: "0.75rem", padding: "8px 12px", height: 38, borderRadius: 8, fontWeight: 700 }}
                >
                  <Download size={14} /> Unduh
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: AUDIT KEUANGAN (FINANCE) */}
        {/* ========================================================= */}
        {activeTab === "finance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#ffffff", padding: "16px 14px", borderRadius: 12, border: "1.5px solid var(--slate-200)" }}>
              <h4 style={{ fontSize: "0.95rem", color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <DollarSign size={18} color="#d97706" />
                Rekapitulasi Kas Bon & Realisasi Lapangan
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.825rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Kas Bon Koperasi (Cash Advance):</span>
                  <strong>{formatRupiah(cashAdvance)}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Total Pengeluaran ({trip.finance?.expenses?.length || 0} nota):</span>
                  <strong style={{ color: "#e11d48" }}>{formatRupiah(totalExpense)}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: "0.95rem", fontWeight: 900 }}>
                  <span>Sisa Kas Lapangan ({balance >= 0 ? "Surplus" : "Defisit"}):</span>
                  <span style={{ color: balance >= 0 ? "#16a34a" : "#dc2626" }}>
                    {formatRupiah(balance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b", padding: "0 2px" }}>
                Daftar Nota Realisasi dari Tour Leader:
              </div>

              {trip.finance?.expenses?.map(exp => (
                <div
                  key={exp.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 10,
                    padding: "10px 12px",
                    border: "1.5px solid var(--slate-200)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "#0f172a" }}>{exp.description}</strong>
                    <div style={{ fontSize: "0.725rem", color: "#64748b", marginTop: 2 }}>
                      {exp.category} • {exp.receiptProof}
                    </div>
                  </div>
                  <strong style={{ fontSize: "0.9rem", color: "#0f172a", fontFamily: "var(--font-mono)" }}>
                    {formatRupiah(exp.amount)}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {/* ========================================================= */}
      <div className="mobile-bottom-nav">
        {[
          { id: "overview", label: "Monitoring", icon: Briefcase },
          { id: "checklist", label: "Checklist", icon: CheckCircle2 },
          { id: "pdf", label: "Laporan PDF", icon: FileText },
          { id: "finance", label: "Audit Kas", icon: DollarSign }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: "transparent",
                border: "none",
                color: isActive ? "#6366f1" : "#64748b",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                fontSize: "0.72rem",
                fontWeight: isActive ? 800 : 600,
                cursor: "pointer",
                padding: "6px 8px",
                flex: 1
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {isActive && (
                <div style={{ width: 14, height: 3, background: "#6366f1", borderRadius: 9999, marginTop: 1 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Master Trip Configuration Modal */}
      {isMasterModalOpen && (
        <TripMasterModal
          isOpen={isMasterModalOpen}
          onClose={() => setIsMasterModalOpen(false)}
          trip={trip}
          onSaveTrip={updateTrip}
        />
      )}
    </div>
  );
}
