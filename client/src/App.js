import React, { Component } from 'react';
import './App.css';
import './components/Profile.js';
import Profile from './components/Profile.js';
import NavigationBar from './components/NavigationBar.js';
import {Jumbotron} from 'reactstrap';
import MainMenu from './components/MainMenu';

class App extends Component {
    
    render() {
        return (
            <Jumbotron>
            
                <NavigationBar/>
                <Profile/>
                <MainMenu/>
            </Jumbotron>
        );
    }
}

export default App;
