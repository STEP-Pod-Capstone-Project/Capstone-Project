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
import com.google.gson.JsonParser;

import com.google.sps.data.Club;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
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
    List<Club> clubsRetrieved = new ArrayList<>();
    if (request.getParameter("id") != null) {
      DocumentReference docRef = clubs.document(request.getParameter("id"));
      ApiFuture<DocumentSnapshot> asyncDocument = docRef.get();
      DocumentSnapshot document = null;
      Club club = null;
      try {
        document = asyncDocument.get();
        if (document.exists()) {
          club = document.toObject(Club.class);
        } else {
          System.err.println("Error: no such document!");
          response.sendError(HttpServletResponse.SC_NOT_FOUND);
          return;
        }
      } catch (Exception e) {
        System.err.println("Error: " + e);
        response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        return;
      }
      clubsRetrieved.add(club);
    }
    else {
      ApiFuture<QuerySnapshot> asyncDocument = clubs.get();
      try {
        List<QueryDocumentSnapshot> documents = asyncDocument.get().getDocuments();
        for (QueryDocumentSnapshot document : documents) {
          clubsRetrieved.add(document.toObject(Club.class));
        }
      } catch (Exception e) {
        System.err.println("Error: " + e);
        response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        return;
      }
    }
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(clubsRetrieved));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
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

    Club club = new Club(id, name, description, ownerID, gbookID);
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
    JsonObject jsonObject = Utility.createRequestBodyJson(request);
    String id = jsonObject.get("id").getAsString();
    Map<String, Object> update = new HashMap<>();
    DocumentReference docRef = clubs.document(request.getParameter("id"));
    ApiFuture<DocumentSnapshot> asyncDocument = docRef.get();
    DocumentSnapshot document = null;
    Club club = null;

    try {
      document = asyncDocument.get();
      if (document.exists()) {
        club = document.toObject(Club.class);
      } else {
        System.err.println("Error: no such document!");
        response.sendError(HttpServletResponse.SC_NOT_FOUND);
        return;
      }
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }

    if (jsonObject.get("name") != null) {
      String name = jsonObject.get("name").getAsString();
      club.setName(name);
      update.put("name", name);
    }
    if (jsonObject.get("description") != null) {
      String description = jsonObject.get("description").getAsString();
      club.setDescription(description);
      update.put("description", description);
    }
    if (jsonObject.get("gbookID") != null) {
      String gbookID = jsonObject.get("gbookID").getAsString();
      club.setGbookID(gbookID);
      update.put("gbookID", gbookID);
    }

    ApiFuture<WriteResult> writeResult = clubs.document(id).set(update, SetOptions.merge());
    try {
      System.out.println("Update time : " + writeResult.get().getUpdateTime());
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(club));
  }
}