import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';


import classes from '../../styles/loginForm.module.css';
import axios from 'axios';
import RegistrationForm from './registrationForm';
import { Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
// import { Link } from 'react-router-dom';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');

    const [users, setUsers] = useState([]);

    // Legare de backend
    const [array, setArray] = useState([]);

    const fetchAPI = async () => {
        const response = await axios.get("http://localhost:5000");
        setArray(response.data.fruits);
        console.log(response.data);
    };

    useEffect(() => {
        fetch("http://localhost:5000")
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Error:", err));
    }, []);

    /////////////////////////////

    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please fill in both fields');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/", {
                email,
                password
            });

            console.log(response.data); // Debugging

            if (response.data.message === "Login successful") {
                navigate("/main-page");
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("Invalid email or password");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }

        try {
            const response = await fetch("http://localhost:5000/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("userId", data.userId); // Store userId
                console.log("Login successful, userId:", data.userId);
                navigate("/main-page"); // Redirect to the main page
            } else {
                console.error("Login failed:", data.error);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const handleFacebookSuccess = (response) => {
        console.log('Facebook login successful', response);
        // Handle the response, e.g., authenticate with your backend
    };

    const handleFacebookFailure = (error) => {
        console.error('Facebook login failed', error);
        // Handle the error
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

            {/* Don't have an account link */}
            <p className={classes.dont_have_account}>
                Don't have an account? <Link to="/registration" className={classes.register_link}>Register now</Link>
            </p>

            <p className={classes.terms}>
                By clicking continue, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
        </div>
    );
}

export default LoginForm;
