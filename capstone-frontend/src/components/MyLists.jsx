import React, { Component } from 'react';

class MyLists extends Component {

  handleSubmit = (event) => {

    event.preventDefault();

    const newBooklist = {
      "userID": window.sessionStorage.getItem("userID"),
      "booklistName": event.target[0].value,
    }

    // Store BookList in Firebase
    fetch("/api/booklist", {
      method: "POST",
      body: JSON.stringify(newBooklist)
    });
  }

  render() {
    return (
      <div>
        <h1 className="text-center"> My BookList </h1>

        <form onSubmit={this.handleSubmit} id="create-booklist-id">
          <label htmlFor="name">BookList Name</label>
          <br />
          <input type="text" name="name" />
          <br />
          <label htmlFor="booklist-btn"> Create BookList </label>
          <br />
          <input type="submit" name="bookList-btn" />
          <br />
        </form>

        <button className="" onClick={async () => {

          const userID = window.sessionStorage.getItem("userID");

          const bookLists = await fetch(`/api/booklist?userID=${userID}`, {
            method: "GET",
          }).then(resp => resp.json());

          console.log(bookLists);

        }}>Click for Data</button>

      </div>
    )
  }
}

export default MyLists;