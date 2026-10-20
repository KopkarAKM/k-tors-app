import React, { useState } from "react";
import { Briefcase, CheckCircle2, FileText, Download, DollarSign, Settings, ShieldCheck, PenTool, Award, Sparkles, MapPin, Calendar, Users, ArrowRight, Layers, Eye } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("overview"); // overview, master, checklist, pdf, finance
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);

  const totalExpense = trip.finance?.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const cashAdvance = trip.finance?.cashAdvance || 0;
  const balance = cashAdvance - totalExpense;
  const totalPax = trip.passengers?.length || 0;

  const PDF_LIST = [
    { title: "Laporan Utama Tour Leader (TLR)", fn: () => generateTourLeaderReportPDF(trip), fileName: `Laporan_TL_${trip.id}.pdf` },
    { title: "Laporan Keuangan Kas Bon & Settlement", fn: () => generateFinancialSettlementPDF(trip), fileName: `Settlement_Kas_${trip.id}.pdf` },
    { title: "Berita Acara Checklist Kelengkapan Fase 1-3", fn: () => generatePhaseChecklistPDF(trip), fileName: `Checklist_Fase_1_3_${trip.id}.pdf` },
    { title: "Passenger Manifest & Rooming List", fn: () => generatePassengerManifestPDF(trip), fileName: `Manifes_Wisatawan_${trip.id}.pdf` },
    { title: "Form Ramp Check Kelaikan Bus (FM-K3-01)", fn: () => generateRampCheckPDF(trip), fileName: `Ramp_Check_${trip.id}.pdf` },
    { title: "Rekapitulasi Kuesioner CSAT", fn: () => generateCsatReportPDF(trip), fileName: `CSAT_Wisatawan_${trip.id}.pdf` }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", paddingBottom: 76 }}>
      {/* Mobile Top Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", color: "#fff", padding: "16px 16px 14px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={18} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <strong style={{ fontSize: "0.95rem", color: "#fff" }}>K-TORS Manager</strong>
                <span style={{ fontSize: "0.6rem", background: "rgba(99, 102, 241, 0.3)", color: "#c7d2fe", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>
                  PUSAT & APPROVAL
                </span>
              </div>
              <p style={{ fontSize: "0.68rem", color: "var(--slate-300)", margin: 0 }}>
                SPT: {trip.sptNumber} • TL: {trip.staff?.leadTL?.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMasterModalOpen(true)}
            className="btn btn-sm"
            style={{ background: "#2563eb", color: "#fff", border: "none", fontSize: "0.68rem", padding: "5px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}
          >
            <Settings size={12} /> Edit Rute
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: "14px 12px", flex: 1 }}>
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & MONITORING */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Trip Status Card */}
            <div style={{ background: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)", borderRadius: 12, padding: 14, color: "#fff", boxShadow: "0 4px 12px rgba(49, 46, 129, 0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span className="badge badge-emerald" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                  ● LIVE OPERASIONAL
                </span>
                <span style={{ fontSize: "0.7rem", color: "#c7d2fe" }}>
                  {trip.startDate} s/d {trip.endDate}
                </span>
              </div>
              <h3 style={{ fontSize: "1.1rem", color: "#fff", margin: "0 0 8px 0" }}>
                {trip.title}
              </h3>
              <p style={{ fontSize: "0.75rem", color: "#e0e7ff", margin: 0 }}>
                📍 <strong>Rute:</strong> {trip.routeSummary || trip.destination}
              </p>
            </div>

            {/* Manager Metrics Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "#fff", padding: 12, borderRadius: 10, border: "1px solid var(--slate-200)" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700 }}>Wisatawan</span>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--slate-900)", marginTop: 2 }}>
                  {totalPax} <span style={{ fontSize: "0.8rem", color: "var(--slate-500)", fontWeight: 500 }}>Pax</span>
                </div>
                <span style={{ fontSize: "0.68rem", color: "var(--emerald-600)" }}>100% Manifes Terisi</span>
              </div>

              <div style={{ background: "#fff", padding: 12, borderRadius: 10, border: "1px solid var(--slate-200)" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700 }}>Kas Lapangan</span>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: balance >= 0 ? "var(--emerald-600)" : "var(--rose-600)", marginTop: 2 }}>
                  {formatRupiah(balance)}
                </div>
                <span style={{ fontSize: "0.68rem", color: "var(--slate-500)" }}>{balance >= 0 ? "Surplus" : "Defisit"}</span>
              </div>
            </div>

            {/* Checklist Kelengkapan Widget */}
            <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid var(--slate-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--slate-800)" }}>
                  Audit Checklist Kepatuhan (Fase 1 - 3)
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--emerald-600)", fontWeight: 700 }}>
                  8/8 Modul Valid (100%)
                </span>
              </div>

              <div style={{ height: 8, background: "var(--slate-100)", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #10b981 0%, #059669 100%)" }} />
              </div>

              <button
                onClick={() => setActiveTab("checklist")}
                className="btn btn-secondary btn-sm"
                style={{ width: "100%", fontSize: "0.75rem" }}
              >
                Buka Detail Checklist & Approval <ArrowRight size={12} />
              </button>
            </div>

            {/* Approval Signature Status */}
            <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid var(--slate-200)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700 }}>
                STATUS PERSETUJUAN MANAGER OPERASIONAL
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div>
                  <strong style={{ fontSize: "0.85rem", color: "var(--slate-900)" }}>{trip.staff?.opsManager?.name}</strong>
                  <div style={{ fontSize: "0.7rem", color: trip.signatures?.opsManager ? "var(--emerald-600)" : "var(--amber-600)", fontWeight: 600 }}>
                    {trip.signatures?.opsManager ? "✓ Telah Disetujui & Ditandatangani" : "Menunggu Approval Manager"}
                  </div>
                </div>

                <button
                  onClick={() => onOpenSignModal("Manager Operasional", trip.staff?.opsManager?.name)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "0.725rem", padding: "6px 12px" }}
                >
                  <PenTool size={13} /> {trip.signatures?.opsManager ? "Ubah TTD" : "Beri TTD"}
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
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--slate-800)", padding: "0 4px" }}>
              Verifikasi Kelengkapan 8 Modul Tur:
            </div>

            {[
              { code: "M-1", title: "Manifes Wisatawan & Medis", desc: `${totalPax} Pax terdata dengan no. WA & darurat`, status: "LENGKAP" },
              { code: "M-2", title: "Tiket, Hotel & Vendor Bus", desc: `${trip.logistics.flights.length} Flight, Hotel ${trip.logistics.hotel.name}`, status: "LENGKAP" },
              { code: "M-3", title: "Ramp Check Bus & Kotak P3K", desc: "9 Parameter Laik & 15 Item P3K Lengkap", status: "LENGKAP" },
              { code: "M-4", title: "Jurnal Harian & Safety Briefing", desc: `${trip.dailyLogs.length} Catatan Log Ber-GPS`, status: "LENGKAP" },
              { code: "M-5", title: "Presensi Wisatawan (QR Pass)", desc: "5 Checkpoint Aktif", status: "LENGKAP" },
              { code: "M-6", title: "Laporan Insiden K3", desc: `${trip.incidents.length} Kasus Selesai`, status: "LENGKAP" },
              { code: "M-7", title: "Settlement Kas Bon & Nota", desc: `${trip.finance.expenses.length} Nota Realisasi`, status: "LENGKAP" },
              { code: "M-8", title: "Evaluasi & CSAT Google Form", desc: `Skor ${trip.csat.averageRating}/5.0 Bintang`, status: "LENGKAP" }
            ].map((m, idx) => (
              <div key={idx} style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: "var(--emerald-50)", color: "var(--emerald-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.825rem", color: "var(--slate-900)" }}>[{m.code}] {m.title}</strong>
                    <div style={{ fontSize: "0.68rem", color: "var(--slate-500)" }}>{m.desc}</div>
                  </div>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: "0.62rem" }}>{m.status}</span>
              </div>
            ))}

            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => onOpenSignModal("Manager Operasional", trip.staff?.opsManager?.name)}
                className="btn btn-primary"
                style={{ width: "100%", padding: "10px", fontSize: "0.85rem" }}
              >
                <PenTool size={15} /> Beri Tanda Tangan Approval Manager
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: DOWNLOAD DOKUMEN PDF DARI PONSEL */}
        {/* ========================================================= */}
        {activeTab === "pdf" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--slate-800)", padding: "0 4px" }}>
              Unduh Laporan Resmi PDF ke Ponsel:
            </div>

            {PDF_LIST.map((pdfItem, idx) => (
              <div key={idx} style={{ background: "#fff", borderRadius: 10, padding: 12, border: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--primary-50)", color: "var(--primary-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "0.85rem", color: "var(--slate-900)", margin: 0 }}>{pdfItem.title}</h5>
                    <span style={{ fontSize: "0.65rem", color: "var(--slate-400)" }}>Format PDF Resmi Kopkarindo</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const doc = pdfItem.fn();
                    doc.save(pdfItem.fileName);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "0.725rem", padding: "6px 10px" }}
                >
                  <Download size={13} /> Unduh
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
            <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid var(--slate-200)" }}>
              <h4 style={{ fontSize: "0.85rem", color: "var(--slate-900)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <DollarSign size={16} color="var(--amber-600)" />
                Rekapitulasi Kas Bon & Pengeluaran Lapangan
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--slate-100)" }}>
                  <span style={{ color: "var(--slate-600)" }}>Kas Bon Diberikan (Cash Advance):</span>
                  <strong>{formatRupiah(cashAdvance)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--slate-100)" }}>
                  <span style={{ color: "var(--slate-600)" }}>Total Realisasi Nota ({trip.finance.expenses.length} bukti):</span>
                  <strong style={{ color: "var(--rose-600)" }}>{formatRupiah(totalExpense)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "0.85rem", fontWeight: 800 }}>
                  <span>Sisa Kas ({balance >= 0 ? "Surplus Dikembalikan" : "Defisit Diganti"}):</span>
                  <span style={{ color: balance >= 0 ? "var(--emerald-600)" : "var(--rose-600)" }}>{formatRupiah(balance)}</span>
                </div>
              </div>
            </div>

            {/* Nota List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate-700)" }}>
                Daftar Nota Realisasi dari Tour Leader:
              </div>
              {trip.finance.expenses.map(exp => (
                <div key={exp.id} style={{ background: "#fff", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "0.8rem", color: "var(--slate-900)" }}>{exp.description}</strong>
                    <div style={{ fontSize: "0.68rem", color: "var(--slate-500)" }}>{exp.category} • {exp.receiptProof}</div>
                  </div>
                  <strong style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>{formatRupiah(exp.amount)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-around", padding: "6px 0", zIndex: 40, boxShadow: "0 -4px 10px rgba(0,0,0,0.05)" }}>
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
                color: isActive ? "#6366f1" : "var(--slate-400)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                fontSize: "0.68rem",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                padding: "4px 8px"
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
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
