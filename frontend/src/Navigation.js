import React from "react";
import { UserContext } from "./UserContext"
import { Link } from "react-router-dom";

class Navigation extends React.Component {
    render() {
        let user = this.context;
        if (user) {
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
                                <a className="nav-link" href="https://scratchlists.auth.eu-central-1.amazoncognito.com/logout?client_id=3lm2ad6qbjd1a1srceqq0966su&logout_uri=http://localhost:3000/logout">Logout</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            )
        }
        else {
            return (
                <nav className="navbar navbar-dark bg-dark">
                    <div className="home-nav">
                        <Link to="/" className="navbar-brand">Scratchlists</Link>
                    </div>
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="https://scratchlists.auth.eu-central-1.amazoncognito.com/login?client_id=3lm2ad6qbjd1a1srceqq0966su&response_type=token&scope=email+https://scratchlists.resource.server/scratchlists.all+openid+profile&redirect_uri=http://localhost:3000/login">Login</a>
                        </li>
                    </ul>
                </nav>
            )
        }
    }
}
Navigation.contextType = UserContext;

export default Navigation;