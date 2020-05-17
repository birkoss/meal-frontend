import React, { Component, Fragment } from 'react';
import { Alert, Row, Form, Input, Button, Typography } from 'antd';
import { Link, withRouter } from "react-router-dom";

import { GetCookie, ApiGetToken, ApiSetToken } from '../helpers';

const { Title } = Typography;

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
        };
    }

    componentDidMount() {
        if (ApiGetToken() !== "") {
            this.props.history.push(this.props.onRegisterRedirect);
        }
    }

    onFormFinish(values) {
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
                    ApiSetToken(res['token']);
                    this.props.history.push(this.props.onRegisterRedirect);
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
                    <Title>Register</Title>
                    { this.state.error !== "" ? <Alert message={ this.state.error } type="error" /> : null }

                    <Form onFinish={values => this.onFormFinish(values)}>
                        <Form.Item name="email" rules={[{ required: true }]} hasFeedback>
                            <Input type="email" placeholder="Email" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true }]} hasFeedback>
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Form.Item name="password2" rules={[
                            { required: true }, 
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            })
                        ]}>
                            <Input.Password placeholder="Confirm Password" />
                        </Form.Item>
                        <Row>
                            <Button type="primary" htmlType="submit">Register</Button>
                            <Link className="form-link" to="/login">Login</Link>
                        </Row>
                    </Form>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(Register);