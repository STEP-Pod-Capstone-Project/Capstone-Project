package com.google.sps;

import com.google.sps.data.Club;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class ClubTest {
  private Club club;

  private static final String NAME = "name";

  private static final String DESCRIPTION = "description";

  private static final String OWNER = "1";

  private static final String ORIGINAL_BOOK = "originalBook";
  private static final String NEW_BOOK = "newBook";

  @Before
  public void setUp() {
    club = new Club("1", NAME, DESCRIPTION, OWNER, ORIGINAL_BOOK);
  }
  
  @Test
  public void testConstructor() {
    Assert.assertEquals(club.getID(), "1");
    Assert.assertEquals(club.getName(), NAME);
    Assert.assertEquals(club.getDescription(), DESCRIPTION);
    Assert.assertEquals(club.getAnnouncement(), "");
    Assert.assertEquals(club.getPosts().size(), 0);
    Assert.assertEquals(club.getOwnerID(), OWNER);
    Assert.assertEquals(club.getMemberIDs().size(), 0);
    Assert.assertEquals(club.getInviteIDs().size(), 0);
    Assert.assertEquals(club.getGbookID(), ORIGINAL_BOOK);
  }

  @Test 
  public void testBook() {
    club.setGbookID(NEW_BOOK);
    Assert.assertEquals(club.getGbookID(), NEW_BOOK);
  }

}