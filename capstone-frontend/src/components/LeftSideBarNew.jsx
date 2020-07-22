import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import CollectionsIcon from '@material-ui/icons/Collections'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


import {
  Route,
  BrowserRouter as Router,
  Link
} from 'react-router-dom';
import { Row, Col } from 'react-bootstrap'

import Home from './Home';
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
}));

export function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openList, setOpenList] = React.useState(true);



  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpenList(!openList);
  };

  return (
    <div className={classes.root}>
      <AppBar
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
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        {/* TODO(): Add Website LOGO or somthing OR PROFILE PIC */}
        <Divider />
        <List>
          <Link to="/" style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}>
            <ListItem button>

              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText style={{ color: 'inherit' }} primary="Home" />

            </ListItem>
          </Link>

          <Link to="/browse" style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}>
            <ListItem button>

              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Search" />

            </ListItem>
          </Link>

          <Link to="/myreads" style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}>
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
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <CollectionsIcon />
                </ListItemIcon>
                <ListItemText primary="Starred" />
              </ListItem>
            </List>
          </Collapse>


        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Row>
          {/* <LeftSideBar bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} /> */}
          <Col id="body-row">
            <Route exact path='/' component={Home} />
            <Route path='/browse/:query' render={(props) => (
              <Browse bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} searchQuery={props.match.params.query} />
            )} />
            <Route path='/mybooks' component={MyBooks} />
            <Route path='/listpage/:id' component={ListPage} />
            <Route path='/myclubs' component={MyClubs} />
            <Route path='/bookpage/:id' render={(props) => (
              <BookPage bookId={props.match.params.id} bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} />
            )} />
            <Route path='/clubpage/:id' render={(props) => (
              <ClubPage id={props.match.params.id} bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} />
            )} />
            <Route path='/createclub' component={CreateClub} />
          </Col>
          <Col md={2}>                <RightSideBar /></Col>

        </Row>
      </main>
    </div >
  );
}
