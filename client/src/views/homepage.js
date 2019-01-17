import React from 'react';
import { AuthContext } from './AuthProvider';

export default class HomePage extends Component {

  render() {
    return (
      <AuthContext>
        {({ signOut }) => (
          <div>
          <h1>Welcome !</h1>
          <button onClick={signOut}>LOGOUT</button>
          </div>
        )}
      </AuthContext>
    );
  }
}