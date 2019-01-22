import React, { Component } from "react";
import { Button } from 'reactstrap';
import LoginForm from "../components/LoginForm";
import AuthContext from "../AuthProvider";
import './login.css';

/**
 * Vue pour la page de login 
 */
const Login = () => (
  <AuthContext>
    <div className="LoginPage">
      <div className="Presentation">
        <img src='logoMinBlanc.png' />
        <h3><li>Partagez vos évenements avec vos amis</li></h3>
        <h3><li>Trouvez des choses à faire à travers le monde</li></h3>
        <h3><li>Rejoignez la communauté</li></h3>
      </div>
      <div className="Login">
        <div className='navButton'><a className='signUp'><Button outline color="secondary">Sign Up</Button></a></div>
        <LoginForm/>
      </div>
    </div>
  </AuthContext>
)

export default Login;

