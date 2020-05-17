import React, { Component } from 'react';
import { AutoComplete, Button, DatePicker, Form, Input, Modal } from 'antd';

import moment from 'moment';


import { ApiGetHeaders } from '../helpers';

class MealForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recipesList: [],
            recipe_url: '',
            recipe_name: '',
            recipe_id: 0,
        };
    }

    createMeal(recipeId, typeId, day) {
        console.log("createMeal", recipeId, typeId, day);

        let url = "http://localhost:8000/api/meals/";
		
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
                    
                    this.setState({
                        message: {
                            error: '',
                            success: "Meal added!",
                        },
                        modalIsVisible: false,
                    });
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
            alert("TO DO !!");
        } else {
            this.createMeal(this.state.recipe_id, values['type'], values['day'].format("YYYY-MM-DD"));
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
            this.searchResult(value);
        }
    }

    searchResult(query) {
        console.log("searchResult", query);
        let url = "http://localhost:8000/api/recipes/search/?search=" + query;
        console.log(this);

        return fetch(url, {
            method: 'GET',
            headers: ApiGetHeaders(),
        })
            .then(res => res.json())
            .then(res => {
                console.log("searchResult", "DONE", res);
                this.setState({
                    recipesList: res['items'].map(item => {
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

    onFieldsChange(field, fields) {
        console.log(field, fields);
        /*
        this.setState({
          fields: { ...this.state.fields, ...changedFields },
        });
        */
      }

    onSelect(value, option) {
        console.log("onSelect", value, option);

        this.setState({
            recipe_url: option.recipe.url,
            recipe_name: option.recipe.name,
            recipe_id: option.recipe.id,
        });
        
        console.log(this.state, this.props);
    }

    afterClose() {
        this.setState({
            recipe_url: '',
            recipe_id: 0,
        });
    }

    render() {
        console.log(this.state);
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

                <Form id="meal-form" onFieldsChange={ (field, fields) => this.onFieldsChange(field, fields) } onFinish={values => this.onFormFinish(values)} initialValues={ {
                    day: moment(this.props.day),
                    type: this.props.typeId,
                } }>
                    <Form.Item name="recipe-name" rules={[{ required: true }]} hasFeedback>
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
                        
                    <Form.Item name="day" rules={[{ required: true }]} hasFeedback>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="type" rules={[{ required: true }]} hasFeedback>
                        <Input placeholder="type" />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default MealForm;