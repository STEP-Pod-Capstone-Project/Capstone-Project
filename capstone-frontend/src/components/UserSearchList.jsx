import React, { Component } from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';
import { UserCard } from './UserCard';

export class UserSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
    }
  }

  getUsers = () => {
    // Get users by searchQuery
    fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/userSearch?searchTerm=${this.props.searchQuery}`)
      .then(response => response.json())
      .then(users => this._isMounted && this.setState({ users, loading: false }))
      .catch(function (err) {
        console.log(err)
      });
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true });
    this.getUsers();
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchQuery !== prevProps.searchQuery) {
      this.setState({ loading: true });
      this.getUsers();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (this.state.loading
      ?
      (<div className='text-center mt-4'>
        <Spinner animation='border' role='status' />
        <br />
        <h1>Loading...</h1>
      </div>)
      :
      this.state.users.length === 0 ?
        <p>There are no users for this search query.</p>
        :
        <Container className='text-center'>
          <Row className='justify-content-center'>
            {this.state.users.map(user =>
              <UserCard key={user.id} user={user} updateFriendsList={this.props.updateFriendsList} />
            )}
          </Row>
        </Container>
    );
  }
}