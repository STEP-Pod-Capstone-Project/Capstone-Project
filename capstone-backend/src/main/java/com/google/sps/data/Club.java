package com.google.sps.data;

import java.util.ArrayList;
import java.util.List;


public class Club extends Group {
  
  private String gbookID;

  public Club(String id, String name, String description, String announcement,
    List<String> posts, String ownerID, List<String> memberIDs,
    List<String> inviteIDs, String gbookID) {
      
    super(id, name, description, announcement, posts, ownerID, memberIDs, inviteIDs);
    this.gbookID = gbookID;
  }

  public Club(String id, String name, String description, String ownerID, String gbookID) {
    this(id, name, description, "", new ArrayList<String>(), ownerID, new ArrayList<String>(),
      new ArrayList<String>(), gbookID);
  }

  public Club(String id, String name, String ownerID, String gbookID) {
    this(id, name, "", ownerID, gbookID);
  }

  public Club(String id, String name, String ownerID) {
    this(id, name, "", ownerID, "");
  }
 
  public String getGbookID() {
    return this.gbookID;
  }

  public void setGbookID(String gbookID) {
    this.gbookID = gbookID;
  }
  
}