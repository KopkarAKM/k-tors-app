import React from "react";
import { X, Printer, Download, FileText, CheckCircle2 } from "lucide-react";

export default function DocumentPreviewModal({ isOpen, onClose, docTitle, docSubtitle, docContent, onDownload }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 780, maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--slate-900)", color: "#fff", borderRadius: "16px 16px 0 0" }}>
          <div>
            <span style={{ fontSize: "0.7rem", color: "#38bdf8", textTransform: "uppercase", fontWeight: 700 }}>PRATINJAU DOKUMEN RESMI</span>
            <h3 style={{ fontSize: "1.05rem", color: "#fff", margin: "2px 0 0 0" }}>{docTitle}</h3>
            {docSubtitle && <p style={{ fontSize: "0.75rem", color: "var(--slate-400)", margin: 0 }}>{docSubtitle}</p>}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="btn btn-emerald btn-sm" onClick={onDownload}>
              <Download size={14} /> Unduh PDF
            </button>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate-400)", marginLeft: 8 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div style={{ padding: 24, background: "#f8fafc", overflowY: "auto", maxHeight: "calc(90vh - 80px)" }}>
          <div style={{ background: "#fff", border: "1px solid var(--slate-200)", borderRadius: 10, padding: 24, boxShadow: "var(--shadow-md)" }}>
            {/* Letterhead */}
            <div style={{ borderBottom: "2px solid var(--slate-900)", paddingBottom: 14, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--slate-900)", margin: 0 }}>KOPKARINDO TRAVEL INDONESIA</h2>
                <p style={{ fontSize: "0.75rem", color: "var(--slate-600)", margin: "2px 0 0 0" }}>
                  Divisi Operasional & Sertifikasi BNSP • Kopkarindo Tower Jakarta Pusat
                </p>
              </div>
              <span className="badge badge-emerald">DOKUMEN RESMI TERVERIFIKASI</span>
            </div>

            {/* Render Custom Preview Content */}
            <div style={{ fontSize: "0.85rem", color: "var(--slate-800)", lineHeight: 1.6 }}>
              {docContent}
            </div>

            {/* Official Stamp Footer */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px dashed var(--slate-300)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.725rem", color: "var(--slate-500)" }}>
              <span>Diterbitkan melalui Platform K-TORS (Kopkarindo Digital Tour Operations)</span>
              <span>Standar BNSP No. 038/PAR/2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
