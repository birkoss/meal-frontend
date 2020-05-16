import React, { Component } from 'react';
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

	render() {

		if (this.state.token === '') {
			return (
				<Login onLogin={ token => this.onLogin(token) } />
			);
		} else {
			return (
				<Layout className="layout">
					<Header>
					<div className="logo" />
					<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
						<Menu.Item key="1">nav 1</Menu.Item>
						<Menu.Item key="2">nav 2</Menu.Item>
						<Menu.Item key="3">nav 3</Menu.Item>
					</Menu>
					</Header>
					<Content style={{ padding: '0 50px' }}>
					<Breadcrumb style={{ margin: '16px 0' }}>
						<Breadcrumb.Item>Home</Breadcrumb.Item>
						<Breadcrumb.Item>List</Breadcrumb.Item>
						<Breadcrumb.Item>App</Breadcrumb.Item>
					</Breadcrumb>
					<div className="site-layout-content">
						<Meals token={ this.state.token } />
					</div>
					</Content>
					<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
				</Layout>
			);
		}
	}
}


export default App;
