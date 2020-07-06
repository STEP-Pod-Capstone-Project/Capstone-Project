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
response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Origin", "https://3001-0b34ed39-12e2-4bb0-83f0-3edbd4365bbd.us-east1.cloudshell.dev");
response.setHeader("Set-Cookie", "cross-site-cookie=name; SameSite=None; Secure");


    List<Club> retrievedClubs = Utility.get(clubs, request, response, new GenericClass(Club.class));
    if (retrievedClubs != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(retrievedClubs));
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Origin", "https://3001-0b34ed39-12e2-4bb0-83f0-3edbd4365bbd.us-east1.cloudshell.dev");
response.setHeader("Set-Cookie", "cross-site-cookie=name; SameSite=None; Secure");


    JsonObject jsonObject = Utility.createRequestBodyJson(request);
    String id = jsonObject.get("id").getAsString();
    String name = jsonObject.get("name").getAsString();
    String ownerID = jsonObject.get("ownerID").getAsString();
    String description = "";
    String gbookID = "";

    if (jsonObject.get("description") != null) {
      description = jsonObject.get("description").getAsString();
    }
    if (jsonObject.get("gbookID") != null) {
      gbookID = jsonObject.get("gbookID").getAsString();
    }

    Club club = new Club(name, description, ownerID, gbookID);
    ApiFuture<WriteResult> asyncDocument = clubs.document(id).set(club);
    try {
      System.out.println("Update time : " + asyncDocument.get().getUpdateTime());
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(club));
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
