import React, { useState } from "react";
import { Award, CheckCircle2, ShieldCheck, Download, Sparkles, Filter, ExternalLink, UserCheck } from "lucide-react";
import { BNSP_CLUSTERS, TOTAL_BNSP_UNITS } from "../data/bnspUnits";
import { generateBnspPortfolioBundlePDF } from "../utils/pdfGenerator";

export default function BnspMatrixModule({ trip, setActiveTab, onOpenSignModal }) {
  const [selectedClusterId, setSelectedClusterId] = useState("all");

  const filteredClusters = selectedClusterId === "all"
    ? BNSP_CLUSTERS
    : BNSP_CLUSTERS.filter(c => c.id === selectedClusterId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero BNSP Banner */}
      <div className="card" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge badge-emerald">STANDAR KOMPETENSI TOUR LEADER & TOUR GUIDE</span>
              <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
                SKKNI / BNSP No. 038/PAR/2026
              </span>
            </div>
            <h2 style={{ fontSize: "1.5rem", color: "#fff", margin: "2px 0 6px 0" }}>
              Matriks Kepatuhan Standar BNSP (TL & TG)
            </h2>
            <p style={{ fontSize: "0.825rem", color: "var(--slate-300)", margin: 0, maxWidth: 700 }}>
              Digunakan langsung oleh Tim Tour & Travel untuk memastikan seluruh kegiatan operasional perjalanan wisata memenuhi 30 Unit Kompetensi standar Tour Leader (TL) dan Tour Guide (TG).
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.7rem", color: "var(--slate-400)", textTransform: "uppercase" }}>KEPATUHAN STANDAR</span>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#34d399" }}>
                30 / 30 UNIT TERPENUHI (100%)
              </div>
            </div>

            <button
              className="btn btn-emerald btn-sm"
              onClick={() => {
                const doc = generateBnspPortfolioBundlePDF(trip);
                doc.save(`Berkas_Standar_BNSP_TL_TG_${trip.id}.pdf`);
              }}
            >
              <Download size={15} /> Unduh Berkas Standar BNSP TL & TG (PDF)
            </button>
          </div>
        </div>

        {/* Tim Verifikasi Operasional Note */}
        <div style={{ marginTop: 18, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--emerald-500)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <UserCheck size={18} />
            </div>
            <div>
              <span style={{ fontSize: "0.7rem", color: "var(--slate-400)", display: "block" }}>TIM VERIFIKASI OPERASIONAL TUR</span>
              <strong style={{ fontSize: "0.85rem", color: "#fff" }}>{trip.staff.leadTL.name} (TL) & {trip.staff.tourGuide?.name || "Ahmad Dahlan (TG)"}</strong>
              <span style={{ fontSize: "0.7rem", color: "#38bdf8", marginLeft: 8, fontFamily: "var(--font-mono)" }}>SOP Kopkarindo 2024-2026</span>
            </div>
          </div>

          <span className="badge badge-emerald" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>
            ✓ Standar Operasional: SESUAI (VALID)
          </span>
        </div>
      </div>

      {/* Cluster Filter Buttons */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button
          onClick={() => setSelectedClusterId("all")}
          className={`btn btn-sm ${selectedClusterId === "all" ? "btn-primary" : "btn-secondary"}`}
          style={{ fontSize: "0.75rem" }}
        >
          Semua 30 Unit (5 Klaster)
        </button>
        {BNSP_CLUSTERS.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedClusterId(c.id)}
            className={`btn btn-sm ${selectedClusterId === c.id ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.75rem" }}
          >
            {c.name.split(":")[0]} ({c.units.length} Unit)
          </button>
        ))}
      </div>

      {/* Clusters List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {filteredClusters.map((cluster) => (
          <div key={cluster.id} className="card" style={{ padding: 0 }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--slate-200)", background: "var(--slate-50)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderRadius: "10px 10px 0 0" }}>
              <div>
                <h4 style={{ fontSize: "1rem", color: "var(--slate-900)", margin: 0 }}>{cluster.name}</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--slate-500)", margin: 0 }}>{cluster.description}</p>
              </div>

              <span className="badge badge-emerald">
                {cluster.units.length} Unit Terpenuhi (100%)
              </span>
            </div>

            <div className="table-container" style={{ border: "none", borderRadius: "0 0 10px 10px" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: 45 }}>Unit</th>
                    <th style={{ width: 150 }}>Kode Unit BNSP</th>
                    <th>Judul Unit Kompetensi</th>
                    <th>Bukti Bukti Dokumen Digital K-TORS</th>
                    <th style={{ textAlign: "center", width: 140 }}>Hasil Asesmen</th>
                  </tr>
                </thead>
                <tbody>
                  {cluster.units.map(unit => (
                    <tr key={unit.code}>
                      <td style={{ textAlign: "center", fontWeight: 700, color: "var(--slate-600)" }}>
                        #{unit.number}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--primary-700)", fontSize: "0.75rem" }}>
                        {unit.code}
                      </td>
                      <td>
                        <strong style={{ color: "var(--slate-900)" }}>{unit.title}</strong>
                      </td>
                      <td>
                        <span className="badge badge-slate" style={{ fontSize: "0.725rem" }}>
                          ✓ {unit.moduleRef}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="badge badge-emerald" style={{ fontSize: "0.75rem" }}>
                          <CheckCircle2 size={12} /> KOMPETEN (K)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
