package com.google.sps.data;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.Collection;
import java.util.HashSet;
import java.util.Arrays;

@RunWith(JUnit4.class)
public final class BookListTest {

  private BookList bookList1;
  private BookList bookList2;

  private final Collection<String> GBOOK_IDs_1 = new HashSet<String>(Arrays.asList("abc123", "def456", "ghi789"));
  private final Collection<String> GBOOK_IDs_2 = new HashSet<String>(Arrays.asList("zxy987", "wvu654", "tsr321"));

  private final String USER_ID_1 = "12345";
  private final String USER_ID_2 = "67890";

  private final String GBOOK_1 = "123abc";
  private final String GBOOK_2 = "987xyz";

  private final String COLLABORATOR_ID_1 = "1111";
  private final String COLLABORATOR_ID_2 = "2222";

  private final String ID_1 = "123456789";
  private final String ID_2 = "987654321";

  private final Collection<String> COLLABORATORS_IDs_1 = new HashSet<String>(
      Arrays.asList("123", "321", "345", "543", "234"));

  private final Collection<String> COLLABORATORS_IDs_2 = new HashSet<String>(
      Arrays.asList("678", "876", "8910", "789", "1098"));

  @Before
  public void setUp() {
    bookList1 = new BookList(ID_1, USER_ID_1, GBOOK_IDs_1, COLLABORATORS_IDs_1);
    bookList2 = new BookList(USER_ID_2, GBOOK_IDs_2);
  }

  @Test
  public void testContructors() {

    assertNotEquals(bookList1, bookList2);

    // Test Diff
    assertFalse(bookList1.getUserID().equals(bookList2.getId()));

    assertNotEquals(bookList1.getGbookIDs(), bookList2.getGbookIDs());

    assertFalse(bookList1.getGbookIDs().containsAll(bookList2.getGbookIDs())
        && bookList2.getGbookIDs().containsAll(bookList1.getGbookIDs()));

    assertNotEquals(bookList1.getCollaboratorsIDs(), bookList2.getCollaboratorsIDs());

    assertFalse(bookList1.getCollaboratorsIDs().containsAll(bookList2.getCollaboratorsIDs())
        && bookList2.getCollaboratorsIDs().containsAll(bookList1.getCollaboratorsIDs()));

    assertFalse(bookList1.getId().equals(bookList2.getId()));
  }

  @Test
  public void testGetters() {

    assertTrue(bookList1.getUserID().equals(USER_ID_1));
    assertEquals(GBOOK_IDs_1, bookList1.getGbookIDs());
    assertTrue(bookList1.getGbookIDs().containsAll(GBOOK_IDs_1));
    assertEquals(COLLABORATORS_IDs_1, bookList1.getCollaboratorsIDs());
    assertTrue(bookList1.getCollaboratorsIDs().containsAll(COLLABORATORS_IDs_1));
    assertTrue(bookList1.getId().equals(ID_1));

    assertTrue(bookList2.getUserID().equals(USER_ID_2));
    assertEquals(GBOOK_IDs_2, bookList2.getGbookIDs());
    assertTrue(bookList2.getGbookIDs().containsAll(GBOOK_IDs_2));
    assertTrue(bookList2.getCollaboratorsIDs().isEmpty());
    assertTrue(bookList2.getId().equals(""));
  }

  @Test
  public void testSetters() {

    bookList2.setUserID(USER_ID_1);
    bookList2.setGbookIDs(GBOOK_IDs_1);
    bookList2.setCollaboratorsIDs(COLLABORATORS_IDs_2);
    bookList2.setID(ID_2);

    assertTrue(bookList2.getUserID().equals(USER_ID_1));
    assertEquals(GBOOK_IDs_1, bookList2.getGbookIDs());
    assertTrue(bookList2.getGbookIDs().containsAll(GBOOK_IDs_1));
    assertEquals(COLLABORATORS_IDs_2, bookList2.getCollaboratorsIDs());
    assertTrue(bookList2.getCollaboratorsIDs().containsAll(COLLABORATORS_IDs_2));
    assertTrue(bookList2.getId().equals(ID_2));
  }

  @Test
  public void testAddRemoveContains() {

    bookList1.addGbook(GBOOK_1);
    bookList1.addCollaborator(COLLABORATOR_ID_1);
    assertTrue(bookList1.containsGbook(GBOOK_1));
    assertTrue(bookList1.containsCollaborator(COLLABORATOR_ID_1));

    bookList2.addGbook(GBOOK_2);
    bookList2.addCollaborator(COLLABORATOR_ID_2);
    assertTrue(bookList2.containsGbook(GBOOK_2));
    assertTrue(bookList2.containsCollaborator(COLLABORATOR_ID_2));

    bookList1.removeGbook(GBOOK_1);
    bookList1.removeCollaborator(COLLABORATOR_ID_1);
    assertFalse(bookList1.containsGbook(GBOOK_1));
    assertFalse(bookList1.containsCollaborator(COLLABORATOR_ID_1));

    bookList2.removeGbook(GBOOK_2);
    bookList2.removeCollaborator(COLLABORATOR_ID_2);
    assertFalse(bookList2.containsGbook(GBOOK_2));
    assertFalse(bookList2.containsCollaborator(COLLABORATOR_ID_2));
  }

  @Test
  public void testIsEmptyAndClear() {

    assertFalse(bookList1.isEmpty());

    bookList1.clear();

    assertTrue(bookList1.isEmpty());
    assertTrue(bookList1.getUserID().equals(""));
    assertTrue(bookList1.getGbookIDs().isEmpty());
    assertTrue(bookList1.getCollaboratorsIDs().isEmpty());
    assertNotNull(bookList1.getId());

    bookList2.clear();
    assertEquals(bookList1.isEmpty(), bookList2.isEmpty());
  }
}
