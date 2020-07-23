package com.google.sps.data;

import java.util.ArrayList;
import java.util.List;


public class Club extends Group {
  private String gbookID;

  public Club(String name, String description, String ownerID, List<String> memberIDs, 
      List<String> inviteIDs, List<String> requestIDs, String gbookID) {
    super(name, description, ownerID, memberIDs, inviteIDs, requestIDs);
    this.gbookID = gbookID;
  }

  public Club(String name, String description, String ownerID, String gbookID){
    this(name, description, ownerID, new ArrayList<String>(), new ArrayList<String>(), 
        new ArrayList<String>(), gbookID);
  }

  public Club(String name, String ownerID, String gbookID) {
    this(name, "", ownerID, gbookID);
  }

  public Club(String name, String ownerID) {
    this(name, ownerID, "");
  }

  public Club() {
    this("", "");
  }

  public String getGbookID() {
    return this.gbookID;
  }

  public void setGbookID(String gbookID) {
    this.gbookID = gbookID;
  }
}
