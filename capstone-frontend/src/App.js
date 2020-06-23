import React from 'react';
import {
  Route, 
  BrowserRouter as Router
} from 'react-router-dom';

import './App.css';

import Home from './components/Home';
import Browse from './components/Browse';
import MyBooks from './components/MyBooks';
import MyLists from './components/MyLists';
import MyClubs from './components/MyClubs';
import BookPage from './components/BookPage';
import ListPage from './components/ListPage';

import Navbar from './components/Navbar';
import LeftSideBar from './components/LeftSideBar';
import RightSideBar from './components/RightSideBar';

function App() {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
          <title> BookBook </title> 
          <link rel="shortcut icon" href="https://pbs.twimg.com/profile_images/813056632250925057/t-DDGecT_400x400.jpg"/>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"/>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
      </head>
      <body>
        <Router>
          <Navbar />
            <div className="row" id="body-row">
              <LeftSideBar />
              <div className="col-12 col-md-8">
                <Route exact path='/' component={Home} />
                <Route path='/browse' component={Browse} />
                <Route path='/mybooks' component={MyBooks} />
                <Route path='/mylists' component={MyLists} />
                <Route path='/myclubs' component={MyClubs} />
                <Route path='/bookdetails' render={(props) => <BookPage {...props} />} />
                <Route path='/listdetails' render={(props) => <ListPage {...props} />} />
              </div>
              <RightSideBar />
          </div>
        </Router>
      </body>
    </html>   
  );
}

export default App;
