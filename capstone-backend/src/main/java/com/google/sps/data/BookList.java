package com.google.sps.data;

import java.util.ArrayList;

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
  private String bookshelfID;
  private Long userID;
  private ArrayList<Long> collaboratorsIDs;

  public BookList(Long userID, String bookshelfID, ArrayList<Long> collaboratorsIDs, Long id) {
    this.userID = userID;
    this.bookshelfID = bookshelfID;
    this.collaboratorsIDs = collaboratorsIDs;
    this.id = id;
  }

  public BookList(Long userID, String bookshelfID, ArrayList<Long> collaboratorsIDs) {
    this(userID, bookshelfID, collaboratorsIDs, null);
  }

  public BookList(Long userID, String bookshelfID){
    this(userID, bookshelfID, null, null);
  }

  public void setBookshelf(String bookshelfID) {
    this.bookshelfID = bookshelfID;
  }

  public void setUserID(Long userID) {
    this.userID = userID;
  }

  public void setCollaboratorsIDs(ArrayList<Long> collaboratorsIDs) {
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

  public ArrayList<Long> getCollaboratorsIDs() {
    return collaboratorsIDs;
  }

  public void addCollaborator(Long collaborator){
    collaboratorsIDs.add(collaborator);
  }

  public void addCollaborator(int index, Long collaborator){
    collaboratorsIDs.add(index, collaborator);
  }

  public boolean removeCollaborator(Long collaborator){
    return collaboratorsIDs.remove(collaborator);
  }

  public Long removeCollaborator(int index){
    return collaboratorsIDs.remove(index);
  }

  public Long getId() {
    return this.id;
  }
}