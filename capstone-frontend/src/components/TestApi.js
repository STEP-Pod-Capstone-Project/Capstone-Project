import React, { Component } from 'react'

export class TestApi extends Component {

  constructor(props) {
    super(props);

    this.state = {
      testData: null,
    };
  }

  componentDidMount(){

    console.log("Mounted");

    console.log(fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/testData", {mode: 'cors'}));

    // fetch("/https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/testData").then(response => response.json()).then(testData => {

    //   if (testData){
    //     console.log("Got Here");
    //   }

    // });
  }


  render() {
    return (
      <div>
        <h1>Testing Api</h1>
        <p>Fetch Data: </p>
        <div id="test-data"></div>
      </div>
    )
  }
}

export default TestApi
