import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';

import CreateHeroku from './createheroku';
import GetChallenges from './getchallenges';
import ChallengeTable from './challengeTable';


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userid: '',
      username: ''
    };
  }

  componentDidMount() {
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
              <b>Hey there, {this.state.username} !</b> 
            </h4>
          <ChallengeTable />

          <React.Fragment>
  
          <Box display="flex">

            <Box>
              <CreateHeroku />
            </Box>

            <Box flexGrow={1}>
              <GetChallenges />
            </Box> 

            <Box>
              <Button variant="contained" color="secondary" onClick={this.onLogoutClick}>
              Logout
              </Button>  
            </Box>

          </Box>
      
          </React.Fragment>

          

          
          

          </div>
        </div>
      </div>
    )
}
}



Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
