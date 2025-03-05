import React from "react";
import classes from "../styles/frontPage.module.css";
import LoginForm from "./components/loginForm.jsx";

function FrontPage() {
    return (
        <div className={classes.frontpageContainer}>
            <LoginForm />
        </div>
    );
}

export default FrontPage;
