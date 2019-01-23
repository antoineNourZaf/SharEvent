import React, { Component, useState } from 'react';
import {Redirect, Route} from 'react-router-dom';
import {Button, Form, HelpBlock, FormGroup, FormControl} from 'react-bootstrap';
import AuthProvider, { AuthContext } from '../AuthProvider.js';
import axios from 'axios';
import './LoginForm.css';

class LoginForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }

  
  handleChange = (event) => {
    
    this.setState({[event.target.name]: event.target.value}); 
  }

  handleSubmit = (e) => {
    
    e.preventDefault();
    this.props.signIn({username:this.state.username, password:this.state.password})
  }

  render() {
    return (
      <div className='FormContainer'>
        <Logo />
        <h3>Login</h3>
        <Form horizontal  onSubmit={this.handleSubmit}>
          <FormGroup controlId="lastname">
            <FormControl
              type="text" name='username' value={this.state.username} placeholder="Username" onChange={this.handleChange} />
            < FormControl.Feedback />
          </FormGroup>
        
          <FormGroup controlId="firstname" >
            <FormControl
              type="password" name='password' value={this.state.password} placeholder="Password" onChange={this.handleChange} />
            < FormControl.Feedback />
          </FormGroup>
          <Button type="submit">Sign In!</Button>
          </Form>
        <a href='#'>Lost your password ?</a>
      </div>
      
    );
  }
}



class Logo extends Component {
    render() {
      return (<div className="logo">
                  <img src='logoMinBlanc.png' width={50}/>
                </div>);
    }
}

export default (props) => (
  <AuthContext>
  {({ signIn,state }) => <LoginForm {...props} signIn={signIn} state={state} />}
  </AuthContext>
)
  
