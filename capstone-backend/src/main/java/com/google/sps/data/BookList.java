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

  private Long id;
  private Long userID;
  private String bookshelfID;
  private Collection<Long> collaboratorsIDs;

  public BookList(Long userID, String bookshelfID, Collection<Long> collaboratorsIDs, Long id) {
    this.userID = userID;
    this.bookshelfID = bookshelfID;
    this.collaboratorsIDs = collaboratorsIDs;
    this.id = id;
  }

  public BookList(Long userID, String bookshelfID, Collection<Long> collaboratorsIDs) {
    this(userID, bookshelfID, collaboratorsIDs, null);
  }

  public BookList(Long userID, String bookshelfID){
    this(userID, bookshelfID, new HashSet<Long>(), null);
  }

  public void setBookshelf(String bookshelfID) {
    this.bookshelfID = bookshelfID;
  }

  public void setUserID(Long userID) {
    this.userID = userID;
  }

  public void setCollaboratorsIDs(Collection<Long> collaboratorsIDs) {
    this.collaboratorsIDs = collaboratorsIDs;
  }

  public void setID(Long id){
    this.id = id;
  }

  public boolean isEmpty() {
    return userID == null && bookshelfID.equals("") && collaboratorsIDs.isEmpty();
  }

  public void clear() {
    userID = null;
    bookshelfID = "";
    collaboratorsIDs.clear();
  }

  public Long getUserID() {
    return userID;
  }

  public String getBookshelfID() {
    return bookshelfID;
  }

  public Collection<Long> getCollaboratorsIDs() {
    return collaboratorsIDs;
  }

  public void addCollaborator(Long collaboratorID){
    collaboratorsIDs.add(collaboratorID);
  }

  public boolean removeCollaborator(Long collaboratorID){
    return collaboratorsIDs.remove(collaboratorID);
  }

  public boolean containsCollaborator(Long collaboratorID){
    return collaboratorsIDs.contains(collaboratorID);
  }

  public Long getId() {
    return this.id;
  }
}