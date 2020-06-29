package com.google.sps.servlets;

import com.google.sps.data.Club;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that allows users to post and get clubs. */
@WebServlet("/api/clubs")
public class ClubServlet extends HttpServlet {

  private JsonObject createRequestBodyJson(HttpServletRequest request) {
    JsonObject jsonObject = new JsonObject();
    StringBuffer jb = new StringBuffer();
    String line = null;
    try {
      BufferedReader reader = new BufferedReader(new InputStreamReader((request.getInputStream())));
      while ((line = reader.readLine()) != null) {
       jb.append(line);
      }
    } catch (Exception e) { 
      System.err.println("Error: " + e);
    }
    try {
      Gson gson = new Gson();
      JsonElement data = JsonParser.parseString(jb.toString());
      jsonObject = data.getAsJsonObject();
    } catch (Exception e) {
      System.err.println("Error parsing JSON request string");
    }

    return jsonObject;
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Club");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    List<Entity> entities = results.asList(FetchOptions.Builder.withLimit(5));

    List<Club> clubs = new ArrayList<>();
    for(Entity e : entities) {
      long id = (long) e.getKey().getId();
      String name = (String) e.getProperty("name");
      String description = (String) e.getProperty("description");
      String announcement = (String) e.getProperty("announcement");

      @SuppressWarnings("unchecked") // Cast can't verify generic type.
      Collection<String> posts = (ArrayList<String>) e.getProperty("posts");

      @SuppressWarnings("unchecked") // Cast can't verify generic type.
      Collection<Long> memberIDs = (HashSet<Long>) e.getProperty("memberIDs");
      
      @SuppressWarnings("unchecked") // Cast can't verify generic type.
      Collection<Long> inviteIDs = (HashSet<Long>) e.getProperty("inviteIDs");

      long ownerID = (long) e.getProperty("ownerID");
      String gbookID = (String) e.getProperty("gbookID");
      Club club = new Club(id, name, description, announcement, ownerID, gbookID);
      clubs.add(club);
    }
    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(clubs));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    JsonObject jsonObject = createRequestBodyJson(request);
    String name = jsonObject.get("name").getAsString();
    String description = jsonObject.get("description").getAsString();
    long ownerID = jsonObject.get("ownerID").getAsLong();

    String announcement = "";
    if (jsonObject.get("announcement") != null) {
      announcement = jsonObject.get("announcement").getAsString();
    }

    Collection<Long> inviteIDs = new ArrayList<>();
    if (jsonObject.get("inviteIDs") != null) {
      for(JsonElement j : jsonObject.get("inviteIDs").getAsJsonArray()) {
        inviteIDs.add(Long.parseLong(j.getAsString()));
      } 
    }

    String gbookID = "";
    if (jsonObject.get("gbookID") != null) {
      gbookID = jsonObject.get("gbookID").getAsString();
    }

    Entity clubEntity = new Entity("Club");

    clubEntity.setProperty("id", clubEntity.getKey().getId());
    clubEntity.setProperty("name", name);
    clubEntity.setProperty("description", description);
    clubEntity.setProperty("announcement", announcement);
    clubEntity.setProperty("posts" , new ArrayList<String>());
    clubEntity.setProperty("ownerID", ownerID);
    clubEntity.setProperty("inviteIDs", inviteIDs);
    clubEntity.setProperty("memberIDs", new ArrayList<Long>());
    clubEntity.setProperty("gbookID", gbookID);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(clubEntity);
  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    JsonObject jsonObject = createRequestBodyJson(request);
    long id = jsonObject.get("id").getAsLong();
    Entity clubEntity = new Entity("Club", id);

    String name = (String) clubEntity.getProperty("name");
    String description = (String) clubEntity.getProperty("description");
    String announcement = (String) clubEntity.getProperty("announcement");
    long ownerID = (long) clubEntity.getProperty("ownerID");
    String gbookID = (String) clubEntity.getProperty("gbookID");

    if (jsonObject.get("name") != null) {
      name = jsonObject.get("name").getAsString();
    }
    if (jsonObject.get("description") != null) {
      description = jsonObject.get("description").getAsString();
    }
    if (jsonObject.get("announcement") != null) {
      announcement = jsonObject.get("announcement").getAsString();
    }
    if (jsonObject.get("ownerID") != null) {
      ownerID = jsonObject.get("ownerID").getAsLong();
    }
    if (jsonObject.get("gbookID") != null) {
      gbookID = jsonObject.get("gbookID").getAsString();
    }

    clubEntity.setProperty("name", name);
    clubEntity.setProperty("description", description);
    clubEntity.setProperty("announcement", announcement);
    clubEntity.setProperty("ownerID", ownerID);
    clubEntity.setProperty("gbookID", gbookID);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(clubEntity);
  }
}
