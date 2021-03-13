import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from '@material-ui/core';


class GetChallenges extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.getHeroku = this.getHeroku.bind(this);
    this.addToDatabase = this.addToDatabase.bind(this);
    this.updateChallenges = this.updateChallenges.bind(this);
    this.addChallenges = this.addChallenges.bind(this);

    this.getUsers = this.getUsers.bind(this);

    this.state = {
      userID: '',
      url: '',
      interval: '',
      herokuChallenges: []

    };
    
  }

  componentDidMount() {

  

    axios.get('http://localhost:5000/users/ID/'+this.props.auth.user.id)
      .then(response => {
          this.setState({
              url: response.data.url
          })
      })
      .catch((error) => {
        console.log(error);
      })

      if(this.state.url != ''){
      this.setState({

        interval: setInterval(() => {
          this.getHeroku();
          }, 1000)

        })
      }

  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
}

  getHeroku(){
    axios.get(this.state.url+'/api/challenges')
    .then(response => {
        this.setState({
          herokuChallenges: response.data.data
        })
      })
  }

  addChallenges(){

    console.log(this.state.herokuChallenges);

    for(var i = 0; i < this.state.herokuChallenges.length; i++){
      //console.log(this.state.herokuChallenges[i])
      axios.post('http://localhost:5000/users/addChallenges/'+this.props.auth.user.id,{
              challengeName: this.state.herokuChallenges[i].name,
              challengeSuccess: this.state.herokuChallenges[i].solved
            })
            .then(res => {console.log(res)})
      }

  }

  
  

  updateChallenges(){
    console.log(this.state.herokuChallenges);

    for(var i = 0; i < this.state.herokuChallenges.length; i++){
      
          axios.post('http://localhost:5000/users/updateChallenge/'+this.props.auth.user.id,{
          challengeName: this.state.herokuChallenges[i].name,
          challengeSuccess: this.state.herokuChallenges[i].solved
        })
      }
  
    }

    getUsers(){
      axios.get('http://localhost:5000/users/')
      .then(res => console.log(res))
    }
  
  
 addToDatabase(){

 this.getHeroku();
  setTimeout(() => { 
    this.getMongo(); 
      setTimeout(() => { 
      this.filterChallenges();
      }, 2000);
    }, 2000);
  }



  onSubmit(e) {
    e.preventDefault();
    this.getHeroku();
  setTimeout(() => { 
    this.getMongo(); 
      setTimeout(() => { 
      this.filterChallenges();
      }, 2000);
    }, 2000);
  }


  render() {
    return (
    <div>
      <Button onClick={this.getUsers}>getUsers</Button>
      <Button onClick={this.getHeroku}>getHeroku</Button>
      <Button onClick={this.addChallenges}>addChallenges</Button>
      <Button onClick={this.updateChallenges}>Submit Challenges</Button>
      <form>   
          <div>
          <input type="submit" value="Add Challenges To Database" className="btn btn-primary" />
        </div>
      </form>
    </div>
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