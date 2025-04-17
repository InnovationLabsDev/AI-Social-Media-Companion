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
        profilePic: "https://via.placeholder.com/150",
    });

    const [postingSettings, setPostingSettings] = useState({
        postGenerationFrequency: "Daily",
        preferredPostType: "Image",
    });

    const handlePermissionChange = (permission) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [permission]: !prevPermissions[permission],
        }));
    };

    return (
        <div className={classes.settingsContainer}>
            <Sidebar />

            {/* 🔹 Permissions Section */}
            <div className={classes.section + " " + classes.permissionsSection}>
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

            {/* 🔹 Profile Section */}
            <div className={classes.section}>
                <h2>Profile</h2>
                <div className={classes.profilePicContainer}>
                    <img src={profile.profilePic} alt="Profile" className={classes.profilePic} />
                    <button className={classes.changePicBtn}>Change Picture</button>
                </div>
                <input
                    type="text"
                    value={profile.name}
                    className={classes.nameInput}
                />
                <button className={classes.manageAccountsBtn}>Manage Connected Accounts</button>
            </div>

            {/* 🔹 Posting Settings Section */}
            <div className={classes.section}>
                <h2>Posting Settings</h2>
                <label>Post Generation Frequency</label>
                <select value={postingSettings.postGenerationFrequency}>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                </select>

                <label>Preferred Post Type</label>
                <select value={postingSettings.preferredPostType}>
                    <option value="Image">Image</option>
                    <option value="Text">Text</option>
                    <option value="Video">Video</option>
                </select>
            </div>
        </div>
    );
}

export default SettingsPage;
