import React, { Component } from 'react';
import { SideNav, Nav } from 'react-sidenav';
import {NavIcon } from "react-sidenav";
import { Icon } from "react-icons-kit";
import { ic_home as home } from "react-icons-kit/md/ic_home";
import {signOut} from 'react-icons-kit/fa/'
import {user, calendar_add} from 'react-icons-kit/ikons/';
import {Link, NavLink} from 'react-router-dom';

import './VerticalBar.css';

class VerticalBar extends Component {
 
  render() {
    return(
      <div className='vertical-bar'>
      <SideNav theme={theme} defaultSelectedPath={"home"}>
        <Nav id="home">
          <NavIcon>
            <Icon icon={home} />
          </NavIcon>
          <NavLink to='/home'>Home</NavLink>
        </Nav>
        
        <Nav id="create">
          <NavIcon>
            <Icon icon={calendar_add} />
          </NavIcon>
          <NavLink to='/createEvent'>Create Event</NavLink>
        </Nav>
        
        <Nav id="user">
          <NavIcon>
            <Icon icon={user} />
          </NavIcon>
          <NavLink to='/profile'>Profil</NavLink>
        </Nav>
        
        <Nav id="logout">
          <NavIcon>
            <Icon icon={signOut} />
          </NavIcon>
          Logout
        </Nav>
      </SideNav>
      </div>
    );
  }

    
}

const theme = {
  hoverBgColor: "darkorange",
  selectionColor: "#03A9F4",
  selectionIconColor: "#03A9F4"
};
export default VerticalBar;