package com.google.sps.data;

import java.util.ArrayList;
import java.util.List;


public class Club extends Group {
  
  private String gbookID;

  public Club(String name, String description, String announcement,
    List<String> posts, String ownerID, List<String> memberIDs,
    List<String> inviteIDs, String gbookID) {
      
    super(name, description, announcement, posts, ownerID, memberIDs, inviteIDs);
    this.gbookID = gbookID;
  }

  public Club(String name, String description, String ownerID, String gbookID) {
    this(name, description, "", new ArrayList<String>(), ownerID, new ArrayList<String>(),
      new ArrayList<String>(), gbookID);
  }

  public Club(String name, String ownerID, String gbookID) {
    this(name, "", ownerID, gbookID);
  }

  public Club(String name, String ownerID) {
    this(name, "", ownerID, "");
  }
 
  public String getGbookID() {
    return this.gbookID;
  }

  public void setGbookID(String gbookID) {
    this.gbookID = gbookID;
  }
  
}