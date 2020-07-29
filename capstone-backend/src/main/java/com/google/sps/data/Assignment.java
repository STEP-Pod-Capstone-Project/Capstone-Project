package com.google.sps.data;

import java.util.ArrayList;
import java.util.List;


public class Assignment extends BaseEntity {
  private String text;
  private final String clubID;
  private final String whenCreated;
  private String whenDue;
  private List<String> completedIDs;

  public Assignment(String text, String clubID, String whenCreated, String whenDue, List<String> completedIDs) {
    this.text = text;
    this.clubID = clubID;
    this.whenCreated = whenCreated;
    this.whenDue = whenDue;
    this.completedIDs = completedIDs;
  }

  public Assignment() {
    this("", "", "", "", new ArrayList<>());
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

  public String getWhenCreated() {
    return whenCreated;
  }

  public String getWhenDue() {
    return whenDue;
  }

  public void setWhenDue(String whenDue) {
    this.whenDue = whenDue;
  }

  public List<String> getCompletedIDs() {
    return completedIDs;
  }

  public void setCompletedIDs(List<String> completedIDs) {
    this.completedIDs = completedIDs;
  }
}
