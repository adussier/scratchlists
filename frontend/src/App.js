import React from 'react';
import './App.css';
import Landing from './Landing';
import Navigation from './Navigation';
import Login from './Login';
import Logout from './Logout';
import TaskList from './TaskList';
import TaskEdit from './TaskEdit';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { UserContext } from "./UserContext"

let isAuthenticated = false;

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

class App extends React.Component {

  constructor() {
    super();
    let sessionState = sessionStorage.getItem("scratchlists_app_state");
    if (sessionState) {
      let session = JSON.parse(sessionState);
      isAuthenticated = session.isAuthenticated;
      this.state = session.state;
    }
    else {
      this.state = { user: null };
      sessionStorage.setItem("scratchlists_app_state", JSON.stringify({ isAuthenticated: false, state: this.state }));
    }
  }

  setUser = (user) => {
    sessionStorage.setItem("scratchlists_app_state", JSON.stringify({ isAuthenticated: true, state: { user: user }}));
    this.setState({ user: user });
  }

  unsetUser = () => {
    isAuthenticated = false;
    sessionStorage.setItem("scratchlists_app_state", JSON.stringify({ isAuthenticated: false, state: { user: null }}));
    this.setState({ user: null });
  }

  setAuthenticated = () => {
    isAuthenticated = true
    sessionStorage.setItem("scratchlists_app_state", JSON.stringify({ isAuthenticated: true, state: this.state }));
  }

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        <Router>
          <Switch>
            <Route exact path="/">
                <Landing />
            </Route>
            <Route path="/login">
              <Login setAuthenticated={this.setAuthenticated} setUser={this.setUser} />
            </Route>
            <PrivateRoute path="/logout">
              <Logout unsetUser={this.unsetUser} />
            </PrivateRoute>
            <PrivateRoute exact path="/open">
                <Navigation />
                <TaskList filter="open" />
            </PrivateRoute>
            <PrivateRoute exact path="/done">
                <Navigation />
                <TaskList exact filter="done" />
            </PrivateRoute>
            <PrivateRoute path="/edit" component={TaskEdit} />
          </Switch>
        </Router>
      </UserContext.Provider>
    )
  }
}
App.contextType = UserContext;

export default App;