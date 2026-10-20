import React, { useState, useEffect } from "react";
import { X, Settings, MapPin, Calendar, Users, FileText, CheckCircle2, ShieldCheck, Compass, DollarSign } from "lucide-react";

export default function TripMasterModal({ isOpen, onClose, trip, onSaveTrip }) {
  const [formData, setFormData] = useState({ ...trip });

  useEffect(() => {
    if (isOpen && trip) {
      setFormData({ ...trip });
    }
  }, [isOpen, trip]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveTrip(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#fff", borderRadius: "16px 16px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--primary-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Settings size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", color: "#fff", margin: 0 }}>Pengaturan Utama & Petugas Tur</h3>
              <p style={{ fontSize: "0.725rem", color: "var(--slate-300)", margin: 0 }}>Atur Tour Leader, Rute Perjalanan, SPT, dan Informasi Penting</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate-400)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Section 1: Trip Identity */}
          <div style={{ background: "var(--slate-50)", padding: 14, borderRadius: 10, border: "1px solid var(--slate-200)" }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--slate-900)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Compass size={15} color="var(--primary-600)" />
              1. Identitas Perjalanan & Surat Tugas (SPT)
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nomor SPT Resmi:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.sptNumber}
                  onChange={(e) => setFormData({ ...formData, sptNumber: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Tipe Perjalanan:</label>
                <select
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Internasional">Internasional (Outbound)</option>
                  <option value="Domestik">Domestik (Wisata Nusantara)</option>
                  <option value="Umrah">Umrah & Wisata Halal</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Judul / Nama Event Perjalanan Tur:</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Destinasi Utama:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Tanggal Mulai:</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Tanggal Selesai:</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Rute Perjalanan (Itinerary Route Summary):</label>
              <textarea
                rows={2}
                required
                className="input-field"
                placeholder="Rute perjalanan detail, cth: Jakarta -> KLIA -> Genting -> Singapore -> Changi"
                value={formData.routeSummary || ""}
                onChange={(e) => setFormData({ ...formData, routeSummary: e.target.value })}
              />
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Informasi Penting & Catatan Operasional Tur:</label>
              <textarea
                rows={2}
                className="input-field"
                placeholder="Ketentuan bagasi, paspor, briefing khusus, dress code, dll."
                value={formData.importantNotes || ""}
                onChange={(e) => setFormData({ ...formData, importantNotes: e.target.value })}
              />
            </div>
          </div>

          {/* Section 2: Staff Roles Assignment */}
          <div style={{ background: "var(--slate-50)", padding: 14, borderRadius: 10, border: "1px solid var(--slate-200)" }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--slate-900)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={15} color="var(--primary-600)" />
              2. Penunjukan Petugas & Tim Operasional
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Lead Tour Leader (TL):</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.staff.leadTL.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    staff: { ...formData.staff, leadTL: { ...formData.staff.leadTL, name: e.target.value } }
                  })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>No. Registrasi BNSP / Sertifikasi TL:</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.staff.leadTL.noRegBnsp}
                  onChange={(e) => setFormData({
                    ...formData,
                    staff: { ...formData.staff, leadTL: { ...formData.staff.leadTL, noRegBnsp: e.target.value } }
                  })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Tour Guide (TG) / Local Guide:</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.staff.tourGuide?.name || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    staff: { ...formData.staff, tourGuide: { ...formData.staff.tourGuide, name: e.target.value } }
                  })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Co-Tour Leader / Staff Pendamping:</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.staff.coTL.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    staff: { ...formData.staff, coTL: { ...formData.staff.coTL, name: e.target.value } }
                  })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Manager Operasional (Approval):</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.staff.opsManager.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    staff: { ...formData.staff, opsManager: { ...formData.staff.opsManager, name: e.target.value } }
                  })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Petugas Finance & Koperasi:</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.staff.financeOfficer.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    staff: { ...formData.staff, financeOfficer: { ...formData.staff.financeOfficer, name: e.target.value } }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, borderTop: "1px solid var(--slate-200)", paddingTop: 14 }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <CheckCircle2 size={14} /> Simpan Pengaturan Tur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
