package com.google.sps.servlets;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that searches for a User using Firestore. */
@WebServlet("/api/userSearch")
public class UserSearchServlet extends HttpServlet {

  private Firestore getFirestore() throws IOException {
    return Utility.getFirestoreDb();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    String searchTerm = request.getParameter("searchTerm");

    if (searchTerm.isEmpty()) {
      System.err.println("Error:\t" + "Null searchTerm");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    if (request.getParameterMap().size() > 1) {
      System.err.println("Error:\t" + "Too many parameters");
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