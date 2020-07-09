import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'
import "../styles/Login.css"


export class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLogin: false,
      googleUser: {},
      profileObj: {},
      profileMenuCollapsed: false
    };
  }

  toggleProfileMenu = () => {
    this.setState({ profileMenuCollapsed: !this.state.profileMenuCollapsed });
  }

  loginResponseSuccess = (response) => {
    this.setState({ isLogin: true, googleUser: response, profileObj: response.profileObj });

    // Store User in Firebase
    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/user", {
      method: "POST",
      body: JSON.stringify(this.state.googleUser.tokenObj),
    });

    window.sessionStorage.setItem("userID", this.state.profileObj.googleId)

  }

  logoutResponseSuccess = () => {
    this.setState({ isLogin: false, googleUser: {}, profileObj: {} });
  }

  render() {
    return (
      <div id="login">

        {this.state.isLogin
          ?
          <div>

            <DropdownButton as={ButtonGroup} title={

              <img id="profile_img"
                className="img-responsive rounded-circle"
                src={this.state.profileObj.imageUrl}
                alt={this.state.profileObj.name} />}

              id="bg-vertical-dropdown-1">

              <Dropdown.Item eventKey="1">
                <GoogleLogout
                  buttonText="Logout"
                  onLogoutSuccess={this.logoutResponseSuccess}
                  isSignedIn={false} />
              </Dropdown.Item>
            </DropdownButton>

          </div>
          :
          <div>

            <GoogleLogin
              clientId="962122785123-t0pm10o610q77epuh9d1jjs29hamm1nf.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={this.loginResponseSuccess}
              isSignedIn={true}
              cookiePolicy={"single_host_origin"} />

          </div>}
      </div>
    )
  }
}

export default Login
