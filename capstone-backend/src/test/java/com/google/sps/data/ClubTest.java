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

  private static final Assignment ASSIGNMENT_ONE = new Assignment("one", "id", "created", "due");
  private static final Assignment ASSIGNMENT_TWO = new Assignment("two", "id", "created", "due");

  private static final String OWNER = "owner";
  
  private static final String ORIGINAL_BOOK = "originalBook";
  private static final String NEW_BOOK = "newBook";

  @Before
  public void setUp() {
    club = new Club(NAME, DESCRIPTION, OWNER, ORIGINAL_BOOK);
  }
  
  @Test
  public void testConstructor() {
    Assert.assertEquals(club.getAssignments().size(), 0);
    Assert.assertEquals(club.getGbookID(), ORIGINAL_BOOK);
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
  public void testBook() {
    club.setGbookID(NEW_BOOK);
    Assert.assertEquals(club.getGbookID(), NEW_BOOK);
  }
}
