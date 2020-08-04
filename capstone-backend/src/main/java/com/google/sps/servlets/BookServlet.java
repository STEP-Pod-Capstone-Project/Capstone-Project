package com.google.sps.servlets;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;

import com.google.gson.Gson;

import com.google.sps.data.Book;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
    List<Book> retrievedBooks = Utility.get(books, request, response, new GenericClass(Book.class));
    if (retrievedBooks != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(retrievedBooks));
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<String> requiredFields = new ArrayList<String>( Arrays.asList("userID", "gbookID") );
    Book createdBook = (Book) Utility.post(books, request, response, new GenericClass(Book.class), requiredFields);
    if (createdBook != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(createdBook));
    }
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Utility.delete(books, request, response);
  }
}