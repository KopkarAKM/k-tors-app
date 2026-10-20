import React, { useState } from "react";
import { X, QrCode, Camera, CheckCircle2, UserCheck, AlertTriangle } from "lucide-react";

export default function QRScannerModal({ isOpen, onClose, passengers, onMarkAttendance, activeCheckpoint }) {
  const [scannedPax, setScannedPax] = useState(null);
  const [manualId, setManualId] = useState("");
  const [scanMessage, setScanMessage] = useState("");

  if (!isOpen) return null;

  const handleSimulateScan = (pax) => {
    onMarkAttendance(pax.id, activeCheckpoint);
    setScannedPax(pax);
    setScanMessage(`Presensi Terverifikasi untuk ${pax.name} (${pax.id}) di ${activeCheckpoint}!`);
    setTimeout(() => {
      setScanMessage("");
    }, 3000);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const found = passengers.find(p => p.id.toLowerCase() === manualId.trim().toLowerCase() || p.docNo.toLowerCase() === manualId.trim().toLowerCase());
    if (found) {
      handleSimulateScan(found);
      setManualId("");
    } else {
      setScanMessage("Peserta tidak ditemukan dalam manifes!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--slate-900)", color: "#fff", borderRadius: "16px 16px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Camera size={18} color="#38bdf8" />
            <div>
              <h3 style={{ fontSize: "0.95rem", color: "#fff", margin: 0 }}>Pemindai QR e-Pass Lapangan</h3>
              <p style={{ fontSize: "0.7rem", color: "var(--slate-400)", margin: 0 }}>Checkpoint Aktif: <strong>{activeCheckpoint}</strong></p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate-400)" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {/* Scanner Viewport Animation */}
          <div style={{ position: "relative", width: "100%", height: 220, background: "#020617", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", border: "2px solid #334155" }}>
            {/* Camera Viewport Guides */}
            <div style={{ position: "absolute", width: 140, height: 140, border: "2px solid #38bdf8", borderRadius: 12, boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)" }}>
              <div style={{ position: "absolute", width: "100%", height: 2, background: "#38bdf8", top: "50%", boxShadow: "0 0 8px #38bdf8", animation: "scannerScan 2s infinite ease-in-out" }} />
            </div>

            <QrCode size={48} style={{ opacity: 0.3, marginBottom: 8 }} />
            <span style={{ fontSize: "0.75rem", color: "var(--slate-400)", zIndex: 2 }}>Arahkan Kamera ke QR Code e-Pass Wisatawan</span>
            
            <style>{`
              @keyframes scannerScan {
                0% { top: 10%; opacity: 0.8; }
                50% { top: 90%; opacity: 1; }
                100% { top: 10%; opacity: 0.8; }
              }
            `}</style>
          </div>

          {/* Success Message Banner */}
          {scanMessage && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: scanMessage.includes("tidak") ? "var(--rose-50)" : "var(--emerald-50)", border: `1px solid ${scanMessage.includes("tidak") ? "#fecdd3" : "#a7f3d0"}`, color: scanMessage.includes("tidak") ? "var(--rose-700)" : "var(--emerald-700)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 8 }}>
              {scanMessage.includes("tidak") ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              <span>{scanMessage}</span>
            </div>
          )}

          {/* Manual Input Search */}
          <form onSubmit={handleManualSubmit} style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Ketik ID Pax (cth: PAX-001) atau No Paspor..."
              className="input-field"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <UserCheck size={14} /> Presensi
            </button>
          </form>

          {/* Quick Simulate Buttons */}
          <div style={{ marginTop: 16 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--slate-600)", display: "block", marginBottom: 8 }}>
              Simulasi Cepat Tap Wisatawan:
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 120, overflowY: "auto" }}>
              {passengers.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSimulateScan(p)}
                  className={`btn btn-sm ${p.attendance[activeCheckpoint] ? "btn-emerald" : "btn-secondary"}`}
                  style={{ fontSize: "0.72rem", padding: "4px 8px" }}
                >
                  {p.id}: {p.name.split(" ")[0]} {p.attendance[activeCheckpoint] ? "✓" : ""}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
