import React, { useState } from "react";
import { Users, FileText, Bus, ShieldCheck, Plus, Search, QrCode, PenTool, CheckCircle2, AlertTriangle, Printer, Download, Eye, Edit2, Trash2, HeartPulse, Phone, AlertCircle, Plane } from "lucide-react";
import QRPassModal from "./QRPassModal";
import { generateRampCheckPDF, generateP3kCheckPDF, generateVendorConfirmationPDF, generatePassengerManifestPDF } from "../utils/pdfGenerator";

export default function PreTripModule({ trip, updateTrip, onOpenSignModal }) {
  const [activeSubTab, setActiveSubTab] = useState("manifest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaxForQr, setSelectedPaxForQr] = useState(null);

  // Modals state
  const [paxModal, setPaxModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [flightModal, setFlightModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [hotelModal, setHotelModal] = useState({ isOpen: false });
  const [vendorModal, setVendorModal] = useState({ isOpen: false });
  const [rampItemModal, setRampItemModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [p3kItemModal, setP3kItemModal] = useState({ isOpen: false, isEdit: false, data: null });

  // Initial Passenger Form Template
  const emptyPax = {
    id: "",
    name: "",
    gender: "L",
    docType: "Paspor",
    docNo: "",
    expiryDate: "2032-12-31",
    nationality: "Indonesia",
    dob: "1990-01-01",
    phone: "+62 ",
    waPhone: "+62 ",
    emergencyContactName: "",
    emergencyContactWa: "+62 ",
    medicalHistory: "Tidak Ada",
    allergy: "Tidak Ada",
    foodRestrictions: "Tidak Ada",
    requiredMedicines: "Tidak Ada",
    specialNotes: "",
    mdacStatus: "APPROVED",
    roomNo: "Room 1402 (Twin)",
    seatNo: "1A"
  };

  const [paxForm, setPaxForm] = useState(emptyPax);

  // ==========================================
  // PASSENGER CRUD HANDLERS
  // ==========================================
  const handleOpenAddPax = () => {
    const nextId = `PAX-${String(trip.passengers.length + 1).padStart(3, "0")}`;
    setPaxForm({ ...emptyPax, id: nextId });
    setPaxModal({ isOpen: true, isEdit: false, data: null });
  };

  const handleOpenEditPax = (pax) => {
    setPaxForm({ ...pax });
    setPaxModal({ isOpen: true, isEdit: true, data: pax });
  };

  const handleSavePax = (e) => {
    e.preventDefault();
    if (paxModal.isEdit) {
      const updated = trip.passengers.map(p => p.id === paxForm.id ? { ...paxForm } : p);
      updateTrip({ ...trip, passengers: updated });
    } else {
      const newPax = {
        ...paxForm,
        attendance: { departureCGK: false, arrivalKUL: false, hotelCheckin: false, busTour: false, returnCGK: false }
      };
      updateTrip({ ...trip, passengers: [...trip.passengers, newPax] });
    }
    setPaxModal({ isOpen: false, isEdit: false, data: null });
  };

  const handleDeletePax = (paxId) => {
    if (window.confirm(`Hapus data wisatawan ${paxId}?`)) {
      const filtered = trip.passengers.filter(p => p.id !== paxId);
      updateTrip({ ...trip, passengers: filtered });
    }
  };

  // ==========================================
  // FLIGHT CRUD HANDLERS
  // ==========================================
  const handleSaveFlight = (e) => {
    e.preventDefault();
    const flightData = flightModal.data;
    if (flightModal.isEdit) {
      const updated = trip.logistics.flights.map(f => f.id === flightData.id ? { ...flightData } : f);
      updateTrip({ ...trip, logistics: { ...trip.logistics, flights: updated } });
    } else {
      const newFlight = { ...flightData, id: `FLIGHT-${Date.now()}` };
      updateTrip({ ...trip, logistics: { ...trip.logistics, flights: [...trip.logistics.flights, newFlight] } });
    }
    setFlightModal({ isOpen: false, isEdit: false, data: null });
  };

  const handleDeleteFlight = (flightId) => {
    if (window.confirm("Hapus data penerbangan ini?")) {
      const updated = trip.logistics.flights.filter(f => f.id !== flightId);
      updateTrip({ ...trip, logistics: { ...trip.logistics, flights: updated } });
    }
  };

  // ==========================================
  // RAMP CHECK & P3K CRUD HANDLERS
  // ==========================================
  const handleToggleRampCheck = (itemId) => {
    const updated = trip.rampCheck.items.map(item => {
      if (item.id === itemId) {
        return { ...item, status: item.status === "LAIK" ? "PERBAIKAN" : "LAIK" };
      }
      return item;
    });
    updateTrip({ ...trip, rampCheck: { ...trip.rampCheck, items: updated } });
  };

  const handleDeleteRampItem = (itemId) => {
    if (window.confirm("Hapus item checklist ramp check ini?")) {
      const updated = trip.rampCheck.items.filter(i => i.id !== itemId);
      updateTrip({ ...trip, rampCheck: { ...trip.rampCheck, items: updated } });
    }
  };

  const handleSaveRampItem = (e) => {
    e.preventDefault();
    const item = rampItemModal.data;
    if (rampItemModal.isEdit) {
      const updated = trip.rampCheck.items.map(i => i.id === item.id ? { ...item } : i);
      updateTrip({ ...trip, rampCheck: { ...trip.rampCheck, items: updated } });
    } else {
      const newItem = { ...item, id: `rc-${Date.now()}` };
      updateTrip({ ...trip, rampCheck: { ...trip.rampCheck, items: [...trip.rampCheck.items, newItem] } });
    }
    setRampItemModal({ isOpen: false, isEdit: false, data: null });
  };

  const handleDeleteP3kItem = (itemId) => {
    if (window.confirm("Hapus item obat/alat P3K ini?")) {
      const updated = trip.p3kKit.items.filter(i => i.id !== itemId);
      updateTrip({ ...trip, p3kKit: { ...trip.p3kKit, items: updated } });
    }
  };

  const handleSaveP3kItem = (e) => {
    e.preventDefault();
    const item = p3kItemModal.data;
    if (p3kItemModal.isEdit) {
      const updated = trip.p3kKit.items.map(i => i.id === item.id ? { ...item } : i);
      updateTrip({ ...trip, p3kKit: { ...trip.p3kKit, items: updated } });
    } else {
      const newItem = { ...item, id: `p-${Date.now()}` };
      updateTrip({ ...trip, p3kKit: { ...trip.p3kKit, items: [...trip.p3kKit.items, newItem] } });
    }
    setP3kItemModal({ isOpen: false, isEdit: false, data: null });
  };

  const filteredPax = trip.passengers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.docNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.allergy && p.allergy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Sub-tab Navigation */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--slate-200)", paddingBottom: 10, flexWrap: "wrap" }}>
        {[
          { id: "manifest", label: "Modul 1: Manifes & Profil Medis Wisatawan", icon: Users },
          { id: "logistics", label: "Modul 2: Logistik Penerbangan, Hotel & Vendor", icon: Bus },
          { id: "k3-prep", label: "Modul 3: Inspeksi K3 (Ramp Check & P3K)", icon: ShieldCheck },
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
          SUB-TAB 1: MANIFEST & PROFIL MEDIS LENGKAP
      ========================================================================= */}
      {activeSubTab === "manifest" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Header Bar */}
          <div className="card" style={{ background: "var(--slate-50)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <span style={{ fontSize: "0.7rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 700 }}>MANIFES PESERTA LENGKAP (SPT: {trip.sptNumber})</span>
                <h3 style={{ fontSize: "1.1rem", color: "var(--slate-900)" }}>{trip.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--slate-600)" }}>
                  Lead TL: <strong>{trip.staff.leadTL.name}</strong> • Tour Guide: <strong>{trip.staff.tourGuide?.name || "Ahmad Dahlan"}</strong> • Total: <strong>{trip.passengers.length} Pax</strong>
                </p>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    const doc = generatePassengerManifestPDF(trip);
                    doc.save(`Passenger_Manifest_${trip.id}.pdf`);
                  }}
                >
                  <Download size={14} /> Unduh Manifes PDF
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleOpenAddPax}>
                  <Plus size={14} /> Tambah Wisatawan Lengkap
                </button>
              </div>
            </div>
          </div>

          {/* Passenger Table */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={18} color="var(--primary-600)" />
                <h4 style={{ fontSize: "0.95rem", margin: 0 }}>Daftar Wisatawan ({trip.passengers.length} Orang)</h4>
              </div>

              <div style={{ position: "relative", minWidth: 280 }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "var(--slate-400)" }} />
                <input
                  type="text"
                  placeholder="Cari nama, paspor, alergi, atau penyakit..."
                  className="input-field"
                  style={{ paddingLeft: 30, fontSize: "0.8rem", height: 34 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container" style={{ border: "none" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID & Nama</th>
                    <th>Kontak WhatsApp & Darurat</th>
                    <th>Identitas Dokumen</th>
                    <th>Riwayat Penyakit & Obat</th>
                    <th>Alergi & Pantangan Makanan</th>
                    <th>Kamar & Kursi</th>
                    <th style={{ textAlign: "center" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPax.map((pax) => (
                    <tr key={pax.id}>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--primary-700)", fontSize: "0.75rem" }}>
                          {pax.id} ({pax.gender})
                        </span>
                        <strong style={{ display: "block", color: "var(--slate-900)", fontSize: "0.875rem" }}>{pax.name}</strong>
                        <span style={{ fontSize: "0.7rem", color: "var(--slate-500)" }}>Lahir: {pax.dob}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.75rem" }}>
                          <span style={{ color: "#059669", fontWeight: 600 }}>WA: {pax.waPhone || pax.phone}</span>
                          <span style={{ display: "block", color: "var(--slate-600)", marginTop: 2 }}>
                            <strong>Darurat:</strong> {pax.emergencyContactName || "Keluarga"} ({pax.emergencyContactWa || pax.emergencyContact})
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{pax.docType}: {pax.docNo}</span>
                        <span style={{ display: "block", fontSize: "0.7rem", color: "var(--emerald-600)" }}>
                          Exp: {pax.expiryDate} ({pax.mdacStatus})
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.75rem", display: "block", color: pax.medicalHistory !== "Tidak Ada" ? "#b91c1c" : "var(--slate-600)", fontWeight: pax.medicalHistory !== "Tidak Ada" ? 600 : 400 }}>
                          🩺 {pax.medicalHistory || "Tidak Ada"}
                        </span>
                        {pax.requiredMedicines && pax.requiredMedicines !== "Tidak Ada" && (
                          <span style={{ fontSize: "0.7rem", color: "#6b21a8", display: "block" }}>
                            💊 Obat: {pax.requiredMedicines}
                          </span>
                        )}
                      </td>
                      <td>
                        {pax.allergy && pax.allergy !== "Tidak Ada" ? (
                          <span className="badge badge-rose" style={{ fontSize: "0.7rem", display: "inline-block", marginBottom: 2 }}>
                            Alergi: {pax.allergy}
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.725rem", color: "var(--slate-400)", display: "block" }}>Bebas Alergi</span>
                        )}
                        {pax.foodRestrictions && pax.foodRestrictions !== "Tidak Ada" && (
                          <span style={{ fontSize: "0.7rem", color: "#c2410c", display: "block" }}>
                            Pantangan: {pax.foodRestrictions}
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{pax.roomNo}</span>
                        <span style={{ display: "block", fontSize: "0.7rem", color: "var(--primary-600)", fontWeight: 700 }}>Seat: {pax.seatNo}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 6px" }}
                            title="QR e-Pass"
                            onClick={() => setSelectedPaxForQr(pax)}
                          >
                            <QrCode size={13} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 6px" }}
                            title="Edit Wisatawan"
                            onClick={() => handleOpenEditPax(pax)}
                          >
                            <Edit2 size={13} color="var(--primary-600)" />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 6px" }}
                            title="Hapus Wisatawan"
                            onClick={() => handleDeletePax(pax.id)}
                          >
                            <Trash2 size={13} color="var(--rose-600)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: LOGISTICS & VENDOR CRUD
      ========================================================================= */}
      {activeSubTab === "logistics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Flight Card */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Plane size={18} color="var(--primary-600)" />
                <h4 style={{ fontSize: "0.95rem", margin: 0 }}>Daftar Penerbangan (Flight Logistics)</h4>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setFlightModal({
                  isOpen: true,
                  isEdit: false,
                  data: { flightNo: "", airline: "", pnr: "", route: "", departureTime: "", arrivalTime: "", terminal: "", baggageAllowance: "30 Kg" }
                })}
              >
                <Plus size={13} /> Tambah Penerbangan
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
              {trip.logistics.flights.map((f, idx) => (
                <div key={f.id || idx} style={{ padding: 14, background: "var(--slate-50)", borderRadius: 8, border: "1px solid var(--slate-200)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <strong style={{ fontSize: "0.95rem", color: "var(--slate-900)" }}>{f.airline} ({f.flightNo})</strong>
                      <span className="badge badge-blue" style={{ marginLeft: 6 }}>PNR: {f.pnr}</span>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "2px 6px" }}
                        onClick={() => setFlightModal({ isOpen: true, isEdit: true, data: f })}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "2px 6px" }}
                        onClick={() => handleDeleteFlight(f.id)}
                      >
                        <Trash2 size={12} color="var(--rose-600)" />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.775rem", color: "var(--slate-700)", margin: "4px 0" }}><strong>Rute:</strong> {f.route}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--slate-600)", margin: "2px 0" }}><strong>Jadwal:</strong> {f.departureTime} ➔ {f.arrivalTime}</p>
                  <span style={{ fontSize: "0.7rem", color: "var(--slate-500)" }}>{f.terminal} • Bagasi: {f.baggageAllowance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel & Vendor Card */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
            {/* Hotel */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ fontSize: "0.95rem", margin: 0 }}>Akomodasi Hotel</h4>
                <button className="btn btn-secondary btn-sm" onClick={() => setHotelModal({ isOpen: true })}>
                  <Edit2 size={13} /> Edit Hotel
                </button>
              </div>
              <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: 8, background: "var(--slate-50)", padding: 12, borderRadius: 8 }}>
                <div><strong>Nama Hotel:</strong> {trip.logistics.hotel.name}</div>
                <div><strong>Booking ID:</strong> <span style={{ fontFamily: "var(--font-mono)" }}>{trip.logistics.hotel.bookingId}</span></div>
                <div><strong>Alamat:</strong> {trip.logistics.hotel.address}</div>
                <div><strong>Periode Menginap:</strong> {trip.logistics.hotel.checkInDate} s/d {trip.logistics.hotel.checkOutDate} ({trip.logistics.hotel.totalRooms} Kamar)</div>
              </div>
            </div>

            {/* Vendor Transport */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ fontSize: "0.95rem", margin: 0 }}>Vendor Transportasi & Bus</h4>
                <button className="btn btn-secondary btn-sm" onClick={() => setVendorModal({ isOpen: true })}>
                  <Edit2 size={13} /> Edit Vendor
                </button>
              </div>
              <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: 8, background: "var(--slate-50)", padding: 12, borderRadius: 8 }}>
                <div><strong>Perusahaan:</strong> {trip.logistics.transportVendor.company}</div>
                <div><strong>Service Order:</strong> {trip.logistics.transportVendor.serviceOrderNo} (PIC: {trip.logistics.transportVendor.pic} - {trip.logistics.transportVendor.contact})</div>
                <div><strong>Tipe Armada & Plat:</strong> {trip.logistics.transportVendor.vehicleType} (<strong>{trip.logistics.transportVendor.plateNumber}</strong>)</div>
                <div><strong>Driver:</strong> {trip.logistics.transportVendor.driverName} ({trip.logistics.transportVendor.driverPhone})</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: K3 RAMP CHECK & P3K CRUD
      ========================================================================= */}
      {activeSubTab === "k3-prep" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Ramp Check Card */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: 4 }}>FORM FM-K3-KOPKAR-01</span>
                <h3 style={{ fontSize: "1.05rem" }}>Inspeksi Kelaikan Armada Bus (Ramp Check)</h3>
                <p style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>
                  Audit Pra-Perjalanan • Plat: {trip.rampCheck.vehiclePlate} • Driver: {trip.rampCheck.driverName}
                </p>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setRampItemModal({
                    isOpen: true,
                    isEdit: false,
                    data: { name: "", status: "LAIK", notes: "" }
                  })}
                >
                  <Plus size={14} /> Tambah Parameter K3
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onOpenSignModal("Pengemudi Bus", trip.rampCheck.driverName)}
                >
                  <PenTool size={14} /> e-Sign Driver & TL
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const doc = generateRampCheckPDF(trip);
                    doc.save(`Ramp_Check_FM-K3-01_${trip.id}.pdf`);
                  }}
                >
                  <Download size={14} /> Unduh PDF
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>No</th>
                    <th>Komponen Keselamatan Armada & Fisik Pengemudi</th>
                    <th>Status Kelaikan (Klik untuk Ubah)</th>
                    <th>Catatan Verifikasi Lapangan</th>
                    <th style={{ width: 80, textAlign: "center" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {trip.rampCheck.items.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: "center", fontWeight: 700 }}>{index + 1}</td>
                      <td><strong>{item.name}</strong></td>
                      <td>
                        <button
                          onClick={() => handleToggleRampCheck(item.id)}
                          className={`badge ${item.status === "LAIK" ? "badge-emerald" : "badge-rose"}`}
                          style={{ cursor: "pointer", border: "none", padding: "4px 10px", fontSize: "0.75rem" }}
                        >
                          {item.status === "LAIK" ? "✓ LAIK JALAN" : "⚠ PERBAIKAN"}
                        </button>
                      </td>
                      <td style={{ color: "var(--slate-600)" }}>{item.notes}</td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "2px 6px" }}
                            onClick={() => setRampItemModal({ isOpen: true, isEdit: true, data: item })}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "2px 6px" }}
                            onClick={() => handleDeleteRampItem(item.id)}
                          >
                            <Trash2 size={12} color="var(--rose-600)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* P3K Card */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: 4 }}>FORM FM-K3-KOPKAR-03</span>
                <h3 style={{ fontSize: "1.05rem" }}>Audit Kelengkapan Kotak P3K Lapangan</h3>
                <p style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>
                  Pemeriksa: {trip.p3kKit.inspectorName} • Status: {trip.p3kKit.status}
                </p>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setP3kItemModal({
                    isOpen: true,
                    isEdit: false,
                    data: { name: "", qty: "1 Box", expiry: "2028-12", condition: "Baik" }
                  })}
                >
                  <Plus size={14} /> Tambah Obat / Alat Medis
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const doc = generateP3kCheckPDF(trip);
                    doc.save(`Checklist_P3K_FM-K3-03_${trip.id}.pdf`);
                  }}
                >
                  <Download size={14} /> Unduh PDF
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>No</th>
                    <th>Nama Obat / Peralatan Medis</th>
                    <th>Jumlah (Qty)</th>
                    <th>Masa Kadaluarsa</th>
                    <th>Kondisi Fisik</th>
                    <th style={{ width: 80, textAlign: "center" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {trip.p3kKit.items.map((p, idx) => (
                    <tr key={p.id}>
                      <td style={{ textAlign: "center" }}>{idx + 1}</td>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.qty}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{p.expiry}</td>
                      <td><span className="badge badge-slate">{p.condition}</span></td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "2px 6px" }}
                            onClick={() => setP3kItemModal({ isOpen: true, isEdit: true, data: p })}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "2px 6px" }}
                            onClick={() => handleDeleteP3kItem(p.id)}
                          >
                            <Trash2 size={12} color="var(--rose-600)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QR Pass Modal */}
      <QRPassModal
        isOpen={!!selectedPaxForQr}
        onClose={() => setSelectedPaxForQr(null)}
        passenger={selectedPaxForQr}
        tripTitle={trip.title}
        sptNumber={trip.sptNumber}
      />

      {/* =========================================================================
          FULL PASSENGER ADD / EDIT MODAL
      ========================================================================= */}
      {paxModal.isOpen && (
        <div className="modal-overlay" onClick={() => setPaxModal({ isOpen: false, isEdit: false, data: null })}>
          <div className="modal-content" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--slate-900)", color: "#fff", borderRadius: "16px 16px 0 0" }}>
              <div>
                <h3 style={{ fontSize: "1rem", color: "#fff", margin: 0 }}>
                  {paxModal.isEdit ? "Edit Data & Profil Medis Wisatawan" : "Tambah Wisatawan Baru"}
                </h3>
                <p style={{ fontSize: "0.7rem", color: "var(--slate-400)", margin: 0 }}>Lengkapi kontak WhatsApp, riwayat kesehatan, dan pantangan makanan</p>
              </div>
              <button onClick={() => setPaxModal({ isOpen: false, isEdit: false, data: null })} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleSavePax} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Identitas Dasar */}
              <div style={{ background: "var(--slate-50)", padding: 12, borderRadius: 8, border: "1px solid var(--slate-200)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate-800)", display: "block", marginBottom: 8 }}>1. Identitas Wisatawan</span>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Nama Lengkap & Gelar:</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={paxForm.name}
                      onChange={(e) => setPaxForm({ ...paxForm, name: e.target.value })}
                      placeholder="Contoh: Dr. Hendra Wijaya"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Jenis Kelamin:</label>
                    <select
                      className="input-field"
                      value={paxForm.gender}
                      onChange={(e) => setPaxForm({ ...paxForm, gender: e.target.value })}
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Tanggal Lahir:</label>
                    <input
                      type="date"
                      className="input-field"
                      value={paxForm.dob}
                      onChange={(e) => setPaxForm({ ...paxForm, dob: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 10, marginTop: 8 }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Jenis Dokumen:</label>
                    <select
                      className="input-field"
                      value={paxForm.docType}
                      onChange={(e) => setPaxForm({ ...paxForm, docType: e.target.value })}
                    >
                      <option value="Paspor">Paspor Internasional</option>
                      <option value="KTP">KTP Elektronik</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Nomor Dokumen (Paspor/KTP):</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={paxForm.docNo}
                      onChange={(e) => setPaxForm({ ...paxForm, docNo: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Masa Berlaku Exp:</label>
                    <input
                      type="date"
                      className="input-field"
                      value={paxForm.expiryDate}
                      onChange={(e) => setPaxForm({ ...paxForm, expiryDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Kontak WhatsApp & Darurat */}
              <div style={{ background: "var(--slate-50)", padding: 12, borderRadius: 8, border: "1px solid var(--slate-200)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate-800)", display: "block", marginBottom: 8 }}>2. Kontak WhatsApp & Kontak Darurat</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>No. WhatsApp Pribadi:</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={paxForm.waPhone}
                      onChange={(e) => setPaxForm({ ...paxForm, waPhone: e.target.value, phone: e.target.value })}
                      placeholder="+62 812-xxxx-xxxx"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Nama Kontak Darurat:</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={paxForm.emergencyContactName}
                      onChange={(e) => setPaxForm({ ...paxForm, emergencyContactName: e.target.value })}
                      placeholder="Ibu Maya (Istri)"
                    />
                  </div>
                </div>

                <div style={{ marginTop: 8 }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>No. WhatsApp Kontak Darurat:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={paxForm.emergencyContactWa}
                    onChange={(e) => setPaxForm({ ...paxForm, emergencyContactWa: e.target.value, emergencyContact: `${paxForm.emergencyContactName} - ${e.target.value}` })}
                    placeholder="+62 811-xxxx-xxxx"
                  />
                </div>
              </div>

              {/* Profil Medis, Alergi, & Obat */}
              <div style={{ background: "var(--slate-50)", padding: 12, borderRadius: 8, border: "1px solid var(--slate-200)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate-800)", display: "block", marginBottom: 8 }}>3. Profil Medis, Alergi & Pantangan Makanan</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Riwayat Penyakit Khusus:</label>
                    <input
                      type="text"
                      className="input-field"
                      value={paxForm.medicalHistory}
                      onChange={(e) => setPaxForm({ ...paxForm, medicalHistory: e.target.value })}
                      placeholder="Hipertensi, Asma, Vertigo, dll"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Alergi atau Diet Khusus:</label>
                    <input
                      type="text"
                      className="input-field"
                      value={paxForm.allergy}
                      onChange={(e) => setPaxForm({ ...paxForm, allergy: e.target.value })}
                      placeholder="Udang, Seafood, Debu, Gluten"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Pantangan Makanan:</label>
                    <input
                      type="text"
                      className="input-field"
                      value={paxForm.foodRestrictions}
                      onChange={(e) => setPaxForm({ ...paxForm, foodRestrictions: e.target.value })}
                      placeholder="Tidak makan pedas, No Pork, dll"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Obat-obatan yang Diperlukan:</label>
                    <input
                      type="text"
                      className="input-field"
                      value={paxForm.requiredMedicines}
                      onChange={(e) => setPaxForm({ ...paxForm, requiredMedicines: e.target.value })}
                      placeholder="Amlodipine, Inhaler, Antasida"
                    />
                  </div>
                </div>
              </div>

              {/* Alokasi Kamar & Kursi */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Alokasi Kamar Hotel:</label>
                  <input
                    type="text"
                    className="input-field"
                    value={paxForm.roomNo}
                    onChange={(e) => setPaxForm({ ...paxForm, roomNo: e.target.value })}
                    placeholder="Room 1402 (Twin)"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600 }}>Nomor Kursi Bus:</label>
                  <input
                    type="text"
                    className="input-field"
                    value={paxForm.seatNo}
                    onChange={(e) => setPaxForm({ ...paxForm, seatNo: e.target.value })}
                    placeholder="1A"
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPaxModal({ isOpen: false, isEdit: false, data: null })}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Data Wisatawan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flight Modal */}
      {flightModal.isOpen && flightModal.data && (
        <div className="modal-overlay" onClick={() => setFlightModal({ isOpen: false, isEdit: false, data: null })}>
          <div className="modal-content" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>{flightModal.isEdit ? "Edit Data Penerbangan" : "Tambah Penerbangan"}</h3>
              <button onClick={() => setFlightModal({ isOpen: false, isEdit: false, data: null })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleSaveFlight} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Maskapai:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={flightModal.data.airline}
                    onChange={(e) => setFlightModal({ ...flightModal, data: { ...flightModal.data, airline: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nomor Flight:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={flightModal.data.flightNo}
                    onChange={(e) => setFlightModal({ ...flightModal, data: { ...flightModal.data, flightNo: e.target.value } })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Kode PNR Booking:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={flightModal.data.pnr}
                    onChange={(e) => setFlightModal({ ...flightModal, data: { ...flightModal.data, pnr: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Rute Penerbangan:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={flightModal.data.route}
                    onChange={(e) => setFlightModal({ ...flightModal, data: { ...flightModal.data, route: e.target.value } })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Waktu Berangkat:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={flightModal.data.departureTime}
                    onChange={(e) => setFlightModal({ ...flightModal, data: { ...flightModal.data, departureTime: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Waktu Tiba:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={flightModal.data.arrivalTime}
                    onChange={(e) => setFlightModal({ ...flightModal, data: { ...flightModal.data, arrivalTime: e.target.value } })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFlightModal({ isOpen: false, isEdit: false, data: null })}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Penerbangan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hotel Edit Modal */}
      {hotelModal.isOpen && (
        <div className="modal-overlay" onClick={() => setHotelModal({ isOpen: false })}>
          <div className="modal-content" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>Edit Data Hotel Akomodasi</h3>
              <button onClick={() => setHotelModal({ isOpen: false })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setHotelModal({ isOpen: false }); }} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Hotel:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={trip.logistics.hotel.name}
                  onChange={(e) => updateTrip({ ...trip, logistics: { ...trip.logistics, hotel: { ...trip.logistics.hotel, name: e.target.value } } })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Booking ID:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={trip.logistics.hotel.bookingId}
                  onChange={(e) => updateTrip({ ...trip, logistics: { ...trip.logistics, hotel: { ...trip.logistics.hotel, bookingId: e.target.value } } })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Alamat Hotel:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={trip.logistics.hotel.address}
                  onChange={(e) => updateTrip({ ...trip, logistics: { ...trip.logistics, hotel: { ...trip.logistics.hotel, address: e.target.value } } })}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button type="submit" className="btn btn-primary btn-sm">Selesai</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Edit Modal */}
      {vendorModal.isOpen && (
        <div className="modal-overlay" onClick={() => setVendorModal({ isOpen: false })}>
          <div className="modal-content" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>Edit Data Vendor & Bus</h3>
              <button onClick={() => setVendorModal({ isOpen: false })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setVendorModal({ isOpen: false }); }} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Perusahaan Otobis / Vendor:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={trip.logistics.transportVendor.company}
                  onChange={(e) => updateTrip({ ...trip, logistics: { ...trip.logistics, transportVendor: { ...trip.logistics.transportVendor, company: e.target.value } } })}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Driver:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={trip.logistics.transportVendor.driverName}
                    onChange={(e) => updateTrip({
                      ...trip,
                      logistics: { ...trip.logistics, transportVendor: { ...trip.logistics.transportVendor, driverName: e.target.value } },
                      rampCheck: { ...trip.rampCheck, driverName: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nomor Plat Bus:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={trip.logistics.transportVendor.plateNumber}
                    onChange={(e) => updateTrip({
                      ...trip,
                      logistics: { ...trip.logistics, transportVendor: { ...trip.logistics.transportVendor, plateNumber: e.target.value } },
                      rampCheck: { ...trip.rampCheck, vehiclePlate: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button type="submit" className="btn btn-primary btn-sm">Selesai</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ramp Check Item Modal */}
      {rampItemModal.isOpen && rampItemModal.data && (
        <div className="modal-overlay" onClick={() => setRampItemModal({ isOpen: false, isEdit: false, data: null })}>
          <div className="modal-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>{rampItemModal.isEdit ? "Edit Parameter Ramp Check" : "Tambah Parameter Ramp Check"}</h3>
              <button onClick={() => setRampItemModal({ isOpen: false, isEdit: false, data: null })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleSaveRampItem} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Komponen / Pemeriksaan:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={rampItemModal.data.name}
                  onChange={(e) => setRampItemModal({ ...rampItemModal, data: { ...rampItemModal.data, name: e.target.value } })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Status Awal:</label>
                <select
                  className="input-field"
                  value={rampItemModal.data.status}
                  onChange={(e) => setRampItemModal({ ...rampItemModal, data: { ...rampItemModal.data, status: e.target.value } })}
                >
                  <option value="LAIK">LAIK</option>
                  <option value="PERBAIKAN">PERBAIKAN</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Catatan Verifikasi:</label>
                <input
                  type="text"
                  className="input-field"
                  value={rampItemModal.data.notes}
                  onChange={(e) => setRampItemModal({ ...rampItemModal, data: { ...rampItemModal.data, notes: e.target.value } })}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* P3K Item Modal */}
      {p3kItemModal.isOpen && p3kItemModal.data && (
        <div className="modal-overlay" onClick={() => setP3kItemModal({ isOpen: false, isEdit: false, data: null })}>
          <div className="modal-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>{p3kItemModal.isEdit ? "Edit Item P3K" : "Tambah Item Obat/Alat Medis"}</h3>
              <button onClick={() => setP3kItemModal({ isOpen: false, isEdit: false, data: null })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleSaveP3kItem} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Obat / Alat Medis:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={p3kItemModal.data.name}
                  onChange={(e) => setP3kItemModal({ ...p3kItemModal, data: { ...p3kItemModal.data, name: e.target.value } })}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Jumlah (Qty):</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={p3kItemModal.data.qty}
                    onChange={(e) => setP3kItemModal({ ...p3kItemModal, data: { ...p3kItemModal.data, qty: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Masa Kadaluarsa:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={p3kItemModal.data.expiry}
                    onChange={(e) => setP3kItemModal({ ...p3kItemModal, data: { ...p3kItemModal.data, expiry: e.target.value } })}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
