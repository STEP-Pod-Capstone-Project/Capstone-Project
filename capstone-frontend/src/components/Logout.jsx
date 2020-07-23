import React, { Component } from 'react'
import { GoogleLogout } from 'react-google-login';
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'

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
          clientId="962122785123-t0pm10o610q77epuh9d1jjs29hamm1nf.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={this.logoutResponseSuccess}
          isSignedIn={false} />
      </div>
    )
  }
}

export default Logout
