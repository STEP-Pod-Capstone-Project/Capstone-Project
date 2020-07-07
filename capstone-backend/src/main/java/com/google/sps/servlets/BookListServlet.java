package com.google.sps.servlets;

import com.google.sps.data.BookList;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.common.base.Joiner;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

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

    try {

      String bookListJsonString = request.getReader().lines().collect(Collectors.joining());
      JsonObject bookListJson = JsonParser.parseString(bookListJsonString).getAsJsonObject();

      System.out.println(bookListJsonString);

      final String userID = bookListJson.get("userID").getAsString();
      final String bookListName = bookListJson.get("booklistName").getAsString();

      BookList userBookList = new BookList(userID, bookListName);

      Firestore db = getFirestore();

      ApiFuture<WriteResult> futureUsers = db.collection("booklists").document(userBookList.getID()).set(userBookList);

      System.out.println("Update time : " + futureUsers.get().getUpdateTime());

    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
    }

  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {

    try {

      String bookListJsonString = request.getReader().lines().collect(Collectors.joining());
      JsonObject bookListJson = JsonParser.parseString(bookListJsonString).getAsJsonObject();

      final String bookListID = bookListJson.get("bookListID").getAsString();
      final JsonArray gBookIDsJsonArray = bookListJson.get("gbookIDs").getAsJsonArray();

      ArrayList<String> gBookIDs = new ArrayList<String>();
      
      for (JsonElement element : gBookIDsJsonArray){
        gBookIDs.add(element.getAsString());
      }

      Firestore db = getFirestore();

      ApiFuture<WriteResult> futureUsers = db.collection("booklists").document(bookListID).update("gbookIDs", gBookIDs);

      System.out.println("Update time : " + futureUsers.get().getUpdateTime());

    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
    }

  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    try {

      String userID = request.getParameter("userID");

      Firestore db = getFirestore();

      Query query = db.collection("booklists").whereEqualTo("userID", userID);
      ApiFuture<QuerySnapshot> querySnapshot = query.get();

      ArrayList<Map<String, Object>> userBookLists = new ArrayList<Map<String, Object>>();

      for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
        userBookLists.add(document.getData());
        System.out.println(Joiner.on(",").withKeyValueSeparator("=").join(document.getData()));
      }

      Gson gson = new Gson();

      response.setContentType("application/json;");

      response.getWriter().println(gson.toJson(userBookLists));

    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
    }

  }

}