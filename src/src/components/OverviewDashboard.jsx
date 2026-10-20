import React from "react";
import { Compass, Users, ShieldCheck, DollarSign, Award, ArrowRight, CheckCircle2, AlertTriangle, FileText, QrCode, Sparkles, MapPin, Calendar, Clock, Plane, Settings, ListChecks } from "lucide-react";
import { formatRupiah } from "../utils/pdfGenerator";

export default function OverviewDashboard({ trip, setActiveTab, onOpenSignModal, onOpenTripMaster }) {
  const totalExpense = trip.finance.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingCash = trip.finance.cashAdvance - totalExpense;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)", borderRadius: 16, padding: "24px 28px", color: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 750 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span className="badge badge-emerald" style={{ fontSize: "0.75rem" }}>
                <span className="live-dot" /> LIVE OPERASIONAL ({trip.status})
              </span>
              <span className="badge badge-blue" style={{ fontSize: "0.75rem" }}>
                {trip.type} TOUR
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--slate-300)", fontFamily: "var(--font-mono)" }}>
                SPT: {trip.sptNumber}
              </span>
            </div>

            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 10 }}>
              {trip.title}
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: "0.825rem", color: "var(--slate-300)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={15} color="#38bdf8" />
                <span>{trip.destination}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={15} color="#38bdf8" />
                <span>{trip.startDate} s/d {trip.endDate}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={15} color="#38bdf8" />
                <span>{trip.passengers.length} Wisatawan</span>
              </div>
            </div>

            {/* Rute & Info Ringkas */}
            {trip.routeSummary && (
              <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(255,255,255,0.06)", borderRadius: 8, fontSize: "0.75rem", color: "#e2e8f0", borderLeft: "3px solid #38bdf8" }}>
                <strong>Rute Perjalanan:</strong> {trip.routeSummary}
              </div>
            )}
          </div>

          {/* Lead TL Card & Quick Edit Master */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 240 }}>
            <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 18px" }}>
              <span style={{ fontSize: "0.65rem", color: "var(--slate-400)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                LEAD TOUR LEADER
              </span>
              <strong style={{ fontSize: "0.95rem", color: "#fff", display: "block", marginTop: 2 }}>
                {trip.staff?.leadTL?.name}
              </strong>
              <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontFamily: "var(--font-mono)", display: "block" }}>
                {trip.staff?.leadTL?.noRegBnsp}
              </span>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem", color: "#34d399" }}>
                <CheckCircle2 size={13} />
                <span>Petugas Utama Terverifikasi</span>
              </div>
            </div>

            <button
              onClick={onOpenTripMaster}
              className="btn btn-sm"
              style={{ background: "#2563eb", color: "#fff", border: "none", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <Settings size={13} /> Ubah Rute & Petugas Tur
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {/* Card 1: Manifes & Wisatawan */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--slate-500)", textTransform: "uppercase" }}>Wisatawan (Manifest)</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-600)" }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--slate-900)" }}>
              {trip.passengers.length} <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--slate-500)" }}>Pax</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--emerald-600)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle2 size={13} /> Data WA, Darurat & Medis Lengkap
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 14, width: "100%" }} onClick={() => setActiveTab("pre-trip")}>
            Lihat Manifes & QR e-Pass <ArrowRight size={13} />
          </button>
        </div>

        {/* Card 2: K3 & Ramp Check */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--slate-500)", textTransform: "uppercase" }}>Audit K3 & Ramp Check</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--emerald-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald-600)" }}>
                <ShieldCheck size={16} />
              </div>
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--emerald-600)" }}>
              GRADE A+
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--slate-600)", marginTop: 4 }}>
              9/9 Kelaikan Bus & 15 P3K Lengkap
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 14, width: "100%" }} onClick={() => setActiveTab("pre-trip")}>
            Detail Ramp Check & P3K <ArrowRight size={13} />
          </button>
        </div>

        {/* Card 3: Keuangan Kas Operasional */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--slate-500)", textTransform: "uppercase" }}>Settlement Kas Tur</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--amber-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--amber-600)" }}>
                <DollarSign size={16} />
              </div>
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--slate-900)" }}>
              {formatRupiah(totalExpense)}
            </div>
            <p style={{ fontSize: "0.75rem", color: remainingCash >= 0 ? "var(--emerald-600)" : "var(--rose-600)", marginTop: 4, fontWeight: 600 }}>
              Sisa Kas: {formatRupiah(remainingCash)} ({remainingCash >= 0 ? "Surplus" : "Defisit"})
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 14, width: "100%" }} onClick={() => setActiveTab("post-trip")}>
            Klaim, Bukti Kas Bon & CSAT <ArrowRight size={13} />
          </button>
        </div>

        {/* Card 4: Checklist Kelengkapan Fase 1 - 3 */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)", borderColor: "#86efac" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--emerald-700)", textTransform: "uppercase" }}>Checklist Kelengkapan</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--emerald-500)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <ListChecks size={16} />
              </div>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--emerald-700)" }}>
              8 / 8 Modul
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--emerald-800)", marginTop: 4, fontWeight: 600 }}>
              100% Seluruh Fase 1 - 3 Terisi
            </p>
          </div>
          <button className="btn btn-emerald btn-sm" style={{ marginTop: 14, width: "100%" }} onClick={() => setActiveTab("checklist")}>
            Audit Checklist Tur <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 3-Phase Workflow Overview */}
      <div className="card">
        <h3 style={{ fontSize: "1rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={18} color="var(--primary-600)" />
          Alur Kerja Operasional Tur Digital (End-to-End Workflow K-TORS)
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {/* Phase 1 */}
          <div style={{ padding: 16, borderRadius: 10, background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--primary-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>1</span>
              <h4 style={{ fontSize: "0.9rem", color: "var(--slate-900)" }}>FASE 1: PRE-TRIP (Persiapan)</h4>
            </div>
            <p style={{ fontSize: "0.775rem", color: "var(--slate-600)", marginBottom: 12 }}>
              Verifikasi Surat Perintah Tugas (SPT), Manifes Paspor/KTP/WhatsApp/Medis, Flight PNR, Hotel Rooming, serta Audit Ramp Check Bus & Kotak P3K.
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span className="badge badge-emerald">Modul 1: Manifest (CRUD)</span>
              <span className="badge badge-emerald">Modul 2: Vendor (CRUD)</span>
              <span className="badge badge-emerald">Modul 3: Ramp Check (CRUD)</span>
            </div>
          </div>

          {/* Phase 2 */}
          <div style={{ padding: 16, borderRadius: 10, background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--primary-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>2</span>
              <h4 style={{ fontSize: "0.9rem", color: "var(--slate-900)" }}>FASE 2: ON-TRIP (Pelaksanaan)</h4>
            </div>
            <p style={{ fontSize: "0.775rem", color: "var(--slate-600)", marginBottom: 12 }}>
              Presensi digital QR e-Pass & Headcount Checkpoint, Jurnal kegiatan harian ber-GPS (tanpa thumbnail foto), Briefing Keselamatan (Safety Talk), dan Laporan Insiden K3.
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span className="badge badge-blue">Modul 4: Daily Log (CRUD)</span>
              <span className="badge badge-blue">Modul 5: Presensi QR (CRUD)</span>
              <span className="badge badge-amber">Modul 6: Insiden K3 (CRUD)</span>
            </div>
          </div>

          {/* Phase 3 */}
          <div style={{ padding: 16, borderRadius: 10, background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--primary-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>3</span>
              <h4 style={{ fontSize: "0.9rem", color: "var(--slate-900)" }}>FASE 3: POST-TRIP (Pelaporan)</h4>
            </div>
            <p style={{ fontSize: "0.775rem", color: "var(--slate-600)", marginBottom: 12 }}>
              Rekonsiliasi Cash Advance vs Nota Pengeluaran (+ Upload Bukti Kas Bon), Evaluasi Skor CSAT & Form Feedback Google Form Wisatawan, dan Kompilasi 9 Dokumen PDF.
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span className="badge badge-emerald">Modul 7: Settlement (+ Bukti Kas Bon)</span>
              <span className="badge badge-emerald">Modul 8: Google Form CSAT</span>
              <span className="badge badge-emerald">Modul 9: Bundel PDF (9 Dokumen)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
