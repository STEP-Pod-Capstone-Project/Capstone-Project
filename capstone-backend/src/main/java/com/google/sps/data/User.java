package com.google.sps.data;

import java.util.Collection;
import java.util.HashSet;


public class User {
  
  private final String id;
  private String email;
  private String username;
  private Collection<String> friendIDs;
 
  public User(String id, String email, String username){
    this.id = id;
    this.email = email;
    this.username = username;
    this.friendIDs = new HashSet<String>();
  }

  public User() {
    this("", "", "");
  }
 
  public String getID() {
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
 
  public Collection<String> getFriends() {
    return friendIDs;
  }
 
  public void addFriend(String friendID) {
    friendIDs.add(friendID);
  }
 
  public void clearFriends() {
    friendIDs.clear();
  }
 
}
