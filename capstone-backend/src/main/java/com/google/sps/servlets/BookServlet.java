package com.google.sps.servlets;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
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
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import com.google.sps.data.Book;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/api/books")
public class BookServlet extends HttpServlet {
  private Firestore db; 
  private CollectionReference books;

  public BookServlet() throws IOException {
    GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(credentials)
        .setProjectId("sopa-capstone-step-2020")
        .build();
    FirebaseApp.initializeApp(options);
    db = FirestoreClient.getFirestore();
    books = db.collection("books");
  }

  private JsonObject createRequestBodyJson(HttpServletRequest request) {
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

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<Book> bookList = new ArrayList<>();
    if (request.getParameter("id") != null) {
      DocumentReference docRef = books.document(request.getParameter("id"));
      ApiFuture<DocumentSnapshot> future = docRef.get();
      DocumentSnapshot document = null;
      Book book = null;
      try {
        document = future.get();
        if (document.exists()) {
          book = document.toObject(Book.class);
        } else {
          System.out.println("no such document!");
        }
      } catch (Exception e) {
        System.out.println("Error: " + e);
      }
      bookList.add(book);
    }
    else {
      ApiFuture<QuerySnapshot> future = books.get();
      try {
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (QueryDocumentSnapshot document : documents) {
          bookList.add(document.toObject(Book.class));
        }
      } catch (Exception e) {
        System.out.println("Error: " + e);
      }
    }

    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(bookList));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    JsonObject jsonObject = createRequestBodyJson(request);
    System.out.println(jsonObject);
    String id = jsonObject.get("id").getAsString();
    String userID = jsonObject.get("userID").getAsString();
    String gbookID = jsonObject.get("gbookID").getAsString();
    boolean hasRead = false;
    int rating = -1;
    String review = "";

    if (jsonObject.get("hasRead") != null) {
      hasRead = jsonObject.get("hasRead").getAsBoolean();
    }
    if (jsonObject.get("rating") != null) {
      rating = jsonObject.get("rating").getAsInt();
    }
    if (jsonObject.get("review") != null) {
      review = jsonObject.get("review").getAsString();
    }
    Book book = new Book(id, userID, gbookID, hasRead, rating, review);
    ApiFuture<WriteResult> future = books.document(id).set(book);
    try {
      System.out.println("Update time : " + future.get().getUpdateTime());
    } catch (Exception e) {
      System.out.println("Error: " + e);
    }
    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(book));
  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    JsonObject jsonObject = createRequestBodyJson(request);
    String id = jsonObject.get("id").getAsString();
    Map<String, Object> update = new HashMap<>();

    if (jsonObject.get("hasRead") != null) {
      update.put("hasRead", jsonObject.get("hasRead").getAsBoolean());
    }
    if (jsonObject.get("rating") != null) {
      update.put("rating", jsonObject.get("rating").getAsInt());
    }
    if (jsonObject.get("review") != null) {
      update.put("review", jsonObject.get("review").getAsString());
    }

    ApiFuture<WriteResult> writeResult = books.document(id).set(update, SetOptions.merge());
    try {
      System.out.println("Update time : " + writeResult.get().getUpdateTime());
    } catch (Exception e) {
      System.out.println("Error: " + e);
    }
  }
}