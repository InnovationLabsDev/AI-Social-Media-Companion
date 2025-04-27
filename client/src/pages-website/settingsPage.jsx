import React, { useState } from "react";
import classes from "../styles/settingsPage.module.css";
import Sidebar from "./components/sideBar.jsx";

function SettingsPage() {
  const [permissions, setPermissions] = useState({
    gallery: false,
    location: false,
    calendar: false,
    files: false,
    notification: false,
    camera: false,
  });

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "",
    password: "",
    retypePassword: "",
    businessName: "",
    businessType: "",
    profilePic: "https://via.placeholder.com/150",
  });

  const [showNameInput, setShowNameInput] = useState(false);
  const [showPicInput, setShowPicInput] = useState(false);
  const [showPostTypeInput, setShowPostTypeInput] = useState(false);
  const [showFrequencyInput, setShowFrequencyInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showBusinessInput, setShowBusinessInput] = useState(false);

  const [postingSettings, setPostingSettings] = useState({
    postGenerationFrequency: "",
    preferredPostType: "",
  });

  const handlePermissionChange = (permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [permission]: !prevPermissions[permission],
    }));
  };

  const handleProfileChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, profilePic: imageUrl }));
    }
  };

  const handleFrequencyChange = (e) => {
    setPostingSettings((prev) => ({ ...prev, postGenerationFrequency: e.target.value }));
  };

  const handlePostTypeChange = (e) => {
    setPostingSettings((prev) => ({ ...prev, preferredPostType: e.target.value }));
  };

  return (
    <div className={classes.settingsContainer}>
      <Sidebar />

      {/* 🔹 Permissions Section */}
      <div className={classes.section}>
        <h2>Permissions</h2>
        <div className={classes.permissionItems}>
          {Object.keys(permissions).map((permission) => (
            <div className={classes.permissionItem} key={permission}>
              <label>{permission.charAt(0).toUpperCase() + permission.slice(1)}</label>
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={permissions[permission]}
                  onChange={() => handlePermissionChange(permission)}
                />
                <span className={classes.slider}></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Posting Settings Section */}
      <div className={classes.section}>
        <h2>Posting Settings</h2>
        <ul className={classes.settingsList}>
          <li className={classes.settingsItem}>
            Post Generation Frequency
            <button className={classes.arrowButton} onClick={() => setShowFrequencyInput(!showFrequencyInput)}>▼</button>
          </li>
          {showFrequencyInput && (
            <li className={classes.inputItemStyled}>
              <label className={classes.inputLabel}>Select Frequency:</label>
              <select
                className={classes.selectStyled}
                value={postingSettings.postGenerationFrequency}
                onChange={handleFrequencyChange}
              >
                <option value="">Select Post Frequency</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </li>
          )}

          <li className={classes.settingsItem}>
            Preferred Post Type
            <button className={classes.arrowButton} onClick={() => setShowPostTypeInput(!showPostTypeInput)}>▼</button>
          </li>
          {showPostTypeInput && (
            <li className={classes.inputItemStyled}>
              <label className={classes.inputLabel}>Select Post Type:</label>
              <select
                className={classes.selectStyled}
                value={postingSettings.preferredPostType}
                onChange={handlePostTypeChange}
              >
                <option value="">Select Post Type</option>
                <option value="Text">Text</option>
                <option value="Photo with Short Caption">Photo with Short Caption</option>
                <option value="Photo with Long Caption">Photo with Long Caption</option>
              </select>
            </li>
          )}
        </ul>
      </div>

      {/* 🔹 Profile Section */}
      <div className={classes.section}>
        <h2>Profile</h2>
        <ul className={classes.settingsList}>
          <li className={classes.settingsItem}>
            Change profile picture
            <button className={classes.arrowButton} onClick={() => setShowPicInput(!showPicInput)}>▼</button>
          </li>
          {showPicInput && (
            <li className={classes.inputItemStyled}>
              <label className={classes.inputLabel}>Upload new picture:</label>
              <div className={classes.inputCard}>
                <input type="file" onChange={handlePicChange} className={classes.styledInputFile} />
                <img src={profile.profilePic} alt="Preview" className={classes.inlinePreview} />
              </div>
            </li>
          )}

          <li className={classes.settingsItem}>
            Change name
            <button className={classes.arrowButton} onClick={() => setShowNameInput(!showNameInput)}>▼</button>
          </li>
          {showNameInput && (
            <li className={classes.inputItemStyled}>
              <label className={classes.inputLabel}>New name:</label>
              <div className={classes.inputCard}>
                <input
                  type="text"
                  value={profile.name}
                  onChange={handleProfileChange("name")}
                  className={classes.nameInputStyled}
                  placeholder="Enter new name"
                />
              </div>
            </li>
          )}

          <li className={classes.settingsItem}>
            Change email
            <button className={classes.arrowButton} onClick={() => setShowEmailInput(!showEmailInput)}>▼</button>
          </li>
          {showEmailInput && (
            <li className={classes.inputItemStyled}>
              <label className={classes.inputLabel}>Email:</label>
              <input
                type="email"
                className={classes.styledTextInput}
                value={profile.email}
                onChange={handleProfileChange("email")}
                placeholder="Enter your email"
              />
            </li>
          )}

          <li className={classes.settingsItem}>
            Change password
            <button className={classes.arrowButton} onClick={() => setShowPasswordInput(!showPasswordInput)}>▼</button>
          </li>
          {showPasswordInput && (
            <>
              <li className={classes.inputItemStyled}>
                <label className={classes.inputLabel}>Password:</label>
                <input
                  type="password"
                  className={classes.styledTextInput}
                  value={profile.password}
                  onChange={handleProfileChange("password")}
                  placeholder="Enter your password"
                />
              </li>
              <li className={classes.inputItemStyled}>
                <label className={classes.inputLabel}>Retype Password:</label>
                <input
                  type="password"
                  className={classes.styledTextInput}
                  value={profile.retypePassword}
                  onChange={handleProfileChange("retypePassword")}
                  placeholder="Retype your password"
                />
              </li>
            </>
          )}

          <li className={classes.settingsItem}>
            Business Info
            <button className={classes.arrowButton} onClick={() => setShowBusinessInput(!showBusinessInput)}>▼</button>
          </li>
          {showBusinessInput && (
            <>
              <li className={classes.inputItemStyled}>
                <label className={classes.inputLabel}>Business Name:</label>
                <input
                  type="text"
                  className={classes.styledTextInput}
                  value={profile.businessName}
                  onChange={handleProfileChange("businessName")}
                  placeholder="Enter your business name"
                />
              </li>
              <li className={classes.inputItemStyled}>
                <label className={classes.inputLabel}>Business Type:</label>
                <input
                  type="text"
                  className={classes.styledTextInput}
                  value={profile.businessType}
                  onChange={handleProfileChange("businessType")}
                  placeholder="Enter your business type"
                />
              </li>
            </>
          )}

          <li className={classes.settingsItem}>
            Manage connected accounts
            <button className={classes.arrowButton}>▼</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SettingsPage;
