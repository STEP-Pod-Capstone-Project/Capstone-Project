package com.google.sps.data;

import java.util.Collection;
import java.util.HashSet;

/**
 * The Book List object stores userID and gbookIDs.
 * 
 * These IDs variables are meant to be fetch from the Frontend, to extract a
 * User's data using the Google Books API.
 * 
 * Additionally, the Book List object also stores collaboratorsIDs.
 * 
 * The 'collaboratorsIDs' variable purpose is to allow the implementation of a
 * sharing feature between Book Lists.
 * 
 */
public final class BookList {

  private String id;
  private String userID;
  private Collection<String> gbookIDs;
  private Collection<String> collaboratorsIDs;

  public BookList(String id, String userID, Collection<String> gbookIDs, Collection<String> collaboratorsIDs) {
    this.id = id;
    this.userID = userID;
    this.gbookIDs = gbookIDs;
    this.collaboratorsIDs = collaboratorsIDs;
  }

  public BookList(String userID, Collection<String> gbookIDs, Collection<String> collaboratorsIDs) {
    this("", userID, gbookIDs, collaboratorsIDs);
  }

  public BookList(String userID, Collection<String> gbookIDs) {
    this("", userID, gbookIDs, new HashSet<String>());
  }

  public void setGbookIDs(Collection<String> gbookIDs) {
    this.gbookIDs = gbookIDs;
  }

  public void setUserID(String userID) {
    this.userID = userID;
  }

  public void setCollaboratorsIDs(Collection<String> collaboratorsIDs) {
    this.collaboratorsIDs = collaboratorsIDs;
  }

  public void setID(String id) {
    this.id = id;
  }

  public boolean isEmpty() {
    return userID.equals("") && gbookIDs.isEmpty() && collaboratorsIDs.isEmpty();
  }

  public void clear() {
    userID = "";
    gbookIDs.clear();
    collaboratorsIDs.clear();
  }

  public String getUserID() {
    return userID;
  }

  public Collection<String> getGbookIDs() {
    return gbookIDs;
  }

  public void addGbook(String gbookID) {
    collaboratorsIDs.add(gbookID);
  }

  public boolean removeGbook(String gbookID) {
    return collaboratorsIDs.remove(gbookID);
  }

  public boolean containsGbook(String gbookID) {
    return collaboratorsIDs.contains(gbookID);
  }

  public Collection<String> getCollaboratorsIDs() {
    return collaboratorsIDs;
  }

  public void addCollaborator(String collaboratorID) {
    collaboratorsIDs.add(collaboratorID);
  }

  public boolean removeCollaborator(String collaboratorID) {
    return collaboratorsIDs.remove(collaboratorID);
  }

  public boolean containsCollaborator(String collaboratorID) {
    return collaboratorsIDs.contains(collaboratorID);
  }

  public String getId() {
    return this.id;
  }
}