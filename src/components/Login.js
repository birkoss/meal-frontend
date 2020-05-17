import React, { Component, Fragment } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Alert, Row, Form, Input, Button, Typography } from 'antd';

import { ApiGetToken, ApiSetToken, GetCookie } from '../helpers';

const { Title } = Typography;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
        };
    }

    componentDidMount() {
        if (ApiGetToken() !== "") {
            this.props.history.push(this.props.onLoginRedirect);
        }
    }

    onFormFinish(values) {
        fetch('http://localhost:8000/api/login/', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'X-CSRFToken': GetCookie('csrftoken'),
			},
			body: JSON.stringify({
                email: values['email'],
                password: values['password'],
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res['status'] === 200) {
                    ApiSetToken(res['token']);
                    this.props.history.push(this.props.onLoginRedirect);
                } else {
                    this.setState({
                        error: res['message'],
                    });
                }
            }).catch(error => {
                console.log("error #2", error);
            });
    }

    render() {
        return (
            <Fragment>
                <div className="one-pager">
                    <Title>Login</Title>
                    { this.state.error !== "" ? <Alert message={ this.state.error } type="error" /> : null }

                    <Form onFinish={values => this.onFormFinish(values)}>
                        <Form.Item name="email" rules={[{ required: true }]} hasFeedback>
                            <Input type="email" placeholder="Email" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true }]} hasFeedback>
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Row>
                            <Button type="primary" htmlType="submit">Sign in</Button>
                            <Link className="form-link" to="/register">Register</Link>
                        </Row>
                    </Form>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(Login);