import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import classes from '../../styles/loginForm.module.css';

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
        <div className={classes.login_container}>
            <h1 className={classes.logo}>PostPal 🚀</h1>

            {/* Round profile image */}
            <div className={classes.profile_icon}>
                <img src="/profile-placeholder.png" alt="Profile" />
            </div>

            {error && <p className={classes.error_message}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className={classes.input_group}>
                    <FaUser className={classes.icon} />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className={classes.input_group}>
                    <FaLock className={classes.icon} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className={classes.remember_forgot}>
                    <label className={classes.switch}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        <span className={classes.slider}></span>
                    </label>
                    <span className={classes.remember}> Remember me</span>
                    <Link to="/forgot-password" className={classes.forgot_password}>
                        Forgot password?
                    </Link>
                </div>

                <button type="submit" className={classes.login_button}>Login</button>
            </form>

            <div className={classes.or_divider}>or</div>

            <button className={`${classes.social_login} ${classes.facebook}`}>
                <FaFacebook /> Continue with Facebook
            </button>

            <button className={`${classes.social_login} ${classes.linkedin}`}>
                <FaLinkedin /> Continue with LinkedIn
            </button>

            <button className={`${classes.social_login} ${classes.google}`}>
                <FcGoogle /> Continue with Google
            </button>
            

            <p className={classes.terms}>
                By clicking continue, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
        </div>
    );
}

export default LoginForm;
