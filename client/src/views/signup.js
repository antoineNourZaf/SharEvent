import React, { Component } from "react";

import SignUpForm from "../components/SignUpForm";
import './signup.css';

export default class SignUp extends Component {
    
  render() {
    return (
    <div className="SignUpPage">
        <div className="SignUp">
          <h2>Crééz votre compte</h2>
          <SignUpForm/>
        </div>
      </div>
    );
  }
}