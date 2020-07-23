package com.google.sps.data;

import java.util.List;
import java.util.ArrayList;


public class Community extends Group {

  // ID references to other communities and clubs
  private List<String> communityIDs;
  private List<String> posts;
  private List<String> clubIDs;

  public Community(String name, String description, List<String> posts, String ownerID, 
      List<String> memberIDs, List<String> inviteIDs, List<String> requestIDs, 
      List<String> communityIDs, List<String> clubIDs) {
    super(name, description, ownerID, memberIDs, inviteIDs, requestIDs);
    this.posts = posts;
    this.communityIDs = communityIDs;
    this.clubIDs = clubIDs;
  }

  public Community(String name, String description, String ownerID) {
    this(name, description, new ArrayList<String>(), ownerID, new ArrayList<String>(),
        new ArrayList<String>(), new ArrayList<String>(), new ArrayList<String>(), 
        new ArrayList<String>());
  }

  public Community() {
    this("", "", "");
  }

  public List<String> getPosts() {
    return posts;
  }

  public void addPost(String post) {
    this.posts.add(post);
  }

  public void removePost(String post) {
    this.posts.remove(post);
  }

  public void clearPosts() {
    this.posts.clear();
  }

  public List<String> getCommunityIDs() {
    return this.communityIDs;
  }

  public void addCommunityReference(String communityID) {
    this.communityIDs.add(communityID);
  }

  public void addCommunityReferences(List<String> communityIDs) {
    this.communityIDs.addAll(communityIDs);
  }

  public void removeCommunityReference(String communityID) {
    this.communityIDs.remove(communityID);
  }

  public void removeCommunityReferences(List<String> communityIDs) {
    this.communityIDs.removeAll(communityIDs);
  }

  public void clearCommunities() {
    this.communityIDs.clear();
  }

  public List<String> getClubIDs() {
    return this.clubIDs;
  }

  public void addClubReference(String clubID) {
    this.clubIDs.add(clubID);
  }

  public void addClubReferences(List<String> clubIDs) {
    this.clubIDs.addAll(clubIDs);
  }

  public void removeClubReference(String clubID) {
    this.clubIDs.remove(clubID);
  }

  public void removeClubReferences(List<String> clubIDs) {
    this.clubIDs.removeAll(clubIDs);
  }

  public void clearClubs() {
    this.clubIDs.clear();
  }

}