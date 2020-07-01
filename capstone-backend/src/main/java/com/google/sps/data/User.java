package com.google.sps.data;

import java.util.ArrayList;
import java.util.Collection;

import com.google.gson.JsonObject;

public final class User {

  private final String id; // Google Id
  private final String email;
  private final String fullName;
  private JsonObject tokenObj; // Needs to be updated every 60 days
  private Collection<String> friendIDs;

  public User(String id, String email, String fullName, JsonObject tokenObj) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
    this.tokenObj = tokenObj;
    this.friendIDs = new ArrayList<String>();
  }

  public User(String id, String email, String fullName) {
    this(id, email, fullName, new JsonObject());
  }

  public String getID() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getfullName() {
    return fullName;
  }

  public JsonObject getTokenObj() {
    return tokenObj;
  }

  public void setTokenObj(JsonObject tokenObj){
    this.tokenObj = tokenObj;
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
