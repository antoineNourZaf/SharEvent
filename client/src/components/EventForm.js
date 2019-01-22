import React, { Component } from 'react';
import {Button, Form, HelpBlock, FormGroup, FormControl} from 'react-bootstrap';
import './EventForm.css';

export default class EventForm extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      titre: '',
      location: '',
      date: '',
      description: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }
  getValidationState() {
    
    /* TO DO */
    // Quand le temps le permettra
    return null;
  }
  /**
   *  Gère l'état du formulaire
   */
  handleChange(e) {
   
    this.setState({
      titre: e.target.titre // title ne fonctionne pas, donc je met titre --> mot reservé ??
    });
    this.setState({
      location: e.target.location
    });
    this.setState({
      date: e.target.date
    });
    this.setState({
     description: e.target.description
    });
  }

  /*
   *  A la validation du formulaire, l'envoyer au back-end pour enregistrement 
   */
  onSubmit = (event) => {

    // Envoyer les infos de l'event au back end ici !!
    
    event.preventDefault();
  }

  render() {
    return (
      <Form horizontal onSubmit={this.onSubmit}>
      <h2>Create your event</h2>
        <FormGroup controlId="title">
          <FormControl type="text" value={this.state.titre} placeholder="Title" onChange={this.handleChange} required={true} />
          <FormControl.Feedback />
        </FormGroup>
        
        <FormGroup controlId="location" validationState={this.getValidationState()}>
          <FormControl type="text" value={this.state.location} placeholder="Location" onChange={this.handleChange} required={true} />
          <FormControl.Feedback />
        </FormGroup>
        
        <FormGroup controlId="date" validationState={this.getValidationState()}>
          <FormControl type="date" value={this.state.date} placeholder="" onChange={this.handleChange} required={true} />
          <FormControl.Feedback />
        </FormGroup>
        
        <FormGroup controlId="description" validationState={this.getValidationState()}>
          <FormControl componentClass="textarea" placeholder="Your event's description" value={this.state.description} onChange={this.handleChange} required={true} />
          <FormControl.Feedback />
        </FormGroup>
        
        <Button type="submit">Share !</Button>
      </Form>
    );
  }

}