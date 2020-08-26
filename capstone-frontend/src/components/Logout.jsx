import React, { Component } from 'react'
import { GoogleLogout } from 'react-google-login';

export class Logout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      profileObj: JSON.parse(window.localStorage.getItem("profileObj")) || {},
    };
  }

  logoutResponseSuccess = () => {
    window.localStorage.removeItem("userID");
    window.localStorage.removeItem("profileObj");
    this.props.toggleSignIn();
    this.setState({ profileObj: {} });
  }

  render() {
    return (
      <div style={this.props.loginStyle || {}}>
        <GoogleLogout
          clientId="118832340668-gq8e44ooi8c1gmi8187sjmokstllj83m.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={this.logoutResponseSuccess}
          isSignedIn={false} />
      </div>
    )
  }
}