package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.google.sps.data.Community;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class CommunityTest {
  private Community community;

  private static final String NAME = "name";
  private static final String DESCRIPTION = "description";
  private static final String OWNER = "1";

  private static final String GROUP_ONE_ID = "abc123";
  private static final String GROUP_TWO_ID = "def456";
  private static final String GROUP_THREE_ID = "ghi789";

  private static final String POST_ONE = "postOne";
  private static final String POST_TWO = "postTwo";

  @Before
  public void setUp() {
    community = new Community(NAME, DESCRIPTION, OWNER);
  }

  @Test
  public void testConstructor() {
    Assert.assertEquals(community.getName(), NAME);
    Assert.assertEquals(community.getDescription(), DESCRIPTION);
    Assert.assertEquals(community.getPosts().size(), 0);
    Assert.assertEquals(community.getOwnerID(), OWNER);
    Assert.assertEquals(community.getMemberIDs().size(), 0);
    Assert.assertEquals(community.getInviteIDs().size(), 0);
    Assert.assertEquals(community.getCommunityIDs().size(), 0);
    Assert.assertEquals(community.getClubIDs().size(), 0);
  }

  @Test
  public void testPost() {
    community.addPost(POST_ONE);

    Assert.assertEquals(community.getPosts().size(), 1);

    List<String> list = new ArrayList<>(community.getPosts());
    Assert.assertEquals(list, Arrays.asList(POST_ONE));

    community.addPost(POST_TWO);

    Assert.assertEquals(community.getPosts().size(), 2);
    list = new ArrayList<>(community.getPosts());
    Assert.assertEquals(list, Arrays.asList(POST_ONE, POST_TWO));
  }

  @Test
  public void testClearPost() {
    community.addPost(POST_ONE);
    community.addPost(POST_TWO);

    Assert.assertEquals(community.getPosts().size(), 2);

    community.clearPosts();

    Assert.assertEquals(community.getPosts().size(), 0);
  }

  @Test
  public void testAddCommunityReference() {
    community.addCommunityReference(GROUP_ONE_ID);
    int expectedSize = 1;

    Assert.assertTrue(community.getCommunityIDs().contains(GROUP_ONE_ID));
    Assert.assertEquals(expectedSize, community.getCommunityIDs().size());
  }

  @Test
  public void testAddCommunityReferencesFromCollection() {
    List<String> references = new ArrayList<>(Arrays.asList(GROUP_ONE_ID, GROUP_TWO_ID));
    int expectedSize = references.size();

    community.addCommunityReferences(references);

    Assert.assertEquals(expectedSize, community.getCommunityIDs().size());
  }

  @Test
  public void testRemoveCommunityReferenceOnlyElement() {
    int expectedSize = 0;

    community.addCommunityReference(GROUP_TWO_ID);
    community.removeCommunityReference(GROUP_TWO_ID);

    Assert.assertEquals(expectedSize, community.getCommunityIDs().size());
    Assert.assertFalse(community.getCommunityIDs().contains(GROUP_TWO_ID));
  }

  @Test
  public void testRemoveCommunityReferenceEmptyCollection() {
    int expectedSize = 0;

    community.removeCommunityReference(GROUP_TWO_ID);

    Assert.assertEquals(expectedSize, community.getCommunityIDs().size());
  }

  @Test
  public void testRemoveCommunityReferenceNoMatchingElementInCollection() {
    int expectedSize = 1;

    community.addCommunityReference(GROUP_TWO_ID);
    community.removeCommunityReference(GROUP_ONE_ID);

    List<String> groupList = new ArrayList<>(community.getCommunityIDs());
    Assert.assertTrue(groupList.contains(GROUP_TWO_ID));
    Assert.assertEquals(expectedSize, groupList.size());
  }

  @Test
  public void testRemoveCommunityReferences() {
    List<String> referencesAdd = new ArrayList<>(Arrays.asList(GROUP_ONE_ID, GROUP_TWO_ID, GROUP_THREE_ID));
    List<String> referencesRemove = new ArrayList<>(Arrays.asList(GROUP_TWO_ID, GROUP_THREE_ID));
    int expectedSize = 1;

    community.addCommunityReferences(referencesAdd);
    community.removeCommunityReferences(referencesRemove);

    List<String> groupList = new ArrayList<>(community.getCommunityIDs());
    Assert.assertTrue(groupList.contains(GROUP_ONE_ID));
    Assert.assertEquals(expectedSize, groupList.size());
  }

  @Test
  public void testClearCommunities() {
    List<String> referencesAdd = new ArrayList<>(Arrays.asList(GROUP_ONE_ID, GROUP_TWO_ID, GROUP_THREE_ID));
    int expectedSize = 0;

    community.addClubReferences(referencesAdd);
    community.clearCommunities();

    Assert.assertEquals(expectedSize, community.getCommunityIDs().size());
  }

  @Test
  public void testAddClubReference() {
    community.addClubReference(GROUP_ONE_ID);
    int expectedSize = 1;

    Assert.assertTrue(community.getClubIDs().contains(GROUP_ONE_ID));
    Assert.assertEquals(expectedSize, community.getClubIDs().size());
  }

  @Test
  public void testAddClubReferencesFromCollection() {
    List<String> references = new ArrayList<>(Arrays.asList(GROUP_ONE_ID, GROUP_TWO_ID));
    int expectedSize = references.size();

    community.addClubReferences(references);

    Assert.assertEquals(expectedSize, community.getClubIDs().size());
  }

  @Test
  public void testRemoveClubReferenceOnlyElement() {
    int expectedSize = 0;

    community.addClubReference(GROUP_TWO_ID);
    community.removeClubReference(GROUP_TWO_ID);

    Assert.assertEquals(expectedSize, community.getClubIDs().size());
    Assert.assertFalse(community.getClubIDs().contains(GROUP_TWO_ID));
  }

  @Test
  public void testRemoveClubReferenceEmptyCollection() {
    int expectedSize = 0;

    community.removeClubReference(GROUP_TWO_ID);

    Assert.assertEquals(expectedSize, community.getClubIDs().size());
  }

  @Test
  public void testRemoveClubReferenceNoMatchingElementInCollection() {
    int expectedSize = 1;

    community.addClubReference(GROUP_TWO_ID);
    community.removeClubReference(GROUP_ONE_ID);

    List<String> groupList = new ArrayList<>(community.getClubIDs());
    Assert.assertTrue(groupList.contains(GROUP_TWO_ID));
    Assert.assertEquals(expectedSize, groupList.size());
  }

  @Test
  public void testRemoveClubReferences() {
    List<String> referencesAdd = new ArrayList<>(Arrays.asList(GROUP_ONE_ID, GROUP_TWO_ID, GROUP_THREE_ID));
    List<String> referencesRemove = new ArrayList<>(Arrays.asList(GROUP_TWO_ID, GROUP_THREE_ID));
    int expectedSize = 1;

    community.addClubReferences(referencesAdd);
    community.removeClubReferences(referencesRemove);

    List<String> groupList = new ArrayList<>(community.getClubIDs());
    Assert.assertTrue(groupList.contains(GROUP_ONE_ID));
    Assert.assertEquals(expectedSize, groupList.size());
  }

  @Test
  public void testClearClubs() {
    List<String> referencesAdd = new ArrayList<>(Arrays.asList(GROUP_ONE_ID, GROUP_TWO_ID, GROUP_THREE_ID));
    int expectedSize = 0;

    community.addClubReferences(referencesAdd);
    community.clearClubs();

    Assert.assertEquals(expectedSize, community.getClubIDs().size());
  }

}