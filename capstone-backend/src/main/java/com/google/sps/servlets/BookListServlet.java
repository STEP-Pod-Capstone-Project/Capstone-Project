package com.google.sps.servlets;

import com.google.sps.data.BookList;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that stores, updates and gets BookList's data from Frontend . */
@WebServlet("/api/booklist")
public class BookListServlet extends HttpServlet {

  private Firestore db;
  private CollectionReference booklists;
  private Gson gson;

  public BookListServlet() throws IOException {
    db = Utility.getFirestoreDb();
    booklists = db.collection("booklists");
    gson = new Gson();
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    List<String> requiredFields = new ArrayList<String>(Arrays.asList("userID", "name"));
    BookList createdBookLists = (BookList) Utility.post(booklists, request, response, new GenericClass(BookList.class),
        requiredFields);
    if (createdBookLists != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(createdBookLists));
    }
  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {

    BookList updatedBookList = (BookList) Utility.put(booklists, request, response, new GenericClass(BookList.class));
    if (updatedBookList != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(updatedBookList));
    }

  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Origin", "https://3000-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io");
response.setHeader("Set-Cookie", "cross-site-cookie=name; SameSite=None; Secure");
    List<BookList> retrievedBookLists = Utility.get(booklists, request, response, new GenericClass(BookList.class));
    if (retrievedBookLists != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(retrievedBookLists));
    }
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Utility.delete(booklists, request, response);
  }

}