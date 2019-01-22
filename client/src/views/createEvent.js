import React, {Component} from 'react';
import EventForm from '../components/EventForm';

export default class CreateEvent extends Component {

  render() {
    return (
    <div className="createEvent">
        <div className="create">
          
          <EventForm/>
        </div>
      </div>
    );
  }
}