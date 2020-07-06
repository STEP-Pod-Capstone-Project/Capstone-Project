package com.google.sps.data;

import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

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

  private final String id = UUID.randomUUID().toString();
  private final String userID;
  private List<String> gbookIDs;
  private List<String> collaboratorsIDs;

  public BookList(String userID, List<String> gbookIDs, List<String> collaboratorsIDs) {
    this.userID = userID;
    this.gbookIDs = gbookIDs;
    this.collaboratorsIDs = collaboratorsIDs;
  }

  public BookList(String userID, List<String> gbookIDs) {
    this(userID, gbookIDs, new ArrayList<String>());
  }

  public void setGbookIDs(List<String> gbookIDs) {
    this.gbookIDs = gbookIDs;
  }

  public void setCollaboratorsIDs(List<String> collaboratorsIDs) {
    this.collaboratorsIDs = collaboratorsIDs;
  }

  public boolean isEmpty() {
    return gbookIDs.isEmpty() && collaboratorsIDs.isEmpty();
  }

  public void clear() {
    gbookIDs.clear();
    collaboratorsIDs.clear();
  }

  public String getUserID() {
    return userID;
  }

  public String getId() {
    return this.id;
  }

  public List<String> getGbookIDs() {
    return gbookIDs;
  }

  public void addGbook(String gbookID) {
    gbookIDs.add(gbookID);
  }

  public boolean removeGbook(String gbookID) {
    return gbookIDs.remove(gbookID);
  }

  public boolean containsGbook(String gbookID) {
    return gbookIDs.contains(gbookID);
  }

  public List<String> getCollaboratorsIDs() {
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
}