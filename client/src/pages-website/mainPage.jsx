import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classes from "../styles/mainPage.module.css";
import Sidebar from "./components/sideBar.jsx";
import { FaRegUserCircle } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter, FaPinterest } from "react-icons/fa";
import cloudinary from "cloudinary-core";

const MainPage = () => {
    const [photo, setPhoto] = useState(null);
    const [caption, setCaption] = useState("This is a sample caption.");
    const [hashtags, setHashtags] = useState([]);
    const [allCaptions, setAllCaptions] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const userId = localStorage.getItem("userId");

    // useEffect(() => {
    //     // Fetch captions and hashtags on component mount
    //     fetchCaptions();
    //     fetchHashtags();
    // }, []);

    // // Function to shuffle an array
    // function shuffleArray(array) {
    //     for (let i = array.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    //     }
    //     return array;
    // }

    // const fetchCaptions = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await fetch("http://localhost:5000/caption");
    //         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    //         const data = await res.json();
    //         if (Array.isArray(data.captionArray)) {
    //             setAllCaptions(data.captionArray);
    //             const shuffledCaptions = shuffleArray(data.captionArray);
    //             setCaption(shuffledCaptions[0]); // Select random caption
    //         } else {
    //             console.error("Invalid JSON structure:", data);
    //         }
    //     } catch (err) {
    //         console.error("Error fetching captions:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const fetchHashtags = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await fetch("http://localhost:5000/hashtags");
    //         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    //         const data = await res.json();
    //         if (Array.isArray(data.hashtags)) {
    //             const shuffledHashtags = shuffleArray(data.hashtags);
    //             setHashtags(shuffledHashtags.slice(0, 3)); // Select top 3 hashtags
    //         } else {
    //             console.error("Invalid JSON structure:", data);
    //         }
    //     } catch (err) {
    //         console.error("Error fetching hashtags:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const regeneratePhoto = () => {
        setPhoto(`https://picsum.photos/300/300?random=${Math.random()}`); // Regenerate random photo
        fetchCaptions();
        fetchHashtags();
    };

    const regenerateCaption = () => {
        if (allCaptions.length > 0) {
            const shuffledCaptions = shuffleArray(allCaptions);
            setCaption(shuffledCaptions[0]); // Regenerate caption
        }
    };

    const regenerateHashtags = () => {
        fetchHashtags(); // Fetch new hashtags
    };

    useEffect(() => {
        if (!userId) {
            console.error("User ID not found!");
            return;
        }

        const fetchLastPhoto = async () => {
            try {
                const response = await fetch(`http://localhost:5000/last-photo/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch last photo");

                const data = await response.json();
                setPhoto(data.url);
                setCaption(data.caption[0]);
                setHashtags(data.hashtags.slice(0, 3));
                // console.log(caption);
                // console.log(hashtags);
            } catch (error) {
                console.error("Error fetching last photo:", error);
            }
        };

        fetchLastPhoto();
    }, [userId, file]);
    const togglePlatformSelection = (platform) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
        );
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0]; // Get the first selected file
        if (!selectedFile) {
            alert("Please select a file first!");
            return; // Exit if no file is selected
        }

        setFile(selectedFile); // Set the file to state
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile); // Append the file to the FormData

            const response = await fetch("http://localhost:5000/main-page", {
                method: "POST", // Make sure it's a POST request
                body: formData,
            });

            const data = await response.json();

            console.log(data);

            if (response.ok) {
                // const imageUrl = data.imageUrl; // Get the uploaded image URL
                // setPhoto(imageUrl); // Update the photo state with the image URL
                console.log("File uploaded successfully!");
                setPhoto("");
                setTimeout(() => setPhoto(data.url), 50);
                alert("File uploaded successfully!");
            } else {
                alert("Error uploading file.");
            }
        } catch (err) {
            console.error("Error uploading file:", err);
            alert("Error uploading file");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadButtonClick = () => {
        document.getElementById("fileInput").click(); // Trigger file input click
    };

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <h1 className={classes.appTitle}>PostPal 🚀</h1>
                <FaRegUserCircle className={classes.userIcon} />
            </div>

            <div className={classes.postCard}>
                <div className={classes.userInfo}>
                    <FaRegUserCircle className={classes.userAvatar} />
                    <div>
                        <p className={classes.username}>@johnmaina</p>
                        <p className={classes.location}>📍 3890 Poplar Dr.</p>
                    </div>

                    {/* File Upload */}
                    <div className={classes.uploadContainer}>
                        <input
                            type="file"
                            id="fileInput"
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                        <button onClick={handleUploadButtonClick} className={classes.uploadButton}>
                            {loading ? "Uploading..." : "Upload"}
                        </button>
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
                        { name: "Twitter", icon: <FaTwitter /> },
                        { name: "Pinterest", icon: <FaPinterest /> },
                    ].map((platform) => (
                        <div
                            key={platform.name}
                            className={`${classes.platformIcon} ${selectedPlatforms.includes(platform.name) ? classes.selectedPlatform : ""}`}
                            onClick={() => togglePlatformSelection(platform.name)}
                        >
                            {platform.icon}
                        </div>
                    ))}
                </div>

                <div className={classes.buttonGroup}>
                    <button className={classes.declineButton}>Decline</button>
                    <button className={classes.acceptButton}>Accept and Share</button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
