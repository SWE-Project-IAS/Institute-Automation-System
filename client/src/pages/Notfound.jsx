import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.bubble}></div>
      <div style={styles.card}>
        <h1 style={styles.heading}>404</h1>
        <p style={styles.subheading}>Oops! Page not found.</p>
        <p style={styles.text}>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/profile" style={styles.button}>Go Home</a>
      </div>
      <style>{keyframes}</style>
    </div>
  );
};

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        background: "#f0f9ff",
        backgroundImage: "linear-gradient(to right, #e0f4ff, #f0f9ff, #dcf3ff)",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        color: "#2c5282",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        border: "1px solid rgba(144, 205, 244, 0.3)",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px 0 rgba(144, 205, 244, 0.2)",
        backdropFilter: "blur(8px)",
        textAlign: "center",
        zIndex: 2,
    },
    heading: {
        fontSize: "4rem",
        margin: "0",
        animation: "bounce 1.5s infinite",
        color: "#3182ce",
    },
    subheading: {
        fontSize: "1.5rem",
        marginBottom: "1rem",
        animation: "fadeIn 2s ease-in-out",
        color: "#4299e1",
    },
    text: {
        fontSize: "1rem",
        marginBottom: "1.5rem",
        color: "#718096",
        animation: "fadeIn 2.5s ease-in-out",
    },
    button: {
        padding: "0.7rem 1.5rem",
        border: "none",
        background: "#63b3ed",
        backgroundImage: "linear-gradient(to right, #4299e1, #63b3ed)",
        color: "#fff",
        borderRadius: "8px",
        cursor: "pointer",
        textDecoration: "none",
        fontWeight: "bold",
        animation: "slideIn 1.5s ease-out",
    },
    bubble: {
        position: "absolute",
        top: "-100px",
        left: "-100px",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle at center, #90cdf4, transparent 70%)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite alternate",
        opacity: 0.4,
    },
};

const keyframes = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes float {
    0% { transform: translateY(0) translateX(0); }
    100% { transform: translateY(20px) translateX(20px); }
  }
`;

export default NotFound;
