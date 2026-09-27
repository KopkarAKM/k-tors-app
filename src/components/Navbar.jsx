import React from "react";
import { Compass, ShieldCheck, Wifi, WifiOff, Users, Award, FileText, CheckCircle2, ChevronDown, Sparkles, Settings, ListChecks, Lock, KeyRound, Briefcase, Smartphone } from "lucide-react";

export const USER_ROLES = [
  { id: "tourLeader", name: "Tour Leader / Tour Guide (TL)", badge: "Petugas Lapangan", color: "var(--primary-600)", icon: Compass },
  { id: "manager", name: "Manager Operasional", badge: "Kantor & Approval", color: "#6366f1", icon: Briefcase }
];

export default function Navbar({ activeTab, setActiveTab, currentRole, onRequestSwitchRole, isOffline, setIsOffline, syncCount, onOpenCloudSync, onOpenTripMaster, onToggleViewMode }) {
  const currentRoleObj = USER_ROLES.find(r => r.id === currentRole) || USER_ROLES[0];
  const IconRole = currentRoleObj.icon || Users;

  return (
    <header style={{ background: "var(--slate-900)", color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
      {/* Top Bar */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        {/* Brand & System Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37,99,235,0.4)" }}>
            <Compass size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", margin: 0 }}>
                K-TORS
              </h1>
              <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)", fontSize: "0.65rem", padding: "2px 6px", borderRadius: 4, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                KOPKARINDO 2026
              </span>
            </div>
            <p style={{ fontSize: "0.7rem", color: "var(--slate-400)", margin: 0 }}>
              Digital Tour Operations & Reporting System • Akses Terproteksi Password (TL & Manager)
            </p>
          </div>
        </div>

        {/* Action Controls: Master Trip Config, Cloud Backend, Offline Switcher & Role Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Master Trip Config Trigger */}
          <button
            onClick={onOpenTripMaster}
            className="btn btn-sm btn-primary"
            style={{ fontSize: "0.75rem", padding: "5px 10px" }}
            title="Atur Tour Leader, Rute Perjalanan, SPT, dan Informasi Penting"
          >
            <Settings size={13} />
            <span>Pengaturan & Rute Tur</span>
          </button>

          {/* Switch to Mobile View */}
          <button
            onClick={onToggleViewMode}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: "0.75rem", padding: "5px 10px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.4)" }}
            title="Buka Tampilan Khusus Ponsel / Smartphone yang Ringkas & Cepat"
          >
            <Smartphone size={13} color="#38bdf8" />
            <span>Tampilan Ponsel</span>
          </button>

          {/* Google Sheets & Drive Cloud Backend Trigger */}
          <button
            onClick={onOpenCloudSync}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: "0.75rem", padding: "5px 10px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", borderColor: "rgba(16, 185, 129, 0.4)" }}
            title="Integrasi Google Sheets Database & Google Drive Cloud Storage"
          >
            <Sparkles size={13} color="#34d399" />
            <span>Google Sheet & Drive</span>
          </button>

          {/* Offline-First Capability Simulator */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`btn btn-sm ${isOffline ? "btn-danger" : "btn-secondary"}`}
            style={{ fontSize: "0.75rem", padding: "5px 10px", background: isOffline ? "#450a0a" : "rgba(255,255,255,0.08)", color: isOffline ? "#fca5a5" : "#cbd5e1", borderColor: isOffline ? "#ef4444" : "rgba(255,255,255,0.15)" }}
            title="Simulasi Operasional Luar Jangkauan / Offline di Lapangan"
          >
            {isOffline ? (
              <>
                <WifiOff size={14} color="#f87171" />
                <span>OFFLINE (Tersimpan Lokal: {syncCount})</span>
              </>
            ) : (
              <>
                <Wifi size={14} color="#34d399" />
                <span>ONLINE (Auto-Sync)</span>
              </>
            )}
          </button>

          {/* Role Switcher with Password Protection Lock */}
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: "2px 8px", gap: 6 }}>
            <IconRole size={14} color={currentRoleObj.color === "#6366f1" ? "#a5b4fc" : "#38bdf8"} />
            
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase" }}>Peran Aktif:</span>
                <span style={{ fontSize: "0.6rem", background: currentRole === "manager" ? "rgba(99, 102, 241, 0.3)" : "rgba(37, 99, 235, 0.3)", color: currentRole === "manager" ? "#c7d2fe" : "#bae6fd", padding: "1px 4px", borderRadius: 3, fontWeight: 700 }}>
                  <Lock size={9} style={{ display: "inline", marginRight: 2 }} />
                  {currentRoleObj.badge}
                </span>
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
                {currentRoleObj.name}
              </span>
            </div>

            <button
              onClick={() => onRequestSwitchRole(currentRole === "manager" ? "tourLeader" : "manager")}
              className="btn btn-sm btn-secondary"
              style={{ padding: "3px 8px", fontSize: "0.68rem", marginLeft: 4, background: "rgba(255,255,255,0.12)", color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}
              title="Ganti ke peran lain dengan memasukkan Password/PIN"
            >
              <KeyRound size={11} /> Ganti Peran
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav style={{ background: "rgba(15, 23, 42, 0.95)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px", display: "flex", gap: 4, overflowX: "auto" }}>
          {[
            { id: "overview", label: "Ringkasan Eksekutif", icon: Compass },
            { id: "pre-trip", label: "Fase 1: Pre-Trip (Persiapan & K3)", icon: ShieldCheck },
            { id: "on-trip", label: "Fase 2: On-Trip (Pelaksanaan & Presensi)", icon: Users },
            { id: "post-trip", label: "Fase 3: Post-Trip (Keuangan & Evaluasi)", icon: FileText },
            { id: "checklist", label: "Checklist Kelengkapan Tur (Fase 1 - 3)", icon: ListChecks, highlight: true },
            { id: "pdf-export", label: "Pusat Dokumen PDF (9 Dokumen)", icon: FileText, highlight: true },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? "rgba(37, 99, 235, 0.2)" : "transparent",
                  border: "none",
                  borderBottom: isActive ? "2px solid #38bdf8" : "2px solid transparent",
                  color: isActive ? "#38bdf8" : tab.highlight ? "#cbd5e1" : "#94a3b8",
                  padding: "12px 14px",
                  fontSize: "0.8rem",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  fontFamily: "inherit"
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.highlight && tab.id === "checklist" && (
                  <span style={{ fontSize: "0.6rem", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>
                    VERIFIKASI
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
