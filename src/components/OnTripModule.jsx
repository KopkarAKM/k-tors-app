import React, { useState } from "react";
import { Clock, MapPin, ShieldAlert, Plus, Camera, CheckCircle2, UserCheck, AlertTriangle, FileText, Download, QrCode, Sparkles, Edit2, Trash2, ShieldCheck, Flag } from "lucide-react";
import QRScannerModal from "./QRScannerModal";
import { generateIncidentReportPDF } from "../utils/pdfGenerator";

export default function OnTripModule({ trip, updateTrip, onOpenSignModal }) {
  const [activeSubTab, setActiveSubTab] = useState("journal");
  const [activeCheckpoint, setActiveCheckpoint] = useState("departureCGK");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Modals state
  const [logModal, setLogModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [incidentModal, setIncidentModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [checkpointModal, setCheckpointModal] = useState({ isOpen: false, isEdit: false, data: null });

  // ==========================================
  // DAILY LOG CRUD HANDLERS
  // ==========================================
  const handleOpenAddLog = () => {
    const nextId = `LOG-${String(trip.dailyLogs.length + 1).padStart(2, "0")}`;
    setLogModal({
      isOpen: true,
      isEdit: false,
      data: {
        id: nextId,
        day: `Hari ${trip.dailyLogs.length + 1} (${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short" })})`,
        time: "08:00",
        location: "",
        gps: "-6.1256, 106.6559",
        activity: "",
        safetyTopic: "Pengenalan jalur evakuasi, meeting point & nomor darurat TL",
        assemblyPoint: "Pintu Masuk Utama",
        notes: ""
      }
    });
  };

  const handleOpenEditLog = (log) => {
    setLogModal({
      isOpen: true,
      isEdit: true,
      data: {
        ...log,
        safetyTopic: log.safetyBriefing?.topic || "",
        assemblyPoint: log.safetyBriefing?.assemblyPoint || ""
      }
    });
  };

  const handleSaveLog = (e) => {
    e.preventDefault();
    const form = logModal.data;
    const logItem = {
      id: form.id,
      day: form.day,
      time: form.time,
      location: form.location,
      gps: form.gps,
      activity: form.activity,
      safetyBriefing: {
        conducted: true,
        topic: form.safetyTopic,
        assemblyPoint: form.assemblyPoint,
        headcountTotal: trip.passengers.length,
        headcountPresent: trip.passengers.length
      },
      notes: form.notes
    };

    if (logModal.isEdit) {
      const updated = trip.dailyLogs.map(l => l.id === form.id ? logItem : l);
      updateTrip({ ...trip, dailyLogs: updated });
    } else {
      updateTrip({ ...trip, dailyLogs: [...trip.dailyLogs, logItem] });
    }
    setLogModal({ isOpen: false, isEdit: false, data: null });
  };

  const handleDeleteLog = (logId) => {
    if (window.confirm("Hapus catatan jurnal harian ini?")) {
      const updated = trip.dailyLogs.filter(l => l.id !== logId);
      updateTrip({ ...trip, dailyLogs: updated });
    }
  };

  // ==========================================
  // CHECKPOINTS CRUD HANDLERS
  // ==========================================
  const handleMarkAttendance = (paxId, checkpointId) => {
    const updatedPax = trip.passengers.map(p => {
      if (p.id === paxId) {
        return {
          ...p,
          attendance: {
            ...p.attendance,
            [checkpointId]: !p.attendance[checkpointId]
          }
        };
      }
      return p;
    });
    updateTrip({ ...trip, passengers: updatedPax });
  };

  const handleSaveCheckpoint = (e) => {
    e.preventDefault();
    const cp = checkpointModal.data;
    if (checkpointModal.isEdit) {
      const updated = (trip.checkpoints || []).map(c => c.id === cp.id ? cp : c);
      updateTrip({ ...trip, checkpoints: updated });
    } else {
      const newCp = { id: `cp-${Date.now()}`, label: cp.label };
      const updatedList = [...(trip.checkpoints || []), newCp];
      updateTrip({ ...trip, checkpoints: updatedList });
      setActiveCheckpoint(newCp.id);
    }
    setCheckpointModal({ isOpen: false, isEdit: false, data: null });
  };

  const handleDeleteCheckpoint = (cpId) => {
    if ((trip.checkpoints || []).length <= 1) {
      alert("Minimal harus ada 1 checkpoint presensi!");
      return;
    }
    if (window.confirm("Hapus checkpoint presensi ini?")) {
      const updated = (trip.checkpoints || []).filter(c => c.id !== cpId);
      updateTrip({ ...trip, checkpoints: updated });
      if (activeCheckpoint === cpId) {
        setActiveCheckpoint(updated[0].id);
      }
    }
  };

  // ==========================================
  // INCIDENT CRUD HANDLERS
  // ==========================================
  const handleOpenAddIncident = () => {
    const nextId = `INC-${String(trip.incidents.length + 1).padStart(3, "0")}`;
    const nextFormNo = `FM-K3-KOPKAR-04/2026/${String(trip.incidents.length + 1).padStart(3, "0")}`;
    setIncidentModal({
      isOpen: true,
      isEdit: false,
      data: {
        id: nextId,
        formNumber: nextFormNo,
        date: new Date().toISOString().split("T")[0],
        time: "12:00",
        location: "",
        category: "Kesehatan Ringan (Medical)",
        passengerName: trip.passengers[0]?.name || "Semua Peserta",
        severity: "LOW",
        description: "",
        actionTaken: "",
        status: "RESOLVED (SELESAI)",
        officerSign: true
      }
    });
  };

  const handleOpenEditIncident = (inc) => {
    setIncidentModal({
      isOpen: true,
      isEdit: true,
      data: { ...inc }
    });
  };

  const handleSaveIncident = (e) => {
    e.preventDefault();
    const incData = incidentModal.data;
    if (incidentModal.isEdit) {
      const updated = trip.incidents.map(i => i.id === incData.id ? { ...incData } : i);
      updateTrip({ ...trip, incidents: updated });
    } else {
      updateTrip({ ...trip, incidents: [...trip.incidents, incData] });
    }
    setIncidentModal({ isOpen: false, isEdit: false, data: null });
  };

  const handleDeleteIncident = (incId) => {
    if (window.confirm("Hapus laporan insiden ini?")) {
      const updated = trip.incidents.filter(i => i.id !== incId);
      updateTrip({ ...trip, incidents: updated });
    }
  };

  const currentCheckpoints = trip.checkpoints || [
    { id: "departureCGK", label: "Keberangkatan Bandara CGK T3" },
    { id: "arrivalKUL", label: "Kedatangan Bandara KLIA-1 Sepang" },
    { id: "hotelCheckin", label: "Check-in Hotel Dorsett KL" },
    { id: "busTour", label: "Boarding Bus Wisata Genting" },
    { id: "returnCGK", label: "Kepulangan Bandara Changi T4" }
  ];

  // Headcount calculation
  const presentCount = trip.passengers.filter(p => p.attendance && p.attendance[activeCheckpoint]).length;
  const totalCount = trip.passengers.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Sub-tab Navigation */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--slate-200)", paddingBottom: 10, flexWrap: "wrap" }}>
        {[
          { id: "journal", label: "Modul 4: Jurnal Harian & Safety Briefing", icon: Clock },
          { id: "transit", label: "Modul 5: Presensi & Headcount e-Pass", icon: UserCheck },
          { id: "incident", label: "Modul 6: Insiden & Keluhan K3 (FM-K3-04)", icon: ShieldAlert },
        ].map(sub => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id)}
              className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.8rem", padding: "8px 14px" }}
            >
              <Icon size={15} />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUB-TAB 1: JURNAL HARIAN & BRIEFING CRUD (NO PHOTO THUMBNAIL)
      ========================================================================= */}
      {activeSubTab === "journal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h3 style={{ fontSize: "1.1rem" }}>Jurnal Harian Lapangan & Safety Briefing</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>
                Pencatatan pemanduan, materi safety talk, assembly point & koordinat GPS
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddLog}>
              <Plus size={14} /> Tambah Catatan Jurnal
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {trip.dailyLogs.map((log) => (
              <div key={log.id} className="card" style={{ padding: 18, borderLeft: "4px solid var(--primary-600)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span className="badge badge-blue">{log.day}</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--slate-700)" }}>{log.time}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--slate-500)", fontFamily: "var(--font-mono)" }}>
                        <MapPin size={12} style={{ display: "inline", verticalAlign: "middle" }} /> GPS: {log.gps}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "1.05rem", color: "var(--slate-900)", marginBottom: 8 }}>{log.location}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--slate-700)", lineHeight: 1.5, marginBottom: 12 }}>
                      {log.activity}
                    </p>

                    {/* Safety Briefing Box */}
                    <div style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)", borderRadius: 8, padding: 10, fontSize: "0.775rem" }}>
                      <strong style={{ color: "var(--emerald-700)", display: "block", marginBottom: 4 }}>
                        ✓ Safety Talk Briefing:
                      </strong>
                      <p style={{ color: "var(--slate-600)", margin: "0 0 6px 0" }}>{log.safetyBriefing?.topic}</p>
                      <div style={{ display: "flex", gap: 16, color: "var(--slate-500)", fontSize: "0.725rem" }}>
                        <span><strong>Assembly Point:</strong> {log.safetyBriefing?.assemblyPoint}</span>
                        <span><strong>Headcount:</strong> {log.safetyBriefing?.headcountPresent}/{log.safetyBriefing?.headcountTotal} Pax</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "4px 8px" }}
                      onClick={() => handleOpenEditLog(log)}
                    >
                      <Edit2 size={13} color="var(--primary-600)" /> Edit
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "4px 8px" }}
                      onClick={() => handleDeleteLog(log.id)}
                    >
                      <Trash2 size={13} color="var(--rose-600)" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: TRANSIT & PRESENSI HEADCOUNT CRUD
      ========================================================================= */}
      {activeSubTab === "transit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Checkpoint Bar */}
          <div className="card" style={{ background: "var(--slate-900)", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
              <div>
                <span style={{ fontSize: "0.7rem", color: "#38bdf8", textTransform: "uppercase", fontWeight: 700 }}>CHECKPOINT PRESENSI LAPANGAN</span>
                <h3 style={{ fontSize: "1.15rem", color: "#fff", margin: "2px 0 0 0" }}>
                  Headcount: {presentCount} / {totalCount} Peserta ({totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%)
                </h3>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
                  onClick={() => setCheckpointModal({ isOpen: true, isEdit: false, data: { label: "" } })}
                >
                  <Plus size={14} /> Tambah Checkpoint
                </button>
                <button className="btn btn-emerald btn-sm" onClick={() => setIsScannerOpen(true)}>
                  <Camera size={14} /> Pemindai QR e-Pass
                </button>
              </div>
            </div>

            {/* Checkpoint Tabs with Edit/Delete */}
            <div style={{ display: "flex", gap: 6, marginTop: 16, overflowX: "auto", paddingBottom: 4 }}>
              {currentCheckpoints.map(cp => (
                <div key={cp.id} style={{ display: "flex", alignItems: "center", background: activeCheckpoint === cp.id ? "var(--primary-600)" : "rgba(255,255,255,0.08)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", padding: "2px 4px" }}>
                  <button
                    onClick={() => setActiveCheckpoint(cp.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      padding: "4px 8px",
                      whiteSpace: "nowrap",
                      fontWeight: activeCheckpoint === cp.id ? 700 : 500
                    }}
                  >
                    {cp.label}
                  </button>
                  <button
                    onClick={() => handleDeleteCheckpoint(cp.id)}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.65rem", padding: "2px 4px" }}
                    title="Hapus Checkpoint"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Passenger Presensi Checklist Table */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontSize: "0.95rem" }}>
                Daftar Hadir: {currentCheckpoints.find(c => c.id === activeCheckpoint)?.label}
              </h4>
              <span className="badge badge-blue">Klik tombol status untuk mengubah kehadiran manual</span>
            </div>

            <div className="table-container" style={{ border: "none" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID Pax</th>
                    <th>Nama Wisatawan</th>
                    <th>No. WhatsApp</th>
                    <th>No. Kursi</th>
                    <th>Kamar Hotel</th>
                    <th>Status Presensi</th>
                    <th>Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody>
                  {trip.passengers.map(pax => {
                    const isPresent = pax.attendance && pax.attendance[activeCheckpoint];
                    return (
                      <tr key={pax.id}>
                        <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{pax.id}</td>
                        <td><strong>{pax.name}</strong></td>
                        <td style={{ color: "#059669", fontSize: "0.75rem", fontWeight: 600 }}>{pax.waPhone || pax.phone}</td>
                        <td style={{ textAlign: "center", fontWeight: 700 }}>{pax.seatNo}</td>
                        <td>{pax.roomNo}</td>
                        <td>
                          <button
                            onClick={() => handleMarkAttendance(pax.id, activeCheckpoint)}
                            className={`badge ${isPresent ? "badge-emerald" : "badge-rose"}`}
                            style={{ cursor: "pointer", border: "none", padding: "5px 12px", fontSize: "0.75rem" }}
                          >
                            {isPresent ? "✓ HADIR (TERVERIFIKASI)" : "✕ BELUM HADIR"}
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 8px", fontSize: "0.7rem" }}
                            onClick={() => handleMarkAttendance(pax.id, activeCheckpoint)}
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: INSIDEN & KELUHAN CRUD
      ========================================================================= */}
      {activeSubTab === "incident" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <span className="badge badge-amber" style={{ marginBottom: 4 }}>FORM FM-K3-KOPKAR-04</span>
              <h3 style={{ fontSize: "1.1rem" }}>Laporan Insiden K3 & Penanganan Keluhan Wisatawan</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>
                Berita Acara Kejadian Medis, Barang Tertinggal, Keluhan Fasilitas & Tindakan Penyelesaian
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const doc = generateIncidentReportPDF(trip);
                  doc.save(`Laporan_Insiden_FM-K3-04_${trip.id}.pdf`);
                }}
              >
                <Download size={14} /> Unduh PDF
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddIncident}>
                <Plus size={14} /> Catat Insiden Baru
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {trip.incidents.map((inc) => (
              <div key={inc.id} className="card" style={{ borderLeft: `4px solid ${inc.severity === "MEDIUM" ? "#f59e0b" : "#3b82f6"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span className="badge badge-slate" style={{ fontFamily: "var(--font-mono)" }}>{inc.formNumber}</span>
                      <span className="badge badge-amber">{inc.category}</span>
                      <span className="badge badge-emerald">{inc.status}</span>
                    </div>
                    <h4 style={{ fontSize: "1rem", color: "var(--slate-900)" }}>Wisatawan: {inc.passengerName}</h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>
                      Waktu & Lokasi: {inc.date} {inc.time} @ {inc.location}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "4px 8px" }}
                      onClick={() => handleOpenEditIncident(inc)}
                    >
                      <Edit2 size={13} color="var(--primary-600)" /> Edit
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "4px 8px" }}
                      onClick={() => handleDeleteIncident(inc.id)}
                    >
                      <Trash2 size={13} color="var(--rose-600)" /> Hapus
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: "0.8rem", background: "var(--slate-50)", padding: 12, borderRadius: 8 }}>
                  <div>
                    <strong style={{ color: "var(--slate-700)", display: "block", marginBottom: 2 }}>Kronologi / Keluhan:</strong>
                    <p style={{ color: "var(--slate-600)", margin: 0, lineHeight: 1.4 }}>{inc.description}</p>
                  </div>
                  <div>
                    <strong style={{ color: "var(--emerald-700)", display: "block", marginBottom: 2 }}>Tindakan Penyelesaian (Action Taken):</strong>
                    <p style={{ color: "var(--slate-600)", margin: 0, whiteSpace: "pre-line", lineHeight: 1.4 }}>{inc.actionTaken}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        passengers={trip.passengers}
        onMarkAttendance={handleMarkAttendance}
        activeCheckpoint={activeCheckpoint}
      />

      {/* Daily Log Modal */}
      {logModal.isOpen && logModal.data && (
        <div className="modal-overlay" onClick={() => setLogModal({ isOpen: false, isEdit: false, data: null })}>
          <div className="modal-content" style={{ maxWidth: 550 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>{logModal.isEdit ? "Edit Jurnal Harian" : "Tambah Catatan Jurnal Harian"}</h3>
              <button onClick={() => setLogModal({ isOpen: false, isEdit: false, data: null })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleSaveLog} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Hari & Tanggal:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={logModal.data.day}
                    onChange={(e) => setLogModal({ ...logModal, data: { ...logModal.data, day: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Waktu Pelaksanaan:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={logModal.data.time}
                    onChange={(e) => setLogModal({ ...logModal, data: { ...logModal.data, time: e.target.value } })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Lokasi & Obyek Wisata:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={logModal.data.location}
                  onChange={(e) => setLogModal({ ...logModal, data: { ...logModal.data, location: e.target.value } })}
                  placeholder="Contoh: Merlion Park & Marina Bay Sands"
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Koordinat GPS Lapangan:</label>
                <input
                  type="text"
                  className="input-field"
                  value={logModal.data.gps}
                  onChange={(e) => setLogModal({ ...logModal, data: { ...logModal.data, gps: e.target.value } })}
                  placeholder="1.2868, 103.8545"
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Deskripsi Pemanduan & Aktivitas:</label>
                <textarea
                  required
                  rows={3}
                  className="input-field"
                  value={logModal.data.activity}
                  onChange={(e) => setLogModal({ ...logModal, data: { ...logModal.data, activity: e.target.value } })}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Materi Safety Talk & Titik Kumpul (Assembly Point):</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={logModal.data.safetyTopic}
                  onChange={(e) => setLogModal({ ...logModal, data: { ...logModal.data, safetyTopic: e.target.value } })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLogModal({ isOpen: false, isEdit: false, data: null })}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Jurnal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Modal */}
      {incidentModal.isOpen && incidentModal.data && (
        <div className="modal-overlay" onClick={() => setIncidentModal({ isOpen: false, isEdit: false, data: null })}>
          <div className="modal-content" style={{ maxWidth: 550 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>{incidentModal.isEdit ? "Edit Laporan Insiden" : "Catat Insiden / Keluhan K3 Baru"}</h3>
              <button onClick={() => setIncidentModal({ isOpen: false, isEdit: false, data: null })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleSaveIncident} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Kategori Insiden:</label>
                  <select
                    className="input-field"
                    value={incidentModal.data.category}
                    onChange={(e) => setIncidentModal({ ...incidentModal, data: { ...incidentModal.data, category: e.target.value } })}
                  >
                    <option value="Kesehatan Ringan (Medical)">Kesehatan Ringan (Medical)</option>
                    <option value="Barang Tertinggal / Kehilangan">Barang Tertinggal / Kehilangan</option>
                    <option value="Keluhan Fasilitas Hotel/Bus">Keluhan Fasilitas Hotel/Bus</option>
                    <option value="Keterlambatan / Flight Delay">Keterlambatan / Flight Delay</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Wisatawan Terkait:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={incidentModal.data.passengerName}
                    onChange={(e) => setIncidentModal({ ...incidentModal, data: { ...incidentModal.data, passengerName: e.target.value } })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Tanggal:</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={incidentModal.data.date}
                    onChange={(e) => setIncidentModal({ ...incidentModal, data: { ...incidentModal.data, date: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Waktu:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={incidentModal.data.time}
                    onChange={(e) => setIncidentModal({ ...incidentModal, data: { ...incidentModal.data, time: e.target.value } })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Lokasi Kejadian:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={incidentModal.data.location}
                  onChange={(e) => setIncidentModal({ ...incidentModal, data: { ...incidentModal.data, location: e.target.value } })}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Kronologi Kejadian:</label>
                <textarea
                  required
                  rows={2}
                  className="input-field"
                  value={incidentModal.data.description}
                  onChange={(e) => setIncidentModal({ ...incidentModal, data: { ...incidentModal.data, description: e.target.value } })}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Tindakan Penyelesaian (Action Taken):</label>
                <textarea
                  required
                  rows={2}
                  className="input-field"
                  value={incidentModal.data.actionTaken}
                  onChange={(e) => setIncidentModal({ ...incidentModal, data: { ...incidentModal.data, actionTaken: e.target.value } })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIncidentModal({ isOpen: false, isEdit: false, data: null })}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Insiden</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkpoint Add Modal */}
      {checkpointModal.isOpen && (
        <div className="modal-overlay" onClick={() => setCheckpointModal({ isOpen: false, isEdit: false, data: null })}>
          <div className="modal-content" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>Tambah Checkpoint Presensi</h3>
              <button onClick={() => setCheckpointModal({ isOpen: false, isEdit: false, data: null })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleSaveCheckpoint} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Checkpoint Presensi:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Contoh: Kunjungan Batu Caves"
                  value={checkpointModal.data?.label || ""}
                  onChange={(e) => setCheckpointModal({ ...checkpointModal, data: { ...checkpointModal.data, label: e.target.value } })}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Checkpoint</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
