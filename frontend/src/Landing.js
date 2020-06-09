import React from "react";
import Config from "./config.js"
import './Landing.css';

export default function Landing(props) {
    return (
        <div className="bg">
            <div className="container pt-5">
                <div>
                    <h1 className="display-1 text-dark text-center">
                        <b><i>ScratchLists</i></b>
                    </h1>
                </div>
                <div className="pb-5">
                    <p className="lead text-dark text-center">
                        <b><i>Your todo lists in the Cloud</i></b>
                    </p>
                </div>
                <div className="py-5">
                    <p className="text-center">
                        <a href={Config.COGNITO_UI_URL} className="btn btn-lg btn-outline-success">Sign in or sign up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}