import { useNavigate } from "react-router-dom";

export const Dictionary = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh", gap: "16px",
      fontFamily: "'Inter', sans-serif", background: "#f9fafb", color: "#374151"
    }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>
        辞書 / Từ điển
      </h1>
      <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>
        Tính năng đang được phát triển...
      </p>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "8px", padding: "10px 20px", background: "#1b2537",
          color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px",
          cursor: "pointer", fontWeight: 500
        }}
      >
        ← Quay về Chat
      </button>
    </div>
  );
};
