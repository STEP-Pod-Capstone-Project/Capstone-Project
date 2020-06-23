package com.google.sps.servlets;

import com.google.sps.data.Club;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that allows users to post and get comments. */
@WebServlet("/api/clubs")
public class ClubServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String stringID = request.getParameter("id");
    Query query = new Query("Club");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    long id = Long.parseLong(stringID);

    PreparedQuery results = datastore.prepare(query);
    
    List<Entity> entities = results.asList(FetchOptions.Builder.withLimit(5));
    List<Club> clubs = new ArrayList<>();
    for(Entity e : entities) {
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
    String name = request.getParameter("name");
    String description = request.getParameter("description");
    long ownerID = Long.parseLong(request.getParameter("ownerID"));

    String announcement = "";
    if (request.getParameter("announcement") != null) {
      announcement = request.getParameter("announcement");
    }

    Collection<Long> inviteIDs = new ArrayList<>();
    if (request.getParameterValues("inviteIDs") != null) {
      for(String s : request.getParameterValues("inviteIDs")) {
        inviteIDs.add(Long.parseLong(s));
      } 

    String gbookID = "";
    if (request.getParameter("gbookID") != null) {
      gbookID = request.getParameter("gbookID");
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
    Entity clubEntity = new Entity("Club", Long.parseLong(request.getParameter("id")));

    String name = (String) clubEntity.getProperty("name");
    String description = (String) clubEntity.getProperty("description");
    String announcement = (String) clubEntity.getProperty("announcement");
    long ownerID = (long) clubEntity.getProperty("ownerID");
    String gbookID = (String) clubEntity.getProperty("gbookID");

    if (request.getParameter("name") != null) name = request.getParameter("name");
    if (request.getParameter("description") != null) description = request.getParameter("description");
    if (request.getParameter("announcement") != null) announcement = request.getParameter("announcement");
    if (request.getParameter("ownerID") != null) ownerID = Long.parseLong(request.getParameter("ownerID"));
    if (request.getParameter("gbookID") != null) gbookID = request.getParameter("gbookID");

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(clubEntity);
  }
}
