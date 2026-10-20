import React, { useRef, useState, useEffect } from "react";
import { X, Check, RotateCcw, PenTool } from "lucide-react";

export default function SignatureModal({ isOpen, onClose, onSave, signerTitle, signerName }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx.strokeStyle = "#0f172a";
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
        }
      }, 50);
      setHasDrawn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--slate-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--primary-50)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-600)" }}>
              <PenTool size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem" }}>Tanda Tangan Digital (e-Sign)</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>{signerTitle} - {signerName}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate-400)" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ border: "2px dashed var(--slate-300)", borderRadius: 12, background: "#fafafa", position: "relative", overflow: "hidden" }}>
            <canvas
              ref={canvasRef}
              width={460}
              height={180}
              style={{ display: "block", width: "100%", height: 180, cursor: "crosshair", touchAction: "none" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div style={{ position: "absolute", bottom: 10, left: 14, fontSize: "0.75rem", color: "var(--slate-400)", pointerEvents: "none" }}>
              Goreskan tanda tangan di area kotak ini (Mouse / Sentuhan Layar)
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleClear}>
              <RotateCcw size={14} /> Bersihkan Canvas
            </button>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={onClose}>
                Batal
              </button>
              <button className="btn btn-emerald btn-sm" onClick={handleConfirm} disabled={!hasDrawn}>
                <Check size={14} /> Simpan & Sahkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
