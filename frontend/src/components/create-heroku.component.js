import React, { Component } from 'react';
const Heroku = require('heroku-client')
const heroku = new Heroku({ token: 'e5b17482-1de1-45b3-9e46-dc574933b082' })



export default class CreateHeroku extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.createHerokuDeployment = this.createHerokuDeployment.bind(this);
    

  }


 createHerokuDeployment(username){

    heroku.request({
        method: 'POST',
        path: '/app-setups',
        body: {
            "app":{"name":username,"region":"us"},
            "source_blob": {"url":"https://api.github.com/repos/BdGress/VirtualHackathon/tarball/master"}
        },
        parseJSON: false
      }).then(response => {console.log(response)})
}
  

  onSubmit(e) {
    e.preventDefault();
    this.createHerokuDeployment();
  }


  render() {
    return (
    <div>
      <h3>Create Heroku</h3>
      <form onSubmit={this.onSubmit}>
          
          <div className="form-group">
          <input type="submit" value="Create Heroku" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}