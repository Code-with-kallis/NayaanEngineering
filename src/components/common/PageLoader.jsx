import React from "react";

const PageLoader = () => {
  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      <div style={styles.loaderWrapper}>
        {/* Glowing aura */}
        <div style={styles.glow} />

        {/* Outer spinning gradient ring */}
        <div style={styles.outerRing} />

        {/* Inner reverse spinning ring */}
        <div style={styles.innerRing} />

        {/* Center dot */}
        <div style={styles.centerDot} />
      </div>

      {/* Modern animated status text */}
      <div style={styles.textContainer}>
        <span style={styles.text}>Loading</span>
        <span style={styles.dots}>...</span>
      </div>
    </div>
  );
};

// Inline CSS Keyframes for smooth, drop-in usage
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes spinReverse {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.35; transform: scale(0.95); }
    50% { opacity: 0.7; transform: scale(1.15); }
  }
  @keyframes blink {
    0%, 20% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#fafbfc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  loaderWrapper: {
    position: "relative",
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, rgba(99, 102, 241, 0) 70%)",
    animation: "pulseGlow 2.5s ease-in-out infinite",
  },
  outerRing: {
    position: "absolute",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "3px solid transparent",
    borderTopColor: "#3b82f6", // Indigo / Blue accent
    borderRightColor: "#6366f1",
    animation: "spin 1s cubic-bezier(0.55, 0.25, 0.25, 0.7) infinite",
  },
  innerRing: {
    position: "absolute",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "2.5px solid transparent",
    borderBottomColor: "#8b5cf6", // Purple accent
    borderLeftColor: "#ec4899", // Pink accent
    animation: "spinReverse 0.85s cubic-bezier(0.55, 0.25, 0.25, 0.7) infinite",
  },
  centerDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    boxShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
  },
  textContainer: {
    marginTop: "24px",
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  text: {
    fontSize: "14px",
    fontWeight: "500",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#64748b",
  },
  dots: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#3b82f6",
    letterSpacing: "0.1em",
    animation: "blink 1.4s infinite",
  },
};

export default PageLoader;