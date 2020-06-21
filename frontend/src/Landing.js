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
                <div>
                    <p className="lead text-dark text-center">
                        <i>Create &amp; manage your tasks from everywhere</i>
                    </p>
                    <p className="lead text-dark text-center">
                        <i>Set task reminders &amp; get notified by email</i>
                    </p>
                    <p className="lead text-dark text-center">
                        <i>Use tags to filter tasks</i>
                    </p>
                </div>
                <div className="py-4">
                    <p className="text-center">
                        <a href={Config.COGNITO_UI_URL} className="btn btn-lg btn-outline-success">Sign in or sign up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}