import React, {Component} from 'react';
import { AuthContext } from '../AuthProvider';
import TitleBar from '../components/TitleBar.js';

export default class HomePage extends Component {

  render() {
    return (
      <AuthContext>
        {({ signOut }) => (
          <div className="homepage">
          <TitleBar/>
          <h1>Welcome !</h1>
          
          </div>
        )}
      </AuthContext>
    );
  }
}