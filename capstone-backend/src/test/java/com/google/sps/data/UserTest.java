package com.google.sps.data;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;

import com.google.common.collect.ImmutableMap;

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

  private final String PROFILE_IMAGE_URL_ONE = "image1.png";
  private final String PROFILE_IMAGE_URL_TWO = "image2.png";

  private final String TOKEN_ID = "tokenId";
  private final String TOKEN_TYPE = "tokenType";
  private final String ACCESS_TOKEN = "accessToken";
  private final String SCOPE = "email profile openid";
  private final String IDP_ID = "google";

  private final Map<String, String> TOKEN_OBJ = new ImmutableMap.Builder<String, String>() 
    .put("TOKEN_ID", TOKEN_ID)
    .put("TOKEN_TYPE", TOKEN_TYPE)
    .put("ACCESS_TOKEN", ACCESS_TOKEN)
    .put("SCOPE", SCOPE)
    .put("IDP_ID", IDP_ID)
    .build();
    

  private final Collection<String> FRIEND_IDs = new ArrayList<String>(
      Arrays.asList("friend_x", "friend_y", "friend_z"));

  private final String FRIEND_ONE = "friendOne";
  private final String FRIEND_TWO = "friendTwo";
  private final String FRIEND_THREE = "friendThree";

  @Before
  public void setUp() {

    userOne = new User(ID_ONE, EMAIL_ONE, FULL_NAME_ONE, PROFILE_IMAGE_URL_ONE, TOKEN_OBJ, FRIEND_IDs);

    userTwo = new User(ID_TWO, EMAIL_TWO, FULL_NAME_TWO, PROFILE_IMAGE_URL_TWO, TOKEN_OBJ);
  }

  @Test
  public void testConstructorGetters() {

    assertEquals(ID_ONE, userOne.getID());
    assertEquals(EMAIL_ONE, userOne.getEmail());
    assertEquals(FULL_NAME_ONE, userOne.getfullName());
    assertEquals(PROFILE_IMAGE_URL_ONE, userOne.getProfileImageUrl());
    assertFalse(userOne.getTokenObj().isEmpty());

    assertTrue(userOne.getTokenObj().containsValue(TOKEN_ID));
    assertTrue(userOne.getTokenObj().containsValue(TOKEN_TYPE));
    assertTrue(userOne.getTokenObj().containsValue(ACCESS_TOKEN));
    assertTrue(userOne.getTokenObj().containsValue(SCOPE));
    assertTrue(userOne.getTokenObj().containsValue(IDP_ID));

    assertFalse(userOne.getFriends().isEmpty());

    assertEquals(ID_TWO, userTwo.getID());
    assertEquals(EMAIL_TWO, userTwo.getEmail());
    assertEquals(FULL_NAME_TWO, userTwo.getfullName());
    assertEquals(PROFILE_IMAGE_URL_TWO, userTwo.getProfileImageUrl());
    assertFalse(userTwo.getTokenObj().isEmpty());

    assertTrue(userTwo.getTokenObj().containsValue(TOKEN_ID));
    assertTrue(userTwo.getTokenObj().containsValue(TOKEN_TYPE));
    assertTrue(userTwo.getTokenObj().containsValue(ACCESS_TOKEN));
    assertTrue(userTwo.getTokenObj().containsValue(SCOPE));
    assertTrue(userTwo.getTokenObj().containsValue(IDP_ID));

    assertTrue(userTwo.getFriends().isEmpty());
  }

  @Test
  public void testAddFriend() {

    userOne.addFriend(FRIEND_ONE);
    userTwo.addFriend(FRIEND_TWO);

    assertTrue(userOne.getFriends().contains(FRIEND_ONE));
    assertTrue(userTwo.getFriends().contains(FRIEND_TWO));
  }

  @Test
  public void testClearFriends() {

    assertTrue(userTwo.getFriends().isEmpty());

    userTwo.addFriend(FRIEND_ONE);
    userTwo.addFriend(FRIEND_TWO);
    userTwo.addFriend(FRIEND_THREE);
    assertTrue(userTwo.getFriends().contains(FRIEND_ONE));
    assertTrue(userTwo.getFriends().contains(FRIEND_TWO));
    assertTrue(userTwo.getFriends().contains(FRIEND_THREE));

    assertFalse(userTwo.getFriends().isEmpty());

    userTwo.clearFriends();
    assertTrue(userTwo.getFriends().isEmpty());
  }
}
