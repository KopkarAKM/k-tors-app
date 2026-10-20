import React, { useState, useEffect } from "react";
import { X, Cloud, CheckCircle2, AlertCircle, RefreshCw, Database, Folder, ExternalLink, Copy, Check, Sparkles, ShieldCheck } from "lucide-react";
import { getSavedApiUrl, saveApiUrl, getLastSyncTime, initGoogleDatabase, syncTripToGoogleSheets } from "../services/googleSheetService";

export default function CloudSyncModal({ isOpen, onClose, trip, onSyncSuccess }) {
  const [apiUrl, setApiUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [lastSync, setLastSync] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiUrl(getSavedApiUrl());
      setLastSync(getLastSyncTime());
      setStatusMessage({ type: "", text: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    saveApiUrl(apiUrl);
    setStatusMessage({
      type: "success",
      text: "URL Google Apps Script Web App berhasil disimpan!"
    });
  };

  const handleInitDb = async () => {
    if (!apiUrl.trim()) {
      setStatusMessage({ type: "error", text: "Silakan masukkan Web App URL terlebih dahulu." });
      return;
    }
    saveApiUrl(apiUrl);
    setIsSaving(true);
    setStatusMessage({ type: "info", text: "Menginisialisasi 7 sheet database dan folder Google Drive..." });

    try {
      const res = await initGoogleDatabase(apiUrl);
      setIsSaving(false);
      setStatusMessage({
        type: "success",
        text: "Berhasil! 7 Sheet tabel database (1_TRIPS s/d 7_CSAT) dan folder 'K-TORS_Cloud_Storage' telah siap di akun Google Anda."
      });
    } catch (err) {
      setIsSaving(false);
      setStatusMessage({ type: "error", text: err.message });
    }
  };

  const handleSyncNow = async () => {
    if (!apiUrl.trim()) {
      setStatusMessage({ type: "error", text: "Silakan masukkan Web App URL terlebih dahulu." });
      return;
    }
    saveApiUrl(apiUrl);
    setIsSaving(true);
    setStatusMessage({ type: "info", text: "Mengunggah data manifes, ramp check, jurnal, nota keuangan, dan evaluasi ke Google Sheets..." });

    try {
      const res = await syncTripToGoogleSheets(trip, apiUrl);
      setIsSaving(false);
      setLastSync(res.syncedAt);
      setStatusMessage({
        type: "success",
        text: `Sukses! Seluruh data tur '${trip.title}' telah tersinkronisasi ke Google Spreadsheet!`
      });
      if (onSyncSuccess) onSyncSuccess();
    } catch (err) {
      setIsSaving(false);
      setStatusMessage({ type: "error", text: err.message });
    }
  };

  const copyAppsScriptSnippet = () => {
    navigator.clipboard.writeText("Buka file backend/Code.gs di project k-tors-app untuk menyalin seluruh skrip Google Apps Script.");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", color: "#fff", borderRadius: "16px 16px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Cloud size={20} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", color: "#fff", margin: 0 }}>Integrasi Google Sheets & Google Drive</h3>
              <p style={{ fontSize: "0.725rem", color: "var(--slate-300)", margin: 0 }}>Backend Serverless Database & Cloud Storage K-TORS</p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate-400)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Status Alert Banner */}
          {statusMessage.text && (
            <div style={{
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: statusMessage.type === "error" ? "var(--rose-50)" : statusMessage.type === "success" ? "var(--emerald-50)" : "var(--primary-50)",
              border: `1px solid ${statusMessage.type === "error" ? "#fecdd3" : statusMessage.type === "success" ? "#a7f3d0" : "#bfdbfe"}`,
              color: statusMessage.type === "error" ? "var(--rose-700)" : statusMessage.type === "success" ? "var(--emerald-700)" : "var(--primary-700)"
            }}>
              {statusMessage.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Configuration Input */}
          <div className="card" style={{ background: "var(--slate-50)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--slate-800)" }}>
                Google Apps Script Web App URL:
              </label>
              <a
                href="https://docs.google.com/spreadsheets/d/141rlz6RmJyPfa0UJMd9qw_XqZvRMsxdBWXOHAVjET2Y/edit?gid=0#gid=0"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: "0.725rem", color: "var(--primary-600)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}
              >
                <ExternalLink size={12} /> Buka Google Spreadsheet
              </a>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                className="input-field"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
              <button className="btn btn-secondary btn-sm" onClick={handleSaveUrl}>
                Simpan
              </button>
            </div>
            <p style={{ fontSize: "0.7rem", color: "var(--slate-500)", marginTop: 6, margin: "6px 0 0 0" }}>
              URL ini terhubung langsung ke Google Spreadsheet & Google Drive Anda.
            </p>
          </div>

          {/* 7 Sheets Database Architecture Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--slate-200)", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Database size={15} color="var(--emerald-600)" />
                <strong style={{ fontSize: "0.8rem", color: "var(--slate-900)" }}>7 Sheet Tabel Google</strong>
              </div>
              <ul style={{ fontSize: "0.7rem", color: "var(--slate-600)", paddingLeft: 18, margin: 0, lineHeight: 1.5 }}>
                <li>1_TRIPS (Master Tur)</li>
                <li>2_PASSENGERS (Manifes)</li>
                <li>3_RAMP_CHECK (K3 Bus)</li>
                <li>4_DAILY_LOGS (Jurnal GPS)</li>
                <li>5_INCIDENTS (Insiden)</li>
                <li>6_EXPENSES (Nota Kas)</li>
                <li>7_CSAT_EVALUATION</li>
              </ul>
            </div>

            <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--slate-200)", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Folder size={15} color="#0284c7" />
                <strong style={{ fontSize: "0.8rem", color: "var(--slate-900)" }}>Folder Cloud Drive</strong>
              </div>
              <ul style={{ fontSize: "0.7rem", color: "var(--slate-600)", paddingLeft: 18, margin: 0, lineHeight: 1.5 }}>
                <li>📁 1_Nota_Kuitansi/</li>
                <li>📁 2_Foto_Jurnal_GPS/</li>
                <li>📁 3_Dokumen_PDF_BNSP/</li>
                <li>Tersimpan otomatis per ID Tur</li>
                <li>Akses sharing berizin aman</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", borderTop: "1px solid var(--slate-200)", paddingTop: 14 }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              onClick={handleInitDb}
              disabled={isSaving}
            >
              <Database size={14} /> Inisialisasi 7 Sheet & Folder
            </button>

            <button
              className="btn btn-emerald btn-sm"
              style={{ flex: 1.5 }}
              onClick={handleSyncNow}
              disabled={isSaving}
            >
              {isSaving ? <RefreshCw size={14} className="spin" /> : <RefreshCw size={14} />}
              <span>{isSaving ? "Sedang Menyinkronkan..." : "Sinkronkan Data Tur Ini Sekarang"}</span>
            </button>
          </div>

          {/* Deployment Quick Guide Accordion */}
          <div style={{ background: "#f1f5f9", borderRadius: 8, padding: 12, fontSize: "0.725rem", color: "var(--slate-700)" }}>
            <strong style={{ display: "block", marginBottom: 4, color: "var(--slate-900)" }}>
              📖 3 Menit Pasang Google Backend:
            </strong>
            <ol style={{ paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
              <li>Buka <a href="https://sheets.new" target="_blank" rel="noreferrer" style={{ color: "var(--primary-600)", fontWeight: 700 }}>sheets.new</a> dan beri nama spreadsheet.</li>
              <li>Klik menu <strong>Extensions -&gt; Apps Script</strong>.</li>
              <li>Salin isi file <code>backend/Code.gs</code> dan tempel di editor Apps Script.</li>
              <li>Klik <strong>Deploy -&gt; New deployment -&gt; Web app</strong> (Access: Anyone) dan tempel URL ke form di atas.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
