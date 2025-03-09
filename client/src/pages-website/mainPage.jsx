import React, { useState } from "react";
import { Link } from "react-router-dom";  // For routing links in the sidebar
import classes from "../styles/mainPage.module.css";  // Assuming your styles are defined here
import Sidebar from "./components/sideBar.jsx";  // Import the Sidebar component
import { useEffect } from "react";

function MainPage() {
    const [photo, setPhoto] = useState(null);
    const [caption, setCaption] = useState("This is a sample caption.");
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(false);

    const regeneratePhoto = () => {
        setPhoto(`https://picsum.photos/200/300?random=${Math.random()}`);
        regenerateCaption(); // Regenerăm și caption-ul la schimbarea pozei
        regenerateHashtags(); // Regenerăm și hashtag-urile la schimbarea pozei
    };

    const fetchCaptionsAndHashtags = async () => {
        setLoading(true);
        fetch("http://localhost:5000/caption")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data.captionArray) && Array.isArray(data.hashtags)) {
                    setCaption(data.captionArray); // Change to `captionArray`
                    setHashtags(data.hashtags);
                } else {
                    console.error("Invalid JSON structure:", data);
                }
            })
            .catch(err => console.error("Error fetching captions and hashtags:", err))
            .finally(() => setLoading(false));
    };


    const regenerateCaption = () => {
        fetchCaptionsAndHashtags();
        const captions = [
            "Exploring new places!",
            "What a wonderful day!",
            "Feeling inspired today!",
            "Adventure awaits!",
            "Let's make today amazing!",
            "Enjoying the little things.",
            "Life is beautiful!"
        ];
        const randomCaption = captions[Math.floor(Math.random() * captions.length)];
        setCaption(randomCaption);
    };

    const regenerateHashtags = () => {
        const hashtagsArray = [
            "#Travel", "#Life", "#Nature", "#Inspiration", "#Photography",
            "#Adventure", "#Explore", "#Wanderlust", "#Love", "#Happiness",
            "#Motivation", "#PositiveVibes", "#Outdoor", "#PicOfTheDay"
        ];
        const selectedHashtags = [];
        while (selectedHashtags.length < 3) {
            const randomHashtag = hashtagsArray[Math.floor(Math.random() * hashtagsArray.length)];
            if (!selectedHashtags.includes(randomHashtag)) {
                selectedHashtags.push(randomHashtag);
            }
        }
        setHashtags(selectedHashtags);
    };

    return (
        <div className={classes.mainPageContainer}>
            {/* Main Content */}
            <div className={classes.content}>
                <Sidebar />
                <div className={classes.photoContainer}>
                    {photo ? (
                        <img src={photo} alt="Generated" className={classes.photo} />
                    ) : (
                        <div className={classes.placeholder}>Placeholder</div>
                    )}
                    <button onClick={regeneratePhoto} className={classes.regenerateButton}>Regenerate Photo</button>
                </div>
                <div className={classes.captionContainer}>
                    <p className={classes.caption}>{caption}</p>
                    <button onClick={regenerateCaption} className={classes.regenerateButton}>Regenerate Caption</button>
                </div>
                <div className={classes.hashtagContainer}>
                    <div>
                        {hashtags.map((hashtag, index) => (
                            <span key={index} className={classes.hashtag}>{hashtag}</span>
                        ))}
                    </div>
                    <button onClick={regenerateHashtags} className={classes.regenerateButton}>Regenerate Hashtags</button>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
