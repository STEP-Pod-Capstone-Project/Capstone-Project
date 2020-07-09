package com.google.sps.servlets;

import com.google.sps.data.BookList;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that stores, updates and gets BookList's data from Frontend . */
@WebServlet("/api/booklist")
public class BookListServlet extends HttpServlet {

  private Firestore getFirestore() throws IOException {
    return Utility.getFirestoreDb();
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.setHeader("Access-Control-Allow-Methods", "POST");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin",
        "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    try {

      JsonObject bookListJson = Utility.createRequestBodyJson(request);

      final String userID = bookListJson.get("userID").getAsString();
      final String bookListName = bookListJson.get("booklistName").getAsString();

      BookList userBookList = new BookList(userID, bookListName);

      Firestore db = getFirestore();

      ApiFuture<WriteResult> futureUsers = db.collection("booklists").document(userBookList.getID()).set(userBookList);

      System.out.println("BookListServlet POST Update time : " + futureUsers.get().getUpdateTime());

    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
    }

  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.setHeader("Access-Control-Allow-Methods", "PUT");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin",
        "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    System.out.println("GOT to PUT");

    try {

      JsonObject bookListJson = Utility.createRequestBodyJson(request);

      final String bookListID = bookListJson.get("bookListID").getAsString();
      final String newGBookID = bookListJson.get("gbookID").getAsString();
      

      Firestore db = getFirestore();

      DocumentSnapshot bookList = db.collection("booklists").document(bookListID).get().get();

      ArrayList<String> gBookIDs = (ArrayList<String>) bookList.get("gbookIDs");
      gBookIDs.add(newGBookID);

      ApiFuture<WriteResult> futureUsers = db.collection("booklists").document(bookListID).update("gbookIDs", gBookIDs);


      System.out.println("BookListServlet PUT Update time : " + futureUsers.get().getUpdateTime());

    } catch (Exception e) {
      System.out.println("BookListServlet PUT Error : " + e.getMessage());
      System.err.println("Error: " + e.getMessage());
    }

  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin",
        "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    try {

      String userID = request.getParameter("userID");

      Firestore db = getFirestore();

      Query query = db.collection("booklists").whereEqualTo("userID", userID);
      ApiFuture<QuerySnapshot> querySnapshot = query.get();

      ArrayList<Map<String, Object>> userBookLists = new ArrayList<Map<String, Object>>();

      for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
        userBookLists.add(document.getData());
      }

      Gson gson = new Gson();

      response.setContentType("application/json;");

      response.getWriter().println(gson.toJson(userBookLists));

    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
    }

  }

}