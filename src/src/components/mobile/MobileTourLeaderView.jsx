import React, { useState } from "react";
import { Compass, Users, CheckCircle2, QrCode, Phone, MessageSquare, AlertTriangle, Plus, DollarSign, Calendar, MapPin, Search, ShieldCheck, HeartPulse, Clock, Sparkles, Send, ArrowRight, Check, X, Camera } from "lucide-react";
import { formatRupiah } from "../../utils/pdfGenerator";
import QRPassModal from "../QRPassModal";
import QRScannerModal from "../QRScannerModal";

export default function MobileTourLeaderView({ trip, updateTrip, onOpenSignModal }) {
  const [activeTab, setActiveTab] = useState("home"); // home, manifest, attendance, k3, finance
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaxForQr, setSelectedPaxForQr] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState("departureCGK");

  // Quick modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  // Forms
  const [quickExpense, setQuickExpense] = useState({ category: "Tol & Parkir", description: "", amount: "", receiptProof: "Nota Kasir #LOKAL" });
  const [quickLog, setQuickLog] = useState({ location: "", activity: "", safetyTopic: "Safety briefing & meeting point", time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) });
  const [quickIncident, setQuickIncident] = useState({ category: "Medis / Sakit Ringan", passengerName: trip.passengers[0]?.name || "", description: "", actionTaken: "" });

  const totalExpense = trip.finance?.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const cashAdvance = trip.finance?.cashAdvance || 0;
  const balance = cashAdvance - totalExpense;

  const checkpointsList = [
    { id: "departureCGK", label: "Bandara CGK (Keberangkatan)" },
    { id: "arrivalKUL", label: "Bandara KUL (Kedatangan)" },
    { id: "hotelCheckin", label: "Hotel Dorsett (Check-in)" },
    { id: "busTour", label: "Bus Tour & Wisata" },
    { id: "returnCGK", label: "Bandara CGK (Kepulangan)" }
  ];

  // Headcount calculation
  const presentCount = trip.passengers.filter(p => p.attendance?.[activeCheckpoint]).length;
  const totalPax = trip.passengers.length;

  const handleToggleAttendance = (paxId) => {
    const updated = trip.passengers.map(p => {
      if (p.id === paxId) {
        return {
          ...p,
          attendance: {
            ...p.attendance,
            [activeCheckpoint]: !p.attendance?.[activeCheckpoint]
          }
        };
      }
      return p;
    });
    updateTrip({ ...trip, passengers: updated });
  };

  const handleSaveQuickExpense = (e) => {
    e.preventDefault();
    const newExp = {
      id: `EXP-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      category: quickExpense.category,
      description: quickExpense.description,
      amount: parseInt(quickExpense.amount, 10) || 0,
      receiptProof: quickExpense.receiptProof
    };
    updateTrip({
      ...trip,
      finance: {
        ...trip.finance,
        expenses: [newExp, ...trip.finance.expenses]
      }
    });
    setQuickExpense({ category: "Tol & Parkir", description: "", amount: "", receiptProof: "Nota Kasir #LOKAL" });
    setIsExpenseModalOpen(false);
  };

  const handleSaveQuickLog = (e) => {
    e.preventDefault();
    const newLog = {
      id: `LOG-${Date.now()}`,
      day: `Hari ${trip.dailyLogs.length + 1} (${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short" })})`,
      time: quickLog.time,
      location: quickLog.location || trip.destination,
      gps: "-6.1256, 106.6559",
      activity: quickLog.activity,
      safetyBriefing: {
        conducted: true,
        topic: quickLog.safetyTopic,
        assemblyPoint: "Pintu Masuk Utama / Bus",
        headcountTotal: totalPax,
        headcountPresent: totalPax
      },
      notes: "Dicatat via K-TORS Mobile Field App"
    };
    updateTrip({
      ...trip,
      dailyLogs: [newLog, ...trip.dailyLogs]
    });
    setQuickLog({ location: "", activity: "", safetyTopic: "Safety briefing & meeting point", time: "08:00" });
    setIsLogModalOpen(false);
  };

  const handleSaveQuickIncident = (e) => {
    e.preventDefault();
    const newInc = {
      id: `INC-${Date.now()}`,
      formNumber: `FM-K3-04-2026-${String(trip.incidents.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      location: trip.destination,
      category: quickIncident.category,
      passengerName: quickIncident.passengerName,
      severity: "Ringan",
      description: quickIncident.description,
      actionTaken: quickIncident.actionTaken,
      status: "SELESAI DITANGANI"
    };
    updateTrip({
      ...trip,
      incidents: [newInc, ...trip.incidents]
    });
    setQuickIncident({ category: "Medis / Sakit Ringan", passengerName: trip.passengers[0]?.name || "", description: "", actionTaken: "" });
    setIsIncidentModalOpen(false);
  };

  const handleShareCsatToWa = () => {
    const text = `Halo Bapak/Ibu wisatawan ${trip.title}, terima kasih telah mempercayakan perjalanan tur bersama Kopkarindo Travel. Mohon kesediaannya mengisi evaluasi & survei kepuasan singkat pada link berikut: ${trip.csat?.googleFormUrl || "https://forms.gle/KTORS-Feedback-Survey-2026"} . Terima kasih banyak!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const filteredPax = trip.passengers.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", paddingBottom: 76 }}>
      {/* Mobile Top App Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#fff", padding: "16px 16px 14px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Compass size={18} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <strong style={{ fontSize: "0.95rem", color: "#fff" }}>K-TORS Mobile</strong>
                <span style={{ fontSize: "0.6rem", background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>
                  TL LAPANGAN
                </span>
              </div>
              <p style={{ fontSize: "0.68rem", color: "var(--slate-300)", margin: 0 }}>
                {trip.destination} • {totalPax} Pax
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={handleShareCsatToWa}
              className="btn btn-sm"
              style={{ background: "#25D366", color: "#fff", border: "none", fontSize: "0.68rem", padding: "4px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}
              title="Kirim Link CSAT ke WA Rombongan"
            >
              <Send size={11} /> Share CSAT
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div style={{ padding: "14px 12px", flex: 1 }}>
        {/* ========================================================= */}
        {/* TAB 1: HOME (QUICK ACTIONS & SUMMARY) */}
        {/* ========================================================= */}
        {activeTab === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Quick Status Card */}
            <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)", borderRadius: 12, padding: 14, color: "#fff", boxShadow: "0 4px 12px rgba(30, 58, 138, 0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--primary-200)", fontWeight: 700 }}>
                  SPT: {trip.sptNumber}
                </span>
                <span className="badge badge-emerald" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                  ● AKTIF
                </span>
              </div>
              <h3 style={{ fontSize: "1.1rem", color: "#fff", margin: "0 0 8px 0" }}>
                {trip.title}
              </h3>
              <p style={{ fontSize: "0.75rem", color: "#e0f2fe", margin: 0 }}>
                📍 <strong>Rute:</strong> {trip.routeSummary || trip.destination}
              </p>
            </div>

            {/* 4 Quick Action Buttons (Big Touch Targets) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* Button 1: Presensi Cepat */}
              <button
                onClick={() => setActiveTab("attendance")}
                style={{ background: "#fff", border: "1px solid var(--slate-200)", borderRadius: 10, padding: "14px 10px", textAlign: "left", display: "flex", flexDirection: "column", gap: 6, cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--primary-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-600)" }}>
                  <Users size={18} />
                </div>
                <strong style={{ fontSize: "0.85rem", color: "var(--slate-900)" }}>Presensi & Headcount</strong>
                <span style={{ fontSize: "0.7rem", color: "var(--emerald-600)", fontWeight: 600 }}>{presentCount} / {totalPax} Pax Hadir</span>
              </button>

              {/* Button 2: Catat Kas Bon */}
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                style={{ background: "#fff", border: "1px solid var(--slate-200)", borderRadius: 10, padding: "14px 10px", textAlign: "left", display: "flex", flexDirection: "column", gap: 6, cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--amber-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--amber-600)" }}>
                  <DollarSign size={18} />
                </div>
                <strong style={{ fontSize: "0.85rem", color: "var(--slate-900)" }}>+ Catat Nota Kas</strong>
                <span style={{ fontSize: "0.7rem", color: "var(--slate-600)" }}>Sisa: {formatRupiah(balance)}</span>
              </button>

              {/* Button 3: Jurnal Harian */}
              <button
                onClick={() => setIsLogModalOpen(true)}
                style={{ background: "#fff", border: "1px solid var(--slate-200)", borderRadius: 10, padding: "14px 10px", textAlign: "left", display: "flex", flexDirection: "column", gap: 6, cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--emerald-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald-600)" }}>
                  <Clock size={18} />
                </div>
                <strong style={{ fontSize: "0.85rem", color: "var(--slate-900)" }}>+ Jurnal Harian GPS</strong>
                <span style={{ fontSize: "0.7rem", color: "var(--slate-600)" }}>{trip.dailyLogs.length} Catatan Kegiatan</span>
              </button>

              {/* Button 4: Lapor Insiden K3 */}
              <button
                onClick={() => setIsIncidentModalOpen(true)}
                style={{ background: "#fff", border: "1px solid var(--slate-200)", borderRadius: 10, padding: "14px 10px", textAlign: "left", display: "flex", flexDirection: "column", gap: 6, cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--rose-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--rose-600)" }}>
                  <AlertTriangle size={18} />
                </div>
                <strong style={{ fontSize: "0.85rem", color: "var(--slate-900)" }}>+ Lapor Insiden K3</strong>
                <span style={{ fontSize: "0.7rem", color: "var(--slate-600)" }}>{trip.incidents.length} Kejadian</span>
              </button>
            </div>

            {/* Quick Contact Wisatawan Alert Card */}
            <div style={{ background: "#fff", borderRadius: 10, padding: 12, border: "1px solid var(--slate-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate-700)" }}>
                  Kontak Darurat & Catatan Medis Wisatawan
                </span>
                <button
                  onClick={() => setActiveTab("manifest")}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "0.68rem", padding: "2px 6px" }}
                >
                  Semua ({totalPax})
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {trip.passengers.slice(0, 3).map(pax => (
                  <div key={pax.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", background: "var(--slate-50)", borderRadius: 6, fontSize: "0.75rem" }}>
                    <div>
                      <strong>{pax.name}</strong>
                      <span style={{ color: "var(--slate-500)", marginLeft: 6, fontSize: "0.68rem" }}>Seat: {pax.seatNo}</span>
                      {(pax.allergy !== "Tidak Ada" || pax.medicalHistory !== "Tidak Ada") && (
                        <div style={{ fontSize: "0.65rem", color: "var(--rose-600)", fontWeight: 600 }}>
                          ⚠️ {pax.allergy !== "Tidak Ada" ? pax.allergy : pax.medicalHistory}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      {pax.waPhone && (
                        <a
                          href={`https://wa.me/${pax.waPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ width: 28, height: 28, borderRadius: 6, background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                          title="WhatsApp Wisatawan"
                        >
                          <MessageSquare size={13} />
                        </a>
                      )}
                      {pax.emergencyContactWa && (
                        <a
                          href={`tel:${pax.emergencyContactWa.replace(/[^0-9]/g, '')}`}
                          style={{ width: 28, height: 28, borderRadius: 6, background: "var(--rose-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                          title="Telepon Kontak Darurat"
                        >
                          <Phone size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MANIFEST & MEDICAL WISATAWAN */}
        {/* ========================================================= */}
        {activeTab === "manifest" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="input-field"
                placeholder="Cari nama, seat, atau no telp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 34, fontSize: "0.825rem" }}
              />
              <Search size={16} color="var(--slate-400)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            </div>

            <div style={{ fontSize: "0.725rem", color: "var(--slate-500)", padding: "0 4px" }}>
              Menampilkan {filteredPax.length} dari {totalPax} wisatawan
            </div>

            {/* Passenger List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredPax.map(pax => (
                <div key={pax.id} style={{ background: "#fff", borderRadius: 10, padding: 12, border: "1px solid var(--slate-200)", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.65rem", color: "var(--slate-400)", fontFamily: "var(--font-mono)" }}>{pax.id} • Seat {pax.seatNo}</span>
                      <h4 style={{ fontSize: "0.9rem", color: "var(--slate-900)", margin: 0 }}>{pax.name}</h4>
                    </div>
                    <button
                      onClick={() => setSelectedPaxForQr(pax)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "3px 8px", fontSize: "0.68rem" }}
                    >
                      <QrCode size={12} /> QR e-Pass
                    </button>
                  </div>

                  <div style={{ fontSize: "0.725rem", color: "var(--slate-600)", background: "var(--slate-50)", padding: "6px 8px", borderRadius: 6, display: "flex", flexDirection: "column", gap: 3 }}>
                    <div><strong>No. Dokumen:</strong> {pax.docType} ({pax.docNo})</div>
                    <div><strong>Kamar:</strong> {pax.roomNo}</div>
                    <div><strong>WhatsApp:</strong> {pax.waPhone || pax.phone}</div>
                    <div><strong>Darurat:</strong> {pax.emergencyContactName} ({pax.emergencyContactWa || pax.emergencyContact})</div>
                  </div>

                  {/* Medical Warning Alert Badge */}
                  {(pax.medicalHistory !== "Tidak Ada" || pax.allergy !== "Tidak Ada" || pax.requiredMedicines !== "Tidak Ada") && (
                    <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 6, padding: "5px 8px", fontSize: "0.7rem", color: "#9f1239" }}>
                      <strong>⚠️ Catatan Medis/Diet:</strong>
                      <div style={{ marginTop: 2 }}>
                        {pax.medicalHistory !== "Tidak Ada" && `• Penyakit: ${pax.medicalHistory} `}
                        {pax.allergy !== "Tidak Ada" && `• Diet/Alergi: ${pax.allergy} `}
                        {pax.requiredMedicines !== "Tidak Ada" && `• Obat: ${pax.requiredMedicines}`}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    {pax.waPhone && (
                      <a
                        href={`https://wa.me/${pax.waPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm"
                        style={{ flex: 1, background: "#25D366", color: "#fff", textDecoration: "none", fontSize: "0.725rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                      >
                        <MessageSquare size={12} /> Chat WA Wisatawan
                      </a>
                    )}
                    {pax.emergencyContactWa && (
                      <a
                        href={`tel:${pax.emergencyContactWa.replace(/[^0-9]/g, '')}`}
                        className="btn btn-sm"
                        style={{ flex: 1, background: "var(--rose-600)", color: "#fff", textDecoration: "none", fontSize: "0.725rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                      >
                        <Phone size={12} /> Call Kontak Darurat
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ATTENDANCE & HEADCOUNT (CHECKPOINTS) */}
        {/* ========================================================= */}
        {activeTab === "attendance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Checkpoint Selector Bar */}
            <div style={{ background: "#fff", padding: 10, borderRadius: 10, border: "1px solid var(--slate-200)" }}>
              <label style={{ fontSize: "0.725rem", fontWeight: 700, color: "var(--slate-600)", display: "block", marginBottom: 4 }}>
                PILIH TITIK PANTAU (CHECKPOINT):
              </label>
              <select
                className="input-field"
                value={activeCheckpoint}
                onChange={(e) => setActiveCheckpoint(e.target.value)}
                style={{ fontSize: "0.85rem", fontWeight: 600 }}
              >
                {checkpointsList.map(cp => (
                  <option key={cp.id} value={cp.id}>
                    {cp.label}
                  </option>
                ))}
              </select>

              {/* Headcount Indicator */}
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "var(--slate-50)", borderRadius: 8 }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--slate-500)" }}>Status Kehadiran:</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: presentCount === totalPax ? "var(--emerald-600)" : "var(--amber-600)" }}>
                    {presentCount} / {totalPax} Pax
                  </div>
                </div>

                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                >
                  <Camera size={14} /> Scan Kamera
                </button>
              </div>
            </div>

            {/* Quick Check Attendance List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {trip.passengers.map(pax => {
                const isPresent = Boolean(pax.attendance?.[activeCheckpoint]);
                return (
                  <div
                    key={pax.id}
                    onClick={() => handleToggleAttendance(pax.id)}
                    style={{
                      background: isPresent ? "#ecfdf5" : "#fff",
                      border: isPresent ? "1px solid #86efac" : "1px solid var(--slate-200)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {/* Big Checkbox */}
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: isPresent ? "var(--emerald-600)" : "#fff",
                          border: isPresent ? "none" : "2px solid var(--slate-300)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff"
                        }}
                      >
                        {isPresent && <Check size={18} />}
                      </div>

                      <div>
                        <strong style={{ fontSize: "0.875rem", color: isPresent ? "var(--emerald-900)" : "var(--slate-900)" }}>
                          {pax.name}
                        </strong>
                        <div style={{ fontSize: "0.68rem", color: "var(--slate-500)" }}>
                          Seat {pax.seatNo} • Room {pax.roomNo.split(" ")[1]}
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: isPresent ? "var(--emerald-700)" : "var(--slate-400)" }}>
                      {isPresent ? "HADIR ✓" : "BELUM"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: K3 & RAMP CHECK BUS */}
        {/* ========================================================= */}
        {activeTab === "k3" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#fff", padding: 12, borderRadius: 10, border: "1px solid var(--slate-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--slate-900)", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldCheck size={16} color="var(--emerald-600)" />
                  Ramp Check Kelaikan Bus ({trip.rampCheck?.vehiclePlate})
                </h4>
                <span className="badge badge-emerald" style={{ fontSize: "0.65rem" }}>
                  GRADE A+
                </span>
              </div>
              <p style={{ fontSize: "0.725rem", color: "var(--slate-600)", margin: "0 0 10px 0" }}>
                Driver: {trip.rampCheck?.driverName} • Vendor: {trip.logistics?.transportVendor?.company}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {(trip.rampCheck?.items || []).map(item => (
                  <div key={item.id} style={{ padding: "6px 8px", background: "var(--slate-50)", borderRadius: 6, fontSize: "0.7rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{item.name}</span>
                    <strong style={{ color: "var(--emerald-600)", fontSize: "0.68rem" }}>{item.status}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Kotak P3K Brief */}
            <div style={{ background: "#fff", padding: 12, borderRadius: 10, border: "1px solid var(--slate-200)" }}>
              <h4 style={{ fontSize: "0.85rem", color: "var(--slate-900)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <HeartPulse size={16} color="var(--rose-600)" />
                Checklist Kotak P3K (15 Item Medis)
              </h4>
              <p style={{ fontSize: "0.725rem", color: "var(--slate-600)", margin: 0 }}>
                Paracetamol, Antasida, Antimo, Oralit, Cetirizine, Betadine, Kassa Steril, Hansaplast, dll. Status: <strong style={{ color: "var(--emerald-600)" }}>100% LENGKAP & SIAP PAKAI</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: FINANCE & SETTLEMENT */}
        {/* ========================================================= */}
        {activeTab === "finance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Balance Card */}
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: 12, padding: 14, color: "#fff" }}>
              <span style={{ fontSize: "0.68rem", color: "var(--slate-400)", textTransform: "uppercase" }}>
                SALDO KAS OPERASIONAL LAPANGAN
              </span>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: balance >= 0 ? "#34d399" : "#f87171", margin: "4px 0" }}>
                {formatRupiah(balance)}
              </div>
              <div style={{ fontSize: "0.725rem", color: "var(--slate-300)", display: "flex", justifyContent: "space-between" }}>
                <span>Kas Awal: {formatRupiah(cashAdvance)}</span>
                <span>Terpakai: {formatRupiah(totalExpense)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="btn btn-primary"
              style={{ width: "100%", padding: "10px", fontSize: "0.85rem" }}
            >
              <Plus size={16} /> Tambah Nota Pengeluaran Baru
            </button>

            {/* Expenses List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate-700)" }}>
                Rincian Nota Lapangan ({trip.finance.expenses.length} Bukti):
              </div>
              {trip.finance.expenses.map(exp => (
                <div key={exp.id} style={{ background: "#fff", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "0.8rem", color: "var(--slate-900)" }}>{exp.description}</strong>
                    <div style={{ fontSize: "0.68rem", color: "var(--slate-500)" }}>
                      {exp.category} • {exp.date} • {exp.receiptProof}
                    </div>
                  </div>
                  <strong style={{ fontSize: "0.85rem", color: "var(--slate-900)", fontFamily: "var(--font-mono)" }}>
                    {formatRupiah(exp.amount)}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-around", padding: "6px 0", zIndex: 40, boxShadow: "0 -4px 10px rgba(0,0,0,0.05)" }}>
        {[
          { id: "home", label: "Beranda", icon: Compass },
          { id: "manifest", label: "Manifes", icon: Users },
          { id: "attendance", label: "Presensi", icon: CheckCircle2 },
          { id: "k3", label: "K3 & Bus", icon: ShieldCheck },
          { id: "finance", label: "Kas Bon", icon: DollarSign }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: "transparent",
                border: "none",
                color: isActive ? "var(--primary-600)" : "var(--slate-400)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                fontSize: "0.68rem",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                padding: "4px 8px"
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="modal-overlay" onClick={() => setIsExpenseModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 360, padding: 18 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Catat Pengeluaran Nota</h4>
              <button onClick={() => setIsExpenseModalOpen(false)} style={{ background: "none", border: "none" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveQuickExpense} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Kategori Beban:</label>
                <select className="input-field" value={quickExpense.category} onChange={(e) => setQuickExpense({ ...quickExpense, category: e.target.value })}>
                  <option value="Tol & Parkir">Tol & Parkir</option>
                  <option value="Tips Driver & Crew">Tips Driver & Crew</option>
                  <option value="Konsumsi & Refreshment">Konsumsi & Refreshment</option>
                  <option value="Tiket Masuk & Retribusi">Tiket Masuk & Retribusi</option>
                  <option value="Medis & Darurat K3">Medis & Darurat K3</option>
                  <option value="Operasional Lainnya">Operasional Lainnya</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Keterangan Belanja:</label>
                <input type="text" required placeholder="Cth: Parkir Bus Genting" className="input-field" value={quickExpense.description} onChange={(e) => setQuickExpense({ ...quickExpense, description: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Jumlah Nominal (IDR):</label>
                <input type="number" required placeholder="Cth: 150000" className="input-field" value={quickExpense.amount} onChange={(e) => setQuickExpense({ ...quickExpense, amount: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>No. Bukti / Nota:</label>
                <input type="text" className="input-field" value={quickExpense.receiptProof} onChange={(e) => setQuickExpense({ ...quickExpense, receiptProof: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsExpenseModalOpen(false)} style={{ flex: 1 }}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1.2 }}>Simpan Nota</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Log Modal */}
      {isLogModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLogModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 360, padding: 18 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Catat Jurnal Kegiatan & GPS</h4>
              <button onClick={() => setIsLogModalOpen(false)} style={{ background: "none", border: "none" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveQuickLog} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Jam & Lokasi:</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 6 }}>
                  <input type="text" className="input-field" value={quickLog.time} onChange={(e) => setQuickLog({ ...quickLog, time: e.target.value })} />
                  <input type="text" required placeholder="Nama Lokasi" className="input-field" value={quickLog.location} onChange={(e) => setQuickLog({ ...quickLog, location: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Aktivitas / Kegiatan:</label>
                <textarea rows={2} required placeholder="Deskripsi ringkas aktivitas..." className="input-field" value={quickLog.activity} onChange={(e) => setQuickLog({ ...quickLog, activity: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Materi Safety Talk:</label>
                <input type="text" className="input-field" value={quickLog.safetyTopic} onChange={(e) => setQuickLog({ ...quickLog, safetyTopic: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsLogModalOpen(false)} style={{ flex: 1 }}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1.2 }}>Simpan Jurnal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Incident Modal */}
      {isIncidentModalOpen && (
        <div className="modal-overlay" onClick={() => setIsIncidentModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 360, padding: 18 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Laporan Kejadian Insiden K3</h4>
              <button onClick={() => setIsIncidentModalOpen(false)} style={{ background: "none", border: "none" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveQuickIncident} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Kategori Insiden:</label>
                <select className="input-field" value={quickIncident.category} onChange={(e) => setQuickIncident({ ...quickIncident, category: e.target.value })}>
                  <option value="Medis / Sakit Ringan">Medis / Sakit Ringan</option>
                  <option value="Barang Tertinggal / Hilang">Barang Tertinggal / Hilang</option>
                  <option value="Keterlambatan / Traffic">Keterlambatan / Traffic</option>
                  <option value="Keluhan Fasilitas">Keluhan Fasilitas</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Wisatawan Terkait:</label>
                <input type="text" required className="input-field" value={quickIncident.passengerName} onChange={(e) => setQuickIncident({ ...quickIncident, passengerName: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Deskripsi Kronologi:</label>
                <textarea rows={2} required placeholder="Jelaskan kejadian singkat..." className="input-field" value={quickIncident.description} onChange={(e) => setQuickIncident({ ...quickIncident, description: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Tindakan Penyelesaian:</label>
                <input type="text" required placeholder="Tindakan yang diambil TL..." className="input-field" value={quickIncident.actionTaken} onChange={(e) => setQuickIncident({ ...quickIncident, actionTaken: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsIncidentModalOpen(false)} style={{ flex: 1 }}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1.2 }}>Kirim Laporan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Pass Modal */}
      {selectedPaxForQr && (
        <QRPassModal
          isOpen={!!selectedPaxForQr}
          onClose={() => setSelectedPaxForQr(null)}
          passenger={selectedPaxForQr}
          trip={trip}
        />
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedPaxId) => {
          handleToggleAttendance(scannedPaxId);
        }}
        passengers={trip.passengers}
      />
    </div>
  );
}
