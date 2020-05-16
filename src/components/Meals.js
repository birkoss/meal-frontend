import React, { Component } from 'react';
import { Alert, Button, Row, Col, Timeline } from 'antd';


import { ApiGetHeaders } from '../helpers';

import './Meals.css';

class Meals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mealsList: [],
            meal: {
                id: null,
            },
            message: {
                error: "",
                success: "",
            }
        };
    }

    componentDidMount() {
        this.fetchMeals();
    }

    fetchMeals() {
		fetch('http://localhost:8000/api/meals/', {
            headers: ApiGetHeaders(),
        })
            .then(res => res.json())
			.then(res => {
                console.log(res);
				if (res['status'] === 200) {
					this.setState({
						mealsList: res['items'],
                    });
				} else {
                    this.setState({
                        message: {
                            message: '',
                            error: res['message'],
                        }
                    });
				}
			});
	}

    onAddClicked(event) {
        let url = "http://localhost:8000/api/meals/";
		
		fetch(url, {
			method: 'POST',
			headers: ApiGetHeaders(),
			body: JSON.stringify({
                type: 1,
                day: '2010-10-10',
                recipe: 1,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res['status'] === 200) {
                    this.fetchMeals();
                    
                    this.setState({
                        message: {
                            error: '',
                            success: "Meal added!",
                        }
                    });
                } else {
                    console.log("error #1", res);	
                }
            })
            .catch(error => {
                console.log("error #2", error);
            });
    }

    editMeal(meal) {
        let url = "http://localhost:8000/api/meals/" + meal.id + "/";
		
		fetch(url, {
			method: 'POST',
			headers: ApiGetHeaders(),
			body: JSON.stringify({
                type: 1,
                day: '2011-10-10',
                recipe: 1,
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
			if (res['status'] === 200) {
                this.fetchMeals();

				this.setState({
                    message: {
                        error: '',
                        success: "Meal Edited!",
                    }
                });
			} else {
				this.setState({
                    message: {
                        error: res['message'],
                        success: '',
                    }
                });
			}
		}).catch(error => {
			console.log("error #2", error);
		});
    }

	deleteMeal(meal) {
        let url = "http://localhost:8000/api/meals/" + meal.id + "/";

		fetch(url, {
			method: 'DELETE',
			headers: ApiGetHeaders(),
        }).then(res => res.json())
        .then(res => {
			if (res['status'] === 200) {
                this.fetchMeals();

				this.setState({
                    message: {
                        error: '',
                        success: "Meal deleted!",
                    }
                });
			} else {
				this.setState({
                    message: {
                        error: res['message'],
                        success: '',
                    }
                });
			}
		}).catch(error => {
			console.log("error #2", error);
		});
	}


    render() {
        return (
            <div>
                { this.state.message.error !== "" ? <Alert message={ this.state.message.error } type="error" /> : null }
                { this.state.message.success !== "" ? <Alert message={ this.state.message.success } type="success" /> : null }
                <Row>
                    <Col span={24}>
                        <Button onClick={event => this.onAddClicked(event)} type="primary">Add</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Timeline>
                        {
                            this.state.mealsList.map(meal => {
                                return (
                                    <Timeline.Item key={meal.id} className="meal">
                                        <div style={{ flex: 7 }}>
                                            <span>{meal.day}</span>
                                            <span>{meal.name}</span>
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <button onClick={event => this.editMeal(meal)} className="btn btn-sm btn-outline-info">Edit</button>
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <button onClick={event => this.deleteMeal(meal)} className="btn btn-sm btn-outline-dark delete">Delete</button>
                                        </div>
                                    </Timeline.Item>
                                );
                            })
                        }
                        </Timeline>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Meals;