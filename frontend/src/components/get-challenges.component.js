import React, { Component } from 'react';
import axios from 'axios';



export default class getChallenges extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.getHeroku = this.getHeroku.bind(this);
    this.getMongo = this.getMongo.bind(this);
    this.filterChallenges = this.filterChallenges.bind(this);
    this.addToDatabase = this.addToDatabase.bind(this);

    this.state = {
      username: '',
      usernames: [],
      userChallengeNames: [String],
      herokuChallenges: [],
    };
    
  }

  componentDidMount() {
    axios.get('http://localhost:5000/users/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
                usernames: response.data.map(user => user.username),
                username: response.data[0].username,
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
}

 getMongo(){
  
    axios.get('http://localhost:5000/users/name/'+this.state.username)
      .then(response =>{
        this.setState({
          userChallengeNames: response.data.map(data => data.challengeName)
        })
        console.log(this.state.userChallengeNames)
     })
  }

  getHeroku(){

    //console.log(this.state.username)
    //axios.get('https://'+this.state.username+'.herokuapp.com/api/challenges')
    var port = 3001;
    axios.get('http://localhost:'+port+'/api/challenges/')
    .then(response => {
        console.log(response.data.data)
        this.setState({
          herokuChallenges: response.data.data
        })
      })
  }

  filterChallenges(){

    for(var i = 0; i < this.state.herokuChallenges.length; i++){
        var herokuName = this.state.herokuChallenges[i].name;
        var challengeNameArray = this.state.userChallengeNames;
        var result = challengeNameArray.includes(herokuName);
        console.log(result)
        if(!result){
            axios.post('http://localhost:5000/users/userChallenges/'+this.state.username,{
            challengeName: this.state.herokuChallenges[i].name,
            challengeSuccess: this.state.herokuChallenges[i].solved
          })
        }
      }
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
      <h3>Get Challenges</h3>
      <form onSubmit={this.onSubmit}>
      <label>Username: </label>
          <select ref="userInput"
              required
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}>
              {
                this.state.usernames.map(function(user) {
                  return <option key={user} value={user}>
                    {user}
                    </option>;
                })
              }
              
          </select>
          
          <div className="form-group">
          <input type="submit" value="Add Challenges To Database" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}