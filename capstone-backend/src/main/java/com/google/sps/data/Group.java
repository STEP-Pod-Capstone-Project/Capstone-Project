package com.google.sps.data;

import java.util.ArrayList;
import java.util.List;

 
public abstract class Group extends BaseEntity {
  
  private String name;
  private String description;
  private String ownerID;
  private List<String> memberIDs;
  private List<String> inviteIDs;

  public Group(String name, String description, String ownerID, List<String> memberIDs, 
      List<String> inviteIDs) {
    this.name = name;
    this.description = description;
    this.ownerID = ownerID;
    this.memberIDs = memberIDs;
    this.inviteIDs = inviteIDs;
  }

  public Group(String name, String description, String ownerID) {
    this(name, description, ownerID, new ArrayList<>(), new ArrayList<>());
  }

  public Group() {
    this("", "", "", new ArrayList<>(), new ArrayList<>());
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
    this.memberIDs.remove(memberID);
  }

  public void removeMembers(List<String> memberIDs) {
    this.memberIDs.removeAll(memberIDs);
  }
 
  public List<String> getInviteIDs() {
    return this.inviteIDs;
  }

  public void invite(String inviteID) {
    this.inviteIDs.add(inviteID);
  }

  public void invite(List<String> inviteIDs) {
    this.inviteIDs.addAll(inviteIDs);
  }

  public void uninvite(String uninviteID) {
    this.inviteIDs.remove(uninviteID);
  }

  public void uninvite(List<String> uninviteIDs) {
    this.inviteIDs.removeAll(uninviteIDs);
  }

  public boolean addMember(String memberID) {
    if (inviteIDs.contains(memberID)) {
      inviteIDs.remove(memberID);
      memberIDs.add(memberID);
      return true;
    }
    return false;
  }
  
}