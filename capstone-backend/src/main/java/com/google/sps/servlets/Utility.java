package com.google.sps.servlets;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.SetOptions;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;


public class Utility {
  public static Firestore getFirestoreDb() throws IOException {
    GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(credentials)
        .setProjectId("sopa-capstone-step-2020")
        .build();
    FirebaseApp.initializeApp(options);
    return FirestoreClient.getFirestore();
  }

  public static JsonObject createRequestBodyJson(HttpServletRequest request) {
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
      JsonParser parser = new JsonParser();
      JsonElement data = parser.parse(jb.toString());
      jsonObject = data.getAsJsonObject();
    } catch (Exception e) {
      System.err.println("Error parsing JSON request string");
    }
    return jsonObject;
  }

  public static <T> List<T> get(CollectionReference collectionReference, HttpServletRequest request, GenericClass<T> genClass) throws IOException {
    List<T> result = new ArrayList<>();
    if (request.getParameter("id") != null) {
      DocumentReference docRef = collectionReference.document(request.getParameter("id"));
      ApiFuture<DocumentSnapshot> future = docRef.get();
      DocumentSnapshot document = null;
      T item = null;
      try {
        document = future.get();
        if (document.exists()) {
          item = document.toObject(genClass.getMyType());
        } else {
          System.err.println("Error: no such document!");
        }
      } catch (Exception e) {
        System.err.println("Error: " + e);
      }
      result.add(item);
    }
    else {
      ApiFuture<QuerySnapshot> future = collectionReference.get();
      try {
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (QueryDocumentSnapshot document : documents) {
          result.add(document.toObject(genClass.getMyType()));
        }
      } catch (Exception e) {
        System.err.println("Error: " + e);
      }
    }
    return result;
  }

}