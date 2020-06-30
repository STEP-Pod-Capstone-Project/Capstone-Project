package com.google.sps;

import com.google.sps.data.Club;
import com.google.sps.data.Group;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class GroupTest {
  private Group group;

  private static final String ORIGINAL_NAME = "originalName";
  private static final String NEW_NAME = "newName";

  private static final String ORIGINAL_DESCRIPTION = "originalDescription";
  private static final String NEW_DESCRIPTION = "newDescription";

  private static final String ANNOUNCEMENT = "announcement";

  private static final String POST_ONE = "postOne";
  private static final String POST_TWO = "postTwo";

  private static final String ORIGINAL_OWNER = "1";
  private static final String NEW_OWNER = "2";

  private static final String MEMBER_ONE = "1";
  private static final String MEMBER_TWO = "2";
  private static final String MEMBER_THREE = "3";

  @Before
  public void setUp() {
    group = new Club("1", ORIGINAL_NAME, ORIGINAL_DESCRIPTION, ORIGINAL_OWNER);
  }
  
  @Test
  public void testConstructor() {
    Assert.assertEquals(group.getID(), "1");
    Assert.assertEquals(group.getName(), ORIGINAL_NAME);
    Assert.assertEquals(group.getDescription(), ORIGINAL_DESCRIPTION);
    Assert.assertEquals(group.getAnnouncement(), "");
    Assert.assertEquals(group.getPosts().size(), 0);
    Assert.assertEquals(group.getOwnerID(), "1");
    Assert.assertEquals(group.getMemberIDs().size(), 0);
    Assert.assertEquals(group.getInviteIDs().size(), 0);
  }

  @Test 
  public void testName() {
    group.setName(NEW_NAME);
    Assert.assertEquals(group.getName(), NEW_NAME);
  }

  @Test 
  public void testDescription() {
    group.setDescription(NEW_DESCRIPTION);
    Assert.assertEquals(group.getDescription(), NEW_DESCRIPTION);
  }

  @Test 
  public void testAnnouncement() {
    group.setAnnouncement(ANNOUNCEMENT);
    Assert.assertEquals(group.getAnnouncement(), ANNOUNCEMENT);
  }

  @Test
  public void testPost() {
    group.post(POST_ONE);

    Assert.assertEquals(group.getPosts().size(), 1);

    List<String> list = new ArrayList<>(group.getPosts());
    Assert.assertEquals(list.get(0), POST_ONE);

    group.post(POST_TWO);

    Assert.assertEquals(group.getPosts().size(), 2);
    list = new ArrayList<>(group.getPosts());
    Assert.assertEquals(list.get(0), POST_ONE);
    Assert.assertEquals(list.get(1), POST_TWO);
  }

  @Test
  public void testClearPost() {
    group.post(POST_ONE);
    group.post(POST_TWO);

    Assert.assertEquals(group.getPosts().size(), 2);

    group.clearPosts();

    Assert.assertEquals(group.getPosts().size(), 0);
  }

  @Test 
  public void testOwner() {
    group.setOwnerID(NEW_OWNER);
    Assert.assertEquals(group.getOwnerID(), NEW_OWNER);
  }

  @Test
  public void testInvite() {
    group.invite(MEMBER_ONE);

    Assert.assertEquals(group.getInviteIDs().size(), 1);
    List<String> list = new ArrayList<>(group.getInviteIDs());
    Assert.assertEquals(list.get(0), MEMBER_ONE);

    group.invite(MEMBER_TWO);

    Assert.assertEquals(group.getInviteIDs().size(), 2);
    list = new ArrayList<>(group.getInviteIDs());
    Assert.assertEquals(list.get(0), MEMBER_ONE);
    Assert.assertEquals(list.get(1), MEMBER_TWO);
  }

  @Test
  public void testInviteList() {
    group.invite(new ArrayList<>(Arrays.asList(MEMBER_ONE, MEMBER_TWO)));

    Assert.assertEquals(group.getInviteIDs().size(), 2);
    List<String> list = new ArrayList<>(group.getInviteIDs());
    Assert.assertEquals(list.get(0), MEMBER_ONE);
    Assert.assertEquals(list.get(1), MEMBER_TWO);
  }

  @Test
  public void testUninvite() {
    group.invite(MEMBER_ONE);
    group.invite(MEMBER_TWO);
    group.uninvite(MEMBER_TWO);

    Assert.assertEquals(group.getInviteIDs().size(), 1);
    List<String> list = new ArrayList<>(group.getInviteIDs());
    Assert.assertEquals(list.get(0), MEMBER_ONE);
  }

  @Test
  public void testUninviteList() {
    group.invite(new ArrayList<>(Arrays.asList(MEMBER_ONE, MEMBER_TWO, MEMBER_THREE)));
    group.uninvite(new ArrayList<>(Arrays.asList(MEMBER_TWO, MEMBER_THREE)));

    Assert.assertEquals(group.getInviteIDs().size(), 1);
    List<String> list = new ArrayList<>(group.getInviteIDs());
    Assert.assertEquals(list.get(0), MEMBER_ONE);
  }

  @Test
  public void testAddMemberInvited() {
    group.invite(MEMBER_ONE);
    group.invite(MEMBER_TWO);
    boolean b = group.addMember(MEMBER_ONE);

    Assert.assertEquals(b, true);
    Assert.assertEquals(group.getInviteIDs().size(), 1);
    Assert.assertEquals(group.getMemberIDs().size(), 1);
    List<String> list = new ArrayList<>(group.getInviteIDs());
    Assert.assertEquals(list.get(0), MEMBER_TWO);
    list = new ArrayList<>(group.getMemberIDs());
    Assert.assertEquals(list.get(0), MEMBER_ONE);
  }

  @Test
  public void testAddMemberNotInvited() {
    group.invite(MEMBER_ONE);
    group.invite(MEMBER_TWO);
    boolean b = group.addMember(MEMBER_THREE);

    Assert.assertEquals(b, false);
    Assert.assertEquals(group.getInviteIDs().size(), 2);
    Assert.assertEquals(group.getMemberIDs().size(), 0);
    List<String> list = new ArrayList<>(group.getInviteIDs());
    Assert.assertEquals(list.get(0), MEMBER_ONE);
    Assert.assertEquals(list.get(1), MEMBER_TWO);
  }
  
  @Test
  public void removeMember() {
    group.invite(new ArrayList<>(Arrays.asList(MEMBER_ONE, MEMBER_TWO, MEMBER_THREE)));
    group.addMember(MEMBER_ONE);
    group.addMember(MEMBER_TWO);
    group.addMember(MEMBER_THREE);

    Assert.assertEquals(group.getMemberIDs().size(), 3);

    group.removeMember(MEMBER_TWO);

    Assert.assertEquals(group.getMemberIDs().size(), 2);
    List<String> list = new ArrayList<>(group.getMemberIDs());
    Assert.assertEquals(list.get(0), MEMBER_ONE);
    Assert.assertEquals(list.get(1), MEMBER_THREE);
  }

  @Test
  public void removeMembers() {
    group.invite(new ArrayList<>(Arrays.asList(MEMBER_ONE, MEMBER_TWO, MEMBER_THREE)));
    group.addMember(MEMBER_ONE);
    group.addMember(MEMBER_TWO);
    group.addMember(MEMBER_THREE);

    Assert.assertEquals(group.getMemberIDs().size(), 3);

    group.removeMembers(new ArrayList<>(Arrays.asList(MEMBER_ONE, MEMBER_TWO)));

    Assert.assertEquals(group.getMemberIDs().size(), 1);
    List<String> list = new ArrayList<>(group.getMemberIDs());
    Assert.assertEquals(list.get(0), MEMBER_THREE);
  }

}
