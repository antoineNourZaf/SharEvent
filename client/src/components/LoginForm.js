import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import './LoginForm.css';

class LoginForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  }

    render() {
      return (
      <div className='FormContainer'>
                <Logo />
                Login<br/><br/>
                <form onSubmit= { this.props.onSubmit }>
                  <Input type='text' name='username' placeholder='Username' /><br/>
                  <Input type='password' name='password' placeholder='Password' /><br/>
                  <Button> Sign In</Button>
                </form>
                
                  <a href='#'>Lost your password ?</a>
             </div>
        );
    }
}


class Input extends Component {
    render() {
      return (<div className='Input'>
                <input type={ this.props.type } name={ this.props.name } placeholder={ this.props.placeholder } required autocomplete='false'/>
                <label for={ this.props.name } ></label>
             </div>);
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