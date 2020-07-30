package com.google.sps.servlets;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;

import com.google.gson.Gson;

import com.google.sps.data.Meeting;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/api/meetings")
public class MeetingServlet extends HttpServlet {
  private Firestore db; 
  private CollectionReference meetings;
  private Gson gson;

  public MeetingServlet() throws IOException {
    db = Utility.getFirestoreDb();
    meetings = db.collection("meetings");
    gson = new Gson();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<Meeting> retrievedMeetings = Utility.get(meetings, request, response, new GenericClass(Meeting.class));
    if (retrievedMeetings != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(retrievedMeetings));
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<String> requiredFields = new ArrayList<String>( Arrays.asList("clubID", "startDateTime", "endDateTime") );
    Meeting createdMeeting = (Meeting) Utility.post(meetings, request, response, new GenericClass(Meeting.class), requiredFields);
    if (createdMeeting != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(createdMeeting));
    }
  }

  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Meeting updatedMeeting = (Meeting) Utility.put(meetings, request, response, new GenericClass(Meeting.class));
    if (updatedMeeting != null) {
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(updatedMeeting));
    }
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Utility.delete(meetings, request, response);
  }
}
