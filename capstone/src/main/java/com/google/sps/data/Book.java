
package com.google.sps.data;
 
/**
 * Class representing a Book.
 *
 * Note: The private variables in this class are converted into JSON.
 */
public final class Book {
    
  private final long id;
  private final long userID;
  private final String gbookID;
  private boolean hasRead;
  private int rating;
  private String review;
 
  /** Constructor for a Book Object */
  public Book(long id, long userID, String gbookID, boolean hasRead, int rating, String review){
    this.id = id;
    this.userID = userID;
    this.gbookID = gbookID;
    this.hasRead = hasRead;
    this.rating = rating;
    this.review = review;
  }
 
  /** Constructor for a Book Object */
  public Book(long id, long userID, String gbookID){
    Book(id, userID, gbookID, false, -1, null)
  }
 
  public long getID() {
    return id;
  }
 
  public void setID(long id) {
    this.id = id;
  }
 
  public long getUserID() {
    return this.userID;
  }
 
  public void setUserID(long userID) {
    this.userID = userID;
  }
 
  public long getGbookID() {
    return this.gbookID;
  }
 
  public void setGbookID(long gbookID) {
    this.gbookID = gbookID;
  }
 
  public boolean hasRead() {
    return this.hasRead;
  }
 
  public boolean setHasRead(boolean hasRead) {
    this.hasRead = hasRead;
  }
 
  public int getRating() {
    return rating;
  }
 
  public void setRating(int rating) {
    this.rating = rating;
  }
 
  public String getReview() {
    return review;
  }
 
  public void setReview(String review) {
    this.review = review;
  }
 
}
