package com.google.sps.data;
 
/**
 * Class representing a User.
 *
 * Note: The private variables in this class are converted into JSON.
 */
public final class User {
  
  private final long id;
  private final String email;
  private final String username;
  private Collection<long> friendIDs;
 
  /** Constructor for a User Object */
  public User(long id, String email, String username){
    this.id = id;
    this.email = email;
    this.username = username;
    this.friendIDs = new HashSet<long>();
  }
 
  public long getID() {
    return id;
  }
 
  public void setID(long id) {
    this.id = id;
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
 
  public Collection<long> getFriends() {
    return friendIDs;
  }
 
  public void addFriend(long friendID) {
    friendIDs.add(friendID);
  }
 
  public void resetFriends() {
    friendIDs.clear();
  }
 
}
