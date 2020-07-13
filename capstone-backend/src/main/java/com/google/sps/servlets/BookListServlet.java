package com.google.sps.servlets;

import com.google.sps.data.BookList;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
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

  private Firestore getFirestore() throws IOException {
    return Utility.getFirestoreDb();
  }

  public BookListServlet() throws IOException {
    db = Utility.getFirestoreDb();
    booklists = db.collection("bookLists");
    gson = new Gson();
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    // response.setHeader("Access-Control-Allow-Methods", "POST");
    // response.setHeader("Access-Control-Allow-Credentials", "true");
    // response.setHeader("Access-Control-Allow-Origin",
    // "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

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

    // response.setHeader("Access-Control-Allow-Methods", "PUT");
    // response.setHeader("Access-Control-Allow-Credentials", "true");
    // response.setHeader("Access-Control-Allow-Origin",
    // "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");


    BookList updatedBookList = (BookList) Utility.put(booklists, request, response, new GenericClass(BookList.class));
    if (updatedBookList != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(updatedBookList));
    }

  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    // response.setHeader("Access-Control-Allow-Methods", "GET");
    // response.setHeader("Access-Control-Allow-Credentials", "true");
    // response.setHeader("Access-Control-Allow-Origin",
    // "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    List<BookList> retrievedBookLists = Utility.get(booklists, request, response, new GenericClass(BookList.class));
    if (retrievedBookLists != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(retrievedBookLists));
    }
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {

    // response.setHeader("Access-Control-Allow-Methods", "DELETE");
    // response.setHeader("Access-Control-Allow-Credentials", "true");
    // response.setHeader("Access-Control-Allow-Origin",
    // "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    try {

      JsonObject bookListJson = Utility.createRequestBodyJson(request);

      final String bookListID = bookListJson.get("bookListID").getAsString();

      Firestore db = getFirestore();

      ApiFuture<WriteResult> futureUsers = db.collection("bookLists").document(bookListID).delete();

      System.out.println("BookListServlet DELETE Update time : " + futureUsers.get().getUpdateTime());

    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
    }

  }

}