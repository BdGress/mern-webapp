import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import { Button } from '@material-ui/core';

import AdminTable from "./adminTable";


class adminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userid: '',
      username: ''
    };
  }

  componentDidMount() {
    console.log(this.props.auth)
    axios.get('/users/id/'+this.props.auth.user.id)
      .then(response => {
          this.setState({
            username: response.data.username,
            userid: response.data._id
          })
      })
      .catch((error) => {
        console.log(error);
      })
  }
   

  

    onLogoutClick = e => {
      e.preventDefault();
      this.props.logoutUser();
    };



  

render() {

return (
      <div>
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there, {this.state.username} ! </b> 
            </h4>

            <AdminTable />
          <Button variant="contained" color="primary" onClick={this.onLogoutClick}>
            Logout
          </Button>

          </div>
        </div>
      </div>
    )
}
}

adminDashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth
  });


export default connect(
  mapStateToProps,
  { logoutUser }
)(adminDashboard);
