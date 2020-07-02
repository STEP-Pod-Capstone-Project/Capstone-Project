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
import java.lang.reflect.Field;
import java.util.List;
import java.util.ArrayList;
import java.util.Map; 

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


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

  private static <T> List<T> getById(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
    if (request.getParameterMap().size() > 1) {
      System.err.println("Error: No other parameter can be sent with an ID");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    List<T> retrievedObjects = new ArrayList<>();
    ApiFuture<QuerySnapshot> asyncQuery;
    DocumentReference docRef = collectionReference.document(request.getParameter("id"));
    ApiFuture<DocumentSnapshot> asyncDocument = docRef.get();
    DocumentSnapshot document = null;
    T item = null;
    try {
      document = asyncDocument.get();
      if (document.exists()) {
        item = document.toObject(genericClass.getMyType());
      } else {
        System.err.println("Error: no such document!");
        response.sendError(HttpServletResponse.SC_NOT_FOUND);
        return null;
      }
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return null;
    }
    retrievedObjects.add(item);
    return retrievedObjects;
  }

  private static <T> ApiFuture<QuerySnapshot> getByField(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
    Map.Entry<String, String[]> entry = request.getParameterMap().entrySet().iterator().next();
    String parameterName = entry.getKey();
    if (entry.getValue().length != 1) {
      System.err.println("Error: Each parameter should have only one value");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    if (entry.getValue()[0].isEmpty()) {
      System.err.println("Error: The parameter value cannot be empty");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    String parameterValue = entry.getValue()[0];
    Field[] fields = genericClass.getMyType().getDeclaredFields();
    boolean containsParameter = false;
    boolean parameterIsList = false;
    for (Field field : fields) {
      if (field.getName().equals(parameterName)) {
        containsParameter = true;
        if (field.getType().getName().equals("java.util.List") || field.getType().getName().equals("java.util.ArrayList")) {
          parameterIsList = true;
        }
      }
    }
    if (!containsParameter) {
      System.err.println("Error: The object does not have the field specified in the request parameter.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    if (!parameterIsList) {
      return collectionReference.whereEqualTo(parameterName, parameterValue).get(); 
    }
    else {
      return collectionReference.whereArrayContains(parameterName, parameterValue).get();
    }
  }

  public static <T> List<T> get(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
    List<T> retrievedObjects = new ArrayList<>();
    ApiFuture<QuerySnapshot> asyncQuery;
    if (request.getParameter("id") != null) {
      return getById(collectionReference, request, response, genericClass);
    }
    if (request.getParameterMap().size() == 0) {
      asyncQuery = collectionReference.get();
    }
    else if (request.getParameterMap().size() == 1) {
      asyncQuery = getByField(collectionReference, request, response, genericClass);
      if (asyncQuery == null) {
        return null;
      }
    }
    else {
      System.err.println("Error: Only one parameter may be sent in the request");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    try {
      List<QueryDocumentSnapshot> documents = asyncQuery.get().getDocuments();
      for (QueryDocumentSnapshot document : documents) {
        retrievedObjects.add(document.toObject(genericClass.getMyType()));
      }
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return null;
    }
    return retrievedObjects;
  }

}