package com.google.sps.data;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/** Contains tests for the VolumeData model. */
@RunWith(JUnit4.class)
public final class VolumeDataTest {
  private VolumeData volumeOne;
  private VolumeData volumeTwo;

  private static final String ID = "ABCD";
  private static final String TITLE = "BookName";
  private static final String[] AUTHORS_1 = { "Andy", "Robert" };
  private static final String[] AUTHORS_2 = {};
  private static final String DESCRIPTION = "desc";
  private static final double AVERAGE_RATING = 3.5;
  private static final String CANONICAL_VOLUME_LINK = "canonlink.com";
  private static final String THUMBNAIL_LINK = "google.com";
  private static final String WEB_READER_LINK = "webreaderlink.com";

  @Before
  public void setUp() {
    volumeOne = new VolumeData(ID, TITLE, AUTHORS_1, DESCRIPTION, AVERAGE_RATING, CANONICAL_VOLUME_LINK, THUMBNAIL_LINK,
        WEB_READER_LINK);
    volumeTwo = new VolumeData(ID, TITLE, AUTHORS_2, DESCRIPTION, AVERAGE_RATING, CANONICAL_VOLUME_LINK, THUMBNAIL_LINK,
        WEB_READER_LINK);
  }

  @Test
  public void testConstructor() {
    Assert.assertEquals(volumeOne.getID(), ID);
    Assert.assertEquals(volumeOne.getTitle(), TITLE);
    Assert.assertArrayEquals(volumeOne.getAuthors(), AUTHORS_1);
    Assert.assertEquals(volumeOne.getDescription(), DESCRIPTION);
    Assert.assertEquals(volumeOne.getAvgRating(), AVERAGE_RATING, 0);
    Assert.assertEquals(volumeOne.getCanonicalVolumeLink(), CANONICAL_VOLUME_LINK);
    Assert.assertEquals(volumeOne.getThumbnailLink(), THUMBNAIL_LINK);
    Assert.assertEquals(volumeOne.getWebReaderLink(), WEB_READER_LINK);


    Assert.assertEquals(volumeTwo.getID(), ID);
    Assert.assertEquals(volumeTwo.getTitle(), TITLE);
    Assert.assertArrayEquals(volumeTwo.getAuthors(), AUTHORS_2);
    Assert.assertEquals(volumeTwo.getDescription(), DESCRIPTION);
    Assert.assertEquals(volumeTwo.getAvgRating(), AVERAGE_RATING, 0);
    Assert.assertEquals(volumeTwo.getCanonicalVolumeLink(), CANONICAL_VOLUME_LINK);
    Assert.assertEquals(volumeTwo.getThumbnailLink(), THUMBNAIL_LINK);
    Assert.assertEquals(volumeTwo.getWebReaderLink(), WEB_READER_LINK);
  }
}
