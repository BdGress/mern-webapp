import React, { Component } from 'react';
import axios from 'axios';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import PropTypes from "prop-types";
import { connect } from "react-redux";





class ChallengeTable extends Component {
    constructor(props) {
      super(props);

      this.getData = this.getData.bind(this);
     

      this.state = {
        row: [],
        interval: " ",
        isBuilding: " ",
        url: " "
      };
    }

    componentDidMount() {
     
      this.setState({
        interval: setInterval(this.getData,3000)
        })
          
    }

    componentWillUnmount(){
      clearInterval(this.state.interval)
    }

 getData(){
    axios.get('/users/getChallenges/'+this.props.auth.user.id)
      .then(response =>{
        this.setState({
            row: response.data
          })
        
     })
  }



  


render() {


  return (
  
<div>
<TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Challenge Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Solved</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.row.map((row) => (
            <TableRow key={row._id} style ={ row.challengeSuccess == true ? { background : "green" }:{ background : "white" }}>
              <TableCell component="th" scope="row">
                {row.challengeName}
              </TableCell>
  
              <TableCell component="th" scope="row">
                {String(row.challengeDescription)}
              </TableCell>

              <TableCell component="th" scope="row">
                {String(row.challengeSuccess)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    

</div>

  );
}
}

ChallengeTable.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps
  )(ChallengeTable);



  