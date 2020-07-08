package com.google.sps.data;

import java.util.List;

 
public abstract class Group extends BaseEntity {
  
  private String name;
  private String description;
  private String announcement;
  private List<String> posts;
  private String ownerID;
  private List<String> memberIDs;
  private List<String> inviteIDs;

  public Group(String name, String description, String announcement, List<String> posts, 
      String ownerID, List<String> memberIDs, List<String> inviteIDs) {
        this.name = name;
        this.description = description;
        this.announcement = announcement;
        this.posts = posts;
        this.ownerID = ownerID;
        this.memberIDs = memberIDs;
        this.inviteIDs = inviteIDs;
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

  public List<String> getPosts() {
    return this.posts;
  }

  public void post(String post) {
    this.posts.add(post);
  }

  public void clearPosts() {
    this.posts.clear();
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