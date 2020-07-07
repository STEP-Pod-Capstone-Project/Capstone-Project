package com.google.sps.servlets;

import com.google.sps.data.BookList;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.common.base.Joiner;
import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
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


@WebServlet("/api/booklistGet")
public class BookListGetServlet extends HttpServlet{

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


    String userIdString = request.getReader().lines().collect(Collectors.joining());
    JsonObject userIdJson = JsonParser.parseString(userIdString).getAsJsonObject();

    String userID = userIdJson.get("userID").getAsString();


    Firestore db = getFirestore();

    Query query = db.collection("booklists").whereEqualTo("userID", userID);
    ApiFuture<QuerySnapshot> querySnapshot = query.get();

    ArrayList<Map<String, Object>> userBookLists = new ArrayList<Map<String, Object>>();

    for (DocumentSnapshot document : querySnapshot.get().getDocuments()){
      userBookLists.add(document.getData());
      System.out.println("ID:\t" + document.getId());
      System.out.println(Joiner.on(",").withKeyValueSeparator("=").join(document.getData()));
    }

    Gson gson = new Gson();

    response.setContentType("application/json;");

    response.getWriter().println(gson.toJson(userBookLists));

    } catch (Exception e){
      System.err.println("Error: " + e.getMessage());
    }

  }
  
}