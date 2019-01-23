import React, { Component } from "react";

import SignUpForm from "../components/SignUpForm";
import './signup.css';

const SignUp = () => (

  <div className="SignUpPage">
    <div className="SignUp">
      <h2>Crééz votre compte</h2>
      <SignUpForm />
    </div>
  </div>

);

export default SignUp;