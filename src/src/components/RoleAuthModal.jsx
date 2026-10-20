import React, { useState } from "react";
import { Lock, KeyRound, ShieldCheck, CheckCircle2, AlertCircle, X, Eye, EyeOff, Compass, Users, Briefcase } from "lucide-react";

export const DEFAULT_ROLE_PASSWORDS = {
  tourLeader: "TL2026",
  manager: "MGR2026"
};

export default function RoleAuthModal({ isOpen, onClose, targetRole, onAuthenticate, currentRole }) {
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const roleDetails = {
    tourLeader: {
      name: "Tour Leader / Tour Guide",
      subtitle: "Petugas Lapangan & Frontline Wisata",
      badge: "Lapangan",
      color: "var(--primary-600)",
      icon: Compass,
      desc: "Wewenang: Manifes data wisatawan, ramp check bus & P3K, presensi QR e-Pass, jurnal kegiatan GPS, penanganan insiden K3, nota kas lapangan, dan sebar link CSAT."
    },
    manager: {
      name: "Manager Operasional",
      subtitle: "Kantor Pusat, Logistik & Approval",
      badge: "Pusat & Approval",
      color: "#6366f1",
      icon: Briefcase,
      desc: "Wewenang: Pengaturan SPT & Rute Perjalanan, pencairan dana kas bon, konfirmasi tiket/hotel/bus, verifikasi checklist kelengkapan modul, dan approval akhir laporan resmi."
    }
  };

  const targetRoleInfo = roleDetails[targetRole] || roleDetails.tourLeader;
  const Icon = targetRoleInfo.icon;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Retrieve stored passwords or use defaults
    const storedPasswords = JSON.parse(localStorage.getItem("K_TORS_ROLE_PASSWORDS") || JSON.stringify(DEFAULT_ROLE_PASSWORDS));
    const correctPassword = storedPasswords[targetRole] || DEFAULT_ROLE_PASSWORDS[targetRole];

    if (passwordInput.trim() === correctPassword) {
      setErrorMsg("");
      setPasswordInput("");
      onAuthenticate(targetRole);
      onClose();
    } else {
      setErrorMsg("Password PIN salah! Silakan periksa kembali kata sandi peran Anda.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#fff", borderRadius: "16px 16px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: targetRoleInfo.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", color: "#fff", margin: 0 }}>Autentikasi Akses Peran</h3>
              <p style={{ fontSize: "0.725rem", color: "var(--slate-300)", margin: 0 }}>Perlindungan Keamanan Akses K-TORS</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate-400)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Target Role Card */}
          <div style={{ padding: 14, borderRadius: 10, background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "#fff", border: "1px solid var(--slate-200)", display: "flex", alignItems: "center", justifyContent: "center", color: targetRoleInfo.color }}>
                <Icon size={22} />
              </div>
              <div>
                <span style={{ fontSize: "0.65rem", background: "rgba(37,99,235,0.1)", color: targetRoleInfo.color, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                  {targetRoleInfo.badge}
                </span>
                <h4 style={{ fontSize: "0.95rem", color: "var(--slate-900)", margin: "2px 0 0 0" }}>
                  {targetRoleInfo.name}
                </h4>
                <p style={{ fontSize: "0.725rem", color: "var(--slate-500)", margin: 0 }}>
                  {targetRoleInfo.subtitle}
                </p>
              </div>
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--slate-600)", marginTop: 10, lineHeight: 1.4, borderTop: "1px dashed var(--slate-200)", paddingTop: 8 }}>
              {targetRoleInfo.desc}
            </p>
          </div>

          {/* Password Input */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--slate-700)", display: "block", marginBottom: 6 }}>
              Masukkan Password / PIN Akses {targetRoleInfo.name}:
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                autoFocus
                required
                className="input-field"
                placeholder={`Masukkan password ${targetRoleInfo.name}`}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setErrorMsg("");
                }}
                style={{ paddingRight: 40, fontSize: "0.9rem", letterSpacing: showPassword ? "normal" : "0.1em" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--slate-400)" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errorMsg && (
              <p style={{ fontSize: "0.75rem", color: "var(--rose-600)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <AlertCircle size={13} /> {errorMsg}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, borderTop: "1px solid var(--slate-200)", paddingTop: 14 }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <KeyRound size={14} /> Buka Kunci Akses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
