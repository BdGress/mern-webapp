import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from '@material-ui/core';


class GetChallenges extends Component {
  constructor(props) {
    super(props);

    this.getHeroku = this.getHeroku.bind(this);
    this.updateChallenges = this.updateChallenges.bind(this);
    this.addChallenges = this.addChallenges.bind(this);
    this.getUrl = this.getUrl.bind(this);

    this.state = {
      userID: '',
      url: '',
      interval: '',
      herokuChallenges: []

    };
    
  }

  componentDidMount() {
    axios.get('/users/ID/'+this.props.auth.user.id)
      .then(response => {
          this.setState({
              url: response.data.url
          })
      })
      .catch((error) => {
        console.log(error);
      })

  }

  getUrl(){
    console.log(this.state.userID)
    axios.get('/users/ID/'+this.props.auth.user.id)
      .then(response => {
          this.setState({
              url: response.data.url
          })
          this.getHeroku();
      })
      .catch((error) => {
        console.log(error);
      })

  }

  getHeroku(){

    axios.get(this.state.url+'/api/challenges')
    .then(response => {
        this.setState({
          herokuChallenges: response.data.data
        })
        console.log(this.state.herokuChallenges)
        this.updateChallenges();
      })
  }

  addChallenges(){
    //console.log(this.state.herokuChallenges)
    for(var i = 0; i < this.state.herokuChallenges.length; i++){
      axios.post('/users/addChallenge/'+this.props.auth.user.id,{
              challengeName: this.state.herokuChallenges[i].name,
              challengeSuccess: this.state.herokuChallenges[i].solved,
              challengeDescription: this.state.herokuChallenges[i].description
              
            })
            .then(res => {console.log(res)})
      }
  }

  updateChallenges(){
    for(var i = 0; i < this.state.herokuChallenges.length; i++){
          axios.post('/users/updateChallenge/'+this.props.auth.user.id,{
          challengeName: this.state.herokuChallenges[i].name,
          challengeSuccess: this.state.herokuChallenges[i].solved,
          challengeDescription: this.state.herokuChallenges[i].description
        })
      }
    }
    
  render() {
    return (
    <span>
      <Button variant="contained" color="primary" onClick={this.getUrl}>Update</Button>
    </span>
    )
  }
}

GetChallenges.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(GetChallenges);