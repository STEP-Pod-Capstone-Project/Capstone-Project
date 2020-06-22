// Temporary file to aid with viewing results of API call
import React, { Component } from 'react';
import '../../App.css';

import BookSearchList from '../BookSearchList';

class SearchView extends Component {
  render() {
    return (
      <div>
        <BookSearchList/>
      </div>
    );
  }
}

export default SearchView;