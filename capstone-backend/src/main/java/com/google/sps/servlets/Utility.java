package com.google.sps.servlets;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
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
import com.google.gson.reflect.TypeToken;

import com.google.sps.data.BaseEntity;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
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
   * @param {id} id to be searched 
   * @param {collectionReference} reference to the appropriate database collection
   * @param {request} request sent to the backend
   * @param {response} response returned from the call
   * @param {genericClass} a Generic class, used in casting documents from the database
   * @return List<T> a singleton List of the Object that matches the ID in the request.
   */
  private static <T extends BaseEntity> List<T> getById(String id, CollectionReference collectionReference, 
      HttpServletRequest request, HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
    if (id.length() == 0) {
      System.err.println("Error caused by either an empty or non-existent \"id\" field in the post body.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    if (request.getParameterMap().size() > 1) {
      System.err.println("Error: No other parameter can be sent with an ID");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    List<T> retrievedObjects = new ArrayList<>();
    DocumentReference docRef = collectionReference.document(id);
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
   * @param {collectionReference} reference to the appropriate collection of documents in the database
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
   * @param {collectionReference} the appropriate collection of documents in the database
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
      return getById(request.getParameter("id"), collectionReference, request, response, genericClass);
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

  public static <T extends BaseEntity> T put(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
    JsonObject jsonObject = Utility.createRequestBodyJson(request);
    String id = "";
    try {
      id = jsonObject.get("id").getAsString();
    } catch (Exception e) {
      System.err.println("Error: " + e);
      System.err.println("This error was likely caused by a lack of an \"id\" field in the post body.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    if (id.length() == 0) {
      System.err.println("Error caused by either an empty or non-existent \"id\" field in the post body.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }
    Map<String, Object> update = new HashMap<>();
    Field[] fields = genericClass.getMyType().getDeclaredFields();
    boolean containsParameter = false;
    for (String key : jsonObject.keySet()) {
      for (Field field: fields) {
        String type = field.getType().getName();
        if (field.getName().equals(key)) {
          containsParameter = true;
          if (type.equals("int") || type.equals("java.lang.Integer")) {
            update.put(key, jsonObject.get(key).getAsInt());
          }
          if (type.equals("java.lang.String") && !field.getName().equals("id")) {
            update.put(key, jsonObject.get(key).getAsString());
          }
          if (type.equals("boolean") || type.equals("java.lang.Boolean")) {
            update.put(key, jsonObject.get(key).getAsBoolean());
          }
          else {
            System.err.println("Error: Bad type in request: can't be cast to Integer, String or Boolean.");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return null;
          }
        }
        else if (("add_"+field.getName()).equals(key)) {
          if (type.equals("java.util.List") || type.equals("java.util.ArrayList")) {
            containsParameter = true;
            update.put(field.getName(), FieldValue.arrayUnion(jsonObject.get(key).getAsString()));
          }
        }
        else if (("remove_"+field.getName()).equals(key)) {
          if (type.equals("java.util.List") || type.equals("java.util.ArrayList")) {
            containsParameter = true;
            update.put(field.getName(), FieldValue.arrayRemove(jsonObject.get(key).getAsString()));
          }
        }
      }
      if (!containsParameter) {
        System.err.println("Error: The object does not have the field specified in the request parameter.");
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return null;
      }
      containsParameter = false;
    }

    ApiFuture<WriteResult> writeResult = collectionReference.document(id).set(update, SetOptions.merge());
    try {
      System.out.println("Update time : " + writeResult.get().getUpdateTime());
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return null;
    }
    return getById(id, collectionReference, request, response, genericClass).get(0);
  }

  public static <T extends BaseEntity> boolean postErrorHandler(JsonObject jsonObject, HttpServletResponse response, 
      GenericClass<T> genericClass, Field[] fields, List<String> requiredFields) throws IOException {
    List<String> list = new ArrayList<>();
    List<String> fieldNames = fields.stream().map(f -> f.getName()).collect(Collectors.toList());
    list.addAll(jsonObject.keySet());
    list.retainAll(fieldNames);
    if (list.size() != jsonObject.keySet().size()) {
      System.err.println("Error: Not all parameters in the request body are fields of the given class.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return false;
    } 
    list.clear();
    list.addAll(jsonObject.keySet().stream()
                    .filter(key -> jsonObject.get(key).getAsString().length() > 0)
                    .collect(Collectors.toList()));
    list.retainAll(requiredFields);
    if (list.size() != requiredFields.size()) {
      System.err.println("Error: Not all required fields are present in the request body, or some required fields are empty.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return false;
    } 
    return true;
  }

  public static <T extends BaseEntity> T post(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response, GenericClass<T> genericClass, List<String> requiredFields) throws IOException {
    Map<String, Object> constructorFields = new HashMap<>();
    JsonObject jsonObject = Utility.createRequestBodyJson(request);
    Field[] fields = genericClass.getMyType().getDeclaredFields();
    if (!postErrorHandler(jsonObject, response, genericClass, fields, requiredFields)) {
      return null;
    }
    for (Field f : fields) {
      String name = f.getName();
      String type = f.getType().getName();
      if (type.equals("int") || type.equals("java.lang.Integer")) {
        if (jsonObject.has(name) && jsonObject.get(name).getAsString().length() != 0) {
          constructorFields.put(name, jsonObject.get(name).getAsInt());
        }
        else {
          constructorFields.put(name, -1);
        }
      }
      else if (type.equals("java.lang.String")) {
        if (jsonObject.has(name) && jsonObject.get(name).getAsString().length() != 0) {
          constructorFields.put(name, jsonObject.get(name).getAsString());
        }
        else {
          constructorFields.put(name, "");
        }
      }
      else if (type.equals("boolean") || type.equals("java.lang.boolean")) {
        if (jsonObject.has(name) && jsonObject.get(name).getAsString().length() != 0) {
          constructorFields.put(name, jsonObject.get(name).getAsBoolean());
        }
        else {
          constructorFields.put(name, false);
        }
      }
      else if (type.equals("java.util.List") || type.equals("java.util.ArrayList")) {
        if (jsonObject.has(name) && jsonObject.get(name).getAsString().length() != 0) {
          // First check to see if it's an "actual array"
          try {
            JsonElement value = jsonObject.get(name);
            Type listType = new TypeToken<List<String>>() {}.getType();
            constructorFields.put(name, new Gson().fromJson(value, listType));
          } catch (Exception e) { //if not, see if it's a comma separated list
              String stringValue = jsonObject.get(name).getAsString().replace("[", "").replace("]", "");
              List<String> listValue = Arrays.asList(stringValue.split(", "));
              constructorFields.put(name, listValue);
            }
          }
        else {
          constructorFields.put(name, new ArrayList<String>());
        }
      }
      else {
        System.err.println("Error: unsupported type");
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return null;
      }
    }

    ApiFuture<DocumentReference> asyncDocument = collectionReference.add(constructorFields);
    try {
      return getById(asyncDocument.get().getId(), collectionReference, request, response, genericClass).get(0);
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return null;
    }
  }
  
   /**
   * Deletes the object with the id given in the request query from the given collectionReference
   * @param {collectionReference} reference to the appropriate collection of documents in the database
   * @param {request} request sent to the backend
   * @param {response} response returned from the call
   * @return boolean true if the object is successfully deleted, false if not
   */
  public static boolean delete(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response) throws IOException {
    if (request.getParameterMap().size() > 1) {
      System.err.println("Error: No other parameter can be sent with an ID");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return false;
    }
    if (request.getParameter("id") != null) {
      String id = request.getParameter("id");
      if (id.length() == 0) {
        System.err.println("Error caused by an empty \"id\" field in the post body.");
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return false;
      }
      ApiFuture<WriteResult> writeResult = collectionReference.document(id).delete();
      System.out.println("Update time : " + writeResult.get().getUpdateTime());
      return true;
    }
    else {
      System.err.println("Error caused by a non-existent \"id\" field in the post body.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return false;
    }
  }
}
