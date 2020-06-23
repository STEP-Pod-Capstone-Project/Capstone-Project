package com.google.sps.data;

import java.util.ArrayList;
import java.util.Random;

/**
 * The Book List object stores userID and bookshelfID.
 * 
 * These IDs variables are meant to be fetch from the Frontend,
 * to extract a User's data using the Google Books API.
 * 
 * Additionally, the Book List object also stores collaboratorsIDs. 
 * 
 * The 'collaboratorsIDs' variable purpose is to allow the implemation of a
 * sharing feature between Book Lists. 
 * 
 */
public class BookList {

  private final long id = new Random().nextLong();
  private String bookshelfID;
  private long userID = -1;
  private ArrayList<Long> collaboratorsIDs = new ArrayList<Long>();

  public BookList(Long userID, String bookshelfID) {
    this.userID = userID;
    this.bookshelfID = bookshelfID;
  }

  public void setBookshelf(String bookshelfID) {
    this.bookshelfID = bookshelfID;
  }

  public void setUserID(long userID) {
    this.userID = userID;
  }

  public boolean isEmpty() {
    return (userID == -1) && bookshelfID.equals("") && collaboratorsIDs.isEmpty();
  }

  public void clear() {
    userID = -1;
    bookshelfID = null;
    collaboratorsIDs.clear();    
  }

  public long getUserID() {
    return userID;
  }

  public String getBookshelfID() {
    return bookshelfID;
  }

  public ArrayList<Long> getCollaboratorsIDs() {
    return collaboratorsIDs;
  }

  public long getId() {
    return this.id;
  }
}