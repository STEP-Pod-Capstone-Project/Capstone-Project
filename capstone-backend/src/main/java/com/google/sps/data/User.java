package com.google.sps.data;

import java.util.Collection;
import java.util.HashSet;

<<<<<<< HEAD
/**
 * Class representing a User.
 *
 * Note: The private variables in this class are converted into JSON.
 */
public class User {

  private final long id;
  private String email;
  private String username;
  private Collection<Long> friendIDs;

  /** Constructor for a User Object */
  public User(long id, String email, String username) {
=======

public class User {
  
  private final String id;
  private String email;
  private String username;
  private Collection<String> friendIDs;
 
  public User(String id, String email, String username){
>>>>>>> firebase setup, book servlet.Does not seem to work yet
    this.id = id;
    this.email = email;
    this.username = username;
    this.friendIDs = new HashSet<String>();
  }

  public User() {
    this("", "", "");
  }
<<<<<<< HEAD

  public long getID() {
=======
 
  public String getID() {
>>>>>>> firebase setup, book servlet.Does not seem to work yet
    return id;
  }

  public String getEmail() {
    return this.email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }
<<<<<<< HEAD

  public Collection<Long> getFriends() {
    return friendIDs;
  }

  public void addFriend(Long friendID) {
=======
 
  public Collection<String> getFriends() {
    return friendIDs;
  }
 
  public void addFriend(String friendID) {
>>>>>>> firebase setup, book servlet.Does not seem to work yet
    friendIDs.add(friendID);
  }

  public void clearFriends() {
    friendIDs.clear();
  }

}
