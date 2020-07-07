import React, { Component } from 'react';

class MyLists extends Component {
  render() {
    return (
      <div>
        <h1> My Lists- put user's lists here </h1>
        <button className="" onClick={async () => {

          const userID = {
            "userID": window.sessionStorage.getItem("userID")
          }


          const bookLists = await fetch("/api/booklistGet", {
            method: "POST",
            body: JSON.stringify(userID)
          }).then(resp => resp.json());

          console.log(bookLists);

        }}>Click for Data</button>

      </div>
    )
  }
}

export default MyLists;