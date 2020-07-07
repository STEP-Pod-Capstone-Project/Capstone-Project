package com.google.sps.servlets;

import com.google.sps.data.BookList;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.common.collect.ImmutableMap;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that stores User's data from Frontend Authentication. */
@WebServlet("/api/booklistStore")
public class BookListStoreServlet extends HttpServlet {

  private Firestore getFirestore() throws IOException {
    return Utility.getFirestoreDb();
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    // response.setHeader("Access-Control-Allow-Methods", "GET");
    // response.setHeader("Access-Control-Allow-Credentials", "true");
    // response.setHeader("Access-Control-Allow-Origin",
    //     "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    try {

      String bookListJsonString = request.getReader().lines().collect(Collectors.joining());
      JsonObject bookListJson = JsonParser.parseString(bookListJsonString).getAsJsonObject();

      final String userID = bookListJson.get("userID").getAsString();
      final String gBookID = bookListJson.get("gBookID").getAsString();

      BookList userBookList = new BookList(userID, Collections.singletonList(gBookID));

      Firestore db = getFirestore();

      ApiFuture<WriteResult> futureUsers = db.collection("booklists").document(userBookList.getID()).set(userBookList);

      System.out.println("Update time : " + futureUsers.get().getUpdateTime());

    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
    }

  }

  
}