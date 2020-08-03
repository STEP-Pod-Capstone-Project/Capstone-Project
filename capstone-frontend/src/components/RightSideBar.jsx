import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import ContactsIcon from '@material-ui/icons/Contacts';
import Drawer from '@material-ui/core/Drawer';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
    nested: {
    paddingRight: theme.spacing(5),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

export const RightSideBar = (props) => {
  const classes = useStyles();
  const [openList, setOpenList] = React.useState(true);

  const handleClick = () => {
    setOpenList(!openList);
  };

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant='permanent'
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor='right'
      >
        <div id='right-sidebar-container' className={classes.toolbar} />
        <ListItem button onClick={handleClick} >
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary='My Friends' />
          {openList ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openList} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {props.friendsList.map(friend => (
              <ListItem button key={friend.email} className={classes.nested}>
                <ListItemAvatar>
                  <Avatar
                    alt={friend.email + ' image'}
                    src={friend.profileImageUrl}
                  />
                </ListItemAvatar>
                <ListItemText primary={friend.fullName} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Drawer>
    </div>
  );
}