import React, { Component } from 'react';
import { Alert, Avatar, Button, Col, List, Modal, Row } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import md5 from 'md5';

import MealForm from './MealForm';

import { ApiGetHeaders, CreateDate, DateToString, DayToString, FormatDate } from '../helpers';

import './Meals.css';

const { confirm } = Modal;

class Meals extends Component {
    constructor(props) {
        super(props);

        // Find the first Monday of the current week
        var date_start = new Date();
        const dayOfWeek = date_start.getDay();
        date_start.setDate(date_start.getDate()-dayOfWeek + 1);
        
        // Find the next Sunday of the current week
        var date_end = new Date(date_start.getTime());
        date_end.setDate(date_end.getDate() + 6);

        this.state = {
            dates: {
                start: FormatDate(date_start),
                end: FormatDate(date_end),
            },
            mealTypes: [],
            modalIsVisible: false,
            mealsList: [],
            daysList: [],
            activeMeal: {
                id: 0,
                day: '',
                recipeId: 0,
                recipeUrl: '',
                recipeName: '',
                typeId: 0,
            },
            message: {
                error: "",
                success: "",
            }
        };        
    }

    componentDidMount() {
        this.fetchMealTypes();
    }

    fetchMealTypes() {
        fetch('http://localhost:8000/api/meal-types/', {
            headers: ApiGetHeaders(),
        })
            .then(res => res.json())
			.then(res => {
				if (res['status'] === 200) {
					this.setState({
						mealTypes: res['items'],
                    });

                    this.fetchMeals();
				} else {
                    this.setState({
                        message: {
                            success: '',
                            error: res['message'],
                        }
                    });
				}
			});
    }

    fetchMeals() {
		fetch('http://localhost:8000/api/meals/?start=' + this.state.dates.start + "&end=" + this.state.dates.end, {
            headers: ApiGetHeaders(),
        })
            .then(res => res.json())
			.then(res => {
                console.log("MEALS", res);
				if (res['status'] === 200) {
					this.setState({
						daysList: this.createDays(res['items']),
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

    addMeal(date, type) {
        console.log("addMeal", date, type);

        this.setState({
            activeMeal: {
                id: 0,
                date,
                day: date,
                typeId: type,
                recipeId: 0,
                recipeUrl: '',
                recipeName: '',
            },
            modalIsVisible: true,
        });
    }

    editMeal(meal) {
        console.log("editMeal", meal);

        this.setState({
            activeMeal: {
                id: meal.meal.id,
                day: meal.meal.day,
                typeId: meal.meal.type.id,
                recipeId: meal.meal.recipe.id,
                recipeUrl: meal.meal.recipe.url,
                recipeName: meal.meal.recipe.name,
            },
            modalIsVisible: true,
        });
    }

	deleteMeal(item) {

        confirm({
            title: 'Do you Want to delete this items?',
            icon: <ExclamationCircleOutlined />,
            content: 'Deleted items cannot be restored.',
            onOk: () => {
                let url = "http://localhost:8000/api/meals/" + item.meal.id + "/";

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
            },
          });
    }
    
    closeModal() {
        this.setState({
            modalIsVisible: false,
        });
        this.fetchMeals();
    }

    onChangeWeek(direction) {
        let newDates = {
            start: null,
            end: null,
        };

        var date = new Date(this.state.dates.start + " 12:00:00");
        console.log(date);
        date.setDate(date.getUTCDate() + direction);
        console.log(date);
        newDates.start = FormatDate(date);

        date = new Date(this.state.dates.end + " 12:00:00");
        date.setDate(date.getUTCDate() + direction);
        newDates.end = FormatDate(date);

        this.setState({
            dates: newDates,
        }, () => {
            this.fetchMeals();
        });
    }

    createDays(mealsList) {
        var d = CreateDate(this.state.dates.start);

        let days = [];
        for(let i=0; i<7; i++) {
            d.setDate(d.getDate() + (i==0 ? 0 : 1));

            let day = {
                'day': DayToString(d),
                'date': {
                    'value': FormatDate(d),
                    'label': DateToString(d),
                },
                'meals': [],
            };

            this.state.mealTypes.forEach(type => {
                day.meals.push({
                    'type': type,
                    'recipe': null,
                    'meal': null,
                })
            });

            mealsList.forEach(meal => {
                if (meal.day === day.date.value) {
                    day.meals.forEach(day_meal => {
                        if (day_meal.type.id === meal.type.id) {
                            day_meal.recipe = meal.recipe;
                            day_meal.meal = meal;
                        }
                    });
                }
            });

            days.push(day);
        }

        return days;
    }

    render() {


        return (
            <div>
                <Row>
                    <Col span={12} className="date-back">
                        <Button type="primary" onClick={ () => this.onChangeWeek(-7) }>&lt;</Button>
                    </Col>
                    <Col span={12} className="date-next">
                        <Button type="primary" onClick={ () => this.onChangeWeek(7) }>&gt;</Button>
                    </Col>
                </Row>
                <MealForm 
                    key={ md5( new Date().getTime() ) } 
                    day={ this.state.activeMeal.day } 
                    isVisible={ this.state.modalIsVisible } 
                    typeId={ this.state.activeMeal.typeId } 
                    recipeId={ this.state.activeMeal.recipeId }
                    recipeUrl={ this.state.activeMeal.recipeUrl }
                    recipeName={ this.state.activeMeal.recipeName }
                    mealId={ this.state.activeMeal.id }
                    onClose={ () => this.closeModal() }
                />

                { this.state.message.error !== "" ? <Alert message={ this.state.message.error } type="error" /> : null }
                { this.state.message.success !== "" ? <Alert message={ this.state.message.success } type="success" /> : null }

                { this.state.daysList.map(day => {
                    return (<List key={day.date.value}
                    itemLayout="horizontal"
                    dataSource={day.meals}
                    header={<h3>{ day.day } - { day.date.label }</h3>}
                    renderItem={item => (
                    <List.Item actions={
                        item.recipe !== null ? [
                            <div onClick={() => this.editMeal(item)}>Edit</div>, 
                            <div onClick={() => this.deleteMeal(item)}>Delete</div>
                        ] : [
                            <div onClick={() => this.addMeal(day.date.value, item.type.id)}>Add</div>
                        ]
                    }>
                        <List.Item.Meta
                            avatar={ <Avatar>L</Avatar> }
                            title={ <div>{ item.type.name }</div> }
                            description={ item.recipe ? (item.recipe.url ? <a target="_blank" href={ item.recipe.url }>{ item.recipe.name }</a> : item.recipe.name) : "" }
                        />
                    </List.Item>
                    )}
                />)
                })}
            </div>
        );
    }
}

export default Meals;