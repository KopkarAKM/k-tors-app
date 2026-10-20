import React, { useState, useEffect } from "react";
import { INITIAL_TRIP_DATA } from "./data/initialData";
import Navbar from "./components/Navbar";
import OverviewDashboard from "./components/OverviewDashboard";
import PreTripModule from "./components/PreTripModule";
import OnTripModule from "./components/OnTripModule";
import PostTripModule from "./components/PostTripModule";
import PhaseChecklistModule from "./components/PhaseChecklistModule";
import PdfExportModule from "./components/PdfExportModule";
import SignatureModal from "./components/SignatureModal";
import CloudSyncModal from "./components/CloudSyncModal";
import TripMasterModal from "./components/TripMasterModal";
import RoleAuthModal from "./components/RoleAuthModal";
import MobileApp from "./components/mobile/MobileApp";
import { RotateCcw, ShieldCheck, CheckCircle2, UserCheck, AlertCircle, Settings, Lock, KeyRound, Smartphone, Monitor } from "lucide-react";

export default function App() {
  const [trip, setTrip] = useState(() => {
    const saved = localStorage.getItem("K_TORS_TRIP_DATA");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TRIP_DATA;
      }
    }
    return INITIAL_TRIP_DATA;
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [currentRole, setCurrentRole] = useState("tourLeader");
  const [isOffline, setIsOffline] = useState(false);
  const [syncCount, setSyncCount] = useState(0);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isTripMasterModalOpen, setIsTripMasterModalOpen] = useState(false);
  
  // View Mode: "desktop" or "mobile"
  const [viewMode, setViewMode] = useState(() => {
    const savedMode = localStorage.getItem("K_TORS_VIEW_MODE");
    if (savedMode) return savedMode;
    return typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop";
  });

  const handleToggleViewMode = () => {
    const nextMode = viewMode === "desktop" ? "mobile" : "desktop";
    setViewMode(nextMode);
    localStorage.setItem("K_TORS_VIEW_MODE", nextMode);
  };
  
  // Role Authentication Modal State
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    targetRole: "manager"
  });

  // Signature Modal State
  const [signModalState, setSignModalState] = useState({
    isOpen: false,
    signerTitle: "",
    signerName: ""
  });

  // Save to LocalStorage whenever trip data changes (Offline-First Capability)
  const updateTrip = (newTripData) => {
    setTrip(newTripData);
    localStorage.setItem("K_TORS_TRIP_DATA", JSON.stringify(newTripData));
    if (isOffline) {
      setSyncCount(prev => prev + 1);
    }
  };

  const handleRequestSwitchRole = (targetRole) => {
    setAuthModal({
      isOpen: true,
      targetRole: targetRole
    });
  };

  const handleAuthenticateRole = (authenticatedRole) => {
    setCurrentRole(authenticatedRole);
  };

  const handleOpenSignModal = (signerTitle, signerName) => {
    setSignModalState({
      isOpen: true,
      signerTitle: signerTitle || (currentRole === "manager" ? "Manager Operasional" : "Tour Leader"),
      signerName: signerName || (currentRole === "manager" ? trip.staff?.opsManager?.name : trip.staff?.leadTL?.name)
    });
  };

  const handleSaveSignature = (dataUrl) => {
    // Save signature into trip state based on signer role
    if (signModalState.signerTitle.toLowerCase().includes("manager")) {
      updateTrip({
        ...trip,
        signatures: {
          ...trip.signatures,
          opsManager: dataUrl
        }
      });
    } else {
      updateTrip({
        ...trip,
        signatures: {
          ...trip.signatures,
          leadTL: dataUrl
        }
      });
    }
  };

  const handleResetData = () => {
    if (window.confirm("Apakah Anda yakin ingin mengatur ulang data simulasi tur ke keadaan awal?")) {
      localStorage.removeItem("K_TORS_TRIP_DATA");
      setTrip(INITIAL_TRIP_DATA);
      setSyncCount(0);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      {/* If Mobile View is active */}
      {viewMode === "mobile" ? (
        <MobileApp
          trip={trip}
          updateTrip={updateTrip}
          currentRole={currentRole}
          onRequestSwitchRole={handleRequestSwitchRole}
          isOffline={isOffline}
          setIsOffline={(offline) => {
            setIsOffline(offline);
            if (!offline) setSyncCount(0);
          }}
          syncCount={syncCount}
          onOpenCloudSync={() => setIsCloudModalOpen(true)}
          onOpenSignModal={handleOpenSignModal}
          onToggleViewMode={handleToggleViewMode}
        />
      ) : (
        <>
          {/* Navbar Desktop */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentRole={currentRole}
            onRequestSwitchRole={handleRequestSwitchRole}
            isOffline={isOffline}
            setIsOffline={(offline) => {
              setIsOffline(offline);
              if (!offline) {
                setSyncCount(0);
              }
            }}
            syncCount={syncCount}
            onOpenCloudSync={() => setIsCloudModalOpen(true)}
            onOpenTripMaster={() => setIsTripMasterModalOpen(true)}
            onToggleViewMode={handleToggleViewMode}
          />

          {/* Role Notice Banner */}
          <div style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "6px 20px" }}>
            <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "var(--slate-400)", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: currentRole === "manager" ? "#a5b4fc" : "#38bdf8", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  <Lock size={12} /> Mode Akses Terproteksi:
                </span>
                <span style={{ color: "#fff", fontWeight: 600 }}>
                  {currentRole === "tourLeader" && "🧭 Tour Leader / TG (Frontline: Manifes, Presensi QR, Jurnal GPS, K3, Nota Lapangan & CSAT)"}
                  {currentRole === "manager" && "👔 Manager Operasional (Pusat & Approval: Inisiasi SPT, Rute, Kas Bon, Audit Modul & Tanda Tangan Resmi)"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={handleToggleViewMode}
                  className="btn btn-sm"
                  style={{ padding: "2px 8px", fontSize: "0.7rem", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)" }}
                >
                  <Smartphone size={11} /> Buka Versi Ponsel
                </button>

                <button
                  onClick={handleResetData}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: "2px 8px", fontSize: "0.68rem", background: "transparent", color: "#94a3b8", borderColor: "rgba(255,255,255,0.2)" }}
                  title="Reset ke data bawaan demo"
                >
                  <RotateCcw size={11} /> Reset Data Demo
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main style={{ flex: 1, maxWidth: 1400, width: "100%", margin: "0 auto", padding: "24px 20px" }}>
            {activeTab === "overview" && (
              <OverviewDashboard
                trip={trip}
                setActiveTab={setActiveTab}
                onOpenSignModal={handleOpenSignModal}
                onOpenTripMaster={() => setIsTripMasterModalOpen(true)}
              />
            )}

            {activeTab === "pre-trip" && (
              <PreTripModule
                trip={trip}
                updateTrip={updateTrip}
                onOpenSignModal={handleOpenSignModal}
              />
            )}

            {activeTab === "on-trip" && (
              <OnTripModule
                trip={trip}
                updateTrip={updateTrip}
                onOpenSignModal={handleOpenSignModal}
              />
            )}

            {activeTab === "post-trip" && (
              <PostTripModule
                trip={trip}
                updateTrip={updateTrip}
                onOpenSignModal={handleOpenSignModal}
              />
            )}

            {activeTab === "checklist" && (
              <PhaseChecklistModule
                trip={trip}
                updateTrip={updateTrip}
                setActiveTab={setActiveTab}
                onOpenSignModal={handleOpenSignModal}
              />
            )}

            {activeTab === "pdf-export" && (
              <PdfExportModule
                trip={trip}
              />
            )}
          </main>

          {/* Footer */}
          <footer style={{ background: "#ffffff", borderTop: "1px solid var(--slate-200)", padding: "20px", marginTop: "auto", fontSize: "0.775rem", color: "var(--slate-500)" }}>
            <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <strong>K-TORS</strong> (Kopkarindo Digital Tour Operations & Reporting System) • Divisi Tour & Travel Kopkarindo.
              </div>
              <div>
                Model Operasional 2 Peran (Tour Leader & Manager) • Terproteksi Sandi Akses & Standar K3 2024-2026.
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Role Authentication PIN/Password Modal */}
      <RoleAuthModal
        isOpen={authModal.isOpen}
        targetRole={authModal.targetRole}
        currentRole={currentRole}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onAuthenticate={handleAuthenticateRole}
      />

      {/* Digital Signature Modal */}
      <SignatureModal
        isOpen={signModalState.isOpen}
        onClose={() => setSignModalState({ ...signModalState, isOpen: false })}
        signerTitle={signModalState.signerTitle}
        signerName={signModalState.signerName}
        onSave={handleSaveSignature}
      />

      {/* Cloud Google Sheets & Drive Sync Modal */}
      <CloudSyncModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        trip={trip}
        onSyncSuccess={() => {
          // Trigger refresh if needed
        }}
      />

      {/* Master Trip Configuration Modal */}
      <TripMasterModal
        isOpen={isTripMasterModalOpen}
        onClose={() => setIsTripMasterModalOpen(false)}
        trip={trip}
        onSaveTrip={updateTrip}
      />
    </div>
  );
}
