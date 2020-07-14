package com.google.sps.data;


public class Comment extends BaseEntity {
  private final String assignmentID;
  private final String text;
  private final String userID;
  private final String whenCreated;

  public Comment(String assignmentID, String text, String userID, String whenCreated) {
    this.assignmentID = assignmentID;
    this.text = text;
    this.userID = userID;
    this.whenCreated = whenCreated; 
  }

  public Comment() {
    this("", "", "", "");
  }

  public String getText() {
    return text;
  }

  public String getUserID() {
    return userID;
  }

  public String getWhenCreated() {
    return whenCreated;
  }
}
