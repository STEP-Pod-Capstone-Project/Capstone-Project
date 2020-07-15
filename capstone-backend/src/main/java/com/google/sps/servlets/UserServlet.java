package com.google.sps.servlets;

import com.google.sps.data.User;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.common.collect.ImmutableMap;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.util.Collections;

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
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Origin", "https://3000-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io");
response.setHeader("Set-Cookie", "cross-site-cookie=name; SameSite=None; Secure");
 
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
              .put("token_id", tokenId)
              .put("token_type", token_type)
              .put("access_token", access_token)
              .put("scope", scope)
              .put("idpId", idpId)
              .build());

      } else {
        System.err.println("Invalid ID token.");
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        return;
      }

      // TODO(#47): Update Acess Token if it expires.

      Firestore db = getFirestore();

      ApiFuture<WriteResult> futureUsers = db.collection("users").document(googleUser.getID()).set(googleUser);

      System.out.println("UserServlet Update time : " + futureUsers.get().getUpdateTime());

    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
    }

  }
}