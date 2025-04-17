import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "../styles/homePage.module.css";
import Menu from "./components/sideBar"

const HomePage = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [captionsNr, setCaptionsNr] = useState(0);
    const [hashtagsNr, setHashtagsNr] = useState(0);
    const [photo, setPhoto] = useState(null);
    const [caption, setCaption] = useState("This is a sample caption.");
    const [hashtags, setHashtags] = useState([]);
    const [allHashtags, setAllHashtags] = useState([]);
    const [allCaptions, setAllCaptions] = useState([]);
    const [availablePosts, setAvailablePosts] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchLastPhoto(0);
            fetchAvailablePosts(6);
        }
    }, [userId]);

    const fetchLastPhoto = async (skip) => {
        if (!userId) {
            console.error("User ID not found!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/photo/${userId}/${skip}`);
            if (!response.ok) throw new Error("Failed to fetch last photo");

            const data = await response.json();
            setCaptionsNr(data.caption.length);
            setHashtagsNr(data.hashtags.length);

            setPhoto(data.url);
            setAllCaptions(data.caption);
            setAllHashtags(data.hashtags);
            setCaption(data.caption[0]);
            setHashtags(data.hashtags.slice(0, 3));
        } catch (error) {
            console.error("Error fetching last photo:", error);
        }
    };

    const fetchAvailablePosts = async (limit = 6) => {
        if (!userId) return;

        const posts = [];

        for (let i = 0; i < limit; i++) {
            try {
                const response = await fetch(`http://localhost:5000/photo/${userId}/${i}`);
                if (!response.ok) throw new Error("Failed to fetch photo");

                const data = await response.json();
                posts.push({
                    location: "📍 Biblioteca UNSTPB",
                    title: "Hackathon 2025",
                    imageUrl: data.url,
                    caption: data.caption[0],
                    hashtags: data.hashtags.slice(0, 3),
                });
            } catch (err) {
                console.error(`Error fetching post ${i}:`, err);
            }
        }

        setAvailablePosts(posts);
    };

    const post = {
        location: "📍 Biblioteca UNSTPB",
        caption: caption,
        hashtags: hashtags,
        imageUrl: photo || "https://picsum.photos/150/150?random=1",
    };

    return (
        <div className={classes.container}>
            <Menu />
            {/* Header */}
            <div className={classes.header}>
                <h1 className={classes.appTitle}>PostPal 🚀</h1>
            </div>

            {/* Highlighted Section */}
            <h2 className={classes.sectionTitle}>Highlighted ➤</h2>
            <div className={classes.highlightCard} onClick={() => navigate('/main-page')}>
                <div className={classes.highlightContent}>
                    {/* Left Side */}
                    <div className={classes.leftSection}>
                        <p className={classes.postLocation}>{post.location}</p>
                        <img src={post.imageUrl} alt="Post" className={classes.postImage} />
                    </div>

                    {/* Right Side */}
                    <div className={classes.postText}>
                        <p className={classes.captionLabel}>Caption:</p>
                        <p className={classes.postCaption}>{post.caption}</p>

                        <p className={classes.hashtagsLabel}>Hashtags:</p>
                        <div className={classes.hashtagContainer}>
                            {post.hashtags.map((tag, index) => (
                                <span key={index} className={classes.hashtag}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Posts Section */}
            <h2 className={classes.sectionTitle}>Available Posts ➤</h2>
            <div className={classes.postsGrid}>
                {availablePosts.slice(1).map((post, index) => (
                    <div
                        key={index}
                        className={classes.postCard}
                        onClick={() => navigate('/main-page?skip=' + (index + 1))}>

                        <img src={post.imageUrl} alt={`Post ${index + 2}`} className={classes.postThumb} />
                        <p className={classes.postLoc}>{post.location}</p>
                        <p className={classes.postTitle}>{post.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
