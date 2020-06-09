import React from "react";
import Config from "./config.js"

export default function Landing(props) {
    return (
        <div>
            <h1>Scratchlists</h1>
            <a href={Config.COGNITO_UI_URL}>Sign in or sign up</a>
        </div>
    )
}