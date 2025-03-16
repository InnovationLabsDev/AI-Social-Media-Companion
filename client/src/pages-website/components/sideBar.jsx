import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/sidebar.module.css"; // Asigură-te că calea e corectă

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Funcție pentru a deschide/închide meniul
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Navigare și închidere automată a meniului
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* 🔹 Toggle Button */}
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        {isOpen ? "X" : "☰ "}
      </button>

      {/* 🔹 Sidebar (randează doar dacă `isOpen` este true) */}
      {isOpen && (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
          <button onClick={() => handleNavigation("/")} className={styles.menuButton}>
            🏠 Home
          </button>
          <button onClick={() => handleNavigation("/main-page")} className={styles.menuButton}>
            📤 Upload
          </button>
          <button onClick={() => handleNavigation("/main-page")} className={styles.menuButton}>
            ⏰ Schedule
          </button>
          <button onClick={() => handleNavigation("/main-page")} className={styles.menuButton}>
            📊 Stats
          </button>
          <button onClick={() => handleNavigation("/settings")} className={styles.menuButton}>
            ⚙️ Settings
          </button>
        </div>
      )}
    </>
  );
}

export default Sidebar;
