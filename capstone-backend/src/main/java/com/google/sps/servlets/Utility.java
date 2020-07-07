package com.google.sps.servlets;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
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

import com.google.sps.data.BaseEntity;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map; 
import java.util.stream.Collectors;

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

  public static JsonObject createRequestBodyJson(HttpServletRequest request) throws IOException {
    String jsonObjectString = request.getReader().lines().collect(Collectors.joining());
    JsonObject jsonObject = JsonParser.parseString(jsonObjectString).getAsJsonObject();
    return jsonObject;
  }

  /**
   * Query the given collection by id. 
   * @param {collectionReference} reference to the appropriate database collection
   * @param {request} request sent to the backend
   * @param {response} response returned from the call
   * @param {genericClass} a Generic class, used in casting documents from the database
   * @return List<T> a singleton List of the Object that matches the ID in the request.
   */
  private static <T extends BaseEntity> List<T> getById(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
    if (request.getParameterMap().size() > 1) {
      System.err.println("Error: No other parameter can be sent with an ID");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    List<T> retrievedObjects = new ArrayList<>();
    DocumentReference docRef = collectionReference.document(request.getParameter("id"));
    ApiFuture<DocumentSnapshot> asyncDocument = docRef.get();
    DocumentSnapshot document = null;
    T item = null;
    try {
      document = asyncDocument.get();
      if (document.exists()) {
        item = document.toObject(genericClass.getMyType());
        item.setId(document.getId());
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

  /**
   * Appends filters to the given query depending on fields in the request query 
   * @param {genericClass} a Generic class, used in casting documents from the database
   * @param {response} response returned from the call
   * @param {it} iterator for the Map of query parameter names to values
   * @param {query} query being modified, to eventually be used to query the database.
   * @return Query the query being modified, to eventually be used to query the database.
   */
  private static <T extends BaseEntity> Query addToQuery(GenericClass<T> genericClass, HttpServletResponse response, 
      Iterator<Map.Entry<String, String[]>> it, Query query) throws IOException {
    Map.Entry<String, String[]> entry = it.next();
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
      return query.whereEqualTo(parameterName, parameterValue);
    }
    else {
      return query.whereArrayContains(parameterName, parameterValue);
    }
  }

  /**
   * Gets an asynchronous collection of matching documents from the database matching the request
   * @param {collectionRefence} reference to the appropriate collection of documents in the database
   * @param {request} request sent to the backend
   * @param {response} response returned from the call
   * @param {genericClass} a Generic class, used in casting documents from the database
   * @return ApiFuture<QuerySnapshot> the asynchronous query results from the given filters.
   */
  private static <T extends BaseEntity> ApiFuture<QuerySnapshot> getByField(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
    Iterator<Map.Entry<String, String[]>> it = request.getParameterMap().entrySet().iterator();
    if (!it.hasNext()) {
      System.err.println("Error in iterating through the request query map");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    Map.Entry<String, String[]> entry = it.next();
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
    Query query = parameterIsList ? collectionReference.whereArrayContains(parameterName, parameterValue)
        : collectionReference.whereEqualTo(parameterName, parameterValue);
    while (it.hasNext()) {
      query = addToQuery(genericClass, response, it, query);
      if (query == null) {
        return null;
      }
    }
    return query.get();
  }

  /**
   * Performs a get request on the given collection, allowing the requester to apply any number 
   * of queries both for equality and to check membership in list fields. Query parameters must 
   * match object field names exactly. If no queries are applied, the entire collection
   * is returned. If an ID is supplied, a singleton list with that object is returned. 
   * @param {collectionRefence} the appropriate collection of documents in the database
   * @param {request} the request sent to the backend
   * @param {response} the response returned from the call
   * @param {genericClass} a Generic class, to be used in casting objects retrieved from the database
   * @return Query the query being modified, to eventually be used to query the database.
   */
  public static <T extends BaseEntity> List<T> get(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
    List<T> retrievedObjects = new ArrayList<>();
    ApiFuture<QuerySnapshot> asyncQuery;
    if (request.getParameter("id") != null) {
      return getById(collectionReference, request, response, genericClass);
    }
    if (request.getParameterMap().size() == 0) {
      asyncQuery = collectionReference.get();
    }
    else {
      asyncQuery = getByField(collectionReference, request, response, genericClass);
      if (asyncQuery == null) {
        return null;
      }
    }
    try {
      retrievedObjects = asyncQuery.get().getDocuments().stream()
                             .map(d -> {
                                        T t = d.toObject(genericClass.getMyType());
                                        t.setId(d.getId());
                                        return t;
                                       })
                             .collect(Collectors.toList());
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return null;
    }
    return retrievedObjects;
  }
}
