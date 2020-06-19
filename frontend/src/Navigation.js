import React from "react";
import Config from "./config.js"
import { Link } from "react-router-dom";

class Navigation extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark">
                <Link to="/" className="navbar-brand pr-5">Scratchlists</Link>
                <div className="navbar-expand mr-auto">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="/open" className="nav-link">Open</a>
                        </li>
                        <li className="nav-item">
                            <a href="/done" className="nav-link">Done</a>
                        </li>
                    </ul>
                </div>
                <div className="navbar-expand">
                    <ul className="navbar-nav">
                        <li className="nav-item float-right">
                            <a className="nav-link" href={Config.COGNITO_LOGOUT_URL}>Logout</a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Navigation;