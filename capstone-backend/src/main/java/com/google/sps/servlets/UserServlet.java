package com.google.sps.servlets;

import com.google.sps.data.User;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import com.google.cloud.firestore.WriteResult;
import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that stores User's data from Frontend Authentication. */
@WebServlet("/api/user")
public class UserServlet extends HttpServlet {

  private Firestore getFirestore() throws IOException {
    return Utility.getFirestoreDb();
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    
    try {

      JsonObject googleUserTokenObjJSON = Utility.createRequestBodyJson(request);

      String tokenId = googleUserTokenObjJSON.get("id_token").getAsString();
      String token_type = googleUserTokenObjJSON.get("token_type").getAsString();
      String access_token = googleUserTokenObjJSON.get("access_token").getAsString();
      String scope = googleUserTokenObjJSON.get("scope").getAsString();
      String idpId = googleUserTokenObjJSON.get("idpId").getAsString();

      User googleUser;

      GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
          .setAudience(
              // Client ID URL
              Collections.singletonList("962122785123-t0pm10o610q77epuh9d1jjs29hamm1nf.apps.googleusercontent.com"))
          .build();

      GoogleIdToken googleIdToken = verifier.verify(tokenId);

      if (googleIdToken != null) {

        Payload payload = googleIdToken.getPayload();

        // Get profile information from payload
        String googleId = payload.getSubject();
        String email = payload.getEmail();
        String fullname = (String) payload.get("name");
        String profileImageUrl = (String) payload.get("picture");

        googleUser = new User(googleId, email, fullname, profileImageUrl,
            new ImmutableMap.Builder<String, String>()
              .put("access_token", access_token)
              .put("idpId", idpId)
              .put("scope", scope)
              .put("token_id", tokenId)
              .put("token_type", token_type)
              .build());

      } else {
        System.err.println("Invalid ID token.");
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        return;
      }

      Firestore db = getFirestore();

      ApiFuture<WriteResult> futureUsers = db.collection("users").document(googleUser.getID()).set(googleUser);

      System.out.println("UserServlet Update time : " + futureUsers.get().getUpdateTime());

    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
    }
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    String userID = request.getParameter("id");
    Map<String, Object> user = new HashMap<>();

    if (userID == null) {
      System.err.println("Error:\t" + "Null Id");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    Firestore db = getFirestore();

    try {
      DocumentSnapshot document = db.collection("users").document(userID).get().get();
      user = document.getData();

    } catch (ExecutionException | InterruptedException e) {
      System.err.println("Error:\t" + e.getMessage());
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(user));

  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    JsonObject jsonObject = Utility.createRequestBodyJson(request);
    CollectionReference users = getFirestore().collection("users");
    String id = "";
    try {
      id = jsonObject.get("id").getAsString();
    } catch (Exception e) {
      System.err.println("Error: " + e);
      System.err.println("This error was likely caused by a lack of an \"id\" field in the post body.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    if (id.length() == 0) {
      System.err.println("Error caused by either an empty or non-existent \"id\" field in the post body.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    Map<String, Object> update = new HashMap<>();
    if (jsonObject.keySet().contains("add_friendIDs")) {
      update.put("friendIDs", FieldValue.arrayUnion(jsonObject.get("add_friendIDs").getAsString()));
    } else if (jsonObject.keySet().contains("remove_friendIDs")) {
      update.put("friendIDs", FieldValue.arrayRemove(jsonObject.get("remove_friendIDs").getAsString()));
    } else {
      System.err.println("Error: The user put method does not support at least one of the given keys.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    ApiFuture<WriteResult> writeResult = users.document(id).set(update, SetOptions.merge());
    try {
      System.out.println("Put update time : " + writeResult.get().getUpdateTime());
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
  }
}