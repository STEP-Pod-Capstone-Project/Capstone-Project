package com.google.sps;

import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import com.google.sps.data.User;

/** */
@RunWith(JUnit4.class)
public final class UserTest {
  private User userOne;
  private User userTwo;

  private static final String EMAIL_ONE = "emailOne";
  private static final String EMAIL_TWO = "emailTwo";
  private static final String NEW_EMAIL = "newEmail";

  private static final String USERNAME_ONE = "usernameOne";
  private static final String USERNAME_TWO = "usernameTwo";
  private static final String NEW_USERNAME = "newUsername";

  @Before
  public void setUp() {
    userOne = new User(1, EMAIL_ONE, USERNAME_ONE);
    userTwo = new User(2, EMAIL_TWO, USERNAME_TWO);
  }

  @Test
  public void testConstructor() {
    Assert.assertEquals(userOne.getID(), 1);
    Assert.assertEquals(userOne.getEmail(), EMAIL_ONE);
    Assert.assertEquals(userOne.getUsername(), USERNAME_ONE);
    Assert.assertEquals(userOne.getFriends().size(), 0);

    Assert.assertEquals(userTwo.getID(), 2);
    Assert.assertEquals(userTwo.getEmail(), EMAIL_TWO);
    Assert.assertEquals(userTwo.getUsername(), USERNAME_TWO);
    Assert.assertEquals(userTwo.getFriends().size(), 0);
  }

  @Test
  public void testEmail() {
    userOne.setEmail(NEW_EMAIL);
    Assert.assertEquals(userOne.getEmail(), NEW_EMAIL);
    Assert.assertEquals(userTwo.getEmail(), EMAIL_TWO);
  }

  @Test
  public void testUsername() {
    userOne.setUsername(NEW_USERNAME);
    Assert.assertEquals(userOne.getUsername(), NEW_USERNAME);
    Assert.assertEquals(userTwo.getUsername(), USERNAME_TWO);
  }

  @Test
  public void testAddFriend() {
    userOne.addFriend(new Long(3));
    Assert.assertEquals(userOne.getFriends().size(), 1);
    for (Long l : userOne.getFriends()) {
      Assert.assertEquals(l, new Long(3));
    }
    Assert.assertEquals(userTwo.getFriends().size(), 0);
  }

  @Test
  public void testClearFriends() {
    userOne.addFriend(new Long(3));
    userOne.addFriend(new Long(4));
    userOne.addFriend(new Long(5));
    Assert.assertEquals(userOne.getFriends().size(), 3);
    userOne.clearFriends();
    Assert.assertEquals(userOne.getFriends().size(), 0);
  }
}
