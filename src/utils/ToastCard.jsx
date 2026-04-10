
const ToastCard = ({ title, message, color, gradient }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px 18px",
        borderRadius: "16px", // 🔥 slightly smoother
        background: `linear-gradient(135deg, ${gradient})`,
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: `0 10px 30px rgba(0,0,0,0.4)`,
        minWidth: "320px", // 🔥 important for size consistency
        transition: "all 0.2s ease", // ✅ added
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${color}, ${color}cc)`, // 🔥 subtle gradient
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 10px ${color}60`, // 🔥 softer glow
          flexShrink: 0, // prevents shrinking
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "#fff",
            marginBottom: "2px", // 🔥 small spacing improvement
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#cbd5e1",
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default ToastCard;