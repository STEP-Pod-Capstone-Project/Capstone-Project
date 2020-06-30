package com.google.sps.data;

import java.util.Collection;
import java.util.ArrayList;
import java.util.HashSet;


public class Community extends Group {
  
  // ID references to other communities and clubs
  private Collection<String> communityIDs;
  private Collection<String> clubIDs;

  public Community(String id, String name, String description, String announcement,
    Collection<String> posts, String ownerID, Collection<String> memberIDs,
    Collection<String> inviteIDs, Collection<String> communityIDs, Collection<String> clubIDs) {
     
    super(id, name, description, announcement, posts, ownerID, memberIDs, inviteIDs);
    this.communityIDs = communityIDs;
    this.clubIDs = clubIDs;
  }

  public Community(String id, String name, String description, String announcement, String ownerID) {

    this(id, name, description, announcement, new ArrayList<String>(), ownerID, new HashSet<String>(),
      new HashSet<String>(), new HashSet<String>(), new HashSet<String>());
  }

  public Community(String id, String name, String description, String ownerID) {
    this(id, name, description, "", ownerID);
  }

  public Collection<String> getCommunities() {
    return this.communityIDs;
  }

  public void addCommunityReference(String communityID) {
    this.communityIDs.add(communityID);
  }

  public void addCommunityReferences(Collection<String> communityIDs) {
    this.communityIDs.addAll(communityIDs);
  }

  public void removeCommunityReference(String communityID) {
    this.communityIDs.remove(communityID);
  }

  public void removeCommunityReferences(Collection<String> communityIDs) {
    this.communityIDs.removeAll(communityIDs);
  }

  public void clearCommunities() {
    this.communityIDs.clear();
  }

  public Collection<String> getClubs() {
    return this.clubIDs;
  }

  public void addClubReference(String clubID) {
    this.clubIDs.add(clubID);
  }

  public void addClubReferences(Collection<String> clubIDs) {
    this.clubIDs.addAll(clubIDs);
  }

  public void removeClubReference(String clubID) {
    this.clubIDs.remove(clubID);
  }

  public void removeClubReferences(Collection<String> clubIDs) {
    this.clubIDs.removeAll(clubIDs);
  }

  public void clearClubs() {
    this.clubIDs.clear();
  }
  
}