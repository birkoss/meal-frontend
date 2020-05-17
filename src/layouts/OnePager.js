import React, { Component } from 'react';
import { Layout } from 'antd';

import './OnePager.css';

const { Content } = Layout;

class OnePager extends Component {
    render() {
        return (
            <Layout className="layout">
                <Content className="layout-onepager">
                    <div className="site-layout-content">
                        { this.props.children }
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default OnePager;