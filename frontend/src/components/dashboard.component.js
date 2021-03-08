import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import axios from "axios";
import { CircularProgress, Button } from '@material-ui/core';

const Heroku = require('heroku-client')
const heroku = new Heroku({ token: 'e5b17482-1de1-45b3-9e46-dc574933b082' })


class Dashboard extends Component {
  constructor(props) {
    super(props);


   this.createHerokuDeployment = this.createHerokuDeployment.bind(this);
   this.HerokuBuildUpdate = this.HerokuBuildUpdate.bind(this);
   this.launchHerokuDeployment = this.launchHerokuDeployment.bind(this);

    this.state = {
      userid: '',
      username: '',
      setupID: '',
      isBuilding: false,
      isBuilt: false,
      url: ''
    };
  }


  componentDidMount() {
    const { user } = this.props.auth;
    axios.get('http://localhost:5000/users/id/'+user.id)
      .then(response => {
          this.setState({
            username: response.data.username,
            userid: user.id,
            url: response.data.url
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



  createHerokuDeployment(){

    this.setState({
      isBuilding: true
    })

    heroku.request({
        method: 'POST',
        path: '/app-setups',
        body: {

          "source_blob": {"url":"https://api.github.com/repos/BdGress/VirtualHackathon/tarball/master"}
        },
        parseJSON: true
      }).then(response => {
        console.log(response);

        const appID = response.id;
        console.log(appID)
        this.setState({
            setupID: response.id
        })

        })
      }
        


HerokuBuildUpdate(){
  console.log(this.state.setupID);
  heroku.get('/app-setups/'+this.state.setupID)
  .then(response => {
    if(response.status == "succeeded"){
        this.setState({
      isBuilding: false,
      isBuilt: true,
      url: "https://" + response.app.name +".herokuapp.com/#/"
    })

    axios.post('http://localhost:5000/users/url/'+this.state.userid,{'url':this.state.url})
      .then(response => console.log(response.data))
      .catch((error) => {
        console.log(error);
      })

    }
    else{
      this.setState({
        isBuilding: true,
        isBuilt: false,
       
      })
      
    }
 
    console.log(this.state.isBuilding)
    console.log(response.app.name)
  })
}

launchHerokuDeployment(){
  window.open(this.state.url)
}


render() {
 const isBuilding = this.state.isBuilding;
 const isBuilt = this.state.isBuilt;
 const url = this.state.url;

 const renderBuildButton = () => {
      if(!isBuilding && !isBuilt && (url == null)){
      return <Button variant="contained" color="primary" onClick={this.createHerokuDeployment} disabled={isBuilding}>
        Build Heroku
        </Button>;}

      if(isBuilding && !isBuilt){
      return <Button variant="contained" color="secondary"><CircularProgress color="primary" />
        Building Heroku
        </Button>;}

      if(!isBuilding && isBuilt){
        return <Button variant="contained" color="secondary" onClick={this.launchHerokuDeployment}>
        Launch Heroku
        </Button>;
      }
    }


 


return (
      <div>
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,{this.state.username} </b> 
            </h4>
  
          {renderBuildButton()}

          <Button variant="contained" color="primary" onClick={this.HerokuBuildUpdate}>
            Heroku Update
          </Button>

          <Button variant="contained" color="primary" onClick={this.onLogoutClick}>
            Logout
          </Button>

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
