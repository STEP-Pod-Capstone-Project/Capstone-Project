import React, { Component } from 'react';

class MyLists extends Component {
  render() {
    return (
      <div>
        <h1> My Lists- put user's lists here </h1>
        <button className="" onClick={() => {
          fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist", {method: "GET"});

        }}>Click for Data</button>

      </div>
    )
  }
}

export default MyLists;