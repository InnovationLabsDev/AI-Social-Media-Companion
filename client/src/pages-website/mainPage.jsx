import React, { useState } from "react";
import { Link } from "react-router-dom";  // For routing links in the sidebar
import classes from "../styles/mainPage.module.css";  // Assuming your styles are defined here
import Sidebar from "./components/sideBar.jsx";  // Import the Sidebar component
import { useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaXTwitter, FaPinterest } from "react-icons/fa6";

const MainPage = () => {
    const [photo, setPhoto] = useState(null);
    const [caption, setCaption] = useState("This is a sample caption.");
    const [hashtags, setHashtags] = useState([]);

    const regeneratePhoto = () => {
        setPhoto(`https://picsum.photos/300/300?random=${Math.random()}`);
        fetchCaptions();
        fetchHashtags();
    };
    const togglePlatformSelection = (platform) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
        );

        // Function to shuffle an array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }



        const fetchCaptions = async () => {
            setLoading(true);
            fetch("http://localhost:5000/caption")
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data.captionArray)) {
                        setAllCaptions(data.captionArray);
                        console.log(allCaptions)
                        const shuffledCaptions = shuffleArray(data.captionArray);
                        const randomCaption = shuffledCaptions[0];
                        setCaption(randomCaption);

                        // setCaption(data.captionArray); // Change to `captionArray`

                    } else {
                        console.error("Invalid JSON structure:", data);
                    }
                })
                .catch(err => console.error("Error fetching captions:", err))
                .finally(() => setLoading(false));
        };

        const fetchHashtags = async () => {
            setLoading(true);
            fetch("http://localhost:5000/caption")
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data.hashtags)) {
                        const shuffledHashtags = shuffleArray(data.hashtags);
                        const randomHashtags = shuffledHashtags.slice(0, 3);
                        setHashtags(randomHashtags);
                    } else {
                        console.error("Invalid JSON structure:", data);
                    }
                })
                .catch(err => console.error("Error fetching hashtags:", err))
                .finally(() => setLoading(false));
        }


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
                                className={`${classes.platformIcon} ${selectedPlatforms.includes(platform.name) ? classes.selectedPlatform : ""
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
