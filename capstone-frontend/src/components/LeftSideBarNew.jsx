import React from 'react';
import { withRouter } from 'react-router-dom'

import clsx from 'clsx';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar'
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase'
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import CollectionsIcon from '@material-ui/icons/Collections'
import DeleteIcon from '@material-ui/icons/Delete'
import PeopleIcon from '@material-ui/icons/People'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


import {
  Route,
  BrowserRouter as Router,
  Link
} from 'react-router-dom';
import { Row, Col } from 'react-bootstrap'

import Home from './Home';
import Logout from './Logout';
import Browse from './Browse';
import MyBooks from './MyBooks';
import MyClubs from './MyClubs';
import { BookPage } from './BookPage';
import ListPage from './ListPage'
import ClubPage from './ClubPage';
import AdminClubPage from './AdminClubPage';
import CreateClub from './CreateClub';
import Navbar from './Navbar';
import LeftSideBar from './LeftSideBar';
import RightSideBar from './RightSideBar';

import CreateList from './CreateList'

import '../styles/LeftSideBar.css'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  nested: {
    paddingLeft: theme.spacing(4),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}));

export const MiniDrawer = withRouter((props) => {

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openList, setOpenList] = React.useState(true);
  const profileObj = JSON.parse(window.localStorage.getItem("profileObj")) || {};

  React.useEffect(() => {
    console.log(props)
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpenList(!openList);
  };

  const handleSearchInput = (event, props) => {
    event.preventDefault();
    const searchValue = document.getElementById('search-input').value;
    props.setSearchQuery(searchValue);
    props.history.push(`/browse/${searchValue}`);

    console.log("has been sent")
  }

  const deleteBookList = async (bookListId, props, currentUrlPath) => {

    // Delete BookList in Firebase
    await fetch(`/api/booklist?id=${bookListId}`, {
      method: "DELETE",
    });

    props.updateBookLists();

    // These lines of code check if the current BookList URL has the same id as the one being deleted
    // If so we redirect home

    if (currentUrlPath.includes(bookListId)) {
      props.history.push("/")
    }
    else {
      props.history.push(currentUrlPath)
    }
  };

  return (
    <div className={classes.root}>
      <AppBar
        style={{ backgroundColor: '#007bff' }}
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            BookBook
          </Typography>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <form onSubmit={(event) => handleSearchInput(event, props)} className="remove-form-style" autocomplete="off">
              <InputBase
                autoComplete="off"
                id="search-input"
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </form>
          </div>
          <div className={classes.grow} />


        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
                            <Logout toggleSignIn={props.toggleSignIn} />

<IconButton>
          <Avatar 
            alt={profileObj.name} 
            src={profileObj.imageUrl} />
</IconButton>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>

        </div>

        {/* TODO(): Add Website LOGO or somthing OR PROFILE PIC */}
        <Divider />
        <List>
          <Link to="/" className="remove-link-style">
            <ListItem button>

              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />

            </ListItem>
          </Link>

          <Link to="/browse" className="remove-link-style">
            <ListItem button>

              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Search" />

            </ListItem>
          </Link>

          <Link to="/myreads" className="remove-link-style">
            <ListItem button >

              <ListItemIcon>
                <MenuBookIcon />
              </ListItemIcon>
              <ListItemText primary="My Books" />

            </ListItem>
          </Link>

          <ListItem button onClick={handleClick}>

            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="My BookLists" />

            {openList ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openList} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {
                props.bookLists.map(bookList =>

                  <Link to={`/listpage/${bookList.id}`} key={bookList.id} className="remove-link-style">
                    <ListItem button className={classes.nested} >

                      <ListItemIcon>
                        <CollectionsIcon />
                      </ListItemIcon>

                      <ListItemText primary={bookList.name} />

                      {open &&
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => deleteBookList(bookList.id, props, window.location.pathname)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      }
                    </ListItem>
                  </Link>
                )
              }
              <CreateList updateBookLists={props.updateBookLists} sideBar={true} />
            </List>
          </Collapse>

          <Link to="/myclubs" className="remove-link-style">
            <ListItem button >

              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="My Clubs" />

            </ListItem>
          </Link>
        </List>
      </Drawer>
      <main className={classes.content}>
        <Row>
          <Col id="body-row">
            <Route exact path='/' component={Home} />
            <Route path='/browse/:query' render={(props) => (
              <Browse bookLists={props.bookLists} updateBookLists={props.updateBookLists} searchQuery={props.match.params.query} />
            )} />
            <Route path='/mybooks' component={MyBooks} />
            <Route path='/listpage/:id' component={ListPage} />
            <Route path='/myclubs' component={MyClubs} />
            <Route path='/bookpage/:id' render={(props) => (
              <BookPage bookId={props.match.params.id} bookLists={props.bookLists} updateBookLists={props.updateBookLists} />
            )} />
            <Route path='/clubpage/:id' render={(props) => (
              <ClubPage id={props.match.params.id} bookLists={props.bookLists} updateBookLists={props.updateBookLists} />
            )} />
            <Route path='/createclub' component={CreateClub} />
          </Col>
          <Col md={2}>
            <RightSideBar />
          </Col>

        </Row>
      </main>
    </div >
  );
})