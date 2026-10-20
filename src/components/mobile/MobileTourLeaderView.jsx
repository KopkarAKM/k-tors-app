import React, { useState } from "react";
import {
  Compass,
  Users,
  CheckCircle2,
  QrCode,
  Phone,
  MessageSquare,
  AlertTriangle,
  Plus,
  DollarSign,
  Search,
  ShieldCheck,
  HeartPulse,
  Clock,
  Send,
  ArrowRight,
  Check,
  X,
  Camera,
  Bus,
  CheckCheck
} from "lucide-react";
import { formatRupiah } from "../../utils/pdfGenerator";
import QRPassModal from "../QRPassModal";
import QRScannerModal from "../QRScannerModal";

export default function MobileTourLeaderView({ trip, updateTrip, onOpenSignModal }) {
  const [activeTab, setActiveTab] = useState("home"); // home, manifest, attendance, k3, finance
  const [searchTerm, setSearchTerm] = useState("");
  const [manifestFilter, setManifestFilter] = useState("all"); // all, medical, room
  const [attendanceFilter, setAttendanceFilter] = useState("all"); // all, missing, present
  const [selectedPaxForQr, setSelectedPaxForQr] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState("departureCGK");

  // Quick Bottom Sheet Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  // Forms
  const [quickExpense, setQuickExpense] = useState({
    category: "Tol & Parkir",
    description: "",
    amount: "",
    receiptProof: "Nota Kasir #LOKAL"
  });

  const [quickLog, setQuickLog] = useState({
    location: "",
    activity: "",
    safetyTopic: "Safety briefing & meeting point",
    time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  });

  const [quickIncident, setQuickIncident] = useState({
    category: "Medis / Sakit Ringan",
    passengerName: trip.passengers[0]?.name || "",
    description: "",
    actionTaken: ""
  });

  const totalExpense = trip.finance?.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const cashAdvance = trip.finance?.cashAdvance || 0;
  const balance = cashAdvance - totalExpense;

  const checkpointsList = [
    { id: "departureCGK", label: "Bandara CGK (Keberangkatan)" },
    { id: "arrivalKUL", label: "Bandara KUL (Kedatangan)" },
    { id: "hotelCheckin", label: "Hotel Dorsett (Check-in)" },
    { id: "busTour", label: "Bus Tour & Wisata Genting" },
    { id: "returnCGK", label: "Bandara CGK (Kepulangan)" }
  ];

  // Headcount calculation
  const totalPax = trip.passengers.length;
  const presentCount = trip.passengers.filter(p => Boolean(p.attendance?.[activeCheckpoint])).length;
  const missingCount = totalPax - presentCount;
  const attendancePercent = totalPax > 0 ? Math.round((presentCount / totalPax) * 100) : 0;

  // Medical alerts calculation
  const paxWithMedicalAlerts = trip.passengers.filter(
    p => (p.medicalHistory && p.medicalHistory !== "Tidak Ada") ||
         (p.allergy && p.allergy !== "Tidak Ada") ||
         (p.requiredMedicines && p.requiredMedicines !== "Tidak Ada")
  );

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

  const handleMarkAllPresent = () => {
    if (window.confirm(`Tandai SEMUA (${totalPax} pax) sebagai HADIR pada titik ${activeCheckpoint}?`)) {
      const updated = trip.passengers.map(p => ({
        ...p,
        attendance: {
          ...p.attendance,
          [activeCheckpoint]: true
        }
      }));
      updateTrip({ ...trip, passengers: updated });
    }
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

  // Filtered Passengers for Manifest
  const filteredPaxForManifest = trip.passengers.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.seatNo && p.seatNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.phone && p.phone.includes(searchTerm));

    if (!matchSearch) return false;

    if (manifestFilter === "medical") {
      return (
        (p.medicalHistory && p.medicalHistory !== "Tidak Ada") ||
        (p.allergy && p.allergy !== "Tidak Ada") ||
        (p.requiredMedicines && p.requiredMedicines !== "Tidak Ada")
      );
    }
    return true;
  });

  // Filtered Passengers for Attendance
  const filteredPaxForAttendance = trip.passengers.filter(p => {
    const isPresent = Boolean(p.attendance?.[activeCheckpoint]);
    if (attendanceFilter === "missing") return !isPresent;
    if (attendanceFilter === "present") return isPresent;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", paddingBottom: 85 }}>
      {/* ========================================================= */}
      {/* MOBILE TOP BAR (High Contrast Header) */}
      {/* ========================================================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #091e42 0%, #0f172a 100%)",
          color: "#ffffff",
          padding: "16px 16px 14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          position: "sticky",
          top: 0,
          zIndex: 30,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(37,99,235,0.4)"
              }}
            >
              <Compass size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <strong style={{ fontSize: "1rem", color: "#ffffff", letterSpacing: "-0.01em" }}>
                  K-TORS Lapangan
                </strong>
                <span
                  style={{
                    fontSize: "0.68rem",
                    background: "#0284c7",
                    color: "#ffffff",
                    padding: "2px 7px",
                    borderRadius: 9999,
                    fontWeight: 700
                  }}
                >
                  TL
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#cbd5e1", margin: 0, fontWeight: 500 }}>
                {trip.staff?.leadTL?.name} • {totalPax} Wisatawan
              </p>
            </div>
          </div>

          <button
            onClick={handleShareCsatToWa}
            className="btn btn-sm"
            style={{
              background: "#16a34a",
              color: "#ffffff",
              border: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "6px 10px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 5,
              boxShadow: "0 2px 6px rgba(22, 163, 74, 0.3)"
            }}
            title="Kirim Link CSAT ke WA Rombongan"
          >
            <Send size={13} /> CSAT WA
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div style={{ padding: "14px 14px", flex: 1 }}>
        {/* ========================================================= */}
        {/* TAB 1: BERANDA (HOME) */}
        {/* ========================================================= */}
        {activeTab === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Status Card Utama Rombongan */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)",
                borderRadius: 14,
                padding: "16px 14px",
                color: "#ffffff",
                boxShadow: "0 6px 16px rgba(30, 58, 138, 0.28)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#bae6fd", fontWeight: 700, letterSpacing: "0.04em" }}>
                  SPT: {trip.sptNumber}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                    background: "#10b981",
                    color: "#ffffff",
                    borderRadius: 9999,
                    fontWeight: 700
                  }}
                >
                  ● TUR AKTIF
                </span>
              </div>

              <h3 style={{ fontSize: "1.15rem", color: "#ffffff", margin: "0 0 8px 0", lineHeight: 1.3 }}>
                {trip.title}
              </h3>

              <p style={{ fontSize: "0.8rem", color: "#f0f9ff", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: 4 }}>
                📍 <strong>Rute:</strong> {trip.routeSummary || trip.destination}
              </p>

              {/* 2 Quick KPI Badges inside Hero */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "rgba(0,0,0,0.2)", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "#e0f2fe", display: "block" }}>Presensi Titik Ini:</span>
                  <strong style={{ fontSize: "0.95rem", color: "#38bdf8" }}>
                    {presentCount} / {totalPax} Hadir
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "#e0f2fe", display: "block" }}>Sisa Kas Bon:</span>
                  <strong style={{ fontSize: "0.95rem", color: balance >= 0 ? "#4ade80" : "#f87171" }}>
                    {formatRupiah(balance)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Medical Alert Banner if any passenger has medical needs */}
            {paxWithMedicalAlerts.length > 0 && (
              <div
                onClick={() => {
                  setManifestFilter("medical");
                  setActiveTab("manifest");
                }}
                style={{
                  background: "#fff1f2",
                  border: "1.5px solid #fecaca",
                  borderRadius: 12,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(225, 29, 72, 0.08)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "#ffe4e6", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48" }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.825rem", color: "#9f1239" }}>
                      ⚠️ Perhatian Medis ({paxWithMedicalAlerts.length} Wisatawan)
                    </strong>
                    <p style={{ fontSize: "0.75rem", color: "#be123c", margin: 0 }}>
                      Ada riwayat alergi / obat pribadi. Ketuk untuk cek.
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} color="#e11d48" />
              </div>
            )}

            {/* 4 Big Action Buttons (Thumb-Friendly Touch Targets) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* Button 1: Presensi Cepat */}
              <button
                onClick={() => setActiveTab("attendance")}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid var(--slate-200)",
                  borderRadius: 12,
                  padding: "14px 12px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}>
                  <Users size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: "0.9rem", color: "#0f172a", display: "block" }}>Presensi Rombongan</strong>
                  <span style={{ fontSize: "0.75rem", color: missingCount === 0 ? "#16a34a" : "#d97706", fontWeight: 700 }}>
                    {missingCount === 0 ? "✓ Lengkap (100%)" : `${missingCount} Belum Presensi`}
                  </span>
                </div>
              </button>

              {/* Button 2: Catat Kas Bon */}
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid var(--slate-200)",
                  borderRadius: 12,
                  padding: "14px 12px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706" }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: "0.9rem", color: "#0f172a", display: "block" }}>+ Catat Nota Kas</strong>
                  <span style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 600 }}>
                    Sisa: {formatRupiah(balance)}
                  </span>
                </div>
              </button>

              {/* Button 3: Jurnal Harian */}
              <button
                onClick={() => setIsLogModalOpen(true)}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid var(--slate-200)",
                  borderRadius: 12,
                  padding: "14px 12px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: "0.9rem", color: "#0f172a", display: "block" }}>+ Jurnal GPS</strong>
                  <span style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 600 }}>
                    {trip.dailyLogs.length} Catatan Kegiatan
                  </span>
                </div>
              </button>

              {/* Button 4: Lapor Insiden K3 */}
              <button
                onClick={() => setIsIncidentModalOpen(true)}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid var(--slate-200)",
                  borderRadius: 12,
                  padding: "14px 12px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48" }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: "0.9rem", color: "#0f172a", display: "block" }}>+ Lapor Insiden</strong>
                  <span style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 600 }}>
                    {trip.incidents.length} Kasus Tercatat
                  </span>
                </div>
              </button>
            </div>

            {/* Quick Contact & Logistik Support Box */}
            <div style={{ background: "#ffffff", borderRadius: 12, padding: "14px 14px", border: "1.5px solid var(--slate-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: "0.825rem", fontWeight: 800, color: "#1e293b", display: "flex", alignItems: "center", gap: 6 }}>
                  <Bus size={16} color="#2563eb" /> Kontak Lapangan & Vendor
                </span>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Bus {trip.rampCheck?.vehiclePlate}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "8px 10px", borderRadius: 8 }}>
                  <div>
                    <strong style={{ color: "#0f172a" }}>Supir Bus: {trip.rampCheck?.driverName}</strong>
                    <div style={{ fontSize: "0.725rem", color: "#64748b" }}>{trip.logistics?.transportVendor?.company}</div>
                  </div>
                  {trip.rampCheck?.driverPhone && (
                    <a
                      href={`tel:${trip.rampCheck.driverPhone.replace(/[^0-9]/g, '')}`}
                      style={{ padding: "6px 10px", background: "#2563eb", color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Phone size={12} /> Hubungi
                    </a>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "8px 10px", borderRadius: 8 }}>
                  <div>
                    <strong style={{ color: "#0f172a" }}>Hotel: {trip.logistics?.hotel?.name}</strong>
                    <div style={{ fontSize: "0.725rem", color: "#64748b" }}>PIC: {trip.logistics?.hotel?.contactPerson}</div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 700 }}>
                    100% Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MANIFES WISATAWAN & PERHATIAN MEDIS */}
        {/* ========================================================= */}
        {activeTab === "manifest" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Search Input (Prominent & Clean) */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="input-field"
                placeholder="Cari nama wisatawan, no seat, atau no telp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: 38,
                  paddingRight: searchTerm ? 36 : 12,
                  fontSize: "0.875rem",
                  height: 44,
                  borderRadius: 10,
                  border: "1.5px solid var(--slate-300)"
                }}
              />
              <Search size={18} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
              <button
                onClick={() => setManifestFilter("all")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 9999,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: manifestFilter === "all" ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                  background: manifestFilter === "all" ? "#2563eb" : "#ffffff",
                  color: manifestFilter === "all" ? "#ffffff" : "#475569"
                }}
              >
                Semua ({totalPax})
              </button>

              <button
                onClick={() => setManifestFilter("medical")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 9999,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: manifestFilter === "medical" ? "1.5px solid #e11d48" : "1px solid #fecaca",
                  background: manifestFilter === "medical" ? "#e11d48" : "#fff1f2",
                  color: manifestFilter === "medical" ? "#ffffff" : "#be123c",
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <AlertTriangle size={13} /> Perhatian Medis ({paxWithMedicalAlerts.length})
              </button>
            </div>

            <div style={{ fontSize: "0.75rem", color: "#64748b", padding: "0 2px" }}>
              Menampilkan {filteredPaxForManifest.length} dari {totalPax} wisatawan
            </div>

            {/* Passenger Cards List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredPaxForManifest.map(pax => {
                const hasMedical =
                  (pax.medicalHistory && pax.medicalHistory !== "Tidak Ada") ||
                  (pax.allergy && pax.allergy !== "Tidak Ada") ||
                  (pax.requiredMedicines && pax.requiredMedicines !== "Tidak Ada");

                return (
                  <div
                    key={pax.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: 12,
                      padding: "14px 14px",
                      border: hasMedical ? "1.5px solid #fca5a5" : "1.5px solid var(--slate-200)",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8
                    }}
                  >
                    {/* Header Row: Seat & Name */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span
                            style={{
                              background: "#0f172a",
                              color: "#ffffff",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              padding: "2px 8px",
                              borderRadius: 6,
                              letterSpacing: "0.02em"
                            }}
                          >
                            SEAT {pax.seatNo}
                          </span>
                          <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "var(--font-mono)" }}>
                            {pax.id}
                          </span>
                        </div>
                        <h4 style={{ fontSize: "1rem", color: "#0f172a", margin: 0, fontWeight: 800 }}>
                          {pax.name}
                        </h4>
                      </div>

                      <button
                        onClick={() => setSelectedPaxForQr(pax)}
                        style={{
                          padding: "6px 10px",
                          fontSize: "0.725rem",
                          fontWeight: 700,
                          background: "#f1f5f9",
                          border: "1px solid #cbd5e1",
                          color: "#1e293b",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          cursor: "pointer"
                        }}
                      >
                        <QrCode size={14} color="#0284c7" /> QR e-Pass
                      </button>
                    </div>

                    {/* Passport & Room info */}
                    <div style={{ fontSize: "0.775rem", color: "#334155", background: "#f8fafc", padding: "8px 10px", borderRadius: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: "0.68rem" }}>DOKUMEN PASPOR</span>
                        <strong>{pax.docNo}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: "0.68rem" }}>KAMAR HOTEL</span>
                        <strong>{pax.roomNo}</strong>
                      </div>
                    </div>

                    {/* Medical Alert Warning Banner (High Contrast) */}
                    {hasMedical && (
                      <div
                        style={{
                          background: "#fff1f2",
                          border: "1.5px solid #fecaca",
                          borderRadius: 8,
                          padding: "8px 10px",
                          fontSize: "0.75rem",
                          color: "#9f1239"
                        }}
                      >
                        <strong style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                          <AlertTriangle size={14} color="#e11d48" /> Catatan Kesehatan & Diet:
                        </strong>
                        <div style={{ lineHeight: 1.4 }}>
                          {pax.medicalHistory !== "Tidak Ada" && <div>• Penyakit: <strong>{pax.medicalHistory}</strong></div>}
                          {pax.allergy !== "Tidak Ada" && <div>• Alergi/Diet: <strong>{pax.allergy}</strong></div>}
                          {pax.requiredMedicines !== "Tidak Ada" && <div>• Obat: <strong>{pax.requiredMedicines}</strong></div>}
                        </div>
                      </div>
                    )}

                    {/* Action Bar (Large Buttons for Thumb Tap) */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                      {pax.waPhone ? (
                        <a
                          href={`https://wa.me/${pax.waPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: "#16a34a",
                            color: "#ffffff",
                            textDecoration: "none",
                            fontSize: "0.775rem",
                            fontWeight: 700,
                            padding: "8px 6px",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5
                          }}
                        >
                          <MessageSquare size={14} /> Chat WA
                        </a>
                      ) : (
                        <button disabled style={{ opacity: 0.5, fontSize: "0.75rem", padding: "8px" }} className="btn btn-secondary btn-sm">
                          No WA -
                        </button>
                      )}

                      {pax.emergencyContactWa ? (
                        <a
                          href={`tel:${pax.emergencyContactWa.replace(/[^0-9]/g, '')}`}
                          style={{
                            background: "#e11d48",
                            color: "#ffffff",
                            textDecoration: "none",
                            fontSize: "0.775rem",
                            fontWeight: 700,
                            padding: "8px 6px",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5
                          }}
                        >
                          <Phone size={14} /> Call Darurat
                        </a>
                      ) : (
                        <button disabled style={{ opacity: 0.5, fontSize: "0.75rem", padding: "8px" }} className="btn btn-secondary btn-sm">
                          Kontak Darurat -
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PRESENSI & HEADCOUNT CHECKPOINT */}
        {/* ========================================================= */}
        {activeTab === "attendance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Titik Pantau Card */}
            <div style={{ background: "#ffffff", padding: "14px 14px", borderRadius: 12, border: "1.5px solid var(--slate-200)" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1e293b", display: "block", marginBottom: 6 }}>
                PILIH TITIK PANTAU (CHECKPOINT):
              </label>
              <select
                className="input-field"
                value={activeCheckpoint}
                onChange={(e) => setActiveCheckpoint(e.target.value)}
                style={{ fontSize: "0.9rem", fontWeight: 700, height: 44, borderRadius: 8, color: "#0f172a" }}
              >
                {checkpointsList.map(cp => (
                  <option key={cp.id} value={cp.id}>
                    {cp.label}
                  </option>
                ))}
              </select>

              {/* Headcount Indicator Bar */}
              <div style={{ marginTop: 12, padding: "10px 12px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>Total Hadir:</span>
                    <div style={{ fontSize: "1.35rem", fontWeight: 900, color: missingCount === 0 ? "#16a34a" : "#d97706" }}>
                      {presentCount} / {totalPax} Pax
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>Tingkat Presensi:</span>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                      {attendancePercent}%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 8, background: "#e2e8f0", borderRadius: 9999, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${attendancePercent}%`,
                      height: "100%",
                      background: missingCount === 0 ? "#16a34a" : "linear-gradient(90deg, #f59e0b 0%, #10b981 100%)",
                      transition: "width 0.3s ease"
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons: Scan Kamera & Tandai Semua Hadir */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="btn btn-primary"
                  style={{ fontSize: "0.825rem", height: 42, padding: "8px 12px", borderRadius: 8 }}
                >
                  <Camera size={16} /> Scan QR Kamera
                </button>

                <button
                  onClick={handleMarkAllPresent}
                  className="btn btn-secondary"
                  style={{ fontSize: "0.78rem", height: 42, padding: "8px 8px", borderRadius: 8, fontWeight: 700 }}
                  title="Tandai semua hadir sekaligus jika sudah dihitung manual"
                >
                  <CheckCheck size={16} color="#16a34a" /> Semua Hadir
                </button>
              </div>
            </div>

            {/* Attendance Status Filter Pills */}
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setAttendanceFilter("all")}
                style={{
                  flex: 1,
                  padding: "8px 6px",
                  borderRadius: 8,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: attendanceFilter === "all" ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                  background: attendanceFilter === "all" ? "#2563eb" : "#ffffff",
                  color: attendanceFilter === "all" ? "#ffffff" : "#475569"
                }}
              >
                Semua ({totalPax})
              </button>

              <button
                onClick={() => setAttendanceFilter("missing")}
                style={{
                  flex: 1.2,
                  padding: "8px 6px",
                  borderRadius: 8,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: attendanceFilter === "missing" ? "1.5px solid #d97706" : "1px solid #fde68a",
                  background: attendanceFilter === "missing" ? "#d97706" : "#fffbeb",
                  color: attendanceFilter === "missing" ? "#ffffff" : "#b45309"
                }}
              >
                ⚠️ Belum ({missingCount})
              </button>

              <button
                onClick={() => setAttendanceFilter("present")}
                style={{
                  flex: 1,
                  padding: "8px 6px",
                  borderRadius: 8,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: attendanceFilter === "present" ? "1.5px solid #16a34a" : "1px solid #bbf7d0",
                  background: attendanceFilter === "present" ? "#16a34a" : "#f0fdf4",
                  color: attendanceFilter === "present" ? "#ffffff" : "#15803d"
                }}
              >
                ✓ Hadir ({presentCount})
              </button>
            </div>

            {/* Attendance List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredPaxForAttendance.length === 0 ? (
                <div style={{ background: "#ffffff", padding: "20px", borderRadius: 12, textAlign: "center", color: "#64748b", fontSize: "0.85rem", border: "1px solid #e2e8f0" }}>
                  {attendanceFilter === "missing" ? "🎉 Luar biasa! Semua wisatawan telah terpresensi hadir." : "Tidak ada wisatawan ditemukan."}
                </div>
              ) : (
                filteredPaxForAttendance.map(pax => {
                  const isPresent = Boolean(pax.attendance?.[activeCheckpoint]);
                  return (
                    <div
                      key={pax.id}
                      onClick={() => handleToggleAttendance(pax.id)}
                      style={{
                        background: isPresent ? "#f0fdf4" : "#ffffff",
                        border: isPresent ? "1.5px solid #86efac" : "1.5px solid var(--slate-200)",
                        borderRadius: 12,
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Big Checkbox */}
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: isPresent ? "#16a34a" : "#ffffff",
                            border: isPresent ? "none" : "2px solid #94a3b8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            flexShrink: 0
                          }}
                        >
                          {isPresent && <Check size={20} />}
                        </div>

                        <div>
                          <strong style={{ fontSize: "0.925rem", color: isPresent ? "#14532d" : "#0f172a" }}>
                            {pax.name}
                          </strong>
                          <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: 2 }}>
                            <span style={{ fontWeight: 700, color: "#1e293b" }}>Seat {pax.seatNo}</span> • Kamar {pax.roomNo.split(" ")[1] || pax.roomNo}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          padding: "4px 8px",
                          borderRadius: 6,
                          background: isPresent ? "#dcfce7" : "#f1f5f9",
                          color: isPresent ? "#15803d" : "#64748b"
                        }}
                      >
                        {isPresent ? "HADIR ✓" : "BELUM"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: K3, BUS & KOTAK P3K */}
        {/* ========================================================= */}
        {activeTab === "k3" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Bus Ramp Check Card */}
            <div style={{ background: "#ffffff", padding: "14px 14px", borderRadius: 12, border: "1.5px solid var(--slate-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h4 style={{ fontSize: "0.9rem", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldCheck size={18} color="#16a34a" />
                  Ramp Check Bus ({trip.rampCheck?.vehiclePlate})
                </h4>
                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    border: "1px solid #86efac",
                    padding: "2px 8px",
                    borderRadius: 9999,
                    fontSize: "0.7rem",
                    fontWeight: 800
                  }}
                >
                  GRADE A+ LAIK
                </span>
              </div>

              <p style={{ fontSize: "0.775rem", color: "#475569", margin: "0 0 10px 0" }}>
                Driver: <strong>{trip.rampCheck?.driverName}</strong> • {trip.logistics?.transportVendor?.company}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {(trip.rampCheck?.items || []).map(item => (
                  <div key={item.id} style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: 8, fontSize: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0" }}>
                    <span style={{ color: "#334155" }}>{item.name}</span>
                    <strong style={{ color: "#16a34a", fontSize: "0.72rem" }}>{item.status}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Kotak P3K Checklist Card */}
            <div style={{ background: "#ffffff", padding: "14px 14px", borderRadius: 12, border: "1.5px solid var(--slate-200)" }}>
              <h4 style={{ fontSize: "0.9rem", color: "#0f172a", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <HeartPulse size={18} color="#e11d48" />
                Kotak P3K Lapangan (15 Item Medis)
              </h4>
              <p style={{ fontSize: "0.775rem", color: "#475569", lineHeight: 1.4, margin: "0 0 10px 0" }}>
                Paracetamol, Antasida, Antimo, Oralit, Cetirizine, Betadine, Kassa Steril, Hansaplast, Minyak Kayu Putih, dll.
              </p>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "8px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#15803d", fontWeight: 700 }}>
                <Check size={16} /> Status: 100% LENGKAP & SIAP PAKAI
              </div>
            </div>

            {/* Insiden K3 List & Button */}
            <div style={{ background: "#ffffff", padding: "14px 14px", borderRadius: 12, border: "1.5px solid var(--slate-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h4 style={{ fontSize: "0.9rem", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={18} color="#d97706" />
                  Laporan Kejadian & Insiden
                </h4>
                <button
                  onClick={() => setIsIncidentModalOpen(true)}
                  className="btn btn-sm"
                  style={{ background: "#e11d48", color: "#fff", fontSize: "0.725rem", padding: "4px 8px" }}
                >
                  <Plus size={12} /> Lapor Insiden
                </button>
              </div>

              {trip.incidents.length === 0 ? (
                <div style={{ fontSize: "0.775rem", color: "#64748b", textAlign: "center", padding: "12px 0" }}>
                  Nihil kejadian insiden. Tur berlangsung aman & lancar.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {trip.incidents.map(inc => (
                    <div key={inc.id} style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#0f172a" }}>
                        <span>{inc.category}</span>
                        <span style={{ color: "#16a34a" }}>{inc.status}</span>
                      </div>
                      <div style={{ color: "#475569", marginTop: 2 }}>{inc.description}</div>
                      <div style={{ color: "#0284c7", marginTop: 2, fontSize: "0.7rem" }}>Tindakan: {inc.actionTaken}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: KEUANGAN & KAS BON */}
        {/* ========================================================= */}
        {activeTab === "finance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Saldo Hero Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: 14,
                padding: "16px 14px",
                color: "#ffffff",
                boxShadow: "0 6px 16px rgba(15, 23, 42, 0.25)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                  SALDO KAS OPERASIONAL LAPANGAN
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                    borderRadius: 9999,
                    background: balance >= 0 ? "#16a34a" : "#dc2626",
                    color: "#ffffff",
                    fontWeight: 700
                  }}
                >
                  {balance >= 0 ? "SURPLUS" : "DEFISIT"}
                </span>
              </div>

              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: balance >= 0 ? "#4ade80" : "#f87171", margin: "6px 0" }}>
                {formatRupiah(balance)}
              </div>

              <div style={{ fontSize: "0.8rem", color: "#cbd5e1", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}>
                <span>Kas Awal: <strong>{formatRupiah(cashAdvance)}</strong></span>
                <span>Terpakai: <strong style={{ color: "#fca5a5" }}>{formatRupiah(totalExpense)}</strong></span>
              </div>
            </div>

            {/* Big Add Expense Button */}
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="btn btn-primary"
              style={{ width: "100%", height: 46, fontSize: "0.9rem", borderRadius: 10, fontWeight: 700 }}
            >
              <Plus size={18} /> Tambah Nota Pengeluaran Baru
            </button>

            {/* Expenses List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1e293b", padding: "0 2px" }}>
                Rincian Nota Lapangan ({trip.finance.expenses.length} Bukti):
              </div>

              {trip.finance.expenses.map(exp => (
                <div
                  key={exp.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 10,
                    padding: "10px 12px",
                    border: "1.5px solid var(--slate-200)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "#0f172a" }}>{exp.description}</strong>
                    <div style={{ fontSize: "0.725rem", color: "#64748b", marginTop: 2 }}>
                      <span style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4, color: "#334155", fontWeight: 600 }}>{exp.category}</span> • {exp.date} • {exp.receiptProof}
                    </div>
                  </div>
                  <strong style={{ fontSize: "0.9rem", color: "#0f172a", fontFamily: "var(--font-mono)" }}>
                    {formatRupiah(exp.amount)}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {/* ========================================================= */}
      <div className="mobile-bottom-nav">
        {[
          { id: "home", label: "Beranda", icon: Compass },
          { id: "manifest", label: "Manifes", icon: Users },
          { id: "attendance", label: "Presensi", icon: CheckCircle2, badge: missingCount > 0 ? missingCount : null },
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
                color: isActive ? "#2563eb" : "#64748b",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                fontSize: "0.72rem",
                fontWeight: isActive ? 800 : 600,
                cursor: "pointer",
                padding: "6px 8px",
                position: "relative",
                flex: 1
              }}
            >
              <div style={{ position: "relative" }}>
                <Icon size={20} />
                {item.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -8,
                      background: "#ef4444",
                      color: "#ffffff",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      width: 16,
                      height: 16,
                      borderRadius: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1.5px solid #ffffff"
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
              {isActive && (
                <div style={{ width: 14, height: 3, background: "#2563eb", borderRadius: 9999, marginTop: 1 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* BOTTOM SHEET 1: QUICK EXPENSE */}
      {/* ========================================================= */}
      {isExpenseModalOpen && (
        <div className="bottom-sheet-overlay" onClick={() => setIsExpenseModalOpen(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h4 style={{ margin: 0, fontSize: "1.05rem", color: "#0f172a", fontWeight: 800 }}>
                Catat Pengeluaran Nota Lapangan
              </h4>
              <button onClick={() => setIsExpenseModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveQuickExpense} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  Kategori Beban:
                </label>
                <select
                  className="input-field"
                  value={quickExpense.category}
                  onChange={(e) => setQuickExpense({ ...quickExpense, category: e.target.value })}
                  style={{ height: 44, fontSize: "0.9rem" }}
                >
                  <option value="Tol & Parkir">Tol & Parkir</option>
                  <option value="Tips Driver & Crew">Tips Driver & Crew</option>
                  <option value="Konsumsi & Refreshment">Konsumsi & Refreshment</option>
                  <option value="Tiket Masuk & Retribusi">Tiket Masuk & Retribusi</option>
                  <option value="Medis & Darurat K3">Medis & Darurat K3</option>
                  <option value="Operasional Lainnya">Operasional Lainnya</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  Keterangan Belanja:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cth: Parkir Bus Genting Highlands"
                  className="input-field"
                  value={quickExpense.description}
                  onChange={(e) => setQuickExpense({ ...quickExpense, description: e.target.value })}
                  style={{ height: 44, fontSize: "0.9rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  Jumlah Nominal (IDR):
                </label>
                <input
                  type="number"
                  required
                  placeholder="Cth: 150000"
                  className="input-field"
                  value={quickExpense.amount}
                  onChange={(e) => setQuickExpense({ ...quickExpense, amount: e.target.value })}
                  style={{ height: 44, fontSize: "1rem", fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  No. Bukti / Nota:
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={quickExpense.receiptProof}
                  onChange={(e) => setQuickExpense({ ...quickExpense, receiptProof: e.target.value })}
                  style={{ height: 44, fontSize: "0.9rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsExpenseModalOpen(false)} style={{ height: 46 }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ height: 46, fontWeight: 700 }}>
                  Simpan Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTTOM SHEET 2: QUICK LOG GPS */}
      {/* ========================================================= */}
      {isLogModalOpen && (
        <div className="bottom-sheet-overlay" onClick={() => setIsLogModalOpen(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h4 style={{ margin: 0, fontSize: "1.05rem", color: "#0f172a", fontWeight: 800 }}>
                Catat Jurnal Kegiatan & GPS
              </h4>
              <button onClick={() => setIsLogModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveQuickLog} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  Jam & Lokasi:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                  <input
                    type="text"
                    className="input-field"
                    value={quickLog.time}
                    onChange={(e) => setQuickLog({ ...quickLog, time: e.target.value })}
                    style={{ height: 44, fontSize: "0.9rem" }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nama Lokasi / Obyek"
                    className="input-field"
                    value={quickLog.location}
                    onChange={(e) => setQuickLog({ ...quickLog, location: e.target.value })}
                    style={{ height: 44, fontSize: "0.9rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  Aktivitas / Kegiatan:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Cth: Wisatawan tiba di Genting Cable Car..."
                  className="input-field"
                  value={quickLog.activity}
                  onChange={(e) => setQuickLog({ ...quickLog, activity: e.target.value })}
                  style={{ fontSize: "0.9rem", padding: "10px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  Materi Safety Talk:
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={quickLog.safetyTopic}
                  onChange={(e) => setQuickLog({ ...quickLog, safetyTopic: e.target.value })}
                  style={{ height: 44, fontSize: "0.9rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsLogModalOpen(false)} style={{ height: 46 }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ height: 46, fontWeight: 700 }}>
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTTOM SHEET 3: QUICK INCIDENT */}
      {/* ========================================================= */}
      {isIncidentModalOpen && (
        <div className="bottom-sheet-overlay" onClick={() => setIsIncidentModalOpen(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h4 style={{ margin: 0, fontSize: "1.05rem", color: "#0f172a", fontWeight: 800 }}>
                Laporan Kejadian Insiden K3
              </h4>
              <button onClick={() => setIsIncidentModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveQuickIncident} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  Kategori Insiden:
                </label>
                <select
                  className="input-field"
                  value={quickIncident.category}
                  onChange={(e) => setQuickIncident({ ...quickIncident, category: e.target.value })}
                  style={{ height: 44, fontSize: "0.9rem" }}
                >
                  <option value="Medis / Sakit Ringan">Medis / Sakit Ringan</option>
                  <option value="Barang Tertinggal / Hilang">Barang Tertinggal / Hilang</option>
                  <option value="Keterlambatan / Traffic">Keterlambatan / Traffic</option>
                  <option value="Keluhan Fasilitas">Keluhan Fasilitas</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  Nama Wisatawan Terkait:
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={quickIncident.passengerName}
                  onChange={(e) => setQuickIncident({ ...quickIncident, passengerName: e.target.value })}
                  style={{ height: 44, fontSize: "0.9rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  Deskripsi Kronologi:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jelaskan kejadian secara ringkas..."
                  className="input-field"
                  value={quickIncident.description}
                  onChange={(e) => setQuickIncident({ ...quickIncident, description: e.target.value })}
                  style={{ fontSize: "0.9rem", padding: "10px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>
                  Tindakan Penyelesaian:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tindakan yang diambil Tour Leader..."
                  className="input-field"
                  value={quickIncident.actionTaken}
                  onChange={(e) => setQuickIncident({ ...quickIncident, actionTaken: e.target.value })}
                  style={{ height: 44, fontSize: "0.9rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsIncidentModalOpen(false)} style={{ height: 46 }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ height: 46, fontWeight: 700 }}>
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Pass Modal with fixed props */}
      {selectedPaxForQr && (
        <QRPassModal
          isOpen={Boolean(selectedPaxForQr)}
          onClose={() => setSelectedPaxForQr(null)}
          passenger={selectedPaxForQr}
          tripTitle={trip.title}
          sptNumber={trip.sptNumber}
        />
      )}

      {/* QR Scanner Modal with fixed props */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        passengers={trip.passengers}
        onMarkAttendance={handleToggleAttendance}
        activeCheckpoint={activeCheckpoint}
      />
    </div>
  );
}
