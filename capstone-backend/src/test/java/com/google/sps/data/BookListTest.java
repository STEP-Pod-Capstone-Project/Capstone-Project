package com.google.sps.data;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.util.Collection;
import java.util.HashSet;
import java.util.Arrays;

@RunWith(JUnit4.class)
public final class BookListTest {

  private BookList bookList1;
  private BookList bookList2;

  private final String BOOKSHELF_ID_1 = "bookshelfID_1";
  private final String BOOKSHELF_ID_2 = "bookshelfID_2";

  private final String USER_ID_1 = "12345";
  private final String USER_ID_2 = "67890";

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
    bookList1 = new BookList(USER_ID_1, BOOKSHELF_ID_1, COLLABORATORS_IDs_1, ID_1);
    bookList2 = new BookList(USER_ID_2, BOOKSHELF_ID_2);
  }

  @Test
  public void testContructors() {

    assertNotEquals(bookList1, bookList2);

    // Test Diff
    assertEquals(false, bookList1.getUserID().equals(bookList2.getId()));

    assertEquals(false, bookList1.getBookshelfID().equals(bookList2.getBookshelfID()));

    assertNotEquals(bookList1.getCollaboratorsIDs(), bookList2.getCollaboratorsIDs());

    assertEquals(false, bookList1.getCollaboratorsIDs().containsAll(bookList2.getCollaboratorsIDs())
        && bookList2.getCollaboratorsIDs().containsAll(bookList1.getCollaboratorsIDs()));

    assertEquals(false, bookList1.getId().equals(bookList2.getId()));
  }

  @Test
  public void testGetters() {

    assertEquals(true, bookList1.getUserID().equals(USER_ID_1));
    assertEquals(true, bookList1.getBookshelfID().equals(BOOKSHELF_ID_1));
    assertEquals(COLLABORATORS_IDs_1, bookList1.getCollaboratorsIDs());
    assertEquals(true, bookList1.getCollaboratorsIDs().containsAll(COLLABORATORS_IDs_1));
    assertEquals(true, bookList1.getId().equals(ID_1));

    assertEquals(true, bookList2.getUserID().equals(USER_ID_2));
    assertEquals(true, bookList2.getBookshelfID().equals(BOOKSHELF_ID_2));
    assertEquals(true, bookList2.getCollaboratorsIDs().isEmpty());
    assertEquals(true, bookList2.getId().equals(""));
  }

  @Test
  public void testSetters() {

    bookList2.setUserID(USER_ID_1);
    bookList2.setBookshelf(BOOKSHELF_ID_1);
    bookList2.setCollaboratorsIDs(COLLABORATORS_IDs_2);
    bookList2.setID(ID_2);

    assertEquals(true, bookList2.getUserID().equals(USER_ID_1));
    assertEquals(true, bookList2.getBookshelfID().equals(BOOKSHELF_ID_1));
    assertEquals(COLLABORATORS_IDs_2, bookList2.getCollaboratorsIDs());
    assertEquals(true, bookList2.getCollaboratorsIDs().containsAll(COLLABORATORS_IDs_2));
    assertEquals(true, bookList2.getId().equals(ID_2));
  }

  @Test
  public void testAddRemoveContainsCollaborators() {

    bookList1.addCollaborator(COLLABORATOR_ID_1);
    assertEquals(true, bookList1.containsCollaborator(COLLABORATOR_ID_1));

    bookList2.addCollaborator(COLLABORATOR_ID_2);
    assertEquals(true, bookList2.containsCollaborator(COLLABORATOR_ID_2));

    bookList1.removeCollaborator(COLLABORATOR_ID_1);
    assertEquals(false, bookList1.containsCollaborator(COLLABORATOR_ID_1));

    bookList2.removeCollaborator(COLLABORATOR_ID_2);
    assertEquals(false, bookList2.containsCollaborator(COLLABORATOR_ID_2));

  }

  @Test
  public void testIsEmptyAndClear() {

    assertEquals(false, bookList1.isEmpty());

    bookList1.clear();

    assertEquals(true, bookList1.isEmpty());
    assertEquals(true, bookList1.getUserID().equals(""));
    assertEquals(true, bookList1.getBookshelfID().equals(""));
    assertEquals(true, bookList1.getCollaboratorsIDs().isEmpty());

    assertNotNull(bookList1.getId());

    bookList2.clear();
    assertEquals(bookList1.isEmpty(), bookList2.isEmpty());
  }
}
