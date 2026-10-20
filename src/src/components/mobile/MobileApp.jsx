import React from "react";
import MobileTourLeaderView from "./MobileTourLeaderView";
import MobileManagerView from "./MobileManagerView";
import { Monitor, Smartphone, Lock, KeyRound, Wifi, WifiOff, Sparkles, RefreshCw } from "lucide-react";

export default function MobileApp({
  trip,
  updateTrip,
  currentRole,
  onRequestSwitchRole,
  isOffline,
  setIsOffline,
  syncCount,
  onOpenCloudSync,
  onOpenSignModal,
  onToggleViewMode
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Mobile Control Top Bar */}
      <div style={{ width: "100%", maxWidth: 480, background: "#020617", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.725rem", color: "#cbd5e1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "2px 6px", borderRadius: 4, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            <Smartphone size={12} /> Mode Ponsel
          </span>
          <span style={{ color: currentRole === "manager" ? "#c7d2fe" : "#bae6fd", fontWeight: 600 }}>
            {currentRole === "manager" ? "👔 Manager" : "🧭 Tour Leader"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Switch Role with Auth */}
          <button
            onClick={() => onRequestSwitchRole(currentRole === "manager" ? "tourLeader" : "manager")}
            className="btn btn-sm btn-secondary"
            style={{ padding: "2px 6px", fontSize: "0.68rem", background: "rgba(255,255,255,0.1)", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
            title="Ganti peran dengan PIN"
          >
            <KeyRound size={11} /> PIN
          </button>

          {/* Switch to Full Desktop View */}
          <button
            onClick={onToggleViewMode}
            className="btn btn-sm btn-primary"
            style={{ padding: "3px 8px", fontSize: "0.68rem" }}
            title="Beralih ke Tampilan Lengkap Desktop / Laptop"
          >
            <Monitor size={11} /> Desktop View
          </button>
        </div>
      </div>

      {/* Phone View Container */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          minHeight: "calc(100vh - 40px)",
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
        }}
      >
        {currentRole === "manager" ? (
          <MobileManagerView
            trip={trip}
            updateTrip={updateTrip}
            onOpenSignModal={onOpenSignModal}
          />
        ) : (
          <MobileTourLeaderView
            trip={trip}
            updateTrip={updateTrip}
            onOpenSignModal={onOpenSignModal}
          />
        )}
      </div>
    </div>
  );
}
