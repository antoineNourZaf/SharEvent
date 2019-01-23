import React, {Component} from 'react';
import './SignUpForm.css';
import { AuthContext } from '../AuthProvider'; 
import {Button, Form, HelpBlock, FormGroup, FormControl} from 'react-bootstrap';


export default class SignUpForm extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      lastname : '',
      firstname : '',
      email: '',
      username: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  getValidationState() {
    
    /* TO DO */
    // Quand le temps le permettra
    return null;
  }

  handleChange(e) {
   
    this.setState({
      [e.target.name]: e.target.value
    });
    
  }

  onSubmit = (event) => {
    console.log('enregistrement reussi');
    event.preventDefault();
  }
  render() {
    return (
      <Form horizontal onSubmit={this.onSubmit}>
        <FormGroup controlId="lastname" validationState={this.getValidationState()}>
          <FormControl
            type="text" name='lastname' value={this.state.lastname} placeholder="Lastname" onChange={this.handleChange} />
          <FormControl.Feedback />
          
        </FormGroup>
        <FormGroup controlId="firstname" validationState={this.getValidationState()}>
          <FormControl
            type="text" name ='firstname' value={this.state.firstname} placeholder="Firstname" onChange={this.handleChange} />
          <FormControl.Feedback />
          
        </FormGroup>
        <FormGroup controlId="email" validationState={this.getValidationState()}>
          <FormControl
            type="email" name='email'value={this.state.email} placeholder="Email" onChange={this.handleChange} />
          <FormControl.Feedback />
          
        </FormGroup>
        <FormGroup controlId="username" validationState={this.getValidationState()}>
          <FormControl
            type="text" name='username' value={this.state.username} placeholder="Username" onChange={this.handleChange} />
          <FormControl.Feedback />
          
        </FormGroup>
        <FormGroup controlId="password" validationState={this.getValidationState()}>
          <FormControl
            type="password" name='password' value={this.state.password} placeholder="Password" onChange={this.handleChange} />
          <FormControl.Feedback />
          
        </FormGroup>
        <Button type="submit">Creez mon compte !</Button>
      </Form>
    );
  }
}
