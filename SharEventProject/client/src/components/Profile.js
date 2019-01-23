import React, { Component } from 'react';
import "./Profile.css";
import { Card, CardImg, CardText, CardBody, Media, CardTitle, CardSubtitle, Button } from 'reactstrap';
import {AuthContext} from '../AuthProvider';

const Profile = () => (
  
    <div>
      
      <Card>
      <Media></Media>
      <CardImg width="80" src="/user.png" alt="Card image cap" />
      <CardBody>
        <CardTitle>{AuthContext.getUser}</CardTitle>
        <CardSubtitle></CardSubtitle>
        <CardText></CardText>
        <Button>Follow</Button>
      </CardBody>
    </Card>
    </div>
  
);

export default Profile;