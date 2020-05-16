import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';

import Login from './components/Login';
import Meals from './components/Meals';

import { ApiGetToken, ApiSetToken } from './helpers';

import 'antd/dist/antd.css';

import './App.css';


const { Header, Content, Footer } = Layout;


class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			token: '',
		};
	}

	componentDidMount() {
		const token = ApiGetToken();
		if (token !== '') {
			this.setState({
				token
			});
		}
	}

	onLogin(token) {
		ApiSetToken(token);

		this.setState({
			token
		});
	}

	onLogout() {
		ApiSetToken("");

		this.setState({
			token: ""
		});
	}

	render() {

		if (this.state.token === '') {
			return (
				<Login onLogin={ token => this.onLogin(token) } />
			);
		} else {
			return (
				<Router>
					<Layout className="layout">
						<Header>
						<div className="logo" />
						<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
							<Menu.Item key="1">
								<Link to="/">Home</Link>
							</Menu.Item>
							<Menu.Item key="2">
								<Link to="/dashboard">nav 2</Link>
							</Menu.Item>
							<Menu.Item key="3" onClick={() => this.onLogout()}>Logout</Menu.Item>
						</Menu>
						</Header>
						<Content style={{ padding: '0 50px' }}>
							<div className="site-layout-content">
								<Switch>
									<Route exact path="/">
										<Meals token={ this.state.token } />
									</Route>
									<Route path="/about">
										about
									</Route>
									<Route path="/dashboard">
										dash
									</Route>
								</Switch>
							</div>
						</Content>
						<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
					</Layout>
				</Router>
			);
		}
	}
}


export default App;
