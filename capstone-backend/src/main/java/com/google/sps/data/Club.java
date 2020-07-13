package com.google.sps.data;

import java.util.ArrayList;
import java.util.List;


public class Club extends Group {
  
  private List<Assignment> assignments;
  private String gbookID;

  public Club(String name, String description, List<Assignment> assignments, 
      String ownerID, List<String> memberIDs, List<String> inviteIDs, String gbookID) {
    super(name, description, ownerID, memberIDs, inviteIDs);
    this.assignments = assignments;
    this.gbookID = gbookID;
  }

  public Club(String name, String description, String ownerID, String gbookID){
    this(name, description, new ArrayList<Assignment>(), ownerID, new ArrayList<String>(), new ArrayList<String>(), gbookID);
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

  public List<Assignment> getAssignments() {
    return this.assignments;
  }

  public void addAssignment(Assignment assignment) {
    this.assignments.add(assignment);
  }

  public void clearAssignments() {
    this.assignments.clear();
  }

  public String getGbookID() {
    return this.gbookID;
  }

  public void setGbookID(String gbookID) {
    this.gbookID = gbookID;
  }
}
