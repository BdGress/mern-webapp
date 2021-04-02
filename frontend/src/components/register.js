import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
import classnames from "classnames";
import { Button, TextField } from '@material-ui/core';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

componentWillReceiveProps(nextProps) {
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
const newUser = {
      username: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

this.props.registerUser(newUser, this.props.history);


  };
render() {
    const { errors } = this.state;
    var nameError = false;
    var emailError = false;
    var passwordError = false;
    var passwordError2 = false;

    if(errors.name){nameError = true}
    if(errors.email){emailError = true}
    if(errors.password){passwordError = true}
    if(errors.password2){passwordError2 = true}

    const registerStyle = {
      paddingTop: "30px"
    };

return (
      <div>
        <div>
          <div>
            <div>
              <h3>
                <b>Register</b> below
              </h3>

            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div>
              <TextField
                  onChange={this.onChange}
                  value={this.state.name}
                  error={nameError}
                  helperText={errors.name}
                  id="name"
                  type="text"
                  label="Participant Name"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
              </div>

              <div>
                <TextField
                  onChange={this.onChange}
                  value={this.state.email}
                  error={emailError}
                  helperText={errors.email}
                  id="email"
                  type="email"
                  label="Email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
              </div>

              <div>
                <TextField
                  onChange={this.onChange}
                  value={this.state.password}
                  error={passwordError}
                  helperText={errors.password}
                  id="password"
                  type="password"
                  label="Password"
                  className={classnames("", {
                  invalid: errors.password
                  })}
                />
              </div>

              <div>
                <TextField
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={passwordError2}
                  helperText={errors.password2}
                  id="password2"
                  type="password"
                  label="Re-Enter Password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
              </div>

              <div style={registerStyle}>
                <Button variant="contained" color="primary" type="submit">
                  Sign up
                </Button>
              </div>

              <p>
                Already have an account? <Link to="/">Log in</Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

export default connect(
    mapStateToProps,
    { registerUser }
  )(withRouter(Register));