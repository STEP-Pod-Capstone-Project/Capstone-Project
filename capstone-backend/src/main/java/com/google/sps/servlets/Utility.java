package com.google.sps.servlets;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
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

import java.io.FileInputStream;
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

    // Firebase already initialize
    if (!FirebaseApp.getApps().isEmpty()) {
      return FirestoreClient.getFirestore();
    }

    FileInputStream serviceAccount = new FileInputStream(
        "./sopa-capstone-step-2020-firebase-adminsdk-f2rym-883a473e3d.json");

    FirebaseOptions options = new FirebaseOptions.Builder()
      .setCredentials(GoogleCredentials.fromStream(serviceAccount))
      .setDatabaseUrl("https://sopa-capstone-step-2020.firebaseio.com")
      .build();

    FirebaseApp.initializeApp(options);
    return FirestoreClient.getFirestore();
  }

  public static JsonObject createRequestBodyJson(HttpServletRequest request) throws IOException {
    String jsonObjectString = request.getReader().lines().collect(Collectors.joining());
    JsonElement jsonElement = JsonParser.parseString(jsonObjectString);
    JsonObject jsonObject = jsonElement.getAsJsonObject();
    
    return jsonObject;
  }

  /**
   * Query the given collection by id. 
   * @param {id} id to be searched 
   * @param {collectionReference} reference to the appropriate database collection
   * @param {request}             request sent to the backend
   * @param {response}            response returned from the call
   * @param {genericClass}        a Generic class, used in casting documents from
   *                              the database
   * @return List<T> a singleton List of the Object that matches the ID in the
   *         request.
   */
  private static <T extends BaseEntity> List<T> getById(String id, CollectionReference collectionReference, 
      HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
    if (id.length() == 0) {
      System.err.println("Error caused by either an empty or non-existent \"id\" field in the post body.");
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
   * 
   * @param {genericClass} a Generic class, used in casting documents from the
   *                       database
   * @param {response}     response returned from the call
   * @param {it}           iterator for the Map of query parameter names to values
   * @param {query}        query being modified, to eventually be used to query
   *                       the database.
   * @return Query the query being modified, to eventually be used to query the
   *         database.
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
    Class superClass = genericClass.getMyType().getSuperclass();
    List<Field> fields = new ArrayList<>(Arrays.asList(genericClass.getMyType().getDeclaredFields()));
    fields.addAll(Arrays.asList(superClass.getDeclaredFields()));
    boolean containsParameter = false;
    boolean parameterIsList = false;
    for (Field field : fields) {
      if (field.getName().equals(parameterName)) {
        containsParameter = true;
        if (field.getType().getName().equals("java.util.List")
            || field.getType().getName().equals("java.util.ArrayList")) {
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
    } else {
      return query.whereArrayContains(parameterName, parameterValue);
    }
  }

  /**
   * Gets an asynchronous collection of matching documents from the database
   * matching the request
   * 
   * @param {collectionRefence} reference to the appropriate collection of
   *                            documents in the database
   * @param {request}           request sent to the backend
   * @param {response}          response returned from the call
   * @param {genericClass}      a Generic class, used in casting documents from
   *                            the database
   * @return ApiFuture<QuerySnapshot> the asynchronous query results from the
   *         given filters.
   */
  private static <T extends BaseEntity> ApiFuture<QuerySnapshot> getByField(CollectionReference collectionReference,
      HttpServletRequest request, HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
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
    Class superClass = genericClass.getMyType().getSuperclass();
    List<Field> fields = new ArrayList<>(Arrays.asList(genericClass.getMyType().getDeclaredFields()));
    fields.addAll(Arrays.asList(superClass.getDeclaredFields()));
    boolean containsParameter = false;
    boolean parameterIsList = false;
    for (Field field : fields) {
      if (field.getName().equals(parameterName)) {
        containsParameter = true;
        if (field.getType().getName().equals("java.util.List")
            || field.getType().getName().equals("java.util.ArrayList")) {
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
   * Performs a get request on the given collection, allowing the requester to
   * apply any number of queries both for equality and to check membership in list
   * fields. Query parameters must match object field names exactly. If no queries
   * are applied, the entire collection is returned. If an ID is supplied, a
   * singleton list with that object is returned.
   * 
   * @param {collectionRefence} the appropriate collection of documents in the
   *                            database
   * @param {request}           the request sent to the backend
   * @param {response}          the response returned from the call
   * @param {genericClass}      a Generic class, to be used in casting objects
   *                            retrieved from the database
   * @return Query the query being modified, to eventually be used to query the
   *         database.
   */
  public static <T extends BaseEntity> List<T> get(CollectionReference collectionReference, HttpServletRequest request,
      HttpServletResponse response, GenericClass<T> genericClass) throws IOException {
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Origin", "https://3000-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io");
response.setHeader("Set-Cookie", "cross-site-cookie=name; SameSite=None; Secure");
    List<T> retrievedObjects = new ArrayList<>();
    ApiFuture<QuerySnapshot> asyncQuery;
    if (request.getParameter("id") != null) {
      if (request.getParameterMap().size() > 1) {
        System.err.println("Error: No other parameter can be sent with an ID");
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return null;
      }
      return getById(request.getParameter("id"), collectionReference, response, genericClass);
    }
    if (request.getParameterMap().size() == 0) {
      asyncQuery = collectionReference.get();
    } else {
      asyncQuery = getByField(collectionReference, request, response, genericClass);
      if (asyncQuery == null) {
        return null;
      }
    }
    try {
      retrievedObjects = asyncQuery.get().getDocuments().stream().map(d -> {
        T t = d.toObject(genericClass.getMyType());
        t.setId(d.getId());
        return t;
      }).collect(Collectors.toList());
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return null;
    }

    return retrievedObjects;
  }

  /**
   * Performs a put on the given collection, allowing the requester to supply fields to be changed. 
   * Request body fields must match object field names exactly, except in the case of lists.
   * To add to a list the body should contain a key "add_<listName>" and to remove from a list the 
   * body should contain a key "remove_<listName>". The updated object is returned.
   * @param {collectionRefence} the appropriate collection of documents in the database
   * @param {request} the request sent to the backend
   * @param {response} the response returned from the call
   * @param {genericClass} a Generic class, to be used in casting objects retrieved from the database
   * @return T the object being modified.
   */
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
    Class superClass = genericClass.getMyType().getSuperclass();
    List<Field> fields = new ArrayList<>(Arrays.asList(genericClass.getMyType().getDeclaredFields()));
    fields.addAll(Arrays.asList(superClass.getDeclaredFields()));
    boolean containsParameter = false;
    for (String key : jsonObject.keySet()) {
      containsParameter = false;
      if (key.equals("id")) containsParameter = true;
      if (jsonObject.get(key).getAsString().length() == 0) continue;
      for (Field field: fields) {
        String type = field.getType().getName();
        String name = field.getName();
        if (key.equals(name)) {
          containsParameter = true;
          if (type.equals("int") || type.equals("java.lang.Integer")) {
            update.put(name, jsonObject.get(name).getAsInt());
          }
          else if (type.equals("java.lang.String")) {
            if (!name.equals("id")){
              update.put(name, jsonObject.get(name).getAsString());
            }
          }
          else if (type.equals("boolean") || type.equals("java.lang.Boolean")) {
            update.put(name, jsonObject.get(name).getAsBoolean());
          }
          else {
            System.err.println("Error: Bad type in request: can't be cast to Integer, String or Boolean.");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return null;
          }
        }
        else if (key.equals("add_"+name)) {
          if (type.equals("java.util.List") || type.equals("java.util.ArrayList")) {
            containsParameter = true;
            update.put(name, FieldValue.arrayUnion(jsonObject.get(key).getAsString()));
          }
        }
        else if (key.equals("remove_"+name)) {
          if (type.equals("java.util.List") || type.equals("java.util.ArrayList")) {
            containsParameter = true;
            update.put(name, FieldValue.arrayRemove(jsonObject.get(key).getAsString()));
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
      System.out.println("Put update time : " + writeResult.get().getUpdateTime());
    } catch (Exception e) {
      System.err.println("Error: " + e);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return null;
    }
    return getById(id, collectionReference, response, genericClass).get(0);
  }

  /**
   * This method assures that the given post request is valid, contains the necessary fields, and 
   * does not contain keys that do not match object fields exactly.
   * @param {jsonObject} the supplied request body in json form
   * @param {response} response returned from the call
   * @param {fields} the Fields (contains name and type) of the class being used  
   * @param {requiredFields} a list of the names of fields deemed "necessary" for creation of an object.
   * @return boolean true if it is a valid post request, false if not
   */
  public static <T extends BaseEntity> boolean postErrorHandler(JsonObject jsonObject, HttpServletResponse response, 
      List<Field> fields, List<String> requiredFields) throws IOException {
    List<String> list = new ArrayList<>();
    List<String> fieldNames = fields.stream().map(f -> f.getName()).collect(Collectors.toList());
    fieldNames.add("token"); // allows us to pass user tokens to the backend without errors
    // Every jsonObject key must match a field name, except for token. If not, this check will fail. 
    if (!fieldNames.containsAll(jsonObject.keySet())) {
      System.err.println("Error: Not all parameters in the request body are fields of the given class.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return false;
    } 
    list.addAll(jsonObject.keySet().stream()
                    .filter(key -> jsonObject.get(key).toString().length() > 0)
                    .collect(Collectors.toList()));
    list.retainAll(requiredFields);
    // Every requiredField must be present as a key in the jsonObject. If not, this check will fail. 
    if (list.size() != requiredFields.size()) {
      System.err.println("Error: Not all required fields are present in the request body, or some required fields are empty.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return false;
    } 
    return true;
  }

  /**
   * This method converts the request into a json, and feeds it to the post helper
   * @param {collectionReference} reference to the appropriate database collection
   * @param {request} the request sent to the backend
   * @param {response} the response returned from the backend
   * @param {genericClass} a Generic class, to be used in casting objects retrieved from the database
   * @param {requiredFields} a list of the names of fields deemed "necessary" for creation of an object.
   * @return T the object created by the post request, with an ID field generated by firebase
   */

  public static <T extends BaseEntity> T post(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response, GenericClass<T> genericClass, List<String> requiredFields) throws IOException {
    JsonObject jsonObject = Utility.createRequestBodyJson(request);
    return postHelper(collectionReference, jsonObject, response, genericClass, requiredFields);
  }

  /**
   * This method executes the given post request, creating the new object and returning it with its ID appended.
   * @param {collectionReference} reference to the appropriate database collection
   * @param {jsonObject} the request body as a json
   * @param {response} the response returned from the backend
   * @param {genericClass} a Generic class, to be used in casting objects retrieved from the database
   * @param {requiredFields} a list of the names of fields deemed "necessary" for creation of an object.
   * @return T the object created by the post request, with an ID field generated by firebase
   */
  public static <T extends BaseEntity> T postHelper(CollectionReference collectionReference, JsonObject jsonObject, 
      HttpServletResponse response, GenericClass<T> genericClass, List<String> requiredFields) throws IOException {
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Origin", "https://3000-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io");
response.setHeader("Set-Cookie", "cross-site-cookie=name; SameSite=None; Secure");
    Map<String, Object> constructorFields = new HashMap<>();
    Class superClass = genericClass.getMyType().getSuperclass();
    List<Field> fields = new ArrayList<>(Arrays.asList(genericClass.getMyType().getDeclaredFields()));
    fields.addAll(Arrays.asList(superClass.getDeclaredFields()));
    if (!postErrorHandler(jsonObject, response, fields, requiredFields)) {
      return null;
    }
    for (Field f : fields) {
      String fName = f.getName();
      String type = f.getType().getName();

      if (type.equals("int") || type.equals("java.lang.Integer")) {
        if (jsonObject.has(fName) && jsonObject.get(fName).getAsString().length() != 0) {
          constructorFields.put(fName, jsonObject.get(fName).getAsInt());
        }
        else {
          constructorFields.put(fName, -1);
        }
      }
      else if (type.equals("java.lang.String")) {
        if (!fName.equals("id")){
          if (jsonObject.has(fName) && jsonObject.get(fName).getAsString().length() != 0) {
            constructorFields.put(fName, jsonObject.get(fName).getAsString());
          }
          else {
            constructorFields.put(fName, "");
          }
        }
      }
      else if (type.equals("boolean") || type.equals("java.lang.boolean")) {
        if (jsonObject.has(fName) && jsonObject.get(fName).getAsString().length() != 0) {
          constructorFields.put(fName, jsonObject.get(fName).getAsBoolean());
        }
        else {
          constructorFields.put(fName, false);
        }
      }
      else if (type.equals("java.util.List") || type.equals("java.util.ArrayList")) {
        if (jsonObject.has(fName) && jsonObject.get(fName).toString().length() != 0) {
          // First check to see if it's an "actual array"
          try {
            JsonElement value = jsonObject.get(fName);
            Type listType = new TypeToken<List<String>>() {}.getType();
            constructorFields.put(fName, new Gson().fromJson(value, listType));
          } catch (Exception e) { //if not, see if it's a comma separated list
              String stringValue = jsonObject.get(fName).getAsString().replace("[", "").replace("]", "");
              List<String> listValue = Arrays.asList(stringValue.split(", "));
              constructorFields.put(fName, listValue);
            }
          }
        else {
          constructorFields.put(fName, new ArrayList<String>());
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
      return getById(asyncDocument.get().getId(), collectionReference, response, genericClass).get(0);
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
  public static void delete(CollectionReference collectionReference, HttpServletRequest request, 
      HttpServletResponse response) throws IOException {
    if (request.getParameterMap().size() > 1) {
      System.err.println("Error: No other parameter can be sent with an ID");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    if (request.getParameter("id") != null) {
      String id = request.getParameter("id");
      if (id.length() == 0) {
        System.err.println("Error caused by an empty \"id\" field in the post body.");
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return;
      }
      ApiFuture<WriteResult> writeResult = collectionReference.document(id).delete();
      try {
        System.out.println("Delete update time : " + writeResult.get().getUpdateTime());
        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
        return;
      } catch (Exception e) {
          System.err.println(e);
          response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
          return;
        }
    }
    else {
      System.err.println("Error caused by a non-existent \"id\" field in the post body.");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
  }
}
