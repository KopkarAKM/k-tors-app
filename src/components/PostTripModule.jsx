import React, { useState } from "react";
import { DollarSign, Star, Plus, Download, CheckCircle2, AlertTriangle, FileText, Sparkles, TrendingUp, Users, Receipt, MessageSquare, Edit2, Trash2, ExternalLink, Upload, Paperclip, Link } from "lucide-react";
import { formatRupiah, generateFinancialSettlementPDF, generateCsatReportPDF } from "../utils/pdfGenerator";

export default function PostTripModule({ trip, updateTrip, onOpenSignModal }) {
  const [activeSubTab, setActiveSubTab] = useState("finance");
  
  // Modals state
  const [expenseModal, setExpenseModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [kasbonModal, setKasbonModal] = useState({ isOpen: false });
  const [commentModal, setCommentModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [gformModal, setGformModal] = useState({ isOpen: false });

  const totalExpense = trip.finance.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const cashAdvance = trip.finance.cashAdvance;
  const balance = cashAdvance - totalExpense;

  // ==========================================
  // EXPENSE CRUD HANDLERS
  // ==========================================
  const handleOpenAddExpense = () => {
    const nextId = `EXP-${String(trip.finance.expenses.length + 1).padStart(2, "0")}`;
    setExpenseModal({
      isOpen: true,
      isEdit: false,
      data: {
        id: nextId,
        date: new Date().toISOString().split("T")[0],
        category: "Tol & Parkir",
        description: "",
        amount: "",
        receiptProof: "Nota Resmi #NEW"
      }
    });
  };

  const handleOpenEditExpense = (exp) => {
    setExpenseModal({
      isOpen: true,
      isEdit: true,
      data: { ...exp }
    });
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    const expData = {
      ...expenseModal.data,
      amount: parseInt(expenseModal.data.amount, 10) || 0
    };

    if (expenseModal.isEdit) {
      const updated = trip.finance.expenses.map(exp => exp.id === expData.id ? expData : exp);
      updateTrip({ ...trip, finance: { ...trip.finance, expenses: updated } });
    } else {
      updateTrip({ ...trip, finance: { ...trip.finance, expenses: [...trip.finance.expenses, expData] } });
    }
    setExpenseModal({ isOpen: false, isEdit: false, data: null });
  };

  const handleDeleteExpense = (expId) => {
    if (window.confirm("Hapus rincian pengeluaran nota ini?")) {
      const updated = trip.finance.expenses.filter(exp => exp.id !== expId);
      updateTrip({ ...trip, finance: { ...trip.finance, expenses: updated } });
    }
  };

  // ==========================================
  // CSAT TESTIMONIAL CRUD HANDLERS
  // ==========================================
  const handleOpenAddComment = () => {
    const nextId = `cm-${Date.now()}`;
    setCommentModal({
      isOpen: true,
      isEdit: false,
      data: {
        id: nextId,
        name: trip.passengers[0]?.name || "Wisatawan",
        rating: 5,
        comment: ""
      }
    });
  };

  const handleOpenEditComment = (comment) => {
    setCommentModal({
      isOpen: true,
      isEdit: true,
      data: { ...comment }
    });
  };

  const handleSaveComment = (e) => {
    e.preventDefault();
    const cm = {
      ...commentModal.data,
      rating: parseFloat(commentModal.data.rating)
    };

    if (commentModal.isEdit) {
      const updated = trip.csat.guestComments.map(c => c.id === cm.id || (c.name === cm.name && !c.id) ? cm : c);
      updateTrip({ ...trip, csat: { ...trip.csat, guestComments: updated } });
    } else {
      updateTrip({ ...trip, csat: { ...trip.csat, guestComments: [...trip.csat.guestComments, cm] } });
    }
    setCommentModal({ isOpen: false, isEdit: false, data: null });
  };

  const handleDeleteComment = (commentId, index) => {
    if (window.confirm("Hapus ulasan evaluasi ini?")) {
      const updated = trip.csat.guestComments.filter((c, i) => (c.id ? c.id !== commentId : i !== index));
      updateTrip({ ...trip, csat: { ...trip.csat, guestComments: updated } });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Sub-tab Navigation */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--slate-200)", paddingBottom: 10, flexWrap: "wrap" }}>
        {[
          { id: "finance", label: "Modul 7: Settlement Keuangan & Bukti Kas Bon", icon: DollarSign },
          { id: "csat", label: "Modul 8: Evaluasi CSAT & Google Form", icon: Star },
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
          SUB-TAB 1: KEUANGAN & BUKTI KAS BON CRUD
      ========================================================================= */}
      {activeSubTab === "finance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* 3 Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            <div className="card" style={{ background: "var(--slate-50)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 600 }}>KAS AWAL (CASH ADVANCE)</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--slate-900)", marginTop: 4 }}>
                    {formatRupiah(cashAdvance)}
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: "4px 8px", fontSize: "0.7rem" }}
                  onClick={() => setKasbonModal({ isOpen: true })}
                >
                  <Edit2 size={12} /> Edit Kas Bon
                </button>
              </div>

              <div style={{ marginTop: 8, padding: "6px 10px", background: "#fff", borderRadius: 6, border: "1px solid var(--slate-200)", fontSize: "0.7rem" }}>
                <span style={{ color: "var(--slate-500)", display: "block" }}>Voucher: <strong>{trip.finance.disbursementVoucherNo}</strong></span>
                <span style={{ color: "var(--primary-700)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <Paperclip size={12} /> {trip.finance.cashAdvanceProofDoc || "Voucher Kasbon Terlampir"}
                </span>
              </div>
            </div>

            <div className="card" style={{ background: "var(--slate-50)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: 600 }}>TOTAL REALISASI LAPANGAN</span>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--rose-600)", marginTop: 4 }}>
                {formatRupiah(totalExpense)}
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--slate-500)", marginTop: 4, display: "block" }}>
                {trip.finance.expenses.length} Bukti Nota Terlampir
              </span>
            </div>

            <div className="card" style={{ background: balance >= 0 ? "var(--emerald-50)" : "var(--rose-50)", borderColor: balance >= 0 ? "#86efac" : "#fca5a5" }}>
              <span style={{ fontSize: "0.75rem", color: balance >= 0 ? "var(--emerald-800)" : "var(--rose-800)", textTransform: "uppercase", fontWeight: 700 }}>
                {balance >= 0 ? "SISA KAS LEBIH (SURPLUS)" : "DEFISIT KAS LAPANGAN"}
              </span>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: balance >= 0 ? "var(--emerald-700)" : "var(--rose-700)", marginTop: 4 }}>
                {formatRupiah(Math.abs(balance))}
              </div>
              <span style={{ fontSize: "0.7rem", color: balance >= 0 ? "var(--emerald-700)" : "var(--rose-700)", marginTop: 4, display: "block" }}>
                {balance >= 0 ? "Wajib disetor kembali ke kasir" : "Klaim penggantian ke Finance"}
              </span>
            </div>
          </div>

          {/* Expenses List Card */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h4 style={{ fontSize: "0.95rem", margin: 0 }}>Daftar Nota & Kuitansi Pengeluaran Tur</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--slate-500)", margin: 0 }}>Daftar beban operasional yang telah diverifikasi</p>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    const doc = generateFinancialSettlementPDF(trip);
                    doc.save(`Settlement_Keuangan_${trip.id}.pdf`);
                  }}
                >
                  <Download size={14} /> Unduh Settlement PDF
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleOpenAddExpense}>
                  <Plus size={14} /> Tambah Nota / Beban
                </button>
              </div>
            </div>

            <div className="table-container" style={{ border: "none" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tanggal</th>
                    <th>Kategori Beban</th>
                    <th>Rincian Keterangan</th>
                    <th>Nomor Bukti / Kuitansi</th>
                    <th style={{ textAlign: "right" }}>Jumlah (IDR)</th>
                    <th style={{ width: 80, textAlign: "center" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {trip.finance.expenses.map((exp, index) => (
                    <tr key={exp.id || index}>
                      <td style={{ textAlign: "center", fontWeight: 700 }}>{index + 1}</td>
                      <td>{exp.date}</td>
                      <td><span className="badge badge-blue">{exp.category}</span></td>
                      <td><strong>{exp.description}</strong></td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--slate-600)" }}>
                        <Receipt size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                        {exp.receiptProof}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "var(--slate-900)" }}>
                        {formatRupiah(exp.amount)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "2px 6px" }}
                            onClick={() => handleOpenEditExpense(exp)}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "2px 6px" }}
                            onClick={() => handleDeleteExpense(exp.id)}
                          >
                            <Trash2 size={12} color="var(--rose-600)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr style={{ background: "var(--slate-50)", fontWeight: 800 }}>
                    <td colSpan={4} style={{ textAlign: "right", textTransform: "uppercase", fontSize: "0.8rem", color: "var(--slate-700)" }}>
                      Total Seluruh Pengeluaran Realisasi:
                    </td>
                    <td colSpan={3} style={{ textAlign: "right", fontSize: "0.95rem", color: "var(--rose-700)" }}>
                      {formatRupiah(totalExpense)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: EVALUASI & GOOGLE FORM CSAT
      ========================================================================= */}
      {activeSubTab === "csat" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Google Form Integration Hero Card */}
          <div className="card" style={{ background: "linear-gradient(135deg, #065f46 0%, #047857 100%)", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <span className="badge badge-emerald" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
                  KUESIONER DIGITAL GOOGLE FORM
                </span>
                <h3 style={{ fontSize: "1.4rem", color: "#fff", margin: "6px 0 2px 0" }}>
                  Evaluasi Kepuasan Wisatawan (CSAT Score: {trip.csat.overallSatisfactionPercent}%)
                </h3>
                <p style={{ fontSize: "0.8rem", color: "#d1fae5", margin: 0 }}>
                  Link Google Form: <strong style={{ color: "#fff", textDecoration: "underline" }}>{trip.csat.googleFormUrl || "Belum Dikonfigurasi"}</strong>
                </p>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ background: "#fff", color: "var(--emerald-800)", fontWeight: 700 }}
                  onClick={() => setGformModal({ isOpen: true })}
                >
                  <Link size={14} /> Hubungkan Google Form
                </button>
                <a
                  href={trip.csat.googleFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
                >
                  <ExternalLink size={14} /> Buka Form Wisatawan
                </a>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
                  onClick={() => {
                    const doc = generateCsatReportPDF(trip);
                    doc.save(`Laporan_CSAT_${trip.id}.pdf`);
                  }}
                >
                  <Download size={14} /> Unduh PDF
                </button>
              </div>
            </div>
          </div>

          {/* 6 Indicators & Testimonials Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
            {/* Indicators Progress */}
            <div className="card">
              <h4 style={{ fontSize: "0.95rem", marginBottom: 14 }}>6 Indikator Penilaian Kuesioner Kepuasan</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {trip.csat.indicators.map((ind) => {
                  const percent = (ind.score / ind.maxScore) * 100;
                  return (
                    <div key={ind.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: "var(--slate-800)" }}>{ind.title}</span>
                        <strong style={{ color: "var(--primary-700)" }}>{ind.score.toFixed(2)} / 5.0</strong>
                      </div>
                      <div style={{ width: "100%", height: 7, background: "var(--slate-100)", borderRadius: 9999, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${percent}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #3b82f6 0%, #10b981 100%)",
                            borderRadius: 9999
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonials List with CRUD */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h4 style={{ fontSize: "0.95rem", margin: 0 }}>Ulasan & Masukan dari Google Form</h4>
                <button className="btn btn-secondary btn-sm" onClick={handleOpenAddComment}>
                  <Plus size={13} /> Tambah Ulasan Manual
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 360, overflowY: "auto" }}>
                {trip.csat.guestComments.map((comment, index) => (
                  <div key={comment.id || index} style={{ padding: 12, borderRadius: 8, background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <strong style={{ fontSize: "0.825rem", color: "var(--slate-900)" }}>{comment.name}</strong>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: 700 }}>
                          {"★".repeat(Math.round(comment.rating))} {comment.rating}/5
                        </span>
                        <button
                          onClick={() => handleOpenEditComment(comment)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px" }}
                        >
                          <Edit2 size={12} color="var(--slate-500)" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id, index)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px" }}
                        >
                          <Trash2 size={12} color="var(--rose-600)" />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.775rem", color: "var(--slate-600)", fontStyle: "italic", margin: 0 }}>
                      "{comment.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS
      ========================================================================= */}
      {/* Kasbon Modal */}
      {kasbonModal.isOpen && (
        <div className="modal-overlay" onClick={() => setKasbonModal({ isOpen: false })}>
          <div className="modal-content" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>Edit Data & Bukti Dokumen Kas Bon Awal</h3>
              <button onClick={() => setKasbonModal({ isOpen: false })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setKasbonModal({ isOpen: false }); }} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nominal Kas Awal (IDR):</label>
                <input
                  type="number"
                  required
                  className="input-field"
                  value={trip.finance.cashAdvance}
                  onChange={(e) => updateTrip({ ...trip, finance: { ...trip.finance, cashAdvance: parseInt(e.target.value, 10) || 0 } })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nomor Voucher / Bukti Kas Bon:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={trip.finance.disbursementVoucherNo}
                  onChange={(e) => updateTrip({ ...trip, finance: { ...trip.finance, disbursementVoucherNo: e.target.value } })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Dokumen / Keterangan Kasbon:</label>
                <input
                  type="text"
                  className="input-field"
                  value={trip.finance.cashAdvanceProofDoc || ""}
                  onChange={(e) => updateTrip({ ...trip, finance: { ...trip.finance, cashAdvanceProofDoc: e.target.value } })}
                  placeholder="Voucher Kasbon No. KV-410 (Disetujui Ka. Koperasi)"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {expenseModal.isOpen && expenseModal.data && (
        <div className="modal-overlay" onClick={() => setExpenseModal({ isOpen: false, isEdit: false, data: null })}>
          <div className="modal-content" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>{expenseModal.isEdit ? "Edit Pengeluaran / Nota" : "Tambah Pengeluaran / Nota Realisasi"}</h3>
              <button onClick={() => setExpenseModal({ isOpen: false, isEdit: false, data: null })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleSaveExpense} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Tanggal Nota:</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={expenseModal.data.date}
                    onChange={(e) => setExpenseModal({ ...expenseModal, data: { ...expenseModal.data, date: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Kategori Beban:</label>
                  <select
                    className="input-field"
                    value={expenseModal.data.category}
                    onChange={(e) => setExpenseModal({ ...expenseModal, data: { ...expenseModal.data, category: e.target.value } })}
                  >
                    <option value="Tol & Parkir">Tol & Parkir</option>
                    <option value="Meals / F&B">Meals / F&B</option>
                    <option value="Tiket Atraksi / Objek">Tiket Atraksi / Objek</option>
                    <option value="Airport Handling & Porter">Airport Handling & Porter</option>
                    <option value="Air Mineral & Logistik K3">Air Mineral & Logistik K3</option>
                    <option value="Driver & Local Guide Tip">Driver & Local Guide Tip</option>
                    <option value="Lain-Lain (Misc)">Lain-Lain (Misc)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Rincian Keterangan Pengeluaran:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Contoh: Tiket Masuk Objek Wisata"
                  value={expenseModal.data.description}
                  onChange={(e) => setExpenseModal({ ...expenseModal, data: { ...expenseModal.data, description: e.target.value } })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Jumlah Nominal (IDR):</label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    placeholder="450000"
                    value={expenseModal.data.amount}
                    onChange={(e) => setExpenseModal({ ...expenseModal, data: { ...expenseModal.data, amount: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nomor Bukti / Kuitansi:</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={expenseModal.data.receiptProof}
                    onChange={(e) => setExpenseModal({ ...expenseModal, data: { ...expenseModal.data, receiptProof: e.target.value } })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setExpenseModal({ isOpen: false, isEdit: false, data: null })}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Form Config Modal */}
      {gformModal.isOpen && (
        <div className="modal-overlay" onClick={() => setGformModal({ isOpen: false })}>
          <div className="modal-content" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>Hubungkan Kuesioner Google Form</h3>
              <button onClick={() => setGformModal({ isOpen: false })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setGformModal({ isOpen: false }); }} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>URL / Tautan Google Form Anda:</label>
                <input
                  type="url"
                  required
                  className="input-field"
                  placeholder="https://forms.gle/..."
                  value={trip.csat.googleFormUrl || ""}
                  onChange={(e) => updateTrip({ ...trip, csat: { ...trip.csat, googleFormUrl: e.target.value } })}
                />
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--slate-500)", margin: 0 }}>
                Wisatawan dapat mengisi evaluasi melalui link Google Form ini dan hasilnya direkapitulasi ke dalam laporan.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Tautan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {commentModal.isOpen && commentModal.data && (
        <div className="modal-overlay" onClick={() => setCommentModal({ isOpen: false, isEdit: false, data: null })}>
          <div className="modal-content" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem" }}>{commentModal.isEdit ? "Edit Ulasan Wisatawan" : "Tambah Ulasan Wisatawan"}</h3>
              <button onClick={() => setCommentModal({ isOpen: false, isEdit: false, data: null })} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleSaveComment} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Nama Wisatawan Responden:</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={commentModal.data.name}
                  onChange={(e) => setCommentModal({ ...commentModal, data: { ...commentModal.data, name: e.target.value } })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Rating Bintang (1 - 5):</label>
                <select
                  className="input-field"
                  value={commentModal.data.rating}
                  onChange={(e) => setCommentModal({ ...commentModal, data: { ...commentModal.data, rating: e.target.value } })}
                >
                  <option value={5}>★★★★★ (5 Bintang)</option>
                  <option value={4.8}>★★★★★ (4.8 Bintang)</option>
                  <option value={4.5}>★★★★☆ (4.5 Bintang)</option>
                  <option value={4}>★★★★☆ (4.0 Bintang)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Komentar / Ulasan:</label>
                <textarea
                  required
                  rows={3}
                  className="input-field"
                  value={commentModal.data.comment}
                  onChange={(e) => setCommentModal({ ...commentModal, data: { ...commentModal.data, comment: e.target.value } })}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCommentModal({ isOpen: false, isEdit: false, data: null })}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Ulasan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
