package com.google.sps;

import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import com.google.sps.data.VolumeData;

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
  private static final String THUMBNAIL_LINK = "google.com";

  @Before
  public void setUp() {
    volumeOne = new VolumeData(ID, TITLE, AUTHORS_1, DESCRIPTION, THUMBNAIL_LINK);
    volumeTwo = new VolumeData(ID, TITLE, AUTHORS_2, DESCRIPTION, THUMBNAIL_LINK);
  }
  
  @Test
  public void testConstructor() {
    Assert.assertEquals(volumeOne.getID(), ID);
    Assert.assertEquals(volumeOne.getTitle(), TITLE);
    Assert.assertArrayEquals(volumeOne.getAuthors(), AUTHORS_1);
    Assert.assertEquals(volumeOne.getDescription(), DESCRIPTION);
    Assert.assertEquals(volumeOne.getThumbnailLink(), THUMBNAIL_LINK);
    
    Assert.assertEquals(volumeTwo.getID(), ID);
    Assert.assertEquals(volumeTwo.getTitle(), TITLE);
    Assert.assertArrayEquals(volumeTwo.getAuthors(), AUTHORS_2);
    Assert.assertEquals(volumeTwo.getDescription(), DESCRIPTION);
    Assert.assertEquals(volumeTwo.getThumbnailLink(), THUMBNAIL_LINK);
  }
}
