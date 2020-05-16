import React, { Component } from 'react';
import { Alert, Row, Col, Form, Input, Button, Typography } from 'antd';

import { GetCookie } from '../helpers';

import './Login.css';

const { Title } = Typography;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: {
                error: '',
            },
            register: {
                error: '',
            }
        };
    }

    onLoginFinish(values) {
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
                    this.props.onLogin(res['token']);
                } else {
                    this.setState({
                        login: {
                            error: res['message'],
                        }
                    });
                }
            }).catch(error => {
                console.log("error #2", error);
            });
    }

    onRegisterFinish(values) {
        fetch('http://localhost:8000/api/register/', {
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
                    this.props.onLogin(res['token']);
                } else {
                    this.setState({
                        register: {
                            error: res['message'],
                        }
                    });
                }
            }).catch(error => {
                console.log("error #2", error);
            });
    }

    onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    };

    render() {
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };

        return (
            <Row justify="space-around">
                <Col lg={6} md={10} sm={16} xs={16}>
                    <Typography>
                        <Title>Login</Title>
                    </Typography>

                    { this.state.login.error !== "" ? <Alert message={ this.state.login.error } type="error" /> : null }

                    <Form layout="vertical" name="basic" onFinish={values => this.onLoginFinish(values)} onFinishFailed={error => this.onFinishFailed(error)}>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                            <Input type="email" />
                        </Form.Item>

                        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col lg={6} md={10} sm={16} xs={16}>
                    <Typography>
                        <Title>Register</Title>
                    </Typography>

                    { this.state.register.error !== "" ? <Alert message={ this.state.register.error } type="error" /> : null }

                    <Form layout="vertical" name="basic" onFinish={values => this.onRegisterFinish(values)} onFinishFailed={error => this.onFinishFailed(error)}>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                            <Input type="email" />
                        </Form.Item>

                        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item label="Confirm Password" name="password2" rules={[
                            { required: true, message: 'Please confirm your password!' }, 
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            })
                        ]}>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default Login;