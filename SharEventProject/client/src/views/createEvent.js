import React, { Component } from 'react';
import EventForm from '../components/EventForm';

const createEvent = () => {

  return (
    <div className="createEvent">
      <div className="create">
        <EventForm />
      </div>
    </div>
  );
}

export default createEvent;
