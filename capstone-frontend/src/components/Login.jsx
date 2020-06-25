import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login';


export class Login extends Component {

  // const responseGoogle = (response) => {
  //   console.log(response);
  // }

  render() {
    return (
      <div style={{textAlign: "center"}}>
        <h3>Google Login</h3>
        <GoogleLogin
          clientId="" 
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}/>
      </div>
    )
  }
}

export default Login
