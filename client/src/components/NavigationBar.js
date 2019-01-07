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
            <div>
            <Navbar >
              <NavbarBrand>SharEvent</NavbarBrand>
            <Button outline color="primary">Sign In</Button>
            <Button outline color="primary">Sign Up</Button>
            </Navbar>
            </div>
        );
    }
}

export default NavigationBar;