import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CircularProgress, Button } from '@material-ui/core';


class CreateHeroku extends Component {
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
      appName: '',
      url: null
    };
  }

   

  componentDidMount() {
      axios.get('http://localhost:5000/users/id/'+this.props.auth.user.id)
        .then(response => {
            this.setState({
              username: response.data.username,
              userid: response.data._id,
              url: response.data.url,
              isBuilding: response.data.isBuilding,
              setupID: response.data.setupID
            })
        })
        .catch((error) => {
          console.log(error);
        })
    }


  createHerokuDeployment(){
    axios.get('http://localhost:5000/heroku/build')
      .then(response => {
        this.setState({
          isBuilding: true,
          setupID: response.data.id,
          appName: response.data.app.name 
        })

        axios.post('http://localhost:5000/users/isBuilding/'+this.state.userid,
        {'isBuilding': this.state.isBuilding})

        axios.post('http://localhost:5000/users/setupID/'+this.state.userid,
        {'setupID': this.state.setupID})

        axios.post('http://localhost:5000/users/userURL/'+this.state.userid,
        {'url': "https://"+this.state.appName+".herokuapp.com"})

     
    })
    .catch((error) => {
      console.log(error);
    }) 
     
  }
      
HerokuBuildUpdate(){

  axios.get('http://localhost:5000/heroku/isBuilding/'+this.state.setupID)
      .then(response => {
        console.log(response.data.status)
        if(response.data.status == "succeeded"){
          this.setState({
          isBuilding: false
          })
          
          axios.post('http://localhost:5000/users/isBuilding/'+this.state.userid,
          {'isBuilding': this.state.isBuilding})

        }

        else if(response.data.status == "pending"){
          setTimeout(this.HerokuBuildUpdate,5000);
        }
      
      })
}


launchHerokuDeployment(){
  window.open(this.state.url)
}


render() {
  
 const renderBuildButton = () => {
      if((this.state.url == null) && (!this.state.isBuilding)){
      return <Button variant="contained" color="primary" onClick={this.createHerokuDeployment} disabled={this.state.isBuilding}>
        Build Heroku
        </Button>;}

      else if(this.state.isBuilding){
      return <Button variant="contained" color="secondary"><CircularProgress color="primary" />
        Building Heroku
        </Button>;}

      else if(!this.state.isBuilding){
        
        return <Button variant="contained" color="secondary" onClick={this.launchHerokuDeployment}>
        Launch Heroku
        </Button>;
      }
    }

return (
      <div>
          {renderBuildButton()}
      </div>
    )
}
}

CreateHeroku.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(CreateHeroku);
