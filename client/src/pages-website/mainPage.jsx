import React, { useState } from "react";
import classes from "../styles/mainPage.module.css";
import { FaRegUserCircle } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaXTwitter, FaPinterest } from "react-icons/fa6";

const MainPage = () => {
    const [photo, setPhoto] = useState(null);
    const [caption, setCaption] = useState("Prepping for a brainstorming session with the creative team about our next campaign.");
    const [hashtags, setHashtags] = useState(["#design", "#tech", "#development", "#vision", "#meeting"]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);

    const regeneratePhoto = () => {
        setPhoto(`https://picsum.photos/300/300?random=${Math.random()}`);
    };

    const regenerateCaption = () => {
        const captions = [
            "Exploring new places!",
            "What a wonderful day!",
            "Prepping for a brainstorming session with the creative team about our next campaign."
        ];
        setCaption(captions[Math.floor(Math.random() * captions.length)]);
    };

    const regenerateHashtags = () => {
        const hashtagsArray = ["#design", "#tech", "#development", "#vision", "#meeting"];
        setHashtags(hashtagsArray.sort(() => 0.5 - Math.random()).slice(0, 5));
    };

    const togglePlatformSelection = (platform) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
        );
    };

    return (
        <div className={classes.container}>
            {/* Header */}
            <div className={classes.header}>
                <h1 className={classes.appTitle}>PostPal 🚀</h1>
                <FaRegUserCircle className={classes.userIcon} />
            </div>

            {/* Post Card */}
            <div className={classes.postCard}>
                {/* User Info */}
                <div className={classes.userInfo}>
                    <FaRegUserCircle className={classes.userAvatar} />
                    <div>
                        <p className={classes.username}>@johnmaina</p>
                        <p className={classes.location}>📍 3890 Poplar Dr.</p>
                    </div>
                </div>

                {/* Post Image with Refresh Button */}
                <div className={classes.photoContainer}>
                    <img src={photo || "https://picsum.photos/300/300"} alt="Generated" className={classes.photo} />
                    <button onClick={regeneratePhoto} className={classes.refreshPhotoButton}>
                        <FiRefreshCcw />
                    </button>
                </div>

                {/* Caption & Hashtags */}
                <div className={classes.captionRow}>
                    <p className={classes.caption}>{caption}</p>
                    <button onClick={regenerateCaption} className={classes.refreshButton}>
                        <FiRefreshCcw />
                    </button>
                </div>

                <div className={classes.hashtagContainer}>
                    {hashtags.map((tag, index) => (
                        <span key={index} className={classes.hashtag}>{tag}</span>
                    ))}
                    <button onClick={regenerateHashtags} className={classes.refreshButton}>
                        <FiRefreshCcw />
                    </button>
                </div>
            </div>

            {/* Platform Selection */}
            <div className={classes.platformSelection}>
                <p className={classes.platformTitle}>Choose platform</p>
                <div className={classes.platformIcons}>
                    {[
                        { name: "Instagram", icon: <FaInstagram /> },
                        { name: "Facebook", icon: <FaFacebookF /> },
                        { name: "LinkedIn", icon: <FaLinkedinIn /> },
                        { name: "Twitter", icon: <FaXTwitter /> },
                        { name: "Pinterest", icon: <FaPinterest /> },
                    ].map((platform) => (
                        <div
                            key={platform.name}
                            className={`${classes.platformIcon} ${
                                selectedPlatforms.includes(platform.name) ? classes.selectedPlatform : ""
                            }`}
                            onClick={() => togglePlatformSelection(platform.name)}
                        >
                            {platform.icon}
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className={classes.buttonGroup}>
                    <button className={classes.declineButton}>Decline</button>
                    <button className={classes.acceptButton}>Accept and Share</button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
