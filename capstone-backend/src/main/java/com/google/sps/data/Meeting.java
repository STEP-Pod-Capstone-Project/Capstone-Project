package com.google.sps.data;

import java.util.ArrayList;
import java.util.List;

public class Meeting extends BaseEntity {
  private final String eventID;
  private final String clubID;
  private final String organizerID;
  private String summary;
  private String location;
  private String description;
  private String startDateTime;
  private String endDateTime;
  private List<String> attendeeEmails;
  private String organizerEmail;
  private String recurrence;
  private String timezone; 

  public Meeting(String eventID, String clubID, String organizerID, String summary, String location,
      String description, String startDateTime, String endDateTime, 
      List<String> attendeeEmails, String organizerEmail, String recurrence, 
      String timezone) {
    this.eventID = eventID;
    this.clubID = clubID;
    this.organizerID = organizerID;
    this.summary = summary;
    this.location = location;
    this.description = description;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.attendeeEmails = attendeeEmails;
    this.organizerEmail = organizerEmail;
    this.recurrence = recurrence;
    this.timezone = timezone;
  }

  public Meeting(String eventID, String clubID, String organizerID, String summary, String startDateTime, 
      String endDateTime, List<String> attendeeEmails, String organizerEmail) {
    this(eventID, clubID, organizerID, summary, "", "", startDateTime, endDateTime, attendeeEmails, organizerEmail, "", "");    
  }

  public Meeting() {
    this("", "", "", "", "", "", new ArrayList<>(), "");
  }

  public String getEventID() {
    return eventID;
  }

  public String getClubID() {
    return clubID;
  }

  public String getOrganizerID() {
    return organizerID;
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

  public List<String> getAttendeeEmails() {
    return attendeeEmails;
  }

  public void setAttendeeEmails(List<String> attendeeEmails) {
    this.attendeeEmails = attendeeEmails;
  }

  public String getOrganizerEmail() {
    return organizerEmail;
  }

  public void setOrganizerEmail(String organizerEmail) {
    this.organizerEmail = organizerEmail;
  }

  public String getRecurrence() {
    return recurrence;
  }

  public void setRecurrence(String recurrence) {
    this.recurrence = recurrence;
  }

  public String getTimezone() {
    return timezone;
  }

  public void setTimezone(String timezone) {
    this.timezone = timezone;
  }
}
