import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import styles from '../../styles/loginForm.module.css';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Fill both fields');
            return;
        }
        setError('');
        alert('Login successful');
    };

    return (
        <div className={styles["login-container"]}>
            <h1 className={styles.logo}>PostPal ✈️</h1>

            {/* Round profile image */}
            <div className={styles["profile-icon"]}>
                <img src="/profile-placeholder.png" alt="Profile" />
            </div>

            {error && <p className={styles["error-message"]}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className={styles["input-group"]}>
                    <FaUser className={styles.icon} />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className={styles["input-group"]}>
                    <FaLock className={styles.icon} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className={styles["remember-forgot"]}>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <span>Remember me</span>
                    <Link to="/forgot-password" className={styles["forgot-password"]}>
                        Forgot password?
                    </Link>
                </div>

                <button type="submit" className={styles["login-button"]}>Login</button>
            </form>

            <div className={styles["or-divider"]}>or</div>

            <button className={`${styles["social-login"]} ${styles.google}`}>
                <FcGoogle /> Continue with Google
            </button>
            <button className={`${styles["social-login"]} ${styles.facebook}`}>
                <FaFacebook /> Continue with Facebook
            </button>
            <button className={`${styles["social-login"]} ${styles.linkedin}`}>
                <FaLinkedin /> Continue with LinkedIn
            </button>

            <p className={styles.terms}>
                By clicking continue, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
        </div>
    );
}

export default LoginForm;
