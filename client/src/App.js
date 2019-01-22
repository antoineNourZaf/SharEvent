import React, { Component } from 'react';
import './App.css';
import AuthContext from './AuthProvider'
import { BrowserRouter, Route, Link, Redirect,Switch } from "react-router-dom";
import VerticalBar from './components/VerticalBar.js';
import Calendar from 'react-calendar';
import Login from './views/login';
import SignUp from './views/signup';
import TitleBar from './components/TitleBar'
import HomePage from './views/homepage';
import Wall from './views/wall';
import CreateEvent from './views/createEvent';
import { home } from 'react-icons-kit/ikons';



const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(params) => (
      <AuthContext>
        {({ user }) => user
          ? <Component {...params} />
          : <Redirect to="/login" />}
      </AuthContext>
    )}
    />
  )

  

export default () => (
    <Switch>
      <ProtectedRoute path="/" exact component={HomePage} />
      <Route exact path="/login" component={Login} />
      <Route path="/home" component={HomePage}/>
      
    </Switch>
  );
