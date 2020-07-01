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

  private final Long USER_ID_1 = Long.valueOf(12345);
  private final Long USER_ID_2 = Long.valueOf(67890);

  private final Long COLLABORATOR_ID_1 = Long.valueOf(1111);
  private final Long COLLABORATOR_ID_2 = Long.valueOf(2222);

  private final Long ID_1 = Long.valueOf(123456789);
  private final Long ID_2 = Long.valueOf(987654321);

  private final Collection<Long> COLLABORATORS_IDs_1 = new HashSet<Long>(
      Arrays.asList((long) 123, (long) 321, (long) 345, (long) 543, (long) 234));

  private final Collection<Long> COLLABORATORS_IDs_2 = new HashSet<Long>(
      Arrays.asList((long) 678, (long) 876, (long) 8910, (long) 789, (long) 1098));

  @Before
  public void setUp() {
    bookList1 = new BookList(USER_ID_1, BOOKSHELF_ID_1, COLLABORATORS_IDs_1, ID_1);
    bookList2 = new BookList(USER_ID_2, BOOKSHELF_ID_2);
  }

  @Test
  public void testContructors() {

    assertNotEquals(bookList1, bookList2);

    // Test Diff
    assertNotEquals(bookList1.getUserID(), bookList2.getUserID());
    assertNotEquals(bookList1.getBookshelfID(), bookList2.getBookshelfID());

    assertNotEquals(bookList1.getBookshelfID(), bookList2.getBookshelfID());

    assertNotNull(bookList1.getId());
    assertNull(bookList2.getId());
  }

  @Test
  public void testGetters() {

    assertEquals(USER_ID_1, bookList1.getUserID());
    assertEquals(BOOKSHELF_ID_1, bookList1.getBookshelfID());
    assertEquals(COLLABORATORS_IDs_1, bookList1.getCollaboratorsIDs());
    assertEquals(ID_1, bookList1.getId());

    assertEquals(USER_ID_2, bookList2.getUserID());
    assertEquals(BOOKSHELF_ID_2, bookList2.getBookshelfID());
    assertEquals(true, bookList2.getCollaboratorsIDs().isEmpty());
    assertNull(bookList2.getId());
  }

  @Test
  public void testSetters() {

    bookList2.setUserID(USER_ID_1);
    bookList2.setBookshelf(BOOKSHELF_ID_1);
    bookList2.setCollaboratorsIDs(COLLABORATORS_IDs_2);
    bookList2.setID(ID_2);

    assertEquals(BOOKSHELF_ID_1, bookList2.getBookshelfID());
    assertEquals(USER_ID_1, bookList2.getUserID());
    assertEquals(COLLABORATORS_IDs_2, bookList2.getCollaboratorsIDs());
    assertEquals(ID_2, bookList2.getId());
  }

  @Test
  public void testAddRemoveContainsCollaborators(){

    bookList1.addCollaborator(COLLABORATOR_ID_2);
    assertEquals(true, bookList1.containsCollaborator(COLLABORATOR_ID_2));

    bookList2.addCollaborator(COLLABORATOR_ID_1);
    assertEquals(true, bookList2.containsCollaborator(COLLABORATOR_ID_1));

    bookList1.removeCollaborator(COLLABORATOR_ID_2);
    assertEquals(false, bookList1.containsCollaborator(COLLABORATOR_ID_2));

    bookList2.removeCollaborator(COLLABORATOR_ID_1);
    assertEquals(false, bookList2.containsCollaborator(COLLABORATOR_ID_1));

  }

  @Test
  public void testIsEmptyAndClear() {

    assertEquals(false, bookList1.isEmpty());

    bookList1.clear();

    assertEquals(true, bookList1.isEmpty());
    assertNull(bookList1.getUserID());
    assertEquals("", bookList1.getBookshelfID());
    assertEquals(true, bookList1.getCollaboratorsIDs().isEmpty());

    assertNotNull(bookList1.getId());

    bookList2.clear();
    assertEquals(bookList1.isEmpty(), bookList2.isEmpty());
  }
}
