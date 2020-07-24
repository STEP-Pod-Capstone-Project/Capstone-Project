package com.google.sps.servlets;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.common.collect.ImmutableMap;
import com.google.cloud.firestore.Query;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that stores User's data from Frontend Authentication. */
@WebServlet("/api/userSearch")
public class UserSearchServlet extends HttpServlet {

  private Firestore getFirestore() throws IOException {
    return Utility.getFirestoreDb();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin",
        "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    String searchTerm = request.getParameter("searchTerm");

    if (searchTerm.isEmpty() || request.getParameterMap().size() > 1) {
      System.err.println("Error:\t" + "No Paramters Specified");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    Set<Map<String, Object>> users = new HashSet<>();

    Firestore db = getFirestore();
    CollectionReference usersCollections = db.collection("users");

    Query queryName = usersCollections.orderBy("fullName").startAt(searchTerm).endAt(searchTerm + '\uf8ff');
    Query queryEmail = usersCollections.orderBy("email").startAt(searchTerm).endAt(searchTerm + '\uf8ff');

    Map<String, Object> user = new HashMap<>();

    try {

      for (DocumentSnapshot document : queryName.get().get().getDocuments()) {

        user = document.getData();
        user.remove("tokenObj");
        
        users.add(user);
      }

      for (DocumentSnapshot document : queryEmail.get().get().getDocuments()) {
        user = document.getData();
        user.remove("tokenObj");
        
        users.add(user);
      }

    } catch (ExecutionException | InterruptedException e) {
      System.err.println("Error:\t" + e.getMessage());
    }

    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(users));
  }
}