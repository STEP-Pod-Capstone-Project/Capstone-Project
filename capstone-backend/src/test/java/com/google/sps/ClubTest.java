package com.google.sps;

import com.google.sps.data.Club;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class ClubTest {
  private Club club;

  private static final String ORIGINAL_NAME = "originalName";
  private static final String NEW_NAME = "newName";

  private static final String ORIGINAL_DESCRIPTION = "originalDescription";
  private static final String NEW_DESCRIPTION = "newDescription";

  private static final String ANNOUNCEMENT = "announcement";

  private static final String POST_ONE = "postOne";
  private static final String POST_TWO = "postTwo";

  private static final long ORIGINAL_OWNER = 1;
  private static final long NEW_OWNER = 2;

  private static final long MEMBER_ONE = 1;
  private static final long MEMBER_TWO = 2;
  private static final long MEMBER_THREE = 3;

  private static final String ORIGINAL_BOOK = "originalBook";
  private static final String NEW_BOOK = "newBook";

  @Before
  public void setUp() {
    club = new Club(1, ORIGINAL_NAME, ORIGINAL_DESCRIPTION, ORIGINAL_OWNER, ORIGINAL_BOOK);
  }
  
  @Test
  public void testConstructor() {
    Assert.assertEquals(club.getID(), 1);
    Assert.assertEquals(club.getName(), ORIGINAL_NAME);
    Assert.assertEquals(club.getDescription(), ORIGINAL_DESCRIPTION);
    Assert.assertEquals(club.getAnnouncement(), "");
    Assert.assertEquals(club.getPosts().size(), 0);
    Assert.assertEquals(club.getOwnerID(), 1);
    Assert.assertEquals(club.getMemberIDs().size(), 0);
    Assert.assertEquals(club.getInviteIDs().size(), 0);
    Assert.assertEquals(club.getGbookID(), ORIGINAL_BOOK);
  }

  @Test 
  public void testName() {
    club.setName(NEW_NAME);
    Assert.assertEquals(club.getName(), NEW_NAME);
  }

  @Test 
  public void testDescription() {
    club.setDescription(NEW_DESCRIPTION);
    Assert.assertEquals(club.getDescription(), NEW_DESCRIPTION);
  }

  @Test 
  public void testAnnouncement() {
    club.setAnnouncement(ANNOUNCEMENT);
    Assert.assertEquals(club.getAnnouncement(), ANNOUNCEMENT);
  }

  @Test
  public void testPost() {
    club.post(POST_ONE);

    Assert.assertEquals(club.getPosts().size(), 1);

    List<String> list = new ArrayList<>(club.getPosts());
    Assert.assertEquals(list.get(0), POST_ONE);

    club.post(POST_TWO);

    Assert.assertEquals(club.getPosts().size(), 2);
    list = new ArrayList<>(club.getPosts());
    Assert.assertEquals(list.get(0), POST_ONE);
    Assert.assertEquals(list.get(1), POST_TWO);
  }

  @Test
  public void testClearPost() {
    club.post(POST_ONE);
    club.post(POST_TWO);

    Assert.assertEquals(club.getPosts().size(), 2);

    club.clearPosts();

    Assert.assertEquals(club.getPosts().size(), 0);
  }

  @Test 
  public void testOwner() {
    club.setOwnerID(NEW_OWNER);
    Assert.assertEquals(club.getOwnerID(), NEW_OWNER);
  }

  @Test
  public void testInvite() {
    club.invite(MEMBER_ONE);

    Assert.assertEquals(club.getInviteIDs().size(), 1);
    List<Long> list = new ArrayList<>(club.getInviteIDs());
    Assert.assertEquals(list.get(0), new Long(MEMBER_ONE));

    club.invite(MEMBER_TWO);

    Assert.assertEquals(club.getInviteIDs().size(), 2);
    list = new ArrayList<>(club.getInviteIDs());
    Assert.assertEquals(list.get(0), new Long(MEMBER_ONE));
    Assert.assertEquals(list.get(1), new Long(MEMBER_TWO));
  }

  @Test
  public void testInviteList() {
    club.invite(new ArrayList<>(Arrays.asList(MEMBER_ONE, MEMBER_TWO)));

    Assert.assertEquals(club.getInviteIDs().size(), 2);
    List<Long> list = new ArrayList<>(club.getInviteIDs());
    Assert.assertEquals(list.get(0), new Long(MEMBER_ONE));
    Assert.assertEquals(list.get(1), new Long(MEMBER_TWO));
  }

  @Test
  public void testUninvite() {
    club.invite(MEMBER_ONE);
    club.invite(MEMBER_TWO);
    club.uninvite(MEMBER_TWO);

    Assert.assertEquals(club.getInviteIDs().size(), 1);
    List<Long> list = new ArrayList<>(club.getInviteIDs());
    Assert.assertEquals(list.get(0), new Long(MEMBER_ONE));
  }

  @Test
  public void testUninviteList() {
    club.invite(new ArrayList<>(Arrays.asList(MEMBER_ONE, MEMBER_TWO, MEMBER_THREE)));
    club.uninvite(new ArrayList<>(Arrays.asList(MEMBER_TWO, MEMBER_THREE)));

    Assert.assertEquals(club.getInviteIDs().size(), 1);
    List<Long> list = new ArrayList<>(club.getInviteIDs());
    Assert.assertEquals(list.get(0), new Long(MEMBER_ONE));
  }

  @Test
  public void testAddMemberInvited() {
    club.invite(MEMBER_ONE);
    club.invite(MEMBER_TWO);
    boolean b = club.addMember(MEMBER_ONE);

    Assert.assertEquals(b, true);
    Assert.assertEquals(club.getInviteIDs().size(), 1);
    Assert.assertEquals(club.getMemberIDs().size(), 1);
    List<Long> list = new ArrayList<>(club.getInviteIDs());
    Assert.assertEquals(list.get(0), new Long(MEMBER_TWO));
    list = new ArrayList<>(club.getMemberIDs());
    Assert.assertEquals(list.get(0), new Long(MEMBER_ONE));
  }

  @Test
  public void testAddMemberNotInvited() {
    club.invite(MEMBER_ONE);
    club.invite(MEMBER_TWO);
    boolean b = club.addMember(MEMBER_THREE);

    Assert.assertEquals(b, false);
    Assert.assertEquals(club.getInviteIDs().size(), 2);
    Assert.assertEquals(club.getMemberIDs().size(), 0);
    List<Long> list = new ArrayList<>(club.getInviteIDs());
    Assert.assertEquals(list.get(0), new Long(MEMBER_ONE));
    Assert.assertEquals(list.get(1), new Long(MEMBER_TWO));
  }
  
  @Test
  public void removeMember() {
    club.invite(new ArrayList<>(Arrays.asList(MEMBER_ONE, MEMBER_TWO, MEMBER_THREE)));
    club.addMember(MEMBER_ONE);
    club.addMember(MEMBER_TWO);
    club.addMember(MEMBER_THREE);

    Assert.assertEquals(club.getMemberIDs().size(), 3);

    club.removeMember(MEMBER_TWO);

    Assert.assertEquals(club.getMemberIDs().size(), 2);
    List<Long> list = new ArrayList<>(club.getMemberIDs());
    Assert.assertEquals(list.get(0), new Long(MEMBER_ONE));
    Assert.assertEquals(list.get(1), new Long(MEMBER_THREE));
  }

  @Test
  public void removeMembers() {
    club.invite(new ArrayList<>(Arrays.asList(MEMBER_ONE, MEMBER_TWO, MEMBER_THREE)));
    club.addMember(MEMBER_ONE);
    club.addMember(MEMBER_TWO);
    club.addMember(MEMBER_THREE);

    Assert.assertEquals(club.getMemberIDs().size(), 3);

    club.removeMembers(new ArrayList(Arrays.asList(MEMBER_ONE, MEMBER_TWO)));

    Assert.assertEquals(club.getMemberIDs().size(), 1);
    List<Long> list = new ArrayList<>(club.getMemberIDs());
    Assert.assertEquals(list.get(0), new Long(MEMBER_THREE));
  }

  @Test 
  public void testBook() {
    club.setGbookID(NEW_BOOK);
    Assert.assertEquals(club.getGbookID(), NEW_BOOK);
  }

}
