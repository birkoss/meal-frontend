import React, { Component } from 'react';
import { Alert, Avatar, List } from 'antd';

import MealForm from './MealForm';

import { ApiGetHeaders, FormatDate } from '../helpers';

import './Meals.css';

class Meals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recipesList: [],
            modalIsVisible: false,
            mealsList: [],
            activeMeal: {
                day: '',
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

    addMeal(date, type) {
        console.log("addMeal", date, type);
        this.setState({
            activeMeal: {
                id: null,
                date,
                day: date,
                typeId: type,
                recipe:'',
            },
            modalIsVisible: true,
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

	deleteMeal(item) {
        let url = "http://localhost:8000/api/meals/" + item.meal + "/";

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
    
    closeModal = e => {
        this.setState({
            modalIsVisible: false,
        });
        this.fetchMeals();
    };

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
                'date': FormatDate(d),
                'meals': [{
                    'type': 'breakfast',
                    'recipe': null,
                    'meal': null,
                },{
                    'type': 'dinner',
                    'recipe': null,
                    'meal': null,
                },{
                    'type': 'lunch',
                    'recipe': null,
                    'meal': null,
                }]
            };

            this.state.mealsList.forEach(meal => {
                if (meal.day === day.date) {
                    day.meals.forEach(day_meal => {
                        if (day_meal.type === meal.type.slug) {
                            day_meal.recipe = meal.recipe;
                            day_meal.meal = meal.id;
                        }
                    });
                }
            });

            days.push(day);
        }
        console.log("RENDER", this.state);
        return (
            <div>

                <MealForm day={ this.state.activeMeal.day } isVisible={ this.state.modalIsVisible } typeId={ this.state.activeMeal.typeId } onClose={ () => this.closeModal() } />

                { this.state.message.error !== "" ? <Alert message={ this.state.message.error } type="error" /> : null }
                { this.state.message.success !== "" ? <Alert message={ this.state.message.success } type="success" /> : null }

                { days.map(day => {
                    return (<List key={day.day}
                    itemLayout="horizontal"
                    dataSource={day.meals}
                    header={<h3>{ day.day }</h3>}
                    renderItem={item => (
                    <List.Item actions={
                        item.recipe !== null ? [
                            <div onClick={() => this.editMedivl(item)}>Edit</div>, 
                            <div onClick={() => this.deleteMeal(item)}>Delete</div>
                        ] : [
                            <div onClick={() => this.addMeal(day.date, 2)}>Add</div>
                        ]
                    }>
                        <List.Item.Meta
                            avatar={ <Avatar>L</Avatar> }
                            title={ <div>{ item.type }</div> }
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