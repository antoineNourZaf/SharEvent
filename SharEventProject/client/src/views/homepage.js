import React, {Component} from 'react';
import AuthProvider, { AuthContext } from '../AuthProvider';
import TitleBar from '../components/TitleBar.js';
import VerticalBar from '../components/VerticalBar.js';
import Calendar from 'react-calendar';
import { Switch, Route,Redirect} from "react-router-dom";
import './homepage.css';

class HomePage extends Component {
 
  render() {
    return (
          
      <div className="Homepage">
        
        <Calendar/>
        
     </div>);
      
      }
      
          
}

export default HomePage;