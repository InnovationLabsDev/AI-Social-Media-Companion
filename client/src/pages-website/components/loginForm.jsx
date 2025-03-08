import React, { useState, useEffect } from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';
import classes from '../../styles/loginForm.module.css';
import axios from 'axios';
import RegistrationForm from './registrationForm';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
            const response = await axios.post("http://localhost:5000", { email, password });

            alert("Login successful");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }

        setIsLoading(false);
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
        <div className={classes.container} >
            <div className={classes.login_box}>
                <h2>
                    <button className={classes.register_button}>
                        <Link to="/registration">Register</Link>
                    </button>
                </h2>
                {error && <p className={classes.error_message}>{error}</p>}
                <form onSubmit={handleSubmit} className={classes.form}>
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
                    <button
                        type="submit"
                        className={classes.login_button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {/* <div>
                    {users.map(user => (
                        <div key={user.id}>
                            <h3>{user.name} ({user.email})</h3>
                            {user.picture ? (
                                <img src={user.picture} alt="User" width="200" />
                            ) : (
                                <p>No Picture</p>
                            )}
                        </div>
                    ))}
                </div> */}
                <FacebookLogin className={classes.facebook_button}
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
                        marginBottom: '10px',
                        width: '75vw'
                    }}
                >
                    Login with Facebook
                </FacebookLogin>
            </div>
        </div >
    );
}

export default LoginForm;
