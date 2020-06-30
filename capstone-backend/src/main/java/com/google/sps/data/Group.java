package com.google.sps.data;

import java.util.Collection;

 
public abstract class Group {
  
  private final String id;
  private String name;
  private String description;
  private String announcement;
  private Collection<String> posts;
  private String ownerID;
  private Collection<String> memberIDs;
  private Collection<String> inviteIDs;

  public Group(String id, String name, String description, String announcement, Collection<String> posts, 
      String ownerID, Collection<String> memberIDs, Collection<String> inviteIDs ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.announcement = announcement;
        this.posts = posts;
        this.ownerID = ownerID;
        this.memberIDs = memberIDs;
        this.inviteIDs = inviteIDs;
  }
 
  public String getID() {
    return this.id;
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

  public Collection<String> getPosts() {
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
 
  public Collection<String> getMemberIDs() {
    return this.memberIDs;
  }

  public void removeMember(String memberID) {
    this.memberIDs.remove(memberID);
  }

  public void removeMembers(Collection<String> memberIDs) {
    this.memberIDs.removeAll(memberIDs);
  }
 
  public Collection<String> getInviteIDs() {
    return this.inviteIDs;
  }

  public void invite(String inviteID) {
    this.inviteIDs.add(inviteID);
  }

  public void invite(Collection<String> inviteIDs) {
    this.inviteIDs.addAll(inviteIDs);
  }

  public void uninvite(String uninviteID) {
    this.inviteIDs.remove(uninviteID);
  }

  public void uninvite(Collection<String> uninviteIDs) {
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