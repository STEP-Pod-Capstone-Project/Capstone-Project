package com.google.sps.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.gson.Gson;

@WebServlet("/api/clubSearch")
public class ClubSearchServlet extends HttpServlet {
  private Firestore db;
  private CollectionReference clubs;
  private Gson gson;

  public ClubSearchServlet() throws IOException {
    db = Utility.getFirestoreDb();
    clubs = db.collection("clubs");
    gson = new Gson();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    if (request.getParameter("searchTerm") == null || request.getParameterMap().size() > 1) {
      System.err.println("Error: Improper parameters, must only send searchTerm");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    String searchTerm = request.getParameter("searchTerm");
    Query query = clubs.orderBy("name").startAt(searchTerm).endAt(searchTerm + '\uf8ff');

    ArrayList<Map<String, Object>> clubs = new ArrayList<>();
    try {
      for (DocumentSnapshot document : query.get().get().getDocuments()) {
        clubs.add(document.getData());
      }
    } catch (InterruptedException | ExecutionException e) {
      System.err.println("Error\t:" + e.getMessage());
    }

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(clubs));
  }
}