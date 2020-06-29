package com.google.sps.data;
 

public class Book {
    
  private final String id;
  private final String userID;
  private final String gbookID;
  private boolean hasRead;
  private int rating;
  private String review;
 
  public Book(String id, String userID, String gbookID, boolean hasRead, int rating, String review) {
    this.id = id;
    this.userID = userID;
    this.gbookID = gbookID;
    this.hasRead = hasRead;
    this.rating = rating;
    this.review = review;
  }
 
  public Book(String id, String userID, String gbookID) {
    this(id, userID, gbookID, false, -1, "");
  }

  public Book() {
    this("", "", "", false, -1, "");
  }
  public String getID() {
    return id;
  }
 
  public String getUserID() {
    return this.userID;
  }
 
  public String getGbookID() {
    return this.gbookID;
  }
 
  public boolean hasRead() {
    return this.hasRead;
  }

  public void read(int rating, String review) {
    hasRead = true;
    this.rating = rating;
    this.review = review;
  }
 
  public void unRead() {
    hasRead = false;
    rating = -1;
    review = "";
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
