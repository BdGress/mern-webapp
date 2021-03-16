import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";


import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/navbar";
import Register from "./components/register";
import Login from "./components/login";
import PrivateRoute from "./components/privateRoute";
import AdminRoute from "./components/adminRoute";
import Dashboard from "./components/dashboard";
import adminDashboard from "./components/adminDashboard";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            
            
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <AdminRoute exact path="/adminDashboard" component={adminDashboard} />
              
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;