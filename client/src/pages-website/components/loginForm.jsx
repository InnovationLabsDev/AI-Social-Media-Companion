/* Login Form Component */

import React from "react";
import { useState } from "react";

import classes from "../../styles/loginForm.module.css";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Fill both fields");
            return -1;
        }
        setError("");
        alert("Login successful");
    };

    const handleLoginWith = (e) => {
        alert("Login with FaceBook");
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
                    <button type="submit" className={classes.login_button}>Login</button>
                    <button type="button" className={classes.login_with} onClick={() => handleLoginWith("SAlut")}>Login with FaceBook</button>
                    <button type="button" className={classes.login_with}>Login with LinkedIn</button>
                    <button type="button" className={classes.login_with}>Login with Instagram</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;