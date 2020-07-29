import React, { Component } from 'react';
import '../App.css';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    this.fetchClubs();
  }

  fetchClubs = async () => {

    const userID = window.localStorage.getItem('userID');

    const clubs = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?id=${userID}`)

    console.log('clubs', clubs)
  }


  render() {
    return (
      <div>
        <h1 className="text-center">Clubs</h1>
        <hr className="light-gray-border mt-0" />

        <p className="text-center">Clubs HERE</p>

        <h1 className="text-center">My BookLists</h1>
        <hr className="light-gray-border mt-0" />

        <p className="text-center">BookLists HERE</p>

        <h1 className="text-center">Shared BookLists</h1>
        <hr className="light-gray-border mt-0" />

        <p className="text-center">Collab BookLists</p>
      </div>
    );
  }
}

export default Home;