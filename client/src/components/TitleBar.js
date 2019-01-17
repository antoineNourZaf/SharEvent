import React, { Component } from 'react';
import {Navbar} from 'reactstrap';
import "./TitleBar.css";

class TitleBar extends Component {
    render() {
        return(
            <div className='title-bar'>
            <Navbar>
                <img src='logoMinBlanc.png' width={50}px/>SharEvent
            </Navbar>
            
            </div>
        );
    }
}

export default TitleBar;