package com.google.sps.data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

public final class User {

  private final String id; // Google Id
  private final String email;
  private final String fullName;
  private final String profileImageUrl;
  private final Map<String, String> tokenObj;
  private Collection<String> friendIDs;

  public User(String id, String email, String fullName, String profileImageUrl, Map<String, String> tokenObj, Collection<String> friendIDs) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
    this.profileImageUrl = profileImageUrl;
    this.tokenObj = tokenObj;
    this.friendIDs = friendIDs;
  }

  public User(String id, String email, String fullName, String profileImageUrl, Map<String, String> tokenObj) {
    this(id, email, fullName, profileImageUrl, tokenObj, new ArrayList<String>());
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

  public String getProfileImageUrl() {
    return profileImageUrl;
  }

  public Map<String, String> getTokenObj(){
    return tokenObj;
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
