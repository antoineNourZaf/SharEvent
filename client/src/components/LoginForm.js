import React, { Component } from 'react';
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
      isAuth: false
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('token');
    if (token) {
      axios.get('localhost:5000/api/me', {
        headers: {
          Authorization: `bearer ${token}`,
        }
      })
        .then(response => {
          const { user } = response.data;
          this.setState({ user });
        })
        .catch(err => {
          console.error(err);
          localStorage.removeItem('token');
        })
    }
    if (token) {
      axios.get('/api/private', {
        headers: {
          Authorization: `bearer ${token}`,
        }
      })
        .then(response => {
          const { user } = response.data;
          this.setState({ user });
        })
        .catch(err => {
          console.error(err);
          localStorage.removeItem('token');
        })
    }
  }

  signIn = ({ username, password }) => {
    axios.post('localhost:5000/auth/login', { username, password })
      .then(response => {
        const { user, token } = response.data;
        window.localStorage.setItem('token', token);
        
      })
      .catch(error => {
        console.error(error);
        this.setState({ error: 'Invalid username or password' });
      })
  }

  signOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }

  handleChange = (event) => {

    
    this.setState({ [event.target.name]: event.target.value}); 
    
  }

  handleSubmit = (e) => {
    
    e.preventDefault();
    this.signIn(this.state.username, this.state.password);
    
    
  }
  getValidationState = () => {
    return null;
  }

  render() {
    return (
      
      <div className='FormContainer'>
      
        <Logo />
        Login<br/><br/>
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormGroup controlId="lastname" validationState={this.getValidationState()}>
            <FormControl
              type="text" name='username' value={this.state.username} placeholder="Username" onChange={this.handleChange} />
            < FormControl.Feedback />
          </FormGroup>
        
          <FormGroup controlId="firstname" validationState={this.getValidationState()}>
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
  
export default LoginForm;