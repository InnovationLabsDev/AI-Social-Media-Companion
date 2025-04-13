import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import classes from "../styles/homePage.module.css";

const HomePage = () => {
    const navigate = useNavigate(); // Hook for navigation

    const post = {
        location: "📍 3890 Poplar Dr.",
        caption: "Prepping for a brainstorming session with the creative team about our next campaign.",
        hashtags: ["#design", "#development", "#meeting", "#tech"],
        imageUrl: "https://picsum.photos/150/150"
    };

    const availablePosts = [
        { location: "⚲ 8558 Green Rd.", title: "Demo Day", imageUrl: "https://picsum.photos/150/150?random=2" },
        { location: "⚲ Champs-Élysées 246", title: "Hackathon", imageUrl: "https://picsum.photos/150/150?random=3" },
        { location: "⚲ 42 Silicon Ave.", title: "Tech Talk", imageUrl: "https://picsum.photos/150/150?random=4" },
        { location: "⚲ 21 Innovation St.", title: "Startup Pitch", imageUrl: "https://picsum.photos/150/150?random=5" },
        { location: "⚲ 777 Developer Ln.", title: "Coding Sprint", imageUrl: "https://picsum.photos/150/150?random=6" }
    ];

    return (
        <div className={classes.container}>
            {/* Header */}
            <div className={classes.header}>
                <h1 className={classes.appTitle}>PostPal 🚀</h1>
            </div>

            {/* Highlighted Section - Clickable */}
            <h2 className={classes.sectionTitle}>Highlighted ➤</h2>
            <div className={classes.highlightCard} onClick={() => navigate('/main-page')}>
                <div className={classes.highlightContent}>
                    {/* Left Section - Location and Image */}
                    <div className={classes.leftSection}>
                        <p className={classes.postLocation}>{post.location}</p>
                        <img src={post.imageUrl} alt="Post" className={classes.postImage} />
                    </div>

                    {/* Right Section - Caption & Hashtags */}
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

            {/* Available Posts */}
            <h2 className={classes.sectionTitle}>Available Posts ➤</h2>
            <div className={classes.postsGrid}>
                {availablePosts.map((post, index) => (
                    <div key={index} className={classes.postCard}>
                        <img src={post.imageUrl} alt={post.title} className={classes.postThumb} />
                        <p className={classes.postLoc}>{post.location}</p>
                        <p className={classes.postTitle}>{post.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
