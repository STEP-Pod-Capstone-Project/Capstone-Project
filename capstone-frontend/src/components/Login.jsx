import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login';
import { Card } from 'react-bootstrap'

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
    return (
      <div>
        <Card className="w-50">
          <Card.Header><h1 className="my-4">Welcome to BookBook</h1></Card.Header>
          <Card.Body>
            <Card.Text>
              <h3 className="my-3">To Get Started</h3>
              <GoogleLogin
                className="text-center"
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
