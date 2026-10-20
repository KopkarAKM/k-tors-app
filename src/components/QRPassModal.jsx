import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Printer, ShieldCheck, AlertCircle, Phone, BedDouble, User } from "lucide-react";

export default function QRPassModal({ isOpen, onClose, passenger, tripTitle, sptNumber }) {
  if (!isOpen || !passenger) return null;

  const qrPayload = JSON.stringify({
    paxId: passenger.id,
    name: passenger.name,
    docNo: passenger.docNo,
    spt: sptNumber,
    room: passenger.roomNo,
    mdac: passenger.mdacStatus
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 440, background: "#ffffff" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--slate-900)", color: "#fff", borderRadius: "16px 16px 0 0" }}>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--primary-200)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>K-TORS SMART e-PASS</span>
            <h3 style={{ fontSize: "0.95rem", color: "#fff", margin: 0 }}>Boarding & Attendance Pass</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate-400)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Boarding Pass Body */}
        <div style={{ padding: "20px" }}>
          <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", borderRadius: 14, padding: 20, color: "#fff", boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.3)", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span className="badge badge-emerald" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                  <ShieldCheck size={12} /> {passenger.mdacStatus} PASS
                </span>
                <h2 style={{ fontSize: "1.2rem", color: "#fff", marginTop: 6, marginBottom: 2 }}>{passenger.name}</h2>
                <p style={{ fontSize: "0.75rem", color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>
                  {passenger.docType}: {passenger.docNo} (Exp: {passenger.expiryDate})
                </p>
              </div>

              <div style={{ background: "#ffffff", padding: 8, borderRadius: 8 }}>
                <QRCodeSVG value={qrPayload} size={84} level="M" />
              </div>
            </div>

            {/* Grid details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: "rgba(255,255,255,0.06)", padding: 12, borderRadius: 10, fontSize: "0.75rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div>
                <span style={{ color: "var(--slate-400)", display: "block", fontSize: "0.65rem" }}>ID PESERTA</span>
                <strong style={{ color: "#fff", fontFamily: "var(--font-mono)" }}>{passenger.id}</strong>
              </div>
              <div>
                <span style={{ color: "var(--slate-400)", display: "block", fontSize: "0.65rem" }}>SEAT NUMBER</span>
                <strong style={{ color: "#38bdf8" }}>{passenger.seatNo}</strong>
              </div>
              <div>
                <span style={{ color: "var(--slate-400)", display: "block", fontSize: "0.65rem" }}>KAMAR HOTEL</span>
                <strong style={{ color: "#fff" }}>{passenger.roomNo}</strong>
              </div>
              <div>
                <span style={{ color: "var(--slate-400)", display: "block", fontSize: "0.65rem" }}>NO. TELEPON</span>
                <strong style={{ color: "#fff" }}>{passenger.phone}</strong>
              </div>
            </div>

            {passenger.allergy && passenger.allergy !== "Tidak Ada" && (
              <div style={{ marginTop: 12, background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#fca5a5" }}>
                <AlertCircle size={14} />
                <span><strong>Catatan Medis/Alergi:</strong> {passenger.allergy}</span>
              </div>
            )}

            <div style={{ marginTop: 12, borderTop: "1px dashed rgba(255,255,255,0.2)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.65rem", color: "var(--slate-400)" }}>
              <span>{tripTitle}</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>{sptNumber}</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>
              Scan QR ini saat check-in bandara & headcount bus
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={14} /> Cetak e-Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
