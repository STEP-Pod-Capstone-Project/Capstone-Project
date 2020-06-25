import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import "../styles/Login.css"


export class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLogin: false,
      profileObj: {}
    };
  }

  loginResponseSuccess = (response) => {
    this.setState({ isLogin: true });
    this.setState({ profileObj: response.profileObj });

    console.log("ProfileObj", this.state.profileObj);
  }

  logoutResponse = () => {
    this.setState({ isLogin: false });
    this.setState({ profileObj: {} });
  }

  render() {
    return (
      <div className="login">
        {this.state.isLogin
          ?
          <div>
            <GoogleLogout
              buttonText="Logout"
              onLogoutSuccess={this.logoutResponse}
              isSignedIn={false} />

            <img id="profile-pic"
              className="img-responsive rounded-circle"
              src={this.state.profileObj.imageUrl}
              alt={this.state.profileObj.name} />
          </div>

          : <GoogleLogin
            clientId="962122785123-r4ps71sg5eobh9riec89s9kas6dpvraj.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.loginResponseSuccess}
            isSignedIn={true}
            cookiePolicy={"single_host_origin"} />}
      </div>
    )
  }
}

export default Login
