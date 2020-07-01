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
    this.setState({ isLogin: true });
    this.setState({ googleUser: response });
    this.setState({ profileObj: response.profileObj });

    console.log("GoogleUser\n", this.state.googleUser);
    console.log("AuthResponse\n", this.state.googleUser.getAuthResponse());

    // Store User in Firebase

    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/user",
      {
        method: "POST",
        body: JSON.stringify(this.state.googleUser),
        credentials: 'include'
      }).then(response => console.log("Data Sent", response));

  }

  logoutResponseSuccess = () => {
    this.setState({ isLogin: false });
    this.setState({ googleUser: {} });
    this.setState({ profileObj: {} });

  }

  render() {
    return (
      <div id="login">

        <button onClick={async () => {

          const authHeaders = new Headers({
            'Authorization': this.state.googleUser.getAuthResponse().token_type + " " + this.state.googleUser.getAuthResponse().access_token,
            'Accept': 'application/json',
          });

          const response = await fetch('https://www.googleapis.com/books/v1/mylibrary/bookshelves?key=AIzaSyAdnHNzKVY7G3ZriaqdSIKkVbHlxKbxyu0', {
            method: 'GET',
            headers: authHeaders,
          })

          const bookshelves = await response.json();

          console.log(bookshelves);

        }}>Fetch Stuff</button>

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
              scope={"https://www.googleapis.com/auth/books"}
              cookiePolicy={"single_host_origin"} />

          </div>}
      </div>
    )
  }
}

export default Login
