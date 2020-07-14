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
  private final double avgRating;
  private final String canonicalVolumeLink;
  private final String thumbnailLink;
  private final String webReaderLink;

  /** Constructor for a VolumeData Object */
  public VolumeData(String id, String title, String[] authors, String description, double avgRating,
      String canonicalVolumeLink, String thumbnailLink, String webReaderLink) {
    this.id = id;
    this.title = title;
    this.authors = authors;
    this.description = description;
    this.avgRating = avgRating;
    this.thumbnailLink = thumbnailLink;
    this.canonicalVolumeLink = canonicalVolumeLink;
    this.webReaderLink = webReaderLink;
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

  public double getAvgRating() {
    return this.avgRating;
  }

  public String getCanonicalVolumeLink() {
    return this.canonicalVolumeLink;
  }

  public String getThumbnailLink() {
    return this.thumbnailLink;
  }

  public String getWebReaderLink() {
    return this.webReaderLink;
  }
}
