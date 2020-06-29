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

  private static final String ID_ONE = "idOne";
  private static final String ID_TWO = "idTwo";
  private static final String ID_THREE = "idThree";
  private static final String ID_FOUR = "idFour";
  private static final String ID_FIVE = "idFive";

  private static final String EMAIL_ONE = "emailOne";
  private static final String EMAIL_TWO = "emailTwo";
  private static final String NEW_EMAIL = "newEmail";

  private static final String USERNAME_ONE = "usernameOne";
  private static final String USERNAME_TWO = "usernameTwo";
  private static final String NEW_USERNAME = "newUsername";


  @Before
  public void setUp() {
    userOne = new User(ID_ONE, EMAIL_ONE, USERNAME_ONE);
    userTwo = new User(ID_TWO, EMAIL_TWO, USERNAME_TWO);
  }
  
  @Test
  public void testConstructor() {
    Assert.assertEquals(userOne.getID(), ID_ONE);
    Assert.assertEquals(userOne.getEmail(), EMAIL_ONE);
    Assert.assertEquals(userOne.getUsername(), USERNAME_ONE);
    Assert.assertEquals(userOne.getFriends().size(), 0);

    Assert.assertEquals(userTwo.getID(), ID_TWO);
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
    userOne.addFriend(ID_THREE);
    Assert.assertEquals(userOne.getFriends().size(), 1);
    for (String l : userOne.getFriends()) {
      Assert.assertEquals(l, ID_THREE);
    }
    Assert.assertEquals(userTwo.getFriends().size(), 0);
  }

  @Test 
  public void testClearFriends() {
    userOne.addFriend(ID_THREE);
    userOne.addFriend(ID_FOUR);
    userOne.addFriend(ID_FIVE);
    Assert.assertEquals(userOne.getFriends().size(), 3);
    userOne.clearFriends();
    Assert.assertEquals(userOne.getFriends().size(), 0);
  }
}
