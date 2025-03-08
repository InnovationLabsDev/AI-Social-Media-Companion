import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from '../../styles/loginForm.module.css';

function RegistrationForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password || !retypePassword) {
            setError('All fields are required');
            return;
        }
        if (password !== retypePassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        alert('Registration successful');
    };

    return (
        <div className={classes.container}>
            <div className={classes.register_box}>
                <h2>Register</h2>
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
                    <div className={classes.input_group}>
                        <label>Retype Password</label>
                        <input
                            type="password"
                            placeholder="Retype your password"
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={classes.register_button}>
                        Register
                    </button>
                </form>
                <Link to="/" className={classes.login_link}>Already have an account? Login</Link>
            </div>
        </div>
    );
}

export default RegistrationForm;