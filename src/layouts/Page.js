import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";

import { Layout, Menu } from 'antd';

import { ApiSetToken } from '../helpers';

import './Page.css';

const { Header, Content, Footer } = Layout;

class Page extends Component {
	onLogout() {
		ApiSetToken("");

		this.setState({
			token: ""
        });
        
        this.props.history.push('/');
	}

    render() {
        return (
            <Layout className="page">
                <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Link to="/">Meals</Link>
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => this.onLogout()}>Logout</Menu.Item>
                </Menu>
                </Header>
                <Content>
                    <div className="site-layout-content">
                        { this.props.children }
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>birkoss.com ©2020</Footer>
            </Layout>
        );
    }
}

export default withRouter(Page);