import React, { useState } from "react";
import { Link } from "react-router-dom";  // For routing links in the sidebar
import classes from "../styles/mainPage.module.css";  // Assuming your styles are defined here
import Sidebar from "./components/sideBar.jsx";  // Import the Sidebar component
import { useEffect } from "react";

function MainPage() {
    const [photo, setPhoto] = useState(null);
    const [caption, setCaption] = useState("This is a sample caption.");
    const [allCaptions, setAllCaptions] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(false);

    const regeneratePhoto = () => {
        setPhoto(`https://picsum.photos/200/300?random=${Math.random()}`);
        fetchCaptions();
        fetchHashtags();
        //regenerateCaption(); // Regenerăm și caption-ul la schimbarea pozei
        //regenerateHashtags(); // Regenerăm și hashtag-urile la schimbarea pozei
    };

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
                    <button onClick={fetchCaptions} className={classes.regenerateButton}>Regenerate Caption</button>
                </div>
                <div className={classes.hashtagContainer}>
                    <div>
                        {hashtags.map((hashtag, index) => (
                            <span key={index} className={classes.hashtag}>{hashtag}</span>
                        ))}
                    </div>
                    <button onClick={fetchHashtags} className={classes.regenerateButton}>Regenerate Hashtags</button>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
