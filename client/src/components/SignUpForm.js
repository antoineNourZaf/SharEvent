import React, {Component} from 'react';
import './SignUpForm.css';
 
import {Button, Form, HelpBlock, FormGroup, FormControl} from 'react-bootstrap';


export default class SignUpForm extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);

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
      lastname: e.target.lastname
    });
    this.setState({
      firstname: e.target.firstname
    });
    this.setState({
      email: e.target.email
    });
    this.setState({
      username: e.target.username
    });
    this.setState({
      password: e.target.password
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
            type="text" value={this.state.lastname} placeholder="Lastname" onChange={this.handleChange} />
          <FormControl.Feedback />
          
        </FormGroup>
        <FormGroup controlId="firstname" validationState={this.getValidationState()}>
          <FormControl
            type="text" value={this.state.firstname} placeholder="Firstname" onChange={this.handleChange} />
          <FormControl.Feedback />
          
        </FormGroup>
        <FormGroup controlId="email" validationState={this.getValidationState()}>
          <FormControl
            type="email" value={this.state.email} placeholder="Email" onChange={this.handleChange} />
          <FormControl.Feedback />
          
        </FormGroup>
        <FormGroup controlId="username" validationState={this.getValidationState()}>
          <FormControl
            type="text" value={this.state.username} placeholder="Username" onChange={this.handleChange} />
          <FormControl.Feedback />
          
        </FormGroup>
        <FormGroup controlId="password" validationState={this.getValidationState()}>
          <FormControl
            type="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} />
          <FormControl.Feedback />
          
        </FormGroup>
        <Button type="submit">Creez mon compte !</Button>
      </Form>
    );
  }
}
