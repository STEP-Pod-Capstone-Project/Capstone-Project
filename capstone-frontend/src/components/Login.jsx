import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login';
import { Card, Navbar } from 'react-bootstrap'
import '../styles/Login.css'

export class Login extends Component {

  loginResponseSuccess = (response) => {

    // Store User in Firebase
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(response.tokenObj),
    });

    window.localStorage.setItem('userID', response.profileObj.googleId);
    window.localStorage.setItem('tokenExpiration', response.tokenObj.expires_at);
    window.localStorage.setItem('profileObj', JSON.stringify(response.profileObj));

    this.props.toggleSignIn();
  }

  render() {
    return (
      <div>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand >BookBook</Navbar.Brand>
        </Navbar>

        <Card id="login-card" className="text-center">
          <Card.Header><h1 id="login-title-text" className="my-4">Welcome to BookBook</h1></Card.Header>
          <Card.Body>
            <Card.Text id="sign-in-text">
              <span id="login-subtitle-text" className="h3">To Get Started</span>
              <br />
              <GoogleLogin
                className="text-center mt-3"
                scope={'https://www.googleapis.com/auth/calendar'}
                clientId="118832340668-gq8e44ooi8c1gmi8187sjmokstllj83m.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={this.loginResponseSuccess}
                onFailure={() => console.error("Login Failure")}
                isSignedIn={true}
                cookiePolicy={"single_host_origin"} />
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default Login
