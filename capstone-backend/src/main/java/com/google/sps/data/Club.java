package com.google.sps.data;

import java.util.Collection;
import java.util.ArrayList;
import java.util.HashSet;


public class Club extends Group {
  
  private String gbookID;

  public Club(String id, String name, String description, String announcement,
    Collection<String> posts, String ownerID, Collection<String> memberIDs,
    Collection<String> inviteIDs, String gbookID) {
      
    super(id, name, description, announcement, posts, ownerID, memberIDs, inviteIDs);
    this.gbookID = gbookID;
  }

  public Club(String id, String name, String description, String announcement, String ownerID,
    String gbookID){

    this(id, name, description, announcement, new ArrayList<String>(), ownerID, new HashSet<String>(),
      new HashSet<String>(), gbookID);
  }

  public Club(String id, String name, String description, String ownerID, String gbookID) {
    this(id, name, description, "", ownerID, gbookID);
  }

  public Club(String id, String name, String description, String ownerID) {
    this(id, name, description, "", ownerID, "");
  }
 
  public String getGbookID() {
    return this.gbookID;
  }

  public void setGbookID(String gbookID) {
    this.gbookID = gbookID;
  }
  
}