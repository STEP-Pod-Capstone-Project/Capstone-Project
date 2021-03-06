package com.google.sps.data;

import java.util.List;
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
public final class BookList extends BaseEntity {

  private final String userID;
  private String name;
  private List<String> gbookIDs;
  private List<String> collaboratorsIDs;

  public BookList(String userID, String name, List<String> gbookIDs, List<String> collaboratorsIDs) {
    this.userID = userID;
    this.name = name;
    this.gbookIDs = gbookIDs;
    this.collaboratorsIDs = collaboratorsIDs;
  }

  public BookList(String userID, String name, List<String> gbookIDs) {
    this(userID, name, gbookIDs, new ArrayList<String>());
  }

  public BookList(String userID, String name){
    this(userID, name, new ArrayList<String>(), new ArrayList<String>());
  }

  public BookList(){
    userID = "";
    name = "";
    gbookIDs = new ArrayList<String>();
    collaboratorsIDs = new ArrayList<String>();
  }

  public void setName(String name){
    this.name = name;
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

  public String getName() {
    return name;
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