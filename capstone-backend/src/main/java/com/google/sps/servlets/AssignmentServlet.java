package com.google.sps.servlets;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.gson.Gson;

import com.google.sps.data.Assignment;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/api/assignments")
public class AssignmentServlet extends HttpServlet {
  private Firestore db; 
  private CollectionReference assignments;
  private Gson gson;

  public AssignmentServlet() throws IOException {
    db = Utility.getFirestoreDb();
    assignments = db.collection("assignments");
    gson = new Gson();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<Assignment> retrievedAssignments = Utility.get(assignments, request, response, new GenericClass(Assignment.class));
    if (retrievedAssignments != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(retrievedAssignments));
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<String> requiredFields = new ArrayList<String>( Arrays.asList("text", "clubID", "whenCreated") );
    Assignment createdAssignment = (Assignment) Utility.post(assignments, request, response, new GenericClass(Assignment.class), requiredFields);
    if (createdAssignment != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(createdAssignment));
    }
  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Assignment updatedAssignment = (Assignment) Utility.put(assignments, request, response, new GenericClass(Assignment.class));
    if (updatedAssignment != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(updatedAssignment));
    }
  }
}
