import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Upload,
  RefreshCcw,
  Play,
  Pause,
  Loader2,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  Image as ImageIcon,
} from "lucide-react";

const WORKER_URL =
  "https://dashboard-insight-worker.faruqueomar81.workers.dev";

function styles() {
  return `
    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }

    button, input, textarea {
      font: inherit;
    }

    .app-shell {
      min-height: 100vh;
      background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
      padding: 16px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      gap: 16px;
    }

    .layout {
      display: grid;
      gap: 16px;
    }

    .left-stack, .right-stack {
      display: grid;
      gap: 16px;
    }

    .card {
      background: rgba(255,255,255,.92);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(148, 163, 184, .22);
      border-radius: 24px;
      box-shadow: 0 12px 34px rgba(15, 23, 42, .08);
      overflow: hidden;
    }

    .card-header {
      padding: 20px 20px 8px;
    }

    .card-title {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .card-subtitle {
      margin: 10px 0 0;
      color: #475569;
      line-height: 1.55;
      font-size: 0.95rem;
    }

    .card-body {
      padding: 16px 20px 20px;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 999px;
      padding: 8px 12px;
      background: #dbeafe;
      color: #1d4ed8;
      font-size: 0.86rem;
      font-weight: 600;
    }

    .camera-frame {
      position: relative;
      background: #020617;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(100, 116, 139, .28);
      aspect-ratio: 16 / 10;
    }

    .camera-frame video,
    .camera-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .camera-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      text-align: center;
      color: white;
      background: rgba(2, 6, 23, .76);
      padding: 24px;
    }

    .button-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 10px;
      margin-top: 14px;
    }

    .btn {
      border: none;
      border-radius: 16px;
      padding: 12px 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn:disabled {
      opacity: .55;
      cursor: not-allowed;
      transform: none;
    }

    .btn-primary {
      background: #1d4ed8;
      color: white;
      box-shadow: 0 10px 24px rgba(29, 78, 216, .24);
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #0f172a;
    }

    .btn-outline {
      background: white;
      color: #0f172a;
      border: 1px solid #cbd5e1;
    }

    .status-box,
    .notice,
    .result-card,
    .summary-box {
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 14px;
    }

    .status-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .status-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: .06em;
    }

    .status-value {
      margin-top: 4px;
      color: #475569;
      font-size: 0.95rem;
    }

    .progress {
      width: 120px;
      height: 8px;
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      width: 66%;
      background: linear-gradient(90deg, #2563eb, #60a5fa);
      animation: pulse-bar 1.1s ease-in-out infinite;
    }

    .error {
      color: #b91c1c;
      font-size: 0.92rem;
      margin-top: 10px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .field-label {
      font-size: 0.78rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: .08em;
      margin-bottom: 6px;
      font-weight: 700;
    }

    .field-input {
      width: 100%;
      border-radius: 16px;
      border: 1px solid #cbd5e1;
      background: white;
      padding: 12px 14px;
      outline: none;
      resize: vertical;
    }

    .field-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59,130,246,.12);
    }

    .empty {
      border: 1px dashed #cbd5e1;
      background: white;
      border-radius: 20px;
      padding: 32px 18px;
      text-align: center;
      color: #64748b;
    }

    .results-grid {
      display: grid;
      gap: 12px;
    }

    .result-card {
      background: white;
      box-shadow: 0 6px 18px rgba(15, 23, 42, .04);
    }

    .result-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .result-title {
      font-size: 0.82rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: .08em;
      font-weight: 700;
    }

    .result-value {
      font-size: 1.18rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.35;
    }

    .result-basis {
      margin-top: 8px;
      color: #475569;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .signal-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 10px;
      border-radius: 999px;
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 0.82rem;
      font-weight: 700;
    }

    .footer-note {
      color: #64748b;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    @keyframes pulse-bar {
      0% { transform: translateX(-18%); opacity: .75; }
      50% { transform: translateX(18%); opacity: 1; }
      100% { transform: translateX(-18%); opacity: .75; }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 860px) {
      .button-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (min-width: 960px) {
      .layout {
        grid-template-columns: 1.05fr 0.95fr;
        align-items: start;
      }
    }
  `;
}

function resizeImage(dataUrl, maxWidth = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable."));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to resize image."));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image for resize."));
    img.src = dataUrl;
  });
}

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [contextNote, setContextNote] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [status, setStatus] = useState(
    "Ready — upload or capture a Power BI dashboard image."
  );
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError("");
    setStatus("Requesting camera access...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraOn(true);
      setStatus("Camera ready — capture the dashboard image.");
    } catch {
      setCameraOn(false);
      setStatus("Camera unavailable");
      setError(
        "Camera access failed. Open over HTTPS and allow camera permission."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Canvas context unavailable.");
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setCapturedImage(canvas.toDataURL("image/jpeg", 0.92));
    setStatus("Dashboard captured ✅");
    setError("");
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result);
      setStatus("Dashboard uploaded ✅");
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const clearSession = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setContextNote("");
    setError("");
    setStatus("Ready — upload or capture a Power BI dashboard image.");
  };

  const analyzeDashboard = async () => {
    if (!capturedImage) {
      setError("Capture or upload an image first.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setStatus("Resizing image...");

      const resizedBlob = await resizeImage(capturedImage, 1400, 0.82);

      setStatus("Analyzing dashboard...");

      const formData = new FormData();
      formData.append("image", resizedBlob, "dashboard.jpg");
      formData.append("context", contextNote || "");

      const response = await fetch(WORKER_URL, {
        method: "POST",
        body: formData,
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Analysis failed.");
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error("Worker returned invalid JSON.");
      }

      setAnalysis(parsed);
      setStatus("Analysis complete ✅");
    } catch (err) {
      setAnalysis(null);
      setStatus("Analysis failed");
      setError(`Analysis failed: ${err?.message || "Unknown error"}`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <style>{styles()}</style>

      <div className="app-shell">
        <div className="container">
          <div className="layout">
            <div className="left-stack">
              <section className="card">
                <div className="card-header">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h1 className="card-title">Dashboard Insight Snap</h1>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: ".92rem",
                          color: "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        Developed by Faruque
                      </div>
                      <p className="card-subtitle">
                        Capture or upload a Power BI dashboard image and get a
                        concise assessment with supporting evidence.
                      </p>
                    </div>

                    <span className="tag">
                      <Shield size={16} />
                      GitHub Pages + Worker
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="camera-frame">
                    {capturedImage ? (
                      <img src={capturedImage} alt="Dashboard preview" />
                    ) : (
                      <video ref={videoRef} playsInline muted />
                    )}

                    {!cameraOn && !capturedImage && (
                      <div className="camera-overlay">
                        <ImageIcon size={42} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                            Capture or upload dashboard
                          </div>
                          <div
                            style={{
                              marginTop: 8,
                              color: "rgba(255,255,255,.78)",
                              lineHeight: 1.5,
                            }}
                          >
                            Best results come from a clear screenshot or
                            straight-on photo.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <canvas ref={canvasRef} style={{ display: "none" }} />

                  <div className="button-grid">
                    {!cameraOn ? (
                      <button className="btn btn-primary" onClick={startCamera}>
                        <Play size={16} /> Start Camera
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        onClick={stopCamera}
                      >
                        <Pause size={16} /> Stop Camera
                      </button>
                    )}

                    <button
                      className="btn btn-secondary"
                      onClick={captureFrame}
                      disabled={!cameraOn}
                    >
                      <Camera size={16} /> Capture
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={analyzeDashboard}
                      disabled={!capturedImage || analyzing}
                    >
                      {analyzing ? (
                        <Loader2
                          size={16}
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      {analyzing ? "Analyzing..." : "Analyze Dashboard"}
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={16} /> Upload
                    </button>

                    <button className="btn btn-outline" onClick={clearSession}>
                      <RefreshCcw size={16} /> Reset
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleUpload}
                  />

                  <div style={{ marginTop: 14 }}>
                    <div className="field-label">Optional context</div>
                    <textarea
                      className="field-input"
                      rows={3}
                      value={contextNote}
                      onChange={(e) => setContextNote(e.target.value)}
                      placeholder="Example: Q3 workforce planning dashboard for Permian operations"
                    />
                  </div>

                  <div className="status-box" style={{ marginTop: 14 }}>
                    <div className="status-row">
                      <div>
                        <div className="status-label">Status</div>
                        <div className="status-value">{status}</div>
                      </div>

                      {analyzing && (
                        <div className="progress">
                          <div className="progress-bar" />
                        </div>
                      )}
                    </div>

                    {error && <div className="error">{error}</div>}
                  </div>
                </div>
              </section>
            </div>

            <div className="right-stack">
              <section className="card">
                <div className="card-header">
                  <h2 className="card-title">Assessment Cards</h2>
                  <p className="card-subtitle">
                    Short decisions with the data basis behind each conclusion.
                  </p>
                </div>

                <div className="card-body">
                  {analyzing ? (
                    <div className="empty">
                      <Loader2
                        size={18}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      <div style={{ marginTop: 10 }}>Reading dashboard...</div>
                    </div>
                  ) : analysis ? (
                    <div className="results-grid">
                      <div className="result-card">
                        <div className="result-top">
                          <CheckCircle2 size={18} color="#166534" />
                          <div className="result-title">
                            General Assessment
                          </div>
                        </div>
                        <div className="result-value">
                          {analysis.general_assessment?.title || "—"}
                        </div>
                        <div className="result-basis">
                          {analysis.general_assessment?.basis || "—"}
                        </div>
                      </div>

                      <div className="result-card">
                        <div className="result-top">
                          <AlertTriangle size={18} color="#b45309" />
                          <div className="result-title">Risk Assessment</div>
                        </div>
                        <div className="result-value">
                          {analysis.risk_assessment?.title || "—"}
                        </div>
                        <div className="result-basis">
                          {analysis.risk_assessment?.basis || "—"}
                        </div>
                      </div>

                      <div className="result-card">
                        <div className="result-top">
                          <Briefcase size={18} color="#1d4ed8" />
                          <div className="result-title">
                            Hiring Recommendation
                          </div>
                        </div>
                        <div className="result-value">
                          {analysis.hiring_recommendation?.title || "—"}
                        </div>
                        <div className="result-basis">
                          {analysis.hiring_recommendation?.basis || "—"}
                        </div>
                      </div>

                      {Array.isArray(analysis.key_signals) &&
                        analysis.key_signals.length > 0 && (
                          <div className="summary-box">
                            <div className="field-label">Key signals</div>
                            <div className="signal-wrap">
                              {analysis.key_signals
                                .slice(0, 6)
                                .map((item, idx) => (
                                  <span
                                    className="chip"
                                    key={`${item}-${idx}`}
                                  >
                                    {item}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="empty">
                      Upload or capture a dashboard image, then tap{" "}
                      <strong>Analyze Dashboard</strong>.
                    </div>
                  )}
                </div>
              </section>

              <section className="card">
                <div className="card-header">
                  <h2 className="card-title">Best Use</h2>
                </div>
                <div className="card-body">
                  <div className="notice">
                    <div className="footer-note">
                      Use on aggregate dashboard screenshots for workforce
                      planning: headcount, vacancies, attrition, hiring pace, or
                      staffing risk.
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
