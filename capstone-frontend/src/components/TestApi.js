import React, { Component } from 'react'

export class TestApi extends Component {

  constructor(props) {
    super(props);

    this.state = {
      testData: null,
    };
  }

  componentDidMount() {

    console.log("Mounted");

    // fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/testData", { credentials: 'include' })
    //   .then(response => response.json())
    //   .then(testData => this.setState({ testData }));

    // fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/testData", { credentials: 'include' })
    //   .then(response => response.json())
    //   .then(testData => console.log(testData));


    fetch("/api/testData")
      .then(response => response.json())
      .then(testData => this.setState({ testData }));

    fetch("/api/testData")
      .then(response => response.json())
      .then(testData => {
        console.log(testData);
      });
  }


  render() {
    return (
      <div>
        <h1>Testing Api</h1>
        <p>Fetch Data: {this.state.testData}</p>
      </div>
    )
  }
}

export default TestApi
