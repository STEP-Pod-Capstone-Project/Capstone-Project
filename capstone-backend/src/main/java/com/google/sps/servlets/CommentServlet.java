package com.google.sps.servlets;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.gson.Gson;

import com.google.sps.data.Comment;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/api/comments")
public class CommentServlet extends HttpServlet {
  private Firestore db; 
  private CollectionReference comments;
  private Gson gson;

  public CommentServlet() throws IOException {
    db = Utility.getFirestoreDb();
    comments = db.collection("comments");
    gson = new Gson();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<Comment> retrievedComments = Utility.get(comments, request, response, new GenericClass(Comment.class));
    if (retrievedComments != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(retrievedComments));
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<String> requiredFields = new ArrayList<String>( Arrays.asList("text", "userID", "whenCreated") );
    Comment createdComment = (Comment) Utility.post(comments, request, response, new GenericClass(Comment.class), requiredFields);
    if (createdComment != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(createdComment));
    }
  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Comment updatedComment = (Comment) Utility.put(comments, request, response, new GenericClass(Comment.class));
    if (updatedComment != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(updatedComment));
    }
  }
}
