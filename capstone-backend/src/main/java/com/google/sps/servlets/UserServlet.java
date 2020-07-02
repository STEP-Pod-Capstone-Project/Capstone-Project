package com.google.sps.servlets;

import com.google.sps.data.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.common.collect.ImmutableMap;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.util.stream.Collectors;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that stores User's data from Frontend Authentication. */
@WebServlet("/api/user")
public class UserServlet extends HttpServlet {

  private JsonObject jsonGottenObject;

  private Firestore getFirestore() throws IOException {
    return Utility.getFirestoreDb();
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    try {

      response.setHeader("Access-Control-Allow-Methods", "GET");
      response.setHeader("Access-Control-Allow-Credentials", "true");
      response.setHeader("Access-Control-Allow-Origin",
          "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

      String googleUserString = request.getReader().lines().collect(Collectors.joining());
      JsonObject googleUserJSON = JsonParser.parseString(googleUserString).getAsJsonObject();

      jsonGottenObject = googleUserJSON;

      JsonObject googleUserProfile = googleUserJSON.getAsJsonObject("profileObj");

      String googleId = googleUserProfile.get("googleId").getAsString();
      String email = googleUserProfile.get("email").getAsString();
      String fullname = googleUserProfile.get("name").getAsString();
      String profileImageUrl = googleUserProfile.get("imageUrl").getAsString();

      JsonObject googleUserTokenObject = googleUserJSON.getAsJsonObject("tokenObj");

      String tokenId = googleUserTokenObject.get("id_token").getAsString();
      String token_type = googleUserTokenObject.get("token_type").getAsString();
      String access_token = googleUserTokenObject.get("access_token").getAsString();
      String scope = googleUserTokenObject.get("scope").getAsString();
      String idpId = googleUserTokenObject.get("idpId").getAsString();

      User googleUser = new User(
        googleId, 
        email, 
        fullname, 
        profileImageUrl,  
        new ImmutableMap.Builder<String, String>()
          .put("token_id", tokenId)
          .put("token_type", token_type)
          .put("access_token", access_token)
          .put("scope", scope)
          .put("idpId", idpId)
          .build()
        );
      
      Firestore db = getFirestore(); 

      ApiFuture<WriteResult> futureUsers = db.collection("users").document(googleUser.getID()).set(googleUser);

      System.out.println("Update time : " + futureUsers.get().getUpdateTime());

    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
    }

  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin",
        "https://3000-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io");

    response.setContentType("application/json;");

    response.getWriter().println(jsonGottenObject);

    response.getWriter().println("\n\n\n\n" + jsonGottenObject.get("profileObj"));

    response.getWriter().println("\n\n\n\n" + jsonGottenObject.get("tokenObj"));

  }

}