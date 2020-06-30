package com.google.sps.data;

import java.util.Collection;
import java.util.HashSet;

/**
 * The Book List object stores userID and bookshelfID.
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
  private String bookshelfID;
  private Collection<String> collaboratorsIDs;

  public BookList(String userID, String bookshelfID, Collection<String> collaboratorsIDs, String id) {
    this.userID = userID;
    this.bookshelfID = bookshelfID;
    this.collaboratorsIDs = collaboratorsIDs;
    this.id = id;
  }

  public BookList(String userID, String bookshelfID, Collection<String> collaboratorsIDs) {
    this(userID, bookshelfID, collaboratorsIDs, "");
  }

  public BookList(String userID, String bookshelfID){
    this(userID, bookshelfID, new HashSet<String>(), "");
  }

  public void setBookshelf(String bookshelfID) {
    this.bookshelfID = bookshelfID;
  }

  public void setUserID(String userID) {
    this.userID = userID;
  }

  public void setCollaboratorsIDs(Collection<String> collaboratorsIDs) {
    this.collaboratorsIDs = collaboratorsIDs;
  }

  public void setID(String id){
    this.id = id;
  }

  public boolean isEmpty() {
    return userID.equals("") && bookshelfID.equals("") && collaboratorsIDs.isEmpty();
  }

  public void clear() {
    userID = "";
    bookshelfID = "";
    collaboratorsIDs.clear();
  }

  public String getUserID() {
    return userID;
  }

  public String getBookshelfID() {
    return bookshelfID;
  }

  public Collection<String> getCollaboratorsIDs() {
    return collaboratorsIDs;
  }

  public void addCollaborator(String collaboratorID){
    collaboratorsIDs.add(collaboratorID);
  }

  public boolean removeCollaborator(String collaboratorID){
    return collaboratorsIDs.remove(collaboratorID);
  }

  public boolean containsCollaborator(String collaboratorID){
    return collaboratorsIDs.contains(collaboratorID);
  }

  public String getId() {
    return this.id;
  }
}