package com.google.sps.data;

import org.junit.Assert;
import org.junit.Before;
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

  private static final Assignment ASSIGNMENT_ONE = new Assignment("one", "id", "created", "due");
  private static final Assignment ASSIGNMENT_TWO = new Assignment("two", "id", "created", "due");

  private static final String ORIGINAL_OWNER = "originalOwner";
  private static final String NEW_OWNER = "newOwner";

  private static final String DESCRIPTION = "description";

  private static final String OWNER = "1";
  
  private static final String ORIGINAL_BOOK = "originalBook";
  private static final String NEW_BOOK = "newBook";

  @Before
  public void setUp() {
    club = new Club(NAME, DESCRIPTION, OWNER, ORIGINAL_BOOK);
  }
  
  @Test
  public void testConstructor() {
    Assert.assertEquals(club.getName(), NAME);
    Assert.assertEquals(club.getDescription(), DESCRIPTION);
    Assert.assertEquals(club.getAssignments().size(), 0);
    Assert.assertEquals(club.getOwnerID(), ORIGINAL_OWNER);
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
  public void testAssignment() {
    club.addAssignment(ASSIGNMENT_ONE);

    Assert.assertEquals(club.getAssignments().size(), 1);

    List<Assignment> list = new ArrayList<>(club.getAssignments());
    Assert.assertEquals(list.get(0), ASSIGNMENT_ONE);

    club.addAssignment(ASSIGNMENT_TWO);

    Assert.assertEquals(club.getAssignments().size(), 2);
    list = new ArrayList<>(club.getAssignments());
    Assert.assertEquals(list.get(0), ASSIGNMENT_ONE);
    Assert.assertEquals(list.get(1), ASSIGNMENT_TWO);
  }

  @Test
  public void testClearAssignments() {
    club.addAssignment(ASSIGNMENT_ONE);
    club.addAssignment(ASSIGNMENT_TWO);

    Assert.assertEquals(club.getAssignments().size(), 2);

    club.clearAssignments();

    Assert.assertEquals(club.getAssignments().size(), 0);
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
    List<String> list = club.getInviteIDs();
    Assert.assertTrue(list.contains(MEMBER_ONE));

    club.invite(MEMBER_TWO);

    Assert.assertEquals(club.getInviteIDs().size(), 2);
    list = club.getInviteIDs();
    Assert.assertTrue(list.contains(MEMBER_ONE));
    Assert.assertTrue(list.contains(MEMBER_TWO));
  }

  @Test
  public void testInviteList() {
    club.invite(Arrays.asList(MEMBER_ONE, MEMBER_TWO));

    Assert.assertEquals(club.getInviteIDs().size(), 2);
    List<String> list = club.getInviteIDs();
    Assert.assertTrue(list.contains(MEMBER_ONE));
    Assert.assertTrue(list.contains(MEMBER_TWO));
  }

  @Test
  public void testUninvite() {
    club.invite(MEMBER_ONE);
    club.invite(MEMBER_TWO);
    club.uninvite(MEMBER_TWO);

    Assert.assertEquals(club.getInviteIDs().size(), 1);
    List<String> list = club.getInviteIDs();
    Assert.assertTrue(list.contains(MEMBER_ONE));
  }

  @Test
  public void testUninviteList() {
    club.invite(Arrays.asList(MEMBER_ONE, MEMBER_TWO, MEMBER_THREE));
    club.uninvite(Arrays.asList(MEMBER_TWO, MEMBER_THREE));

    Assert.assertEquals(club.getInviteIDs().size(), 1);
    List<String> list = club.getInviteIDs();
    Assert.assertTrue(list.contains(MEMBER_ONE));
  }

  @Test
  public void testAddMemberInvited() {
    club.invite(MEMBER_ONE);
    club.invite(MEMBER_TWO);
    boolean b = club.addMember(MEMBER_ONE);

    Assert.assertEquals(b, true);
    Assert.assertEquals(club.getInviteIDs().size(), 1);
    Assert.assertEquals(club.getMemberIDs().size(), 1);
    List<String> list = club.getInviteIDs();
    Assert.assertTrue(list.contains(MEMBER_TWO));
    list = club.getMemberIDs();
    Assert.assertTrue(list.contains(MEMBER_ONE));
  }

  @Test
  public void testAddMemberNotInvited() {
    club.invite(MEMBER_ONE);
    club.invite(MEMBER_TWO);
    boolean b = club.addMember(MEMBER_THREE);

    Assert.assertEquals(b, false);
    Assert.assertEquals(club.getInviteIDs().size(), 2);
    Assert.assertEquals(club.getMemberIDs().size(), 0);
    List<String> list = club.getInviteIDs();
    Assert.assertTrue(list.contains(MEMBER_ONE));
    Assert.assertTrue(list.contains(MEMBER_TWO));
  }
  
  @Test
  public void removeMember() {
    club.invite(Arrays.asList(MEMBER_ONE, MEMBER_TWO, MEMBER_THREE));
    club.addMember(MEMBER_ONE);
    club.addMember(MEMBER_TWO);
    club.addMember(MEMBER_THREE);

    Assert.assertEquals(club.getMemberIDs().size(), 3);

    club.removeMember(MEMBER_TWO);

    Assert.assertEquals(club.getMemberIDs().size(), 2);
    List<String> list = club.getMemberIDs();
    Assert.assertTrue(list.contains(MEMBER_ONE));
    Assert.assertTrue(list.contains(MEMBER_THREE));
  }

  @Test
  public void removeMembers() {
    club.invite(Arrays.asList(MEMBER_ONE, MEMBER_TWO, MEMBER_THREE));
    club.addMember(MEMBER_ONE);
    club.addMember(MEMBER_TWO);
    club.addMember(MEMBER_THREE);

    Assert.assertEquals(club.getMemberIDs().size(), 3);

    club.removeMembers(Arrays.asList(MEMBER_ONE, MEMBER_TWO));

    Assert.assertEquals(club.getMemberIDs().size(), 1);
    List<String> list = club.getMemberIDs();
    Assert.assertTrue(list.contains(MEMBER_THREE));
  }

  @Test 
  public void testBook() {
    club.setGbookID(NEW_BOOK);
    Assert.assertEquals(club.getGbookID(), NEW_BOOK);
  }

}