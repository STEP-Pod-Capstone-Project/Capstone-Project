package com.google.sps.data;

/**
 * Class representing data in a Volume retrieved from the Google API.
 *
 * Note: The private variables in this class are converted into JSON.
 */
public final class VolumeData {
    
  private final String id;
  private final String title;
  private final String[] authors;
  private final String description;
  private final String thumbnailLink;
 
  /** Constructor for a VolumeData Object */
  public VolumeData(String id, String title, String[] authors, String description, String thumbnailLink){
    this.id = id;
    this.title = title;
    this.authors = authors;
    this.description = description;
    this.thumbnailLink = thumbnailLink;
  }

  public String getID() {
    return id;
  }
 
  public String getTitle() {
    return this.title;
  }
 
  public String[] getAuthors() {
    return this.authors;
  }
 
  public String getDescription() {
    return this.description;
  }

  public String getThumbnailLink() {
    return this.thumbnailLink;
  }
}
