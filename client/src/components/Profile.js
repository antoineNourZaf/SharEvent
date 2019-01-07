import React, { Component } from 'react';
import "./Profile.css";
import { Card, CardImg, CardText, CardBody, Media,
  CardTitle, CardSubtitle, Button } from 'reactstrap';

  

class Profile extends Component {
    render () {
        return (
            <div>
            <Card>
                <Media src="/test.jpg"></Media>
            <CardImg top width="100%" src="" alt="Card image cap" />
            <CardBody>
                <CardTitle>John Doe</CardTitle>
                <CardSubtitle>@ProfileName</CardSubtitle>
                <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                <Button>Follow</Button>
            </CardBody>
            </Card>
            </div>
        );
    }
}

export default Profile;