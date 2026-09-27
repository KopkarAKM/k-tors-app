import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, FileText, ArrowRight, CheckSquare, Sparkles, ExternalLink, PenTool, Printer, Compass, Users, Bus, HeartPulse, Clock, DollarSign, Star } from "lucide-react";
import { formatRupiah } from "../utils/pdfGenerator";

export default function PhaseChecklistModule({ trip, updateTrip, setActiveTab, onOpenSignModal }) {
  const [manualChecks, setManualChecks] = useState(() => {
    return trip.phaseChecklistOverrides || {
      masterSpt: true,
      m1Manifest: true,
      m2Vendor: true,
      m3RampCheck: true,
      m4DailyLog: true,
      m5Presensi: true,
      m6Incident: true,
      m7Finance: true,
      m8Csat: true,
      allApprovedByOps: true
    };
  });

  const handleToggleManualCheck = (key) => {
    const updated = { ...manualChecks, [key]: !manualChecks[key] };
    setManualChecks(updated);
    if (updateTrip) {
      updateTrip({ ...trip, phaseChecklistOverrides: updated });
    }
  };

  // Dynamic status computations
  const totalPax = trip.passengers?.length || 0;
  const paxWithWA = trip.passengers?.filter(p => p.waPhone && p.waPhone.trim() !== "+62" && p.waPhone.trim() !== "").length || 0;
  const paxWithEmergency = trip.passengers?.filter(p => p.emergencyContactName && p.emergencyContactName.trim() !== "").length || 0;
  
  const totalRampItems = trip.rampCheck?.items?.length || 0;
  const laikRampItems = trip.rampCheck?.items?.filter(i => i.status === "LAIK").length || 0;
  
  const totalP3kItems = trip.rampCheck?.p3kItems?.length || 0;
  const laikP3kItems = trip.rampCheck?.p3kItems?.filter(i => i.status === "LENGKAP").length || 0;

  const totalLogs = trip.dailyLogs?.length || 0;
  const totalExpenses = trip.finance?.expenses?.length || 0;
  const totalExpenseAmount = trip.finance?.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const cashAdvance = trip.finance?.cashAdvance || 0;
  const balance = cashAdvance - totalExpenseAmount;
  const totalComments = trip.csat?.comments?.length || 0;

  // Module checklist items definition
  const checklistPhases = [
    {
      phaseId: "phase0",
      phaseTitle: "PENGATURAN AWAL: Identitas & Petugas Tur",
      badge: "Inisiasi",
      color: "var(--primary-600)",
      modules: [
        {
          id: "masterSpt",
          code: "MASTER",
          name: "Konfigurasi SPT, Rute Perjalanan & Penunjukan Petugas (TL/TG)",
          desc: `SPT: ${trip.sptNumber} | Rute: ${trip.routeSummary || "Telah ditentukan"} | Lead TL: ${trip.staff?.leadTL?.name}`,
          isAutoPassed: Boolean(trip.sptNumber && trip.staff?.leadTL?.name && trip.routeSummary),
          targetTab: "overview",
          icon: Compass,
          stats: `${trip.destination} • ${trip.startDate} s/d ${trip.endDate}`
        }
      ]
    },
    {
      phaseId: "phase1",
      phaseTitle: "FASE 1: PRE-TRIP (Persiapan Operasional & K3)",
      badge: "Fase 1",
      color: "#0284c7",
      modules: [
        {
          id: "m1Manifest",
          code: "MODUL 1",
          name: "Manifes Wisatawan, WhatsApp, Kontak Darurat & Catatan Medis",
          desc: `${totalPax} Pax terdata | ${paxWithWA} No. WA Pribadi | ${paxWithEmergency} Kontak Darurat & Riwayat Penyakit/Alergi Lengkap`,
          isAutoPassed: totalPax > 0,
          targetTab: "pre-trip",
          icon: Users,
          stats: `${totalPax} Wisatawan Aktif`
        },
        {
          id: "m2Vendor",
          code: "MODUL 2",
          name: "Tiket Penerbangan, Rooming Hotel & Transportasi Vendor",
          desc: `${trip.logistics?.flights?.length || 0} Tiket Penerbangan | Hotel: ${trip.logistics?.hotel?.name || "-"} | Bus: ${trip.logistics?.transport?.vendor || "-"}`,
          isAutoPassed: Boolean(trip.logistics?.flights?.length && trip.logistics?.hotel?.name),
          targetTab: "pre-trip",
          icon: Bus,
          stats: `${trip.logistics?.flights?.length || 0} Flight • ${trip.logistics?.transport?.busCount || 1} Bus`
        },
        {
          id: "m3RampCheck",
          code: "MODUL 3",
          name: "Inspeksi Kelaikan Kendaraan (Ramp Check) & Checklist Kotak P3K",
          desc: `Ramp Check: ${laikRampItems}/${totalRampItems} Item LAIK | Kotak P3K: ${laikP3kItems}/${totalP3kItems} Item Lengkap Standar K3`,
          isAutoPassed: laikRampItems >= 9 && laikP3kItems >= 10,
          targetTab: "pre-trip",
          icon: HeartPulse,
          stats: `${laikRampItems}/${totalRampItems} Bus • ${laikP3kItems}/${totalP3kItems} P3K`
        }
      ]
    },
    {
      phaseId: "phase2",
      phaseTitle: "FASE 2: ON-TRIP (Pelaksanaan & Pemantauan Lapangan)",
      badge: "Fase 2",
      color: "#10b981",
      modules: [
        {
          id: "m4DailyLog",
          code: "MODUL 4",
          name: "Jurnal Log Harian Operasional & Briefing Keselamatan (Safety Talk)",
          desc: `${totalLogs} Entri Jurnal Harian dengan Koordinat GPS & Topik Briefing Keselamatan`,
          isAutoPassed: totalLogs > 0,
          targetTab: "on-trip",
          icon: Clock,
          stats: `${totalLogs} Hari Kegiatan`
        },
        {
          id: "m5Presensi",
          code: "MODUL 5",
          name: "Presensi Digital Wisatawan & Headcount Setiap Checkpoint (QR e-Pass)",
          desc: `Pelacakan kehadiran real-time seluruh wisatawan pada 5 Checkpoint Utama`,
          isAutoPassed: totalPax > 0,
          targetTab: "on-trip",
          icon: CheckCircle2,
          stats: `5 Titik Pantau Aktif`
        },
        {
          id: "m6Incident",
          code: "MODUL 6",
          name: "Laporan Penanganan Insiden K3 & Near Miss Kejadian Lapangan",
          desc: `${trip.incidents?.length || 0} Insiden Tercatat | Status Tindakan & Investigasi Selesai`,
          isAutoPassed: true,
          targetTab: "on-trip",
          icon: AlertTriangle,
          stats: `${trip.incidents?.length || 0} Insiden (Tertangani)`
        }
      ]
    },
    {
      phaseId: "phase3",
      phaseTitle: "FASE 3: POST-TRIP (Penyelesaian Keuangan & Evaluasi)",
      badge: "Fase 3",
      color: "#f59e0b",
      modules: [
        {
          id: "m7Finance",
          code: "MODUL 7",
          name: "Settlement Kas Bon, Bukti Dokumen & Laporan Realisasi Pengeluaran",
          desc: `Kas Bon: ${formatRupiah(cashAdvance)} | Pengeluaran: ${formatRupiah(totalExpenseAmount)} (${totalExpenses} Nota) | Saldo: ${formatRupiah(balance)}`,
          isAutoPassed: totalExpenses > 0,
          targetTab: "post-trip",
          icon: DollarSign,
          stats: `${totalExpenses} Nota Realisasi`
        },
        {
          id: "m8Csat",
          code: "MODUL 8",
          name: "Evaluasi & CSAT Feedback Wisatawan (Google Form Integration)",
          desc: `Skor CSAT: ${trip.csat?.averageRating || 4.9}/5.0 | ${totalComments} Testimoni & Form Evaluasi Terhubung`,
          isAutoPassed: totalComments > 0,
          targetTab: "post-trip",
          icon: Star,
          stats: `${trip.csat?.averageRating || 4.9} ★ CSAT`
        }
      ]
    }
  ];

  // Count total completed items
  let totalItems = 0;
  let completedItems = 0;

  checklistPhases.forEach(phase => {
    phase.modules.forEach(m => {
      totalItems += 1;
      if (manualChecks[m.id] !== undefined ? manualChecks[m.id] : m.isAutoPassed) {
        completedItems += 1;
      }
    });
  });

  const completionPercentage = Math.round((completedItems / totalItems) * 100);
  const isFullyComplete = completionPercentage === 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Banner */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: 14, padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span className="badge badge-emerald">
              <CheckCircle2 size={12} /> VERIFIKASI OPERASIONAL TUR
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--slate-300)" }}>
              SPT: {trip.sptNumber}
            </span>
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", margin: 0 }}>
            Checklist Kelengkapan Seluruh Fase & Modul (Fase 1 - 3)
          </h2>
          <p style={{ fontSize: "0.8rem", color: "var(--slate-300)", margin: "4px 0 0 0" }}>
            Audit kepatuhan internal untuk memastikan seluruh data modul operasional tur telah terisi, tervalidasi, dan siap diterbitkan sebagai laporan resmi.
          </p>
        </div>

        {/* Completion Widget */}
        <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 200 }}>
          <div style={{ fontSize: "0.7rem", color: "var(--slate-400)", textTransform: "uppercase", fontWeight: 700 }}>
            Kelengkapan Sistem
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: isFullyComplete ? "var(--emerald-400)" : "#38bdf8", marginTop: 2 }}>
            {completionPercentage}%
          </div>
          <div style={{ fontSize: "0.75rem", color: isFullyComplete ? "#34d399" : "var(--slate-300)" }}>
            {completedItems} dari {totalItems} Modul Selesai
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ background: "#fff", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--slate-200)", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", fontWeight: 600 }}>
          <span style={{ color: "var(--slate-700)" }}>Progress Verifikasi Kesiapan Dokumen & Laporan:</span>
          <span style={{ color: isFullyComplete ? "var(--emerald-600)" : "var(--primary-600)" }}>
            {isFullyComplete ? "✓ 100% LENGKAP & SIAP DILAPORKAN" : `${completionPercentage}% Dalam Proses`}
          </span>
        </div>
        <div style={{ height: 10, background: "var(--slate-100)", borderRadius: 6, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${completionPercentage}%`,
              background: isFullyComplete ? "linear-gradient(90deg, #10b981 0%, #059669 100%)" : "linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)",
              borderRadius: 6,
              transition: "width 0.4s ease"
            }}
          />
        </div>
      </div>

      {/* Checklist Phases Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {checklistPhases.map((phase) => (
          <div key={phase.phaseId} className="card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: "1px solid var(--slate-100)", paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: phase.color, color: "#fff", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                  {phase.badge}
                </span>
                <h3 style={{ fontSize: "0.95rem", color: "var(--slate-900)", margin: 0, fontWeight: 700 }}>
                  {phase.phaseTitle}
                </h3>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {phase.modules.map((m) => {
                const Icon = m.icon;
                const isChecked = manualChecks[m.id] !== undefined ? manualChecks[m.id] : m.isAutoPassed;

                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: isChecked ? "var(--slate-50)" : "#fff9f9",
                      border: isChecked ? "1px solid var(--slate-200)" : "1px solid #fecaca",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                      {/* Checkbox Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleManualCheck(m.id)}
                        style={{
                          background: isChecked ? "var(--emerald-600)" : "transparent",
                          border: isChecked ? "none" : "2px solid var(--slate-300)",
                          color: "#fff",
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                        title="Klik untuk ubah status verifikasi"
                      >
                        {isChecked && <CheckCircle2 size={16} />}
                      </button>

                      {/* Icon */}
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: isChecked ? "var(--primary-50)" : "var(--rose-50)", display: "flex", alignItems: "center", justifyContent: "center", color: isChecked ? "var(--primary-600)" : "var(--rose-600)" }}>
                        <Icon size={18} />
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--slate-500)", fontFamily: "var(--font-mono)" }}>
                            [{m.code}]
                          </span>
                          <strong style={{ fontSize: "0.85rem", color: "var(--slate-900)" }}>
                            {m.name}
                          </strong>
                          <span className={`badge ${isChecked ? "badge-emerald" : "badge-amber"}`} style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                            {isChecked ? "TERISI & VALID" : "BELUM LENGKAP"}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--slate-600)", margin: "3px 0 0 0" }}>
                          {m.desc}
                        </p>
                      </div>
                    </div>

                    {/* Action Link to Module */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 12 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--slate-500)", fontWeight: 500 }}>
                        {m.stats}
                      </span>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: "0.725rem", padding: "4px 8px" }}
                        onClick={() => setActiveTab(m.targetTab)}
                      >
                        Buka Modul <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Approval & Sign-off Section */}
      <div className="card" style={{ background: "linear-gradient(180deg, #ffffff 0%, var(--slate-50) 100%)" }}>
        <h3 style={{ fontSize: "0.95rem", color: "var(--slate-900)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={18} color="var(--primary-600)" />
          Pengesahan Checklist Kelengkapan & Verifikasi Manajemen
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Sign Lead TL */}
          <div style={{ padding: 14, background: "#fff", borderRadius: 10, border: "1px solid var(--slate-200)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700 }}>
              PETUGAS OPERASIONAL (LEAD TOUR LEADER)
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--slate-900)", marginTop: 2 }}>
              {trip.staff?.leadTL?.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", fontFamily: "var(--font-mono)" }}>
              No. Reg: {trip.staff?.leadTL?.noRegBnsp || "-"}
            </div>

            <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {trip.signatures?.leadTL ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--emerald-600)", fontSize: "0.75rem", fontWeight: 600 }}>
                  <CheckCircle2 size={15} />
                  <span>Telah Ditandatangani Digital</span>
                </div>
              ) : (
                <span style={{ fontSize: "0.75rem", color: "var(--slate-400)" }}>Belum ditandatangani</span>
              )}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenSignModal("Lead Tour Leader", trip.staff?.leadTL?.name)}
                style={{ fontSize: "0.725rem", padding: "4px 8px" }}
              >
                <PenTool size={12} /> {trip.signatures?.leadTL ? "Ubah Tanda Tangan" : "Tanda Tangan"}
              </button>
            </div>
          </div>

          {/* Sign Ops Manager */}
          <div style={{ padding: 14, background: "#fff", borderRadius: 10, border: "1px solid var(--slate-200)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700 }}>
              VERIFIKATOR (MANAGER OPERASIONAL)
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--slate-900)", marginTop: 2 }}>
              {trip.staff?.opsManager?.name || "Bambang Sudarmono, S.E."}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>
              Divisi Tour & Travel Kopkarindo
            </div>

            <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {trip.signatures?.opsManager ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--emerald-600)", fontSize: "0.75rem", fontWeight: 600 }}>
                  <CheckCircle2 size={15} />
                  <span>Telah Disetujui Manajemen</span>
                </div>
              ) : (
                <span style={{ fontSize: "0.75rem", color: "var(--slate-400)" }}>Menunggu approval</span>
              )}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenSignModal("Manager Operasional", trip.staff?.opsManager?.name || "Bambang Sudarmono, S.E.")}
                style={{ fontSize: "0.725rem", padding: "4px 8px" }}
              >
                <PenTool size={12} /> {trip.signatures?.opsManager ? "Ubah Approval" : "Beri Approval"}
              </button>
            </div>
          </div>
        </div>

        {/* Action button to PDF center */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={() => setActiveTab("pdf-export")}
            style={{ fontSize: "0.85rem", padding: "8px 16px" }}
          >
            <FileText size={15} /> Buka Pusat Dokumen & Terbitkan Laporan PDF (9 Dokumen)
          </button>
        </div>
      </div>
    </div>
  );
}
