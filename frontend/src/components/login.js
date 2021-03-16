import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";
import { Button, TextField } from '@material-ui/core';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.user.isAdmin){
      this.props.history.push("/adminDashboard");
    }

    else if (this.props.auth.isAuthenticated) {
      this.props.history.push("/Dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated && (nextProps.auth.user.isAdmin)){
      this.props.history.push("/adminDashboard");
    }
    else if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/Dashboard"); // push user to dashboard when they login
    }
if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }  



onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

onSubmit = e => {
    e.preventDefault();
const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter    

  };


render() {
    const { errors } = this.state;
    var emailError = false;
    var passwordError = false;
  
    if(errors.email || errors.emailnotfound){emailError = true}
    if(errors.password || errors.passwordincorrect){passwordError = true}

    const loginStyle = {
      paddingTop: "30px"
    };

return (
      <div>
            <div>
              <h1>
                <b>Welcome To the GU Hackathon!</b> 
              </h1>
              <h3>
                <b>Login below</b> 
              </h3>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <TextField
                  onChange={this.onChange}
                  value={this.state.email}
                  error={emailError}
                  helperText={errors.email || errors.emailnotfound}
                  id="email"
                  type="email"
                  label="Email"
                  
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
                
                
              </div>
              

              <div className="input-field col s12">
                <TextField
                  onChange={this.onChange}
                  value={this.state.password}
                  error={passwordError}
                  helperText={errors.password || errors.passwordincorrect}
                  id="password"
                  type="password"
                  label="Password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
              </div>

              
              
              
              <div style={loginStyle}>
                <Button variant="contained" color="primary" type="submit">
                  Login
                </Button>

                <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p> 
              </div>
            </form>
          </div>
    );
  }
}
Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };

  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

  export default connect(
    mapStateToProps,
    { loginUser }
  )(Login);