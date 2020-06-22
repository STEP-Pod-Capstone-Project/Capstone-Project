package com.google.sps.data;

import java.util.Collection;
import java.util.HashSet;

 
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
  public User(long id, String email, String username){
    this.id = id;
    this.email = email;
    this.username = username;
    this.friendIDs = new HashSet<Long>();
  }
 
  public long getID() {
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
 
  public Collection<Long> getFriends() {
    return friendIDs;
  }
 
  public void addFriend(Long friendID) {
    friendIDs.add(friendID);
  }
 
  public void clearFriends() {
    friendIDs.clear();
  }
 
}
