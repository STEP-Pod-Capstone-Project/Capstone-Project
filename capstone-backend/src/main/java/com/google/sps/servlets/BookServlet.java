package com.google.sps.servlets;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.SetOptions;
import com.google.cloud.firestore.WriteResult;

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
  private Gson gson;

  public BookServlet() throws IOException {
    db = Utility.getFirestoreDb();
    books = db.collection("books");
    gson = new Gson();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
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
          System.err.println("Error: no such document!");
        }
      } catch (Exception e) {
        System.err.println("Error: " + e);
      }
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(book));
    }
    else {
      List<Book> bookList = new ArrayList<>();
      ApiFuture<QuerySnapshot> future = books.get();
      try {
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (QueryDocumentSnapshot document : documents) {
          bookList.add(document.toObject(Book.class));
        }
      } catch (Exception e) {
        System.err.println("Error: " + e);
      }
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(bookList));
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    JsonObject jsonObject = Utility.createRequestBodyJson(request);
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
      System.err.println("Error: " + e);
    }
    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(book));
  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    JsonObject jsonObject = Utility.createRequestBodyJson(request);
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
      System.err.println("Error: " + e);
    }
  }
}