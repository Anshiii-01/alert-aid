import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",

        /* perfect circle */
        width: "48px",
        height: "48px",
        borderRadius: "50%",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
        color: "#fff",
        border: "none",

        cursor: "pointer",
        zIndex: 1000,

        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(9.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
      }}
    >
      <ArrowUp size={22} />
    </button>
  );
}
