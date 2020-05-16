import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from './components/Login';
import Register from './components/Register';
import Meals from './components/Meals';

import OnePager from './layouts/OnePager';
import Page from './layouts/Page';

import { ApiSetToken } from './helpers';

import PrivateRoute from './components/PrivateRoute';

import 'antd/dist/antd.css';

import './App.css';


class App extends Component {
	onLogin(token) {
		ApiSetToken(token);

		this.setState({
			token
		});

		this.props.history.push('/');
	}

	render() {
		return (
			<Router>
				<Switch>
					<Route path="/login">
						<OnePager>
							<Login onLogin={ token => this.onLogin(token) } />
						</OnePager>
					</Route>
					<Route path="/register">
						<OnePager>
							<Register onRegister={ token => this.onLogin(token) } />
						</OnePager>
					</Route>
					<PrivateRoute path='/'>
						<Page>
							<Meals />
						</Page>
					</PrivateRoute>
				</Switch>
			</Router>
		);
	}
}


export default App;
