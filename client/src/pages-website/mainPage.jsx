import React, { useState, useEffect } from "react";
import classes from "../styles/mainPage.module.css";
import { FaRegUserCircle } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter as FaXTwitter,
  FaPinterest
} from "react-icons/fa";

// Fixed username per platform
const PLATFORM_USERNAMES = {
  Instagram: "insta_creator",
  Facebook:  "fb_brandpage",
  LinkedIn:  "pro_marketer",
  Twitter:   "x_updates",
  Pinterest: "pinspiration"
};

// Fixed avatar per platform (using pravatar.cc placeholders)
const PLATFORM_AVATARS = {
  Instagram: "https://i.pravatar.cc/150?img=12",
  Facebook:  "https://i.pravatar.cc/150?img=34",
  LinkedIn:  "https://i.pravatar.cc/150?img=56",
  Twitter:   "https://i.pravatar.cc/150?img=35",
  Pinterest: "https://i.pravatar.cc/150?img=10"
};

const MainPage = () => {
  const [photo, setPhoto] = useState(null);
  const [profilePic, setProfilePic] = useState(PLATFORM_AVATARS["Instagram"]);
  const [username, setUsername]     = useState(PLATFORM_USERNAMES["Instagram"]);
  const [caption, setCaption]       = useState("");
  const [hashtags, setHashtags]     = useState(["#design", "#tech", "#creative", "#inspo"]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [currentPlatform, setCurrentPlatform]     = useState("Instagram");
  const [captionIndex, setCaptionIndex]           = useState(0);

  const regeneratePhoto = () => {
    setPhoto(`https://picsum.photos/300/300?random=${Math.random()}`);
  };

  const getCaptionForPlatform = (platform) => {
    const platformCaptions = {
      Instagram: [
        "☀️ Beach vibes only!",
        "Chillin' with the crew 😎",
        "Life's better in the sun 🌞"
      ],
      Facebook: [
        "Had an amazing time brainstorming with the team today—lots of ideas, coffee, and creativity flowing. Stay tuned for our next big project!",
        "Great day of collaboration! Can't wait to share our upcoming campaign.",
        "Busy brainstorming with the team! Stay tuned for exciting things coming your way!"
      ],
      LinkedIn: [
        "I’m thrilled to share that our team has successfully launched the Q2 marketing campaign, driving a 25% increase in engagement and opening new channels for brand storytelling. Huge thanks to everyone involved—onward and upward!",
        "Proud to be part of a team that's transforming the way we engage with our audience. Excited for what's next!",
        "Excited to announce that our latest project has successfully launched—looking forward to seeing the results!"
      ],
      Twitter: [
        "Big news dropping soon 🔥",
        "Exciting update coming your way 🚀",
        "Stay tuned for an awesome announcement 👀"
      ],
      Pinterest: [
        "Pinning my latest moodboard!",
        "Check out this new inspiration board! ✨",
        "Dreaming up new ideas for my next project 💡"
      ]
    };
    const caps = platformCaptions[platform] || [];
    return caps[captionIndex % caps.length];
  };

  const regenerateCaption = () => {
    setCaption(getCaptionForPlatform(currentPlatform));
    setCaptionIndex(i => (i + 1) % getCaptionForPlatform(currentPlatform).length);
  };

  const regenerateHashtags = () => {
    const pool = ["#design", "#tech", "#creative", "#inspo", "#innovation", "#team", "#marketing"];
    setHashtags(pool.sort(() => 0.5 - Math.random()).slice(0, 4));
  };

  const togglePlatformSelection = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
    setCurrentPlatform(platform);
  };

  const getAspectRatioClass = (plt) => {
    switch (plt) {
      case "Instagram": return classes.aspectRatio1by1;
      case "Facebook":  return classes.aspectRatio3by4;
      case "LinkedIn":  return classes.aspectRatio5by4;
      case "Pinterest": return classes.aspectRatio9by16;
      default:           return ""; // Twitter has no photo
    }
  };

  // On platform change, set username/avatar and regenerate caption/photo
  useEffect(() => {
    setUsername(PLATFORM_USERNAMES[currentPlatform]);
    setProfilePic(PLATFORM_AVATARS[currentPlatform]);
    regenerateCaption();
  }, [currentPlatform]);

  const isPhotoVisible = currentPlatform !== "Twitter";

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1 className={classes.appTitle}>PostPal 🚀</h1>
        <FaRegUserCircle className={classes.userIcon} />
      </div>

      <div className={classes.postCard}>
        {/* USER INFO */}
        <div className={`${classes.userInfo} ${classes[`${currentPlatform.toLowerCase()}UserInfo`]}`}>
          <img
            src={profilePic}
            alt="avatar"
            className={classes.userAvatar}
          />
          <div className={classes.userText}>
            <span className={classes.username}>@{username}</span>
            {currentPlatform === "Facebook" && (
              <span className={classes.location}>📍 3890 Poplar Dr.</span>
            )}
            {currentPlatform === "LinkedIn" && (
              <span className={classes.location}> Marketing Specialist</span>
            )}
          </div>
        </div>

        {/* PHOTO */}
        {isPhotoVisible && (
          <div className={`${classes.photoContainer} ${getAspectRatioClass(currentPlatform)}`}>
            <img
              src={photo}
              alt="Generated post"
              className={classes.photo}
            />
            <button onClick={regeneratePhoto} className={classes.refreshPhotoButton}>
              <FiRefreshCcw />
            </button>
          </div>
        )}

        {/* CAPTION & REFRESH */}
        <div className={classes.captionRow}>
          <p className={classes.caption}>
            {caption}
            {currentPlatform === "Twitter" && " " + hashtags.join(" ")}
          </p>
          <button onClick={regenerateCaption} className={classes.refreshButton}>
            <FiRefreshCcw />
          </button>
        </div>

        {/* HASHTAGS */}
        {["Instagram", "Facebook", "Pinterest"].includes(currentPlatform) && (
          <div className={classes.hashtagContainer}>
            {hashtags.map((tag, i) => (
              <span key={i} className={classes.hashtag}>{tag}</span>
            ))}
            <button onClick={regenerateHashtags} className={classes.refreshButton}>
              <FiRefreshCcw />
            </button>
          </div>
        )}
      </div>

      {/* PLATFORM PICKER */}
      <div className={classes.platformSelection}>
        <p className={classes.platformTitle}>Choose platform</p>
        <div className={classes.platformIcons}>
          {[
            { name: "Instagram", icon: <FaInstagram /> },
            { name: "Facebook",  icon: <FaFacebookF /> },
            { name: "LinkedIn",  icon: <FaLinkedinIn /> },
            { name: "Twitter",   icon: <FaXTwitter /> },
            { name: "Pinterest", icon: <FaPinterest /> }
          ].map(plt => (
            <div
              key={plt.name}
              className={`${classes.platformIcon} ${selectedPlatforms.includes(plt.name) ? classes.selectedPlatform : ""}`}
              onClick={() => togglePlatformSelection(plt.name)}
            >
              {plt.icon}
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
