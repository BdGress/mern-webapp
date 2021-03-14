import React, { Component } from 'react';
import axios from 'axios';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import PropTypes from "prop-types";
import { connect } from "react-redux";

class ChallengeTable extends Component {
    constructor(props) {
      super(props);

      this.getData = this.getData.bind(this);
     

      this.state = {
        rows: [],
        interval: ''
      };
    }

    componentDidMount() {
        this.getData();

        this.setState({

        interval: setInterval(() => {
            this.getData();
          }, 20000)

        })
      }

      componentWillUnmount() {
          clearInterval(this.state.interval);
    }

 getData(){
    axios.get('http://localhost:5000/users/getChallenges/'+this.props.auth.user.id)
      .then(response =>{
        this.setState({
            rows: response.data
          })
     })
  }



  


render() {
   const rows = this.state.rows;

  return (
  
    <div>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Challenge Name</TableCell>
            <TableCell>Solved</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,index) => (
            <TableRow key={row._id}>
                <TableCell>
                {row.challengeName}
                </TableCell>
                <TableCell>
                    {row.challengeSuccess.toString()}
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



  