import React, { Component } from 'react';
import axios from 'axios';

const {
  Provider: AuthContextProvider,
  Consumer: AuthContext,
} = React.createContext();

class AuthProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      error: null,
      signIn: this.signIn,
      signOut: this.signOut,
    }
  }

  componentDidMount() {
    const token = window.localStorage.getItem('token');
    if (token) {
      axios.get('/api/me', {
        headers: {
          Authorization: `bearer ${token}`,
          Accept: `https://fast-refuge-14566.herokuapp.com`,
        }
      })
        .then(response => {
          const { user } = response.data;
          this.setState({ user });
        })
        .catch(err => {
          console.error(err);
          localStorage.removeItem('token');
        })
    }
  }

  signIn = ({ username, password }) => {
    // Implement me !
    // const headers = {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT',
    //   'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    //   'Content-Type': 'text/plain;charset=utf-8'
    // }
    // console.log("TRYING TO POST");
    // console.log("USER: " + username + ", PASS: " + password)
    axios.post('https://fast-refuge-14566.herokuapp.com/auth/login', { username, password }, {headers: headers})
      .then(response => {
        const { user, token } = response.data;
        window.localStorage.setItem('token', token);
        this.setState({ user });
        // console.log("SENDING FROM CLIENT");
      })
      .catch(error => {
        console.error(error);
        this.setState({ error: 'Invalid username or password' });
      })
  }

  signOut = () => {
    // Implement me !
    localStorage.removeItem('token');
    window.location.reload();
  }

  render() {
    const { children } = this.props
    return (
      <AuthContextProvider value={this.state}>
        {children}
      </AuthContextProvider>
    )
  }
}

export { AuthContext };
export default AuthProvider;
