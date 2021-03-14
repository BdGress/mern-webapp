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
   this.getHeroku = this.getHeroku.bind(this);
   this.addChallenges = this.addChallenges.bind(this);

    this.state = {
      userid: '',
      username: '',
      setupID: '',
      isBuilding: false,
      appName: '',
      url: null,
      interval: '',
      herokuChallenges: []
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

        if(this.state.isBuilding){
          this.setState({
          interval: setInterval(this.HerokuBuildUpdate,10000)
          })

        }

    }

  componentWillUnmount(){
    clearInterval(this.state.interval)
  }

  getHeroku(){
    axios.get(this.state.url+'/api/challenges')
    .then(response => {
        this.setState({
          herokuChallenges: response.data.data
        })
        console.log(this.state.herokuChallenges);
        this.addChallenges();
      })
  }

  addChallenges(){
    for(var i = 0; i < this.state.herokuChallenges.length; i++){
      axios.post('http://localhost:5000/users/addChallenge/'+this.props.auth.user.id,{
              challengeName: this.state.herokuChallenges[i].name,
              challengeSuccess: this.state.herokuChallenges[i].solved
            })
            .then(res => {console.log(res)})
      }
  }



  createHerokuDeployment(){
    axios.get('http://localhost:5000/heroku/build')
      .then(response => {
        this.setState({
          isBuilding: true,
          setupID: response.data.id,
          url: "https://"+response.data.app.name+".herokuapp.com"
        })

        axios.post('http://localhost:5000/users/isBuilding/'+this.state.userid,
        {'isBuilding': this.state.isBuilding})

        axios.post('http://localhost:5000/users/setupID/'+this.state.userid,
        {'setupID': this.state.setupID})

        axios.post('http://localhost:5000/users/userURL/'+this.state.userid,
        {'url': this.state.url})
          
     
    })
    .catch((error) => {
      console.log(error);
    }) 

    this.setState({
      interval: setInterval(this.HerokuBuildUpdate,10000)
      })
     
  }
      
HerokuBuildUpdate(){

  axios.get('http://localhost:5000/heroku/isBuilding/'+this.state.setupID)
      .then(response => {
        //console.log(response)
        if(response.data.status === "succeeded"){
          clearInterval(this.state.interval);

          this.setState({
          isBuilding: false
          })

          console.log('success')
          axios.post('http://localhost:5000/users/isBuilding/'+this.state.userid,
          {'isBuilding': this.state.isBuilding})
          .then(this.getHeroku())
          

        }

        else if(response.data.status === "pending"){
          console.log('pending')
        }
      
      })
}


launchHerokuDeployment(){
  window.open(this.state.url)
}


render() {
  
 const renderBuildButton = () => {
      if(this.state.url == null){
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
