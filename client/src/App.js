import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Login from './views/login';
import SignUp from './views/signup';
import HomePage from './views/homepage';
import Wall from './views/wall';

class App extends Component {
    
    render() {
        return (
           <Router>
                <Route exact path="/" component={HomePage} />
                <Route path="/signup" component={SignUp} />
                <Route path="/wall" component={Wall} /> 
           </Router>
        );
    }
}

export default App;
