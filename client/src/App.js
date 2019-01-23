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
import Logout from './views/logout';
import Wall from './views/wall';
import createEvent from './views/createEvent';
import { home } from 'react-icons-kit/ikons';
import Profile from './components/Profile.js';

export default () => (
  <div className='root'>
  <TitleBar/>
  <VerticalBar/>
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/home" component={HomePage}/>
      <Route path="/login" component={Login}/>
      <Route path="/createEvent" component={createEvent}/>
      <Route path="/logout" component={Logout}/>
      <Route path="/profile" component={Profile}/>
    </Switch>
  </div>
  );
