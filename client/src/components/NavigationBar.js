import React, { Component } from 'react';
import {Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Button} from 'reactstrap';
import "./NavigationBar.css";

class NavigationBar extends Component {
    render() {
        return(
            <div className='navigation-bar'>
            <Navbar>
                <img src='logoMinBlanc.png' width={50}px/>SharEvent
            
              
           
                
            </Navbar>
            
            </div>
        );
    }
}

export default NavigationBar;