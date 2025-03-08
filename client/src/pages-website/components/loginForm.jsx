import React, { useState } from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Link } from "react-router-dom";

import classes from '../../styles/loginForm.module.css';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Fill both fields');
            return;
        }
        setError("");
        //alert("Login successful");
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
        <div className={classes.container}>
            <div className={classes.login_box}>
                <h2>Login</h2>
                {error && <p className={classes.error_message}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={classes.input_group}>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={classes.input_group}>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Link to={"/main-page"}><button type="submit" className={classes.login_button}>Login</button></Link>
                    <button type="button" className={classes.login_with} onClick={() => handleLoginWith("SAlut")}>Login with FaceBook</button>
                    <button type="button" className={classes.login_with}>Login with LinkedIn</button>
                    <button type="button" className={classes.login_with}>Login with Instagram</button>
                </form>
                <FacebookLogin
                    appId="645771001175191" // Replace with your Facebook App ID
                    onSuccess={handleFacebookSuccess}
                    onFail={handleFacebookFailure}
                    style={{
                        backgroundColor: '#4267b2',
                        color: '#fff',
                        fontSize: '16px',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '4px',
                        marginTop: '10px',
                    }}
                >
                    Login with Facebook
                </FacebookLogin>
            </div>
        </div>
    );
}

export default LoginForm;
