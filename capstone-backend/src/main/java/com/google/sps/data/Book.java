package com.google.sps.data;


public class Book extends BaseEntity {
    
  private final String userID;
  private final String gbookID;
  private int rating;
  private String review;

 
  public Book(String userID, String gbookID, int rating, String review) {
    this.userID = userID;
    this.gbookID = gbookID;
    this.rating = rating;
    this.review = review;
  }
 
  public Book(String userID, String gbookID) {
    this(userID, gbookID, -1, "");
  }

  public Book() {
    this("", "");
  }
 
  public String getUserID() {
    return this.userID;
  }

  public String getGbookID() {
    return this.gbookID;
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
