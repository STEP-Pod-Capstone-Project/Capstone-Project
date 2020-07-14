package com.google.sps.data;

import java.util.ArrayList;
import java.util.List; 

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

  private static final String OWNER = "owner";
  
  private static final String ORIGINAL_BOOK = "originalBook";
  private static final String NEW_BOOK = "newBook";

  @Before
  public void setUp() {
    club = new Club(NAME, DESCRIPTION, OWNER, ORIGINAL_BOOK);
  }
  
  @Test
  public void testConstructor() {
    Assert.assertEquals(club.getGbookID(), ORIGINAL_BOOK);
  }

  @Test 
  public void testBook() {
    club.setGbookID(NEW_BOOK);
    Assert.assertEquals(club.getGbookID(), NEW_BOOK);
  }
}
