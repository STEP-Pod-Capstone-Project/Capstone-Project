package com.google.sps;

import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import com.google.sps.data.Book;

/** */
@RunWith(JUnit4.class)
public final class BookTest {
  private Book bookOne;
  private Book bookTwo;
  
  private static final String ID_ONE = "idOne";
  private static final String ID_TWO = "idTwo";

  private static final String USER_ID_ONE = "userIdOne";
  private static final String USER_ID_TWO = "UserIdTwo";

  private static final String ORIGINAL_REVIEW = "originalReview";
  private static final String NEW_REVIEW = "newReview";

  private static final String GBOOK_ID1 = "gbookID_1";
  private static final String GBOOK_ID2 = "gbookID_2";


  @Before
  public void setUp() {
    bookOne = new Book(ID_ONE, USER_ID_ONE, GBOOK_ID1, true, 3, ORIGINAL_REVIEW);
    bookTwo = new Book(ID_TWO, USER_ID_TWO, GBOOK_ID2);
  }
  
  @Test
  public void testConstructor() {
    Assert.assertEquals(bookOne.getID(), ID_ONE);
    Assert.assertEquals(bookOne.getUserID(), USER_ID_ONE);
    Assert.assertEquals(bookOne.getGbookID(), GBOOK_ID1);
    Assert.assertEquals(bookOne.hasRead(), true);
    Assert.assertEquals(bookOne.getRating(), 3);
    Assert.assertEquals(bookOne.getReview(), ORIGINAL_REVIEW);

    Assert.assertEquals(bookTwo.getID(), ID_TWO);
    Assert.assertEquals(bookTwo.getUserID(), USER_ID_TWO);
    Assert.assertEquals(bookTwo.getGbookID(), GBOOK_ID2);
    Assert.assertEquals(bookTwo.hasRead(), false);
    Assert.assertEquals(bookTwo.getRating(), -1);
    Assert.assertEquals(bookTwo.getReview(), "");
  }

  @Test 
  public void testUnRead() {
    bookOne.unRead();
    Assert.assertEquals(bookOne.hasRead(), false);
    Assert.assertEquals(bookOne.getRating(), -1);
    Assert.assertEquals(bookOne.getReview(), "");
  }

  @Test 
  public void testRead() {
    bookTwo.read(2, NEW_REVIEW);
    Assert.assertEquals(bookTwo.hasRead(), true);
    Assert.assertEquals(bookTwo.getRating(), 2);
    Assert.assertEquals(bookTwo.getReview(), NEW_REVIEW);
  }

  @Test
  public void testRating() {
    bookOne.setRating(4);
    Assert.assertEquals(bookOne.getRating(), 4);
  }

  @Test
  public void testReview() {
    bookOne.setReview(NEW_REVIEW);
    Assert.assertEquals(bookOne.getReview(), NEW_REVIEW);
  }
}
