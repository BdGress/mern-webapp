import React, { Component } from 'react';
import axios from 'axios';

import { connect } from "react-redux";

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

function deleteUser(id){
    console.log(id)

    axios.delete('http://localhost:5000/users/delete/'+id)
      .then(response =>{
          console.log(response)

     })

}


function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
    return (
      <React.Fragment>
        <TableRow>
          <TableCell>
            <IconButton aria-label="expand row" size="small" align="left" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
          {row.username}
          </TableCell>
          <TableCell>
          {row.email}
          </TableCell>
          <TableCell>
          <a href="#" onClick={() => { deleteUser(row._id) }}>delete</a>
          </TableCell>
          
        </TableRow>
        <TableRow >
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography align="left" variant="h6" gutterBottom component="div">
                  {row.url}
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Challenge Name</TableCell>
                      <TableCell>Success</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.challenges.map((challenges) => (
                      <TableRow key={challenges._id} style ={ challenges.challengeSuccess == true ? { background : "green" }:{ background : "white" }}>
                        <TableCell component="th" scope="row">
                          {challenges.challengeName}
                        </TableCell>
                        <TableCell>{String(challenges.challengeSuccess)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  

class AdminTable extends Component {
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


useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

getData(){
    axios.get('http://localhost:5000/users/')
      .then(response =>{
        this.setState({
            rows: response.data
          })
          console.log(response)

     })
  }

  

render() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
           
          <TableCell></TableCell>
            <TableCell> Username</TableCell>
            <TableCell> Email</TableCell>
            <TableCell> Edit</TableCell>
        

          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.rows.map((row) => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}



}

AdminTable.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps
  )(AdminTable);