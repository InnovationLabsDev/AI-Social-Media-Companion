import React from "react";
import classes from "../styles/frontPage.module.css";
import RegistraionForm from "./components/registrationForm.jsx";

function RegistraionPage() {
    return (
        <div className={classes.frontpageContainer}>
            <RegistraionForm />
        </div>
    );
}

export default RegistraionPage;