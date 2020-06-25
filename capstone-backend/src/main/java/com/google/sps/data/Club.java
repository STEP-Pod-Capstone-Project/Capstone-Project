package com.google.sps.data;

import java.util.Collection;
import java.util.ArrayList;
import java.util.HashSet;

 
/**
 * Class representing a Club.
 *
 * Note: The private variables in this class are converted into JSON.
 */
public class Club {
  
  private final long id;
  private String name;
  private String description;
  private String announcement;
  private Collection<String> posts;
  private long ownerID;
  private Collection<Long> memberIDs;
  private Collection<Long> inviteIDs;
  private String gbookID;

  public Club(long id, String name, String description, String announcement, Collection<String> posts, 
      long ownerID, Collection<Long> memberIDs, Collection<Long> inviteIDs, String gbookID) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.announcement = announcement;
        this.posts = posts;
        this.ownerID = ownerID;
        this.memberIDs = memberIDs;
        this.inviteIDs = inviteIDs;
        this.gbookID = gbookID;
  }

  public Club(long id, String name, String description, String announcement, long ownerID, String gbookID){
    this(id, name, description, announcement, new ArrayList<String>(), ownerID, new HashSet<Long>(), new HashSet<Long>(), gbookID);
  }

  public Club(long id, String name, String description, long ownerID, String gbookID) {
    this(id, name, description, "", ownerID, gbookID);
  }
 
  public long getID() {
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

  public long getOwnerID() {
    return ownerID;
  }

  public void setOwnerID(long ownerID) {
    this.ownerID = ownerID;
  }
 
  public Collection<Long> getMemberIDs() {
    return this.memberIDs;
  }

  public void removeMember(long memberID) {
    memberIDs.remove(memberID);
  }

  public void removeMembers(Collection<Long> memberIDs) {
    for (Long l : memberIDs) {
      this.memberIDs.remove(l);
    }
  }
 
  public Collection<Long> getInviteIDs() {
    return this.inviteIDs;
  }

  public void invite(long inviteID) {
    inviteIDs.add(inviteID);
  }

  public void invite(Collection<Long> inviteIDs) {
    for (Long l : inviteIDs) {
      this.inviteIDs.add(l);
    }
  }

  public void uninvite(Long uninviteID) {
    inviteIDs.remove(uninviteID);
  }

  public void uninvite(Collection<Long> uninviteIDs) {
    for (Long l : uninviteIDs) {
      this.inviteIDs.remove(l);
    }
  }

  public boolean addMember(long memberID) {
    if (inviteIDs.contains(memberID)) {
      inviteIDs.remove(memberID);
      memberIDs.add(memberID);
      return true;
    }
    return false;
  }

  public String getGbookID() {
    return this.gbookID;
  }

  public void setGbookID(String gbookID) {
    this.gbookID = gbookID;
  }
 
}
