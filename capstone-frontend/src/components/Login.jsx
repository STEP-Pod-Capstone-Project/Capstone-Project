import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'
import "../styles/Login.css"


export class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLogin: false,
      profileObj: {},
      profileMenuCollapsed: false
    };
  }

  toggleProfileMenu = () => {
    this.setState({ profileMenuCollapsed: !this.state.profileMenuCollapsed });
  }

  loginResponseSuccess = (response) => {
    this.setState({ isLogin: true });
    this.setState({ profileObj: response.profileObj });
  }

  logoutResponseSuccess = () => {
    this.setState({ isLogin: false });
    this.setState({ profileObj: {} });
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
              clientId="962122785123-r4ps71sg5eobh9riec89s9kas6dpvraj.apps.googleusercontent.com"
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
