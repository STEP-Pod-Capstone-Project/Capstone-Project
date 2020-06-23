import React, { Component } from 'react'

export class TestBookList extends Component {

  constructor() {
    super();

    this.state = {
      BookshelfIDs: null,
      UsersIDs: null
    };
  }

  handleBookShelfIDsChange = (event) => {
    this.setState({ BookshelfIDs: event.target.value });
  }

  handleUsersIDsChange = (event) => {
    this.setState({ UsersIDs: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(event.formData);
    console.log(this.state.BookshelfIDs, this.state.UsersIDs);
  }

  componentDidMount() {

    let formData = new FormData();

    formData.append("bookshelfIDs", this.state.BookshelfIDs);
    formData.append("usersIDs", this.state.UsersIDs);

    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/testBookList", { method: "POST", credentials: 'include', body: formData });

    console.log(formData);
  }






  render() {
    return (
      <div>
        <form>
          <label>
            BookshelfIDs:
            <input type="text" name="bookshelfIDs" onChange={this.handleBookShelfIDsChange} />
          </label>
          <label>UsersIDs
            <input type="text" name="usersIDs" onChange={this.handleUsersIDsChange} />
          </label>
          <button onClick={this.handleSubmit}>Submit</button>
        </form>
      </div>
    )
  }
}

export default TestBookList
