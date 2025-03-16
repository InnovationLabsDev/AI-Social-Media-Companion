import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/sidebar.module.css"; // Update the path if needed

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to navigate when clicking a button
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close sidebar after navigating
  };

  return (
    <>
      {/* 🔹 Toggle Button */}
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        {isOpen ? "X" : "Open Menu"}
      </button>

      {/* 🔹 Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <button onClick={() => handleNavigation("/")} className={styles.menuButton}>
        🏠Home
        </button>
        <button onClick={() => handleNavigation("/main-page")} className={styles.menuButton}>
        📤Upload
        </button>

        <button onClick={() => handleNavigation("/main-page")} className={styles.menuButton}>
        ⏰Schedule
        </button>
        
        <button onClick={() => handleNavigation("/main-page")} className={styles.menuButton}>
        📊Stats
        </button>

        <button onClick={() => handleNavigation("/settings")} className={styles.menuButton}>
        ⚙️Settings
        
        </button>
      </div>
    </>
  );
}

// return (
//   <>
//     {/* 🔹 Toggle Button */}
//     <button onClick={toggleSidebar} className={styles.toggleButton}>
//       {isOpen ? "✖ Close" : "☰ Menu"}
//     </button>

//     {/* 🔹 Sidebar */}
//     <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
//       <button onClick={() => handleNavigation("/")} className={styles.menuButton}>
//         🏠 <FaHome /> Home
//       </button>
//       <button onClick={() => handleNavigation("/upload")} className={styles.menuButton}>
//         📤 <FaUpload /> Upload
//       </button>
//       <button onClick={() => handleNavigation("/schedule")} className={styles.menuButton}>
//         ⏰ <FaCalendarAlt /> Schedule
//       </button>
//       <button onClick={() => handleNavigation("/stats")} className={styles.menuButton}>
//         📊 <FaChartLine /> Stats
//       </button>
//       <button onClick={() => handleNavigation("/settings")} className={styles.menuButton}>
//         ⚙️ <FaCog /> Settings
//       </button>
//     </div>
//   </>
// );
// }

export default Sidebar;
