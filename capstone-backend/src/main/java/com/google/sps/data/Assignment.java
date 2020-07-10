package com.google.sps.data;

import java.util.ArrayList;
import java.util.List;

public class Assignment extends BaseEntity {
  private String text;
  private final String clubID;
  private List<Comment> comments;
  private final String whenCreated;
  private String whenDue;

  public Assignment(String text, String clubID, List<Comment> comments, String whenCreated,
      String whenDue) {
    this.text = text;
    this.clubID = clubID;
    this.comments = comments;
    this.whenCreated = whenCreated;
    this.whenDue = whenDue;
  }

  public Assignment(String text, String clubID, String whenCreated, String whenDue) {
    this(text, clubID, new ArrayList<Comment>(), whenCreated, whenDue);
  }

  public Assignment() {
    this("", "", "", "");
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public String getClubID() {
    return clubID;
  }

  public List<Comment> getComments() {
    return comments;
  }

  public void setComments(ArrayList<Comment> comments) {
    this.comments = comments;
  }

  public void addComment(Comment comment) {
    this.comments.add(comment);
  }

  public void removeComment(Comment comment) {
    this.comments.remove(comment);
  }

  public String getWhenCreated() {
    return whenCreated;
  }

  public String getWhenDue() {
    return whenDue;
  }

  public void setWhenDue(String whenDue) {
    this.whenDue = whenDue;
  }
}
