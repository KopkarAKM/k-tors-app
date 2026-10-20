import React from "react";
import MobileTourLeaderView from "./MobileTourLeaderView";
import MobileManagerView from "./MobileManagerView";
import { Monitor, Smartphone, Lock, KeyRound, Wifi, WifiOff, RefreshCw } from "lucide-react";

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
    <div style={{ minHeight: "100vh", background: "#0b1329", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Mobile Top System & Mode Bar */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#020617",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "8px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "#cbd5e1"
        }}
      >
        {/* Role & Mode Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              background: currentRole === "manager" ? "rgba(99, 102, 241, 0.2)" : "rgba(56, 189, 248, 0.2)",
              color: currentRole === "manager" ? "#a5b4fc" : "#38bdf8",
              padding: "2px 8px",
              borderRadius: 6,
              fontWeight: 800,
              fontSize: "0.72rem",
              display: "flex",
              alignItems: "center",
              gap: 5
            }}
          >
            <Smartphone size={13} /> {currentRole === "manager" ? "Mode Manager" : "Mode Tour Leader"}
          </span>

          {/* Offline/Online toggle pill */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            style={{
              background: isOffline ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)",
              color: isOffline ? "#f87171" : "#4ade80",
              border: "none",
              borderRadius: 6,
              padding: "2px 6px",
              fontSize: "0.68rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer"
            }}
            title="Klik untuk beralih mode online/offline"
          >
            {isOffline ? <WifiOff size={11} /> : <Wifi size={11} />}
            {isOffline ? "Offline" : "Online"}
          </button>
        </div>

        {/* Action Buttons: PIN Switch & Desktop View */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => onRequestSwitchRole(currentRole === "manager" ? "tourLeader" : "manager")}
            className="btn btn-sm btn-secondary"
            style={{
              padding: "4px 8px",
              fontSize: "0.72rem",
              fontWeight: 700,
              background: "rgba(255,255,255,0.08)",
              color: "#ffffff",
              borderColor: "rgba(255,255,255,0.2)"
            }}
            title="Ganti peran antara Tour Leader dan Manager dengan PIN"
          >
            <KeyRound size={12} /> Ganti Peran
          </button>

          <button
            onClick={onToggleViewMode}
            className="btn btn-sm btn-primary"
            style={{
              padding: "4px 10px",
              fontSize: "0.72rem",
              fontWeight: 700,
              background: "#2563eb"
            }}
            title="Beralih ke Tampilan Penuh Desktop / Laptop"
          >
            <Monitor size={12} /> Desktop
          </button>
        </div>
      </div>

      {/* Phone View Container */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          minHeight: "calc(100vh - 42px)",
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
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
