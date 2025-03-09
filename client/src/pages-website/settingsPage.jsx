import React, { useState } from "react";
import classes from "../styles/settingsPage.module.css"; // Import CSS styles
import Sidebar from "./components/sideBar.jsx"; // Import the Sidebar component

function SettingsPage() {
    
    // State for permissions (switches)
    const [permissions, setPermissions] = useState({
        gallery: false,
        location: false,
        calendar: false,
        files: false,
        notification: false,
        camera: false,
    });

    // State for Profile Settings
    const [profile, setProfile] = useState({
        name: "John Doe",
        profilePic: "https://via.placeholder.com/150",
    });

    // State for Posting Settings
    const [postingSettings, setPostingSettings] = useState({
        postGenerationFrequency: "Daily",
        preferredPostType: "Image",
    });

    // Function to toggle permissions switches
    const handlePermissionChange = (permission) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [permission]: !prevPermissions[permission],
        }));
    };

    // Function to change the name
    const handleChangeName = (e) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            name: e.target.value,
        }));
    };

    // Function to handle post generation frequency change
    const handleFrequencyChange = (e) => {
        setPostingSettings((prev) => ({
            ...prev,
            postGenerationFrequency: e.target.value,
        }));
    };

    // Function to handle preferred post type change
    const handlePostTypeChange = (e) => {
        setPostingSettings((prev) => ({
            ...prev,
            preferredPostType: e.target.value,
        }));
    };

    return (
        // Sidebar
        <div className={classes.settingsContainer}>
            <Sidebar />
            {/* Main Content */}
            <div className={classes.content}>
                {/* Permissions Section */}
                <div className={classes.section}>
                    <h2>Permissions</h2>
                    <div className={classes.permissionItems}>
                        {Object.keys(permissions).map((permission) => (
                            <div className={classes.permissionItem} key={permission}>
                                <label>{permission.charAt(0).toUpperCase() + permission.slice(1)}</label>
                                <input
                                    type="checkbox"
                                    checked={permissions[permission]}
                                    onChange={() => handlePermissionChange(permission)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile Section */}
                <div className={classes.section}>
                    <h2>Profile</h2>
                    <div className={classes.profileItem}>
                        <label>Profile Picture</label>
                        <div className={classes.profilePicContainer}>
                            <img
                                src={profile.profilePic}
                                alt="Profile"
                                className={classes.profilePic}
                            />
                            <button className={classes.changePicBtn}>Change Picture</button>
                        </div>
                    </div>
                    <div className={classes.profileItem}>
                        <label>Name</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={handleChangeName}
                            className={classes.nameInput}
                        />
                    </div>
                    <div className={classes.profileItem}>
                        <label>Manage Connected Accounts</label>
                        <button className={classes.manageAccountsBtn}>Manage</button>
                    </div>
                </div>

                {/* Posting Settings Section */}
                <div className={classes.section}>
                    <h2>Posting Settings</h2>
                    <div className={classes.postingItem}>
                        <label>Post Generation Frequency</label>
                        <select
                            value={postingSettings.postGenerationFrequency}
                            onChange={handleFrequencyChange}
                        >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                    <div className={classes.postingItem}>
                        <label>Preferred Post Type</label>
                        <select
                            value={postingSettings.preferredPostType}
                            onChange={handlePostTypeChange}
                        >
                            <option value="Image">Image</option>
                            <option value="Text">Text</option>
                            <option value="Video">Video</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
