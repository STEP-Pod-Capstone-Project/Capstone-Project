import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
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
            <button className="dropdown-toggle" type="button" onClick={this.toggleProfileMenu}>

              <img id="profile-pic"
                className="img-responsive rounded-circle"
                src={this.state.profileObj.imageUrl}
                alt={this.state.profileObj.name} />
            </button>

            <div className={this.state.profileMenuCollapsed ? "dropdown-menu show" : "dropdown-menu"}>
              <a className="dropdown-item" href="/">
                <GoogleLogout
                  buttonText="Logout"
                  onLogoutSuccess={this.logoutResponse}
                  isSignedIn={false} />
              </a>
            </div>
          </div>
          :
          <div>
            <button className="dropdown-toggle" type="button" onClick={this.toggleProfileMenu}>

              <img id="profile-pic"
                className="img-responsive rounded-circle"
                src={"/images/default_account.png"}
                alt="Default Profile" />
            </button>
            
            <div className={this.state.profileMenuCollapsed ? "dropdown-menu show" : "dropdown-menu"}>
              <a className="dropdown-item" href="/">
                <GoogleLogin
                  clientId="962122785123-r4ps71sg5eobh9riec89s9kas6dpvraj.apps.googleusercontent.com"
                  buttonText="Login"
                  onSuccess={this.loginResponseSuccess}
                  isSignedIn={true}
                  cookiePolicy={"single_host_origin"} />
              </a>
            </div>
          </div>}
      </div>
    )
  }
}

export default Login
