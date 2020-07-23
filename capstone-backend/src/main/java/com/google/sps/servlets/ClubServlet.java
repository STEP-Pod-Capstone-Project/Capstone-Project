package com.google.sps.servlets;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;

import com.google.gson.Gson;

import com.google.sps.data.Club;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Origin", "https://3000-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io");
response.setHeader("Set-Cookie", "cross-site-cookie=name; SameSite=None; Secure");
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

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Utility.delete(clubs, request, response);
  }
}
