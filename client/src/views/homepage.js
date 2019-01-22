import React, {Component} from 'react';
import { AuthContext } from '../AuthProvider';
import TitleBar from '../components/TitleBar.js';
import VerticalBar from '../components/VerticalBar.js';
import Calendar from 'react-calendar';
import { Switch, Route,Redirect} from "react-router-dom";
import './homepage.css';

const HomePage = () => (
 
      
        <div className="Homepage">
     
      <TitleBar/>
      <VerticalBar/>
      <Calendar/>
      <div className='Routes'>
    <Switch><Route path="./homepage" component={VerticalBar.home} />
    <Route path="./createEvent" component={VerticalBar.createEvent} />
    <Route path="//renderitems2"  />
    <Route path="./login" exact component={VerticalBar.home} />
    </Switch>
    </div>
    
    <Redirect to='/login'/>
    </div>  
);

export default HomePage;