import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login';
import { Card, Navbar, Nav, Button, FormControl, Form } from 'react-bootstrap'
import '../styles/Login.css'

export class Login extends Component {

  loginResponseSuccess = (response) => {

    // Store User in Firebase
    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/user", {
      method: "POST",
      body: JSON.stringify(response.tokenObj),
    });

    window.localStorage.setItem("userID", response.profileObj.googleId);
    window.localStorage.setItem("profileObj", JSON.stringify(response.profileObj))

    this.props.toggleSignIn();
  }

  render() {
    console.log(window.localStorage.getItem("userID") === null, window.localStorage.getItem("profileObj") === null)
    return (
      <div>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand >BookBook</Navbar.Brand>
        </Navbar>

        <Card id="login-card" className="text-center">
          <Card.Header><h1 className="my-4">Welcome to BookBook</h1></Card.Header>
          <Card.Body>
            <Card.Text id="sign-in-text">
              <span className="h3">To Get Started</span>
              <br />
              <GoogleLogin
                className="text-center mt-3"
                clientId="962122785123-t0pm10o610q77epuh9d1jjs29hamm1nf.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={this.loginResponseSuccess}
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
