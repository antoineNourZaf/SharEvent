import React, { Component } from 'react';
import './App.css';
import './components/Profile.js';
import Profile from './components/Profile.js';
import TitleBar from './components/TitleBar.js';
import {Jumbotron} from 'reactstrap';
import MainMenu from './components/MainMenu';


import Login from './views/login';
import SignUp from './views/signup';

class App extends Component {
    
    render() {
        return (
            <div className='main'>
                
                <SignUp/>             
               
            </div>
        );
    }
}

export default App;
