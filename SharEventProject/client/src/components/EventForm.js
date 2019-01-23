import React, { Component } from 'react';
import {Button, Form, HelpBlock, FormGroup, FormControl} from 'react-bootstrap';
import AuthProvider, {AuthContext} from '../AuthProvider';
import axios from 'axios';
import './EventForm.css';

export default class EventForm extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      title: '',
      place: '',
      dateEvent: '',
      description: '',
      creator: <AuthContext>getUser</AuthContext>
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
  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value}); 
  }

  /*
   *  A la validation du formulaire, l'envoyer au back-end pour enregistrement 
   */
  onSubmit = (event) => {

    axios.post('/api/events',  this.state )
      .then(response => {
        alert(response.data); // On previent que l'event a bien été généré
      })
      .catch(error => {
       alert("Une erreur est survenue");
      })
    
    event.preventDefault();
  }

  render() {
    return (
      <Form horizontal onSubmit={this.onSubmit}>
      <h2>Create your event</h2>
        <FormGroup controlId="title">
          <FormControl type="text" name='title' value={this.state.title} placeholder="Title" onChange={this.handleChange} required={true} />
          <FormControl.Feedback />
        </FormGroup>
        
        <FormGroup controlId="location" validationState={this.getValidationState()}>
          <FormControl type="text" name='place' value={this.state.location} placeholder="Location" onChange={this.handleChange} required={true} />
          <FormControl.Feedback />
        </FormGroup>
        
        <FormGroup controlId="date" validationState={this.getValidationState()}>
          <FormControl type="date" name='dateEvent' value={this.state.date} placeholder="" onChange={this.handleChange} required={true} />
          <FormControl.Feedback />
        </FormGroup>
        
        <FormGroup controlId="description" validationState={this.getValidationState()}>
          <FormControl componentClass="textarea" name='description' placeholder="Your event's description" value={this.state.description} onChange={this.handleChange} required={true} />
          <FormControl.Feedback />
        </FormGroup>
        
        <Button type="submit">Share !</Button>
      </Form>
    );
  }

}