import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/sidebar.module.css"; // Asigură-te că calea e corectă

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Funcție pentru a deschide meniul
  const openSidebar = () => {
    setIsOpen(true);
  };

  // Funcție pentru a închide meniul
  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Navigare și închidere automată a meniului
  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar(); // Închide meniul după navigare
  };

  return (
    <>
      {/* 🔹 Buton pentru DESCHIDERE meniului (vizibil doar când e închis) */}
      {!isOpen && (
        <button onClick={openSidebar} className={styles.openButton}>
          ☰
        </button>
      )}

      {/* 🔹 Sidebar */}
      {isOpen && (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
          {/* 🔹 Buton pentru ÎNCHIDERE meniului (vizibil doar când e deschis) */}
          <button onClick={closeSidebar} className={styles.closeButton}>
            ✖
          </button>

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
