package com.google.sps.servlets;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.gson.Gson;

import com.google.sps.data.Club;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/clubs")
public class ClubServlet extends HttpServlet {
  private Firestore db;
  private CollectionReference clubs;
  private Gson gson;

  public ClubServlet() throws IOException {
    db = Utility.getFirestoreDb();
    clubs = db.collection("clubs");
    gson = new Gson();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    List<Club> retrievedClubs;

    // If searchTerm is present, search for Clubs in Firestore using prefix matching 
    if (request.getParameter("searchTerm") != null) {
      if (request.getParameterMap().size() > 1) {
        System.err.println("Error: Improper parameters, must send searchTerm without other parameters");
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return;
      }

      String searchTerm = request.getParameter("searchTerm");
      Query query = clubs.orderBy("name").startAt(searchTerm).endAt(searchTerm + '\uf8ff');
      retrievedClubs = new ArrayList<>();
      try {
        Club club;
        for (DocumentSnapshot document : query.get().get().getDocuments()) {
          club = document.toObject(Club.class);
          club.setId(document.getId());
          retrievedClubs.add(club);
        }
      } catch (InterruptedException | ExecutionException e) {
        System.err.println("Error\t:" + e.getMessage());
      }
    } else {
      retrievedClubs = Utility.get(clubs, request, response, new GenericClass(Club.class));
    }

    if (retrievedClubs != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(retrievedClubs));
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<String> requiredFields = new ArrayList<String>(Arrays.asList("name", "ownerID"));
    Club createdClub = (Club) Utility.post(clubs, request, response, new GenericClass(Club.class), requiredFields);
    if (createdClub != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(createdClub));
    }
  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Club updatedClub = (Club) Utility.put(clubs, request, response, new GenericClass(Club.class));
    if (updatedClub != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(updatedClub));
    }
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Utility.delete(clubs, request, response);
  }
}
