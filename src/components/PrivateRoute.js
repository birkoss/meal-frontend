import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

import { ApiGetToken } from '../helpers';


class PrivateRoute extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            ApiGetToken() !== "" ? this.props.children : <Redirect to="/login" />
        );
    }
};


export default PrivateRoute;