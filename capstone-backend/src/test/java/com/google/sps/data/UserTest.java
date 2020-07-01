package com.google.sps.data;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class UserTest {
  private User userOne;
  private User userTwo;

  private final String ID_ONE = "123456789";
  private final String ID_TWO = "987654321";

  private final String EMAIL_ONE = "emailOne";
  private final String EMAIL_TWO = "emailTwo";

  private final String FULL_NAME_ONE = "fullNameOne";
  private final String FULL_NAME_TWO = "fullNameTwo";

  private JsonObject TOKEN_OBJ_ONE = new JsonObject();


  private String FRIEND_ONE = "friendOne";
  private String FRIEND_TWO = "friendTwo";
  private String FRIEND_THREE = "friendThree";

  @Before
  public void setUp() {

    TOKEN_OBJ_ONE.add("access_token", JsonParser.parseString("test_access_token"));
    TOKEN_OBJ_ONE.add("id_token", JsonParser.parseString("test_id_token_one"));

    userOne = new User(ID_ONE, EMAIL_ONE, FULL_NAME_ONE, TOKEN_OBJ_ONE);
    userTwo = new User(ID_TWO, EMAIL_TWO, FULL_NAME_TWO);
  }

  @Test
  public void testConstructor() {
    assertEquals(ID_ONE, userOne.getID());
    assertEquals(EMAIL_ONE, userOne.getEmail());
    assertEquals(FULL_NAME_ONE, userOne.getfullName());
    assertEquals(TOKEN_OBJ_ONE, userOne.getTokenObj());
    assertTrue(userOne.getFriends().isEmpty());

    assertEquals(ID_TWO, userTwo.getID());
    assertEquals(EMAIL_TWO, userTwo.getEmail());
    assertEquals(FULL_NAME_TWO, userTwo.getfullName());
    assertEquals("{}", userTwo.getTokenObj().toString());
    assertTrue(userTwo.getFriends().isEmpty());
  }

  @Test
  public void testSetters() {
    userTwo.setTokenObj(TOKEN_OBJ_ONE);
    assertEquals(TOKEN_OBJ_ONE, userTwo.getTokenObj());
  }

  @Test
  public void testAddFriend() {
    userOne.addFriend(FRIEND_ONE);
    userTwo.addFriend(FRIEND_TWO);

    assertFalse(userOne.getFriends().isEmpty());
    assertFalse(userTwo.getFriends().isEmpty());

    assertEquals(FRIEND_ONE, userOne.getFriends().toArray()[0]);
    assertEquals(FRIEND_TWO, userTwo.getFriends().toArray()[0]);
  }

  @Test
  public void testClearFriends() {
    userOne.addFriend(FRIEND_ONE);
    userOne.addFriend(FRIEND_TWO);
    userOne.addFriend(FRIEND_THREE);
    assertTrue(userOne.getFriends().contains(FRIEND_ONE));
    assertTrue(userOne.getFriends().contains(FRIEND_TWO));
    assertTrue(userOne.getFriends().contains(FRIEND_THREE));

    userOne.clearFriends();
    assertTrue(userOne.getFriends().isEmpty());
  }
}
