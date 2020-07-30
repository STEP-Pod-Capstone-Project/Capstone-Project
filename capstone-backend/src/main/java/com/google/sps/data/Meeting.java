package com.google.sps.data;

import java.util.ArrayList;
import java.util.List;

public class Meeting extends BaseEntity {
  private final String clubID;
  private String summary;
  private String location;
  private String description;
  private String startDateTime;
  private String endDateTime;
  private List<String> eventAttendees;
  private String organizerEmail;
  private String organizerName;

  public Meeting(String clubID, String summary, String location, String description, 
      String startDateTime, String endDateTime, List<String> eventAttendees, 
      String organizerEmail, String organizerName) {
    this.clubID = clubID;
    this.summary = summary;
    this.location = location;
    this.description = description;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.eventAttendees = eventAttendees;
    this.organizerEmail = organizerEmail;
    this.organizerName = organizerName;    
  }

  public Meeting(String clubID, String summary, String startDateTime, String endDateTime, 
      List<String> eventAttendees, String organizerEmail, String organizerName) {
    this(clubID, summary, "", "", startDateTime, endDateTime, eventAttendees, organizerEmail, organizerName);    
  }

  public Meeting() {
    this("", "", "", "", new ArrayList<>(), "", "");
  }

  public String getClubID() {
    return clubID;
  }

  public String getSummary() {
    return summary;
  }

  public void setSummary(String summary) {
    this.summary = summary;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getStartDateTime() {
    return startDateTime;
  }

  public void setStartDateTime(String startDateTime) {
    this.startDateTime = startDateTime;
  }

  public String getEndDateTime() {
    return endDateTime;
  }

  public void setEndDateTime(String endDateTime) {
    this.endDateTime = endDateTime;
  }

  public List<String> getEventAttendees() {
    return eventAttendees;
  }

  public void setEventAttendees(List<String> eventAttendees) {
    this.eventAttendees = eventAttendees;
  }

  public String getOrganizerEmail() {
    return organizerEmail;
  }

  public void setOrganizerEmail(String organizerEmail) {
    this.organizerEmail = organizerEmail;
  }

  public String getOrganizerName() {
    return organizerName;
  }

  public void setOrganizerName(String organizerName) {
    this.organizerName = organizerName;
  }
}
