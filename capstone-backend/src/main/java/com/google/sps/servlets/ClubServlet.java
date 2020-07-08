package com.google.sps.servlets;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.SetOptions;
import com.google.cloud.firestore.WriteResult;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import com.google.sps.data.Club;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

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
    List<Club> retrievedClubs = Utility.get(clubs, request, response, new GenericClass(Club.class));
    if (retrievedClubs != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(retrievedClubs));
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<String> requiredFields = new ArrayList<String>( Arrays.asList("name", "ownerID") );
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
}
