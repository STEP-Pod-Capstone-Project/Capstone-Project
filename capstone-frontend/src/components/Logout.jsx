import React, { Component } from 'react'
import { GoogleLogout } from 'react-google-login';
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'
import "../styles/Logout.css"

export class Logout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      profileObj: JSON.parse(window.localStorage.getItem("profileObj")),
    };
  }

  logoutResponseSuccess = () => {
    console.log("logout")
    window.localStorage.removeItem("userID");
    window.localStorage.removeItem("profileObj");
    this.props.toggleSignIn();
    this.setState({ profileObj: {} });
  }

  render() {
    return (
      <div id="logout">

        <DropdownButton as={ButtonGroup} title={

          <img id="profile_img"
            className="img-responsive rounded-circle"
            src={this.state.profileObj.imageUrl}
            alt={this.state.profileObj.name} />}

          id="bg-vertical-dropdown-1">

          <Dropdown.Item eventKey="1">
            <GoogleLogout
              clientId="962122785123-t0pm10o610q77epuh9d1jjs29hamm1nf.apps.googleusercontent.com"
              buttonText="Logout"
              onLogoutSuccess={this.logoutResponseSuccess}
              isSignedIn={false} />
          </Dropdown.Item>
        </DropdownButton>

      </div>
    )
  }
}

export default Logout
