import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class UserTableRow extends Component {
    render() {
        return (
            <tr>
                <td>{this.props.obj.username}</td>
                <td>{this.props.obj.challengeName}</td>
            </tr>
        );
    }
}