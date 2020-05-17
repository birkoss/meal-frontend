import React, { Component } from 'react';
import { Alert, AutoComplete, Button, Form, Input, Modal } from 'antd';

import { ApiGetHeaders } from '../helpers';

class MealForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: '',
            recipesList: [],
            mealId: props['mealId'],
            recipe_url: props['recipeUrl'],
            recipe_name: props['recipeName'],
            recipe_id: props['recipeId'],
            typeId: props['typeId'],
            day: props['day'],
        };
    }

    updateMeal(recipeId, typeId, day) {
        let url = "http://localhost:8000/api/meals/";
        if (this.state.mealId !== 0) {
            url = "http://localhost:8000/api/meals/" + this.state.mealId + "/";
        }
		
		fetch(url, {
			method: 'POST',
			headers: ApiGetHeaders(),
			body: JSON.stringify({
                type: typeId,
                day: day,
                recipe: recipeId,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res['status'] === 200) {
                    this.props.onClose();
                } else {
                    console.log("error #1", res);	
                }
            })
            .catch(error => {
                console.log("error #2", error);
            });
    }

    onFormFinish(values) {
        if (this.state.recipe_id === 0) {
            fetch("http://localhost:8000/api/recipes/", {
                method: 'POST',
                headers: ApiGetHeaders(),
                body: JSON.stringify({
                    name: values['recipeName'],
                    url: this.state.recipe_url,
                })
            })
                .then(res => res.json())
                .then(res => {
                    if (res['status'] === 200) {
                        this.updateMeal(res['item']['id'], this.state.typeId, this.state.day);
                    } else {
                        this.setState({
                            errorMessage: res['message'],
                        });
                    }
                })
                .catch(error => {
                    this.setState({
                        errorMessage: "Erreur!",
                    });
                });
        } else {
            this.updateMeal(this.state.recipe_id, this.state.typeId, this.state.day);
        }
    }

    onSearch(value) {
        console.log("onSearch", value);
        this.setState({
            recipesList: [],
            recipe_url: '',
            recipe_name: value,
            recipe_id: 0,
        });

        if (value) {
            this.searchRecipes(value);
        }
    }

    searchRecipes(query) {
        console.log("searchRecipes", query);
        let url = "http://localhost:8000/api/recipes/search/?search=" + query;
        console.log(this);

        return fetch(url, {
            method: 'GET',
            headers: ApiGetHeaders(),
        })
            .then(res => res.json())
            .then(res => {
                console.log("searchRecipes", "DONE", res);
                this.setState({
                    recipesList: res['items'].map(item => {
                        if (item.name.toLowerCase() === query.toLowerCase()) {
                            this.selectExistingRecipe(item);
                        }
                        return {
                            value: item.name,
                            label: item.name,
                            recipe: item,
                        }
                    }),
                });
            })
            .catch(error => {
                console.log("error #2", error);
            });
    }

    closeModal = e => {
        this.setState({
            modalIsVisible: false,
        });
    };

    selectExistingRecipe(recipe) {
        this.setState({
            recipe_url: recipe.url,
            recipe_name: recipe.name,
            recipe_id: recipe.id,
        });
    }

    onSelect(value, option) {
        console.log("onSelect", value, option);

        this.selectExistingRecipe(option.recipe);
    }

    afterClose() {
        this.setState({
            recipe_url: '',
            recipe_id: 0,
        });
    }

    render() {
        return (
            <Modal
                destroyOnClose={true}
                title="Meal Form"
                visible={ this.props.isVisible }
                onOk={ () => { this.processModal() } }
                onCancel={ () => this.props.onClose() }
                afterClose={ () => this.afterClose() }
                footer={[
                    <Button key="back" onClick={ () => this.props.onClose() }>Annuler</Button>,
                    <Button htmlType="submit" form="meal-form" key="submit" type="primary">Enregistrer</Button>,
                ]}
            >

                { this.state.errorMessage !== "" ? <Alert message={ this.state.errorMessage } type="error" /> : null }

                <Form id="meal-form" onFinish={values => this.onFormFinish(values)} initialValues={ {
                    recipeName: this.state.recipe_name,
                } }>
                    <Form.Item name="recipeName" rules={[{ required: true }]} hasFeedback>
                        <AutoComplete 
                            placeholder="Nom de la recette" 
                            options={ this.state.recipesList } 
                            onSearch={ value => this.onSearch(value) } 
                            onSelect={ (value, option) => this.onSelect(value, option) }
                        />
                    </Form.Item>
                    
                    <Form.Item rules={[{ required: true }]} hasFeedback>
                        <Input placeholder="URL de la recette" onChange={e => this.setState({recipe_url: e.target.value})} value={this.state.recipe_url}/>
                    </Form.Item>

                </Form>
            </Modal>
        );
    }
}

export default MealForm;