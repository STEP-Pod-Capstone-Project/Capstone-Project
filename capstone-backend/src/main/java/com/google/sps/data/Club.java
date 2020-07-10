package com.google.sps.data;

import java.util.ArrayList;
import java.util.List;


public class Club extends Group {
  
  private String name;
  private String description;
  private String announcement;
  private List<Assignment> assignments;
  private String ownerID;
  private List<String> memberIDs;
  private List<String> inviteIDs;
  private String gbookID;

  public Club(String name, String description, String announcement, List<Assignment> assignments, 
      String ownerID, List<String> memberIDs, List<String> inviteIDs, String gbookID) {
        this.name = name;
        this.description = description;
        this.announcement = announcement;
        this.assignments = assignments;
        this.ownerID = ownerID;
        this.memberIDs = memberIDs;
        this.inviteIDs = inviteIDs;
        this.gbookID = gbookID;
  }

  public Club(String name, String description, String ownerID, String gbookID){
    this(name, description, "", new ArrayList<Assignment>(), ownerID, new ArrayList<String>(), new ArrayList<String>(), gbookID);
  }

  public Club(String name, String ownerID, String gbookID) {
    this(name, "", ownerID, gbookID);
  }

  public Club(String name, String ownerID) {
    this(name, "", ownerID, "");
  }

  public Club() {
    this("", "");
  }
 
  public String getName() {
    return this.name;
  }
 
  public void setName(String name) {
    this.name = name;
  }
 
  public String getDescription() {
    return this.description;
  }
 
  public void setDescription(String description) {
    this.description = description;
  }

  public String getAnnouncement() {
    return this.announcement;
  }
 
  public void setAnnouncement(String announcement) {
    this.announcement = announcement;
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

  public String getOwnerID() {
    return ownerID;
  }

  public void setOwnerID(String ownerID) {
    this.ownerID = ownerID;
  }
 
  public List<String> getMemberIDs() {
    return this.memberIDs;
  }

  public void removeMember(String memberID) {
    memberIDs.remove(memberID);
  }

  public void removeMembers(List<String> memberIDs) {
    for (String m : memberIDs) {
      this.memberIDs.remove(m);
    }
  }
 
  public List<String> getInviteIDs() {
    return this.inviteIDs;
  }

  public void invite(String inviteID) {
    inviteIDs.add(inviteID);
  }

  public void invite(List<String> inviteIDs) {
    for (String i : inviteIDs) {
      this.inviteIDs.add(i);
    }
  }

  public void uninvite(String uninviteID) {
    inviteIDs.remove(uninviteID);
  }

  public void uninvite(List<String> uninviteIDs) {
    for (String u : uninviteIDs) {
      this.inviteIDs.remove(u);
    }
  }

  public boolean addMember(String memberID) {
    if (inviteIDs.contains(memberID)) {
      inviteIDs.remove(memberID);
      memberIDs.add(memberID);
      return true;
    }
    return false;
  }

>>>>>>> modify clubs to have assignments
  public String getGbookID() {
    return this.gbookID;
  }

  public void setGbookID(String gbookID) {
    this.gbookID = gbookID;
  }
  
}