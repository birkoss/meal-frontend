import React, { Component } from 'react';
import { Alert, Avatar, List, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import md5 from 'md5';

import MealForm from './MealForm';

import { ApiGetHeaders, DateToString, FormatDate } from '../helpers';

import './Meals.css';

const { confirm } = Modal;

class Meals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mealTypes: [],
            recipesList: [],
            modalIsVisible: false,
            mealsList: [],
            activeMeal: {
                id: 0,
                day: '',
                recipeId: 0,
                recipeUrl: '',
                recipeName: '',
                typeId: 0,
            },
            meal: {
                id: null,
                date: '',
                type: 1,
                recipe: '',
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
		fetch('http://localhost:8000/api/meals/', {
            headers: ApiGetHeaders(),
        })
            .then(res => res.json())
			.then(res => {
                console.log("MEALS", res);
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

    render() {

        const daysLabel = {
            1: "Lundi",
            2: "Mardi",
            3: "Mercredi",
            4: "Jeudi",
            5: "Vendredi",
            6: "Samedi",
            0: "Dimanche",
        };
        
        var d = new Date();
        const dayOfWeek = d.getDay();

        // Start at the first day of the week
        d.setDate(d.getDate()-dayOfWeek);

        let days = [];
        for(let i=0; i<7; i++) {
            d.setDate(d.getDate()+1);

            let day = {
                'day': daysLabel[d.getDay()],
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

            this.state.mealsList.forEach(meal => {
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

        return (
            <div>

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

                { days.map(day => {
                    return (<List key={day.day}
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
                            description={ item.recipe ? item.recipe.name : "" }
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