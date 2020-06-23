package com.google.sps.data;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.FetchOptions;
import java.util.ArrayList;
import java.util.Random;

public class BookList {

  private final long id = new Random().nextLong();
  private ArrayList<String> bookshelfIDs = new ArrayList<String>();
  private ArrayList<Long> usersIDs = new ArrayList<Long>();
  Entity bookListEntity = new Entity("BookList");

  public BookList(ArrayList<String> bookshelfIDs, ArrayList<Long> usersIDs) {
    this.bookshelfIDs = bookshelfIDs;
    this.usersIDs = usersIDs;

    if (this.isEmpty()) {
      bookListEntity.setProperty("id", id);

      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

      for (String bookShelfID : bookshelfIDs) {

        Entity bookshelfIdEntity = new Entity("BookShelf", bookListEntity.getKey());
        bookshelfIdEntity.setProperty("id", bookShelfID);
        datastore.put(bookListEntity);
      }

      for (long userID : usersIDs) {

        Entity userIdEntity = new Entity("User", bookListEntity.getKey());
        userIdEntity.setProperty("id", userID);
        datastore.put(userIdEntity);
      }

      datastore.put(bookListEntity);
    }
  }

  public void addBookshelf(String bookshelfID) {
    bookshelfIDs.add(bookshelfID);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    Entity bookshelfIdEntity = new Entity("BookShelf", bookListEntity.getKey());
    bookshelfIdEntity.setProperty("id", bookshelfID);
    datastore.put(bookshelfIdEntity);
  }

  public void addUser(long userID) {
    usersIDs.add(userID);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    Entity userIdEntity = new Entity("User", bookListEntity.getKey());
    userIdEntity.setProperty("id", userID);
    datastore.put(userIdEntity);
  }

  public boolean removeBookshelf(String bookshelfID) {

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    Query query = new Query(bookListEntity.getKey());
    PreparedQuery results = datastore.prepare(query);

    while (results.countEntities(FetchOptions.Builder.withLimit(5000)) != 0) {

      for (Entity entity : results.asIterable()) {
        if (entity.getKind().equals("BookShelf")) {

          if ((String) entity.getProperty("id") == bookshelfID) {
            datastore.delete(entity.getKey());
          }
        }
      }
    }

    return bookshelfIDs.remove(bookshelfID);
  }

  public boolean removeUser(long userID) {

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    Query query = new Query(bookListEntity.getKey());
    PreparedQuery results = datastore.prepare(query);

    while (results.countEntities(FetchOptions.Builder.withLimit(5000)) != 0) {

      for (Entity entity : results.asIterable()) {
        if (entity.getKind().equals("User")) {

          if ((long) entity.getProperty("id") == userID) {
            datastore.delete(entity.getKey());
          }
        }
      }
    }

    return usersIDs.remove(userID);
  }

  public boolean containsBookshelf(String bookshelfID) {
    return bookshelfIDs.contains(bookshelfID);
  }

  public boolean containsUser(long userID) {
    return usersIDs.contains(userID);
  }

  public boolean isEmpty() {
    return bookshelfIDs.isEmpty() && usersIDs.isEmpty();
  }

  public void clear() {
    bookshelfIDs.clear();
    usersIDs.clear();

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    Query query = new Query(bookListEntity.getKey());
    PreparedQuery results = datastore.prepare(query);

    while (results.countEntities(FetchOptions.Builder.withLimit(5000)) != 0) {

      for (Entity entity : results.asIterable()) {
        datastore.delete(entity.getKey());
      }
    }
  }

  public int sizeBookshelfIDs() {
    return bookshelfIDs.size();
  }

  public int sizeUsersIDs() {
    return usersIDs.size();
  }

  public long getUserID() {
    return usersIDs.get(0);
  }

  public long getUserID(int index) {
    return usersIDs.get(index);
  }

  public String getBookshelfID() {
    return bookshelfIDs.get(0);
  }

  public String getBookshelfID(int index) {
    return bookshelfIDs.get(index);
  }

  public long getId() {
    return this.id;
  }
}